const fs = require('node:fs');
const assert = require('node:assert/strict');

const html = fs.readFileSync('public/index.html', 'utf8');
const script = fs.readFileSync('public/assets/js/script.js', 'utf8');

assert.match(html, /data-local-launcher/);
assert.match(html, /data-default-host="localhost"/);
assert.match(html, /name="host"/);
assert.match(html, /data-open-target/);
assert.match(html, />Save</);
assert.doesNotMatch(html, /MY CORTEX|Open your local Cortex|Save and open Cortex/);
assert.match(html, /assets\/css\/style\.css/);
assert.match(html, /assets\/js\/script\.js/);
assert.match(script, /localStorage\.getItem\(hostKey\)/);
assert.match(script, /localStorage\.setItem\(hostKey,target\.host\)/);
assert.match(script, /localStorage\.setItem\(portKey,String\(target\.port\)\)/);
assert.match(script, /window\.location\.replace\(target\.url\)/);
assert.match(script, /params\.has\('config'\)/);
assert.match(script, /if\(mode==='launch'\)/);

console.log('launcher contracts passed');
