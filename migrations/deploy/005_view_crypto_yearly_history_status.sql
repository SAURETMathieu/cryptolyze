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
    CASE
      WHEN COUNT(cdh.id) = 0 THEN 'not_requested'
      WHEN COUNT(cdh.id) > 0 AND COUNT(cdh.id) FILTER (WHERE cdh.prices_per_minute IS NULL) > 0 THEN 'loading'
      WHEN COUNT(cdh.id) = CASE
                            WHEN y.year % 4 = 0
                                AND (y.year % 100 != 0 OR y.year % 400 = 0)
                            THEN 366 ELSE 365 END
        AND COUNT(cdh.id) FILTER (WHERE cdh.prices_per_minute IS NULL) = 0 THEN 'complete'
      ELSE 'incomplete'
    END AS year_status
  FROM crypto c
  JOIN years y ON y.crypto_id = c.id
  LEFT JOIN crypto_day_history cdh ON cdh.crypto_id = c.id
    AND EXTRACT(YEAR FROM cdh.date)::int = y.year
  GROUP BY c.id, y.year
)
SELECT
  c.*,
  jsonb_object_agg(ch.year, ch.year_status) AS history_completeness,
  COUNT(*) FILTER (WHERE ch.year_status = 'complete')   AS complete_years,
  COUNT(*) FILTER (WHERE ch.year_status != 'complete') AS incomplete_years
FROM crypto c
JOIN checks ch ON ch.crypto_id = c.id
GROUP BY c.id;

COMMIT;