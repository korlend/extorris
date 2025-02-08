
# Requirements

1. Node 20+
2. Yarn corepack
3. MySQL 8.4
4. redis 5+ or dragonfly 1.26+
5. rabbitmq 3.0
6. docker, for redis and dragonfly

# DB

1. Install mysql
1. Create database "extorris" or other name
1. Create user with select, insert, update, delete permissions for that database
1. Run db.sql script for created database

# Redis

```
docker run -p 6379:6379 --ulimit memlock=-1 docker.dragonflydb.io/dragonflydb/dragonfly
```

# Rabbit

```
docker run -d -p 5672:5672 --hostname my-rabbit --name some-rabbit rabbitmq:3
```

# Install

## build extorris-common for portal dependency

1. cd extorris-common
1. activate ```corepack enable``` (requires admin privileges)
1. install packages ```yarn```
1. run build ```yarn build```

## installation is similar to all projects

1. activate ```corepack enable``` (requires admin privileges)
1. install packages ```yarn```
1. run applications ```yarn dev```
