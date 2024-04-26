# Amazon ECS Task running application built with Boto3 SDK

```bash
docker build . -t berry2012/boto3troubleshooter:v1
docker run -d --name boto3 berry2012/boto3troubleshooter:v1 sleep 300
docker exec -it boto3 sh

export region=eu-west-1
export aws_account_id=12121212121212

aws ecr create-repository --repository-name sdk-apps --region eu-west-1

docker tag berry2012/boto3troubleshooter:v1 $aws_account_id.dkr.ecr.$region.amazonaws.com/sdk-apps:boto3troubleshooter

aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.$region.amazonaws.com

docker push $aws_account_id.dkr.ecr.$region.amazonaws.com/sdk-apps:boto3troubleshooter

export clustername="mycluster"
export region=eu-west-1
export aws_account_id=12121212121212
export servicename=boto3

cat << EOF > taskdef-resolution.json
{
    "networkMode": "awsvpc",
    "taskRoleArn": "arn:aws:iam::${aws_account_id}:role/ecsTaskExecutionRole",
    "executionRoleArn": "arn:aws:iam::${aws_account_id}:role/ecsTaskExecutionRole",
    "requiresCompatibilities": [
        "EC2",
        "FARGATE"
    ],
    "cpu": "2048",
    "memory": "8192",    
    "containerDefinitions": [
        {
            "name": "boto3",
            "image": "${aws_account_id}.dkr.ecr.${region}.amazonaws.com:boto3troubleshooter",
            "essential": true,
            "linuxParameters": {
                "initProcessEnabled": true
            },
            "environment": [
                {
                    "name": "BUCKET",
                    "value": "whalecloud-works"
                },
                {
                    "name": "KEY",
                    "value": "file.txt"
                }             
            ],             
            "command": [
                "sleep",
                "3600"
            ],            
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                  "awslogs-create-group": "True",
                  "awslogs-group": "/ecs/$servicename",
                  "awslogs-region": "$region",
                  "awslogs-stream-prefix": "ecs"
                }
            }        
        }
    ],
    "family": "sdk-apps"
}
EOF

taskdef=$(aws ecs register-task-definition --cli-input-json file://taskdef-resolution.json \
--query 'taskDefinition[].taskDefinitionArn' --output text \
--region $region)

taskdef="sdk-apps:13"
```

```bash
taskid=$(aws ecs run-task \
--cluster ${clustername} \
--task-definition ${taskdef} \
--region ${region} \
--enable-execute-command \
--launch-type FARGATE \
--network-configuration "awsvpcConfiguration={subnets=[subnet-abcdefght],securityGroups=[sg-abcdefght],assignPublicIp=ENABLED}" \
--query 'tasks[].taskArn' --output text)

echo taskid=$taskid
sleep 60
aws ecs execute-command --cluster ${clustername} \
    --task $taskid \
    --container boto3 \
    --interactive \
    --command "/bin/sh"
```

```bash
cat << EOF > script.py
import boto3
import json
import logging
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from datetime import date

load_dotenv()  # This line brings all environment variables from .env into os.environ
# s3 = boto3.client('s3')    # the right way

bucket = os.environ['BUCKET'] 
key = os.environ['KEY'] 

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
print("Script Completed on: ", date.today())
print(f"S3 Bucket: ", bucket)
print(f"S3 Object: ", key)  
EOF

python script.py

apt install htop -y && apt install stress
```

## no task role

**Override**
```bash
            "entryPoint": [
                "sh",
                "-c"
            ],
            "command": [
                "/bin/sh -c \"env && curl ${ECS_CONTAINER_METADATA_URI_V4} && curl -s 169.254.170.2${AWS_CONTAINER_CREDENTIALS_RELATIVE_URI} && sleep 3600\""
            ],        
```
