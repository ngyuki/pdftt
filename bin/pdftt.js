#!/usr/bin/env node

const fs = require('fs');
const pdftt = require('../');

const data = JSON.parse(process.argv[2]);

const arr = Array.isArray(data) ? data : [data];

const defaults = {
   page: 0,
   x: 0,
   y: 0,
   size: 14,
   text: 'undefined'
};

const propsList = [];
for (const props of arr) {
    const newProps = Object.assign(defaults, props);
    propsList.push({
       page: newProps.page,
       x: newProps.x,
       y: newProps.y,
       size: newProps.size,
       text: newProps.text,
    });
}

(async function(){
    const input = await readStreamAll(process.stdin);
    const output = await pdftt(input, propsList);
    process.stdout.write(output);
}());

function readStreamAll(stream){
    return new Promise((resolve) => {
        let buffer = null;
        stream.on('end', () => resolve(buffer ? buffer : Buffer.alloc(0)));
        stream.on('data', (data) => {
            if (buffer) {
                buffer = Buffer.concat([buffer, data]);
            } else {
                buffer = data;
            }
        });
    });
}
