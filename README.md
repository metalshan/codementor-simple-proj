## Info about project
* This is a node.js project, built with typescript.
* Framework loopback4 is used for REST and database used is `postgres`.
* This architecture is built by following SOLID architecture and decorator pattern.
* This will run in localhost:3000 and swagger at localhost:3000/explorer
* Login provides a token, which needs to be used as Authentication bearer token in each request headers.


## How to install
* Clone it.
* Get your postgres server running on 5432 port and create a database named codementor, with user root and password postgre.
* Run everything in `entities.sql` in that database.
* Run `npm install`.
* Run `npm start`.
* You should be able to access `localhost:3000` and `localhost:3000/explorer`.
