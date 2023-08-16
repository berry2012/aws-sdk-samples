# An Example Containerized Application Built with AWS Java SDK 


## Prerequisites

- [Building Java Projects with Maven](https://spring.io/guides/gs/maven/#scratch)

- [Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker/)


## Set up the project

**Skip the basics and Clone the repo**

```
git clone https://github.com/berry2012/aws-java-sdk-samples.git

cd aws-java-sdk-samples/s3bucket-lister
```


## Build Java code
```
mvn compile

mvn package

java -jar target/gs-maven-0.1.0.jar
```

## Dockerize the app with args
```
docker build --build-arg JAR_FILE="target/gs-maven-0.1.0.jar" -t hellojava:v1 .

docker run -p 8080:8080 --name myapp hellojava:v1

docker run -ti --name myapp --entrypoint /bin/sh hellojava:v1

docker exec -ti myapp /bin/sh

```


## Dockerize the app using sh entrypoint
```
docker build --build-arg JAR_FILE="target/gs-maven-0.1.0.jar" -t hellojava:v2 -f Dockerfile.1 .

docker run -p 8080:8080 --name myappv2 hellojava:v2

docker run -ti --name myappv2 --entrypoint /bin/sh hellojava:v2

docker exec -ti myappv2 /bin/sh

```

## Test

```
$ docker build --build-arg JAR_FILE="target/gs-maven-0.1.0.jar" -t hellojava:v2 -f Dockerfile.1 . && docker run -p 8080:8080 --name myappv2 hellojava:v2

```

## Expected result

```
Successfully tagged hellojava:v2
## RUNNING JAVA APP...
The current local time is: 17:07:01.969
Hello world!
Your Amazon S3 buckets are:
* my-bucket-1
* my-bucket-2
* my-bucket-3
Going to sleep for a while...
Sleep time in ms = 100000
Done!!!
```

---

# Orchestrating with Amazon EKS

- Push your Docker Image to Amazon ECR
- Configuring a Kubernetes service account to assume an IAM role.
- [Configuring Pods to use a Kubernetes service account](https://docs.aws.amazon.com/eks/latest/userguide/pod-configuration.html)
- Refer to sample [pod.yml](./pod.yml)
- 
```
% kubectl logs -f s3bucket-lister -n serverless
## RUNNING JAVA APP...
The current local time is: 17:07:01.969
Hello world!
Your Amazon S3 buckets are:
* my-bucket-1
* my-bucket-2
* my-bucket-3
Going to sleep for a while...
Sleep time in ms = 100000
Done!!!

```