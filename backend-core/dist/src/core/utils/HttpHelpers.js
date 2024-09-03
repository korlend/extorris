"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onListening = exports.onError = exports.normalizePort = void 0;
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
exports.normalizePort = normalizePort;
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            console.error('EACCES, requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error('EADDRINUSE, port is already in use');
            process.exit(1);
        default:
            throw error;
    }
}
exports.onError = onError;
function onListening(server) {
    if (!server) {
        console.error('no server :o');
        console.error(server);
        return;
    }
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port;
    console.debug('Listening on ' + bind);
}
exports.onListening = onListening;
//# sourceMappingURL=HttpHelpers.js.map