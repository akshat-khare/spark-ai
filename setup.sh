#!/bin/bash

apt-get update -y
apt-get install rabbitmq-server -y
pip install celery[redis]
apt install lsb-release curl gpg -y
curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list
apt-get update -y
apt-get install redis -y
