from pyspark.sql import SparkSession
import pyspark.sql.functions as F

def transform_data(df):
    """Example transformation: filter and group."""
    return df.filter(F.col("count") > 10).groupBy("id").count()

if __name__ == "__main__":
    spark = SparkSession.builder.getOrCreate()
    data = [(1, 20), (2, 5), (1, 15)]
    columns = ["id", "count"]
    df = spark.createDataFrame(data, columns)
    
    transformed_df = transform_data(df)
    transformed_df.show()
