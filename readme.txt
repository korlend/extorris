
# Requirements

1. Node 20+
2. MySQL 8.4

# DB

I'm using mysql, unfortunately db auto creation is in todo list as of yet

# Install

## build extorris-common for portal dependency

1. cd extorris-common
2. activate "corepack enable" (requires admin privileges)
3. install packages "yarn"
4. run build "yarn build"

## installation is similar to all projects

1. activate "corepack enable" (requires admin privileges)
2. install packages "yarn"
3. for backend install mysql TODO: add db init script (probably DB creation from DBModel annotations)
4. run applications "yarn dev"
