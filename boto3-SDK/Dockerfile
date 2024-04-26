FROM python:3.9.19

RUN apt update && apt install jq -y && apt install vim -y && apt install curl -y

RUN pip install --upgrade pip && \
    pip install --upgrade awscli && \
    pip install --no-cache-dir boto3 && \
    pip install python-dotenv

# Bundle app source
COPY . .

CMD [ "python3", "script.py" ]