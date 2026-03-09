# Spark Best Practices for Databricks

## Optimization Techniques

- **Photon Acceleration**: Enable Photon for compute-intensive workloads. It is highly optimized for SQL and dataframes.
- **Delta Lake Optimization**:
  - `OPTIMIZE`: Regularly run `OPTIMIZE` on Delta tables to compact small files.
  - `Z-ORDER BY`: Use for multidimensional clustering on high-cardinality columns (e.g., `id`, `timestamp`).
  - **Liquid Clustering**: For tables over 10TB or with changing access patterns, use Liquid Clustering instead of Z-Ordering.
- **Data Skipping**: Ensure columns used in filters are not transformed (e.g., use `CAST(ts AS DATE) = '2023-01-01'` carefully; prefer range filters).

## Compute Configuration

- **Autoscaling**: Use "Enhanced Autoscaling" for better resource management.
- **Spot Instances**: Use Spot instances for non-critical, interruptible batch jobs to reduce cost.
- **Unity Catalog**: Always use Unity Catalog (UC) for data governance and fine-grained access control.

## Python (PySpark) Patterns

- **Avoid UDFs**: Use built-in Spark functions (`pyspark.sql.functions`) whenever possible.
- **Vectorized UDFs**: If you must use a UDF, use Pandas UDFs (Vectorized UDFs) for better performance.
- **Broadcast Joins**: Use `broadcast(df)` for joining a small table with a large one.
