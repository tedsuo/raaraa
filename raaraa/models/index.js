var fs = require('fs');

fs.readdirSync(__dirname).forEach(function(path) {
    if (/!\.js$/.test(path)) {
        return;
    }

    if (path === 'index.js') {
        return;
    }
    
    path = path.replace(/\.js$/, '');
    var model = require('./'+path);
    exports[path] = model;
});