## Description

This repository by no means the template of how you should do things.
For backend there is no ORM (like TypeORM or sequalize) usage or some beautiful Node frameworks like Nest, it's just a convoluted self implementation of Service/Repository/Model with strong typization and annotations usage on models.

At top level there is an attempt to make some code shareable between Frontend and Backend services, which is not fully implemented.
Currently I'm thinking how to solve my d.ts file containing duplicates of some types with "_2" in the end.

Beware of console.logs and TODOs.

## Requirements

1. Node 20+
2. Yarn corepack
3. MySQL 8.4
4. redis 5+ or dragonfly 1.26+
5. rabbitmq 3.0
6. docker, for redis and dragonfly

## DB

1. Install mysql
1. Create database "extorris" or use any other name
1. Create user with select, insert, update, delete permissions for that database
1. At "backend/config/config.json" change database.mysql change user, password, database and port according to your mysql
1. Run db.sql script for created database

## Redis

```
docker run -p 6379:6379 --ulimit memlock=-1 docker.dragonflydb.io/dragonflydb/dragonfly
```

## RabbitMQ

```
docker run -d -p 5672:5672 --hostname my-rabbit --name some-rabbit rabbitmq:3
```

## Install

### build extorris-common for portal dependency

1. cd extorris-common
1. activate ```corepack enable``` (requires admin privileges)
1. install packages ```yarn```
1. run build ```yarn build```

### installation is similar to all projects

1. activate ```corepack enable``` (requires admin privileges)
1. install packages ```yarn```
1. run applications ```yarn dev```
