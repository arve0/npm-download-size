const http = require("http");
const fs = require("fs");
const { normalize, join } = require("path");

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
    let filename = join(__dirname, '..', 'dist', safePath);
    if (!fs.existsSync(filename)) {
        console.log('404 - ' + request.method + ': ' + request.url);
        response.statusCode = 404;
        response.end('File not found.');
    }
    else {
        console.log('200 - ' + request.method + ': ' + request.url);
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
            console.log(`Listening on port ${port}`);
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