# Build the inmage

```bash
docker build . -t berry2012/nodejs_sdk_s3_api_sample:v2
```

## Run the container

```bash
docker run --name mycontainer berry2012/nodejs_sdk_s3_api_sample:v2

docker run -d --name mycontainer berry2012/nodejs_sdk_s3_api_sample:v2 sleep 120

docker run -e KEY="random.zip" -e BUCKET="S3-bucket" -d --name mycontainer berry2012/nodejs_sdk_s3_api_sample:v2 sleep 120

docker exec -it mycontainer /bin/bash

node index.js
```

```bash
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.$region.amazonaws.com
docker tag berry2012/nodejs_sdk_s3_api_sample:v2 $aws_account_id.dkr.ecr.$region.amazonaws.com/sdk-apps:nodejs_sdk_v3_samples
docker push $aws_account_id.dkr.ecr.$region.amazonaws.com/sdk-apps:nodejs_sdk_v3_samples
```

## ECS Deployment

```bash
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
            "name": "s3_listobjects",
            "image": "${aws_account_id}.dkr.ecr.$region.amazonaws.com/sdk-apps:nodejs_sdk_v3_samples",
            "essential": true,
            "linuxParameters": {
                "initProcessEnabled": true
            },
            "environment": [
                {
                    "name": "BUCKET",
                    "value": "mybucket"
                },
                {
                    "name": "KEY",
                    "value": "file.txt"
                }                
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

aws ecs register-task-definition --cli-input-json file://taskdef.json --region $region
aws ecs register-task-definition --cli-input-json file://taskdef-resolution.json --region $region
```

## stess the container CPU

```bash
apt install stress -y
stress --cpu 8 --io 4 --vm 4 --vm-bytes 1024M --timeout 120s
stress --vm 4 --vm-bytes 2048M --timeout 120s # stress memory
```

## Running node with env (optional)

```bash
KEY="file.txt" BUCKET="bucket-work" node index.js
```

## Clean Up

```bash
docker rm mycontainer
```
