// import MySQLConnector from "./src/core/MySQLConnector";
// console.log("test0");
import http from 'http';
import express, { Request, Response, NextFunction } from "express";

import ConfigLoader from "./src/core/config/ConfigLoader";
import { normalizePort, onError, onListening } from './src/core/utils/HttpHelpers';

import authRouter from "./src/routers/auth";

// MySQLConnector.getInstance()

async function loadConfig() {
  return await ConfigLoader.getInstance();
}

async function init() {
  const config = await loadConfig();
  const app = express();

  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello world');
    next(123);
  });

  const port = normalizePort(config.get('port'));

  app.set('port', port);

  // app.use(express.Router);
  app.use(authRouter);

  const server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

init();
