const http = require("http");
const fs = require("fs");
const { normalize, join } = require("path");

const rootPath = join(__dirname, '..', 'dist');

const DEBUG = process.env.DEBUG || false
const debug = (str) => DEBUG ? console.log(str) : null;

const mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'default': 'text/plain',
};

const webserver = http.createServer(sendFile);

function sendFile(request, response) {
    let path = request.url || '';
    let safePath = normalize(path).replace('^(\.\.[\/\\])+', '');
    if (safePath === '' || safePath === '/') {
        safePath = 'index.html';
    }
    let filename = join(rootPath, safePath);
    if (!fs.existsSync(filename)) {
        debug('Server: 404 - ' + request.method + ': ' + request.url);
        response.statusCode = 404;
        response.end('File not found.');
    }
    else {
        debug('Server: 200 - ' + request.method + ': ' + request.url);
        let headers = {
            // @ts-ignore
            'Content-Type': mimeTypes[filename.split('.').pop()] || mimeTypes['default']
        };
        response.writeHead(200, headers);
        response.end(fs.readFileSync(filename));
    }
}

function start(port = 8888) {
    return new Promise((resolve, reject) => {
        webserver.listen(port, (err) => {
            if (err) {
                return reject(err);
            }
            debug(`Server: Listening on port ${port}`);
            resolve();
        });
    });
}
exports.start = start;
function shutdown() {
    webserver.close();
}
exports.shutdown = shutdown;
//# sourceMappingURL=server.js.map