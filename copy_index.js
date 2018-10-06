const { readFileSync, writeFileSync } = require('fs');

let index = readFileSync('dist/index.html', 'utf8')
    .replace(/(href|src)=(js|css)/g, '$1=dist/$2');

writeFileSync('index.html', index);