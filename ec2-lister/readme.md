# An Example Containerized Application Built with AWS Java SDK 

This Application list running EC2 instances in your AWS account region

## Prerequisites

- An Amazon EKS Cluster
- Docker installed to build the image 
- Kubectl installed


## Set up the project

```
git clone https://github.com/berry2012/aws-java-sdk-samples.git

cd aws-java-sdk-samples/ec2-lister
```


## Build Java code 

```
mvn compile

mvn package

```

## Test Java code locally
```
java -jar target/aws-ec2-examples-1.0.0.jar
```


## Dockerize the app using sh entrypoint

```

docker build --build-arg JAR_FILE="target/aws-ec2-examples-1.0.0.jar" -t ec2lister:v2 .

docker run -p 8080:8080 --name myappv2 ec2lister:v2

docker run -ti --name myappv2 --entrypoint /bin/sh ec2lister:v2

docker exec -ti myappv2 /bin/sh

```

## Test

```

$ docker build --build-arg JAR_FILE="../target/aws-ec2-examples-1.0.0.jar" -t ec2lister:v2 -f Dockerfile . && docker run -p 8080:8080 --name myappv2 ec2lister:v2

```

## Expected result

```
Successfully tagged ec2lister:v2

## RUNNING JAVA APP...
The current local time is: 17:16:50.944

AWS EKS Using the AWS SDK for Java v1.0.0
Found reservation with id i-1234abcde1234abcef, AMI ami-0069d66985b09d219, type t3.medium, state running and monitoring state disabled
Found reservation with id i-1234abcde1234abcde, AMI ami-0e8cb4bdc5bb2e6c0, type t2.micro, state running and monitoring state disabled
```

---

## Orchestrating with Amazon EKS

**Option 1 - build your own Amazon ECR**
- Push your Docker Image to Amazon ECR
- Configuring a Kubernetes service account to assume an IAM role.
- [Configuring Pods to use a Kubernetes service account](https://docs.aws.amazon.com/eks/latest/userguide/pod-configuration.html)


**Option 2 - Use the public repo**

- Refer to sample [pod.yml](./pod.yml)

```
% kubectl apply -f pod.yaml
% kubectl logs -f ec2lister -n serverless

## RUNNING JAVA APP...
The current local time is: 17:16:50.944

AWS EKS Using the AWS SDK for Java v1.0.0
Found reservation with id i-1234abcde1234abcef, AMI ami-0069d66985b09d219, type t3.medium, state running and monitoring state disabled
Found reservation with id i-1234abcde1234abcde, AMI ami-0e8cb4bdc5bb2e6c0, type t2.micro, state running and monitoring state disabled

```