/**
 * Interface représentant un nœud de jointure dans la chaîne de jointures SQL
 * @interface JoinNodeI
 * @property {string} schema - Le schéma de la table
 * @property {string} table - Le nom de la table
 * @property {number} level - Le niveau de profondeur dans la chaîne de jointures
 * @property {string} sourceField - Le champ source de la jointure
 * @property {string} targetField - Le champ cible de la jointure
 * @property {JoinNodeI} [next] - Le nœud suivant dans la chaîne de jointures
 */
interface JoinNodeI {
  schema: string;
  table: string;
  level: number;
  sourceField: string;
  targetField: string;
  next?: JoinNodeI;
}

/**
 * Divise une chaîne de jointures en parties distinctes
 * @function splitJoinChain
 * @param {string} joinChain - La chaîne de jointures à diviser
 * @returns {{ joins: string[]; lastField: string }} - Un objet contenant les jointures et le dernier champ
 * @example
 * splitJoinChain('erp.order_item(order_id->id).profile_id')
 * // Returns: { joins: ['erp.order_item(order_id->id)'], lastField: 'profile_id' }
 */
function splitJoinChain(joinChain: string): {
  joins: string[];
  lastField: string;
} {
  const parts: string[] = [];
  let buffer = "";

  for (let i = 0; i < joinChain.length; i++) {
    const char = joinChain[i];
    buffer += char;

    if (char === ")") {
      if (buffer[0] === ".") {
        buffer = buffer.slice(1);
      }
      parts.push(buffer.trim());
      buffer = "";
    }
  }

  if (buffer) {
    if (buffer[0] === ".") {
      buffer = buffer.slice(1);
    }
    // champ final (ex: profile_id)
    parts.push(buffer.trim());
  }

  const lastField = parts.pop()!;
  return { joins: parts, lastField };
}

/**
 * Crée une requête SQL DISTINCT avec des jointures
 * @function createDistinctSqlRequest
 * @param {string} baseTable - La table de base au format "schema.table"
 * @param {string} joinChain - La chaîne de jointures au format "schema.table(sourceField->targetField).champ"
 * @param {string} [orderBy="ASC"] - L'ordre de tri (ASC ou DESC)
 * @param {string} [castType="text"] - Le type de cast pour le champ final
 * @returns {string} - La requête SQL générée
 * @throws {Error} Si le format de la table de base est invalide
 * @throws {Error} Si le format de la chaîne de jointures est invalide
 * @example
 * createDistinctSqlRequest(
 *   'erp.order',
 *   'erp.order_item(order_id->id).erp.purchase_item(order_item_id->id).public.deal(id->deal_id).profile_id',
 *   'ASC',
 *   'text'
 * )
 */
export function createDistinctSqlRequest(
  baseTable: string,
  joinChain: string,
  orderBy: string = "ASC",
  castType: string = "text"
): string {
  if (!baseTable.includes(".")) {
    throw new Error('La table de base doit être au format "schema.table"');
  }

  const [baseSchema, baseTableName] = baseTable.split(".");

  const { joins: parts, lastField } = splitJoinChain(joinChain);

  if (parts.length < 1) {
    return `SELECT DISTINCT ${lastField}::${castType} AS value, COUNT(*) FROM ${baseSchema}.${baseTableName} t0 GROUP BY ${lastField} ORDER BY ${lastField}::${castType} ${orderBy}`;
  }

  let level = 1;

  /**
   * Parse les parties d'une jointure pour créer un nœud de jointure
   * @function parseJoinParts
   * @param {string[]} parts - Les parties de la jointure à parser
   * @returns {JoinNodeI} - Le nœud de jointure créé
   * @throws {Error} Si le format de la jointure est invalide
   * @private
   */
  function parseJoinParts(parts: string[]): JoinNodeI {
    const part = parts[0]!;

    if (!part.includes("(") || !part.includes(")")) {
      throw new Error(
        `Format de jointure invalide: ${part}. Format attendu: schema.table(sourceField->targetField)`
      );
    }

    const [tablePart, relation] = part.split("(");

    if (!tablePart || !relation || !relation.includes("->")) {
      throw new Error(
        `Format de relation invalide dans: ${part}. Format attendu: sourceField->targetField`
      );
    }

    const [schema, table] = tablePart.includes(".")
      ? tablePart.split(".")
      : [baseSchema, tablePart];
    const [sourceField, targetField] = relation.replace(")", "").split("->");

    if (!schema || !table || !sourceField || !targetField) {
      throw new Error(
        `Format de jointure invalide: ${part}. Format attendu: schema.table(sourceField->targetField)`
      );
    }

    const node: JoinNodeI = {
      schema,
      table,
      level,
      sourceField,
      targetField,
    };

    if (parts.length > 1) {
      level += 1;
      node.next = parseJoinParts(parts.slice(1));
    }

    return node;
  }

  const root = parseJoinParts(parts);

  /**
   * Récupère le dernier nœud et le champ final d'une chaîne de jointures
   * @function getLastNode
   * @param {JoinNodeI} node - Le nœud de départ
   * @returns {{ alias: string; field: string }} - L'alias et le champ du dernier nœud
   * @private
   */
  function getLastNode(node: JoinNodeI): { alias: string; field: string } {
    if (!node.next) return { alias: `t${node.level}`, field: lastField };
    return getLastNode(node.next);
  }

  const last = getLastNode(root);

  let sql = `SELECT DISTINCT ${last.alias}.${last.field}::${castType} AS value, COUNT(*)\n`;
  sql += `FROM ${baseSchema}.${baseTableName} t0\n`;

  /**
   * Construit la partie JOIN de la requête SQL
   * @function buildJoins
   * @param {JoinNodeI} node - Le nœud de jointure actuel
   * @param {string} prevAlias - L'alias de la table précédente
   * @returns {string} - La partie JOIN de la requête SQL
   * @private
   */
  function buildJoins(node: JoinNodeI, prevAlias: string): string {
    const currentAlias = `t${node.level}`;
    let join = `JOIN ${node.schema}.${node.table} ${currentAlias} ON ${currentAlias}.${node.sourceField} = ${prevAlias}.${node.targetField}\n`;
    if (node.next) {
      join += buildJoins(node.next, currentAlias);
    }
    return join;
  }

  sql += buildJoins(root, "t0");
  sql += `GROUP BY ${last.alias}.${last.field}\nORDER BY ${last.alias}.${last.field}::${castType} ${orderBy}`;

  return sql;
}
