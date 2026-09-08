const fs = require('node:fs');
const assert = require('node:assert/strict');

const html = fs.readFileSync('public/index.html', 'utf8');
const script = fs.readFileSync('public/assets/js/script.js', 'utf8');

assert.match(html, /data-local-launcher/);
assert.match(html, /assets\/css\/style\.css/);
assert.match(html, /assets\/js\/script\.js/);
assert.match(script, /localStorage\.getItem\(key\)/);
assert.match(script, /localStorage\.setItem\(key,String\(port\)\)/);
assert.match(script, /window\.location\.replace\(`http:\/\/localhost:\$\{port\}\//);
assert.match(script, /params\.has\('config'\)/);
assert.match(script, /if\(mode==='launch'\)/);

console.log('launcher contracts passed');
