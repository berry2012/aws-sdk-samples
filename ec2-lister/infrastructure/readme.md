# An Example Containerized Application Built with AWS Java SDK 

This Application list running EC2 instances in your AWS account region

## Prerequisites

- An Amazon EKS Cluster
- Docker installed to build the image 
- Kubectl installed


## Set up the project

**We will skip the basics of compiling maven packages and just clone the repo**

```
git clone https://github.com/berry2012/aws-java-sdk-samples.git

cd aws-java-sdk-samples/ec2-lister
```


## Build Java code or use the prebuilt package in target/aws-ec2-examples-1.0.jar

```
java -jar target/aws-ec2-examples-1.0.jar
```


## Dockerize the app using sh entrypoint

```
cd infrastructure 

cp ../target/aws-ec2-examples-1.0.jar .

docker build --build-arg JAR_FILE="aws-ec2-examples-1.0.jar" -t ec2lister:v2 .

docker run -p 8080:8080 --name myappv2 ec2lister:v2

docker run -ti --name myappv2 --entrypoint /bin/sh ec2lister:v2

docker exec -ti myappv2 /bin/sh

```

## Test

```
cd infrastructure 

$ docker build --build-arg JAR_FILE="../target/aws-ec2-examples-1.0.jar" -t ec2lister:v2 -f Dockerfile.1 . && docker run -p 8080:8080 --name myappv2 ec2lister:v2

```

## Expected result

```
Successfully tagged ec2lister:v2
## RUNNING JAVA APP...
Found reservation with id i-1234abcde1234abcef, AMI ami-0069d66985b09d219, type t3.medium, state running and monitoring state disabled
Found reservation with id i-1234abcde1234abcde, AMI ami-0e8cb4bdc5bb2e6c0, type t2.micro, state running and monitoring state disabled
```

---

## Orchestrating with Amazon EKS

- Push your Docker Image to Amazon ECR
- Configuring a Kubernetes service account to assume an IAM role.
- [Configuring Pods to use a Kubernetes service account](https://docs.aws.amazon.com/eks/latest/userguide/pod-configuration.html)
- Refer to sample [pod.yml](./infrastructure/pod.yml)
- 

```
% kubectl logs -f ec2-lister -n serverless
## RUNNING JAVA APP...
Found reservation with id i-1234abcde1234abcef, AMI ami-0069d66985b09d219, type t3.medium, state running and monitoring state disabled
Found reservation with id i-1234abcde1234abcde, AMI ami-0e8cb4bdc5bb2e6c0, type t2.micro, state running and monitoring state disabled

```