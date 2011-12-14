var server = false;
if (process.NODE_ENV) {
    server = true;
}

exports = server;
