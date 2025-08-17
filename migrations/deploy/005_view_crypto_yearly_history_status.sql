-- Deploy cryptolize:005_view_crypto_yearly_history_status to pg

BEGIN;

CREATE OR REPLACE VIEW crypto_yearly_history_status
with (security_invoker = true)
AS
WITH years AS (
  SELECT c.id AS crypto_id,
        generate_series(
          c.first_year,
          EXTRACT(YEAR FROM CURRENT_DATE)::int - 1
        ) AS year
  FROM crypto c
),
checks AS (
  SELECT
    c.id AS crypto_id,
    y.year,
    (
      SELECT COUNT(*) = CASE
                          WHEN y.year % 4 = 0
                              AND (y.year % 100 != 0 OR y.year % 400 = 0)
                          THEN 366 ELSE 365 END
      FROM crypto_day_history cdh
      WHERE cdh.crypto_id = c.id
        AND EXTRACT(YEAR FROM cdh.date)::int = y.year
    ) AS is_complete
  FROM crypto c
  JOIN years y ON y.crypto_id = c.id
)
SELECT
  c.*,
  jsonb_object_agg(ch.year, ch.is_complete) AS history_completeness,
  COUNT(*) FILTER (WHERE ch.is_complete)   AS complete_years,
  COUNT(*) FILTER (WHERE NOT ch.is_complete) AS incomplete_years
FROM crypto c
JOIN checks ch ON ch.crypto_id = c.id
GROUP BY c.id;

COMMIT;