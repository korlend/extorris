
# Requirements

1. Node 20+
2. Yarn corepack
3. MySQL 8.4
4. redis 5+ or dragonfly 1.26+
5. rabbitmq 3.0
6. docker, for redis and dragonfly

# Redis

```
docker run -p 6379:6379 --ulimit memlock=-1 docker.dragonflydb.io/dragonflydb/dragonfly
```

# Rabbit

```
docker run -d -p 5672:5672 --hostname my-rabbit --name some-rabbit rabbitmq:3
```

# DB

I'm using mysql, unfortunately db auto creation is in todo list as of yet

# Install

## build extorris-common for portal dependency

1. cd extorris-common
2. activate ```corepack enable``` (requires admin privileges)
3. install packages ```yarn```
4. run build ```yarn build```

## installation is similar to all projects

1. activate ```corepack enable``` (requires admin privileges)
2. install packages ```yarn```
3. for backend install mysql TODO: add db init script (probably DB creation from DBModel annotations)
4. run applications ```yarn dev```
