import boto3
import json
import logging
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()  # This line brings all environment variables from .env into os.environ
# s3 = boto3.client('s3')    # the right way

bucket = os.environ['BUCKET'] 
key = os.environ['KEY'] 

now = datetime.now()
dt_string = now.strftime("%d/%m/%Y %H:%M:%S")

def get_s3_object():
    s3 = boto3.client('s3')
    try:
        response = s3.get_object(
            Bucket=bucket,
            Key=key
        )
        result = json.dumps(response["ETag"], indent=4, sort_keys=True, default=str)
        print(f"Attempt:", x)
        print(f"Success:", result)
    except ClientError as e:
        logging.error(e)
        print(f"Error:", e)


for x in range(1, 1000):
    get_s3_object()
else:
  print("Finally finished!")

print("Script completed at:", dt_string)
print(f"S3 Bucket: ", bucket)
print(f"S3 Object: ", key)