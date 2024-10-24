import { Server } from 'http';

export function normalizePort(val: any) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

export function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }

  switch (error.code) {
    case 'EACCES':
      console.error('EACCES, requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error('EADDRINUSE, port is already in use')
      process.exit(1)
    default:
      throw error
  }
}

export function onListening(server: Server) {
  if (!server) {
    console.error('no server :o');
    console.error(server);
    return;
  }
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port
  console.debug('Listening on ' + bind);
}
