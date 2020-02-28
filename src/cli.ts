import { pdftt, Props } from './index'
import { Stream } from 'stream';

const data = JSON.parse(process.argv[2]);

const arr = Array.isArray(data) ? data : [data];

const defaults = {
   page: 0,
   x: 0,
   y: 0,
   size: 14,
   text: 'undefined'
};

const propsList: Array<Props> = [];
for (const props of arr) {
    const newProps = Object.assign(defaults, props);
    propsList.push({
       page: newProps.page as number,
       x: newProps.x as number,
       y: newProps.y as number,
       size: newProps.size as number,
       text: newProps.text as string,
    });
}

(async function(){
    const input = await readStreamAll(process.stdin);
    const output = await pdftt(input, propsList);
    process.stdout.write(output);
}());

function readStreamAll(stream: Stream): Promise<Buffer> {
    return new Promise((resolve) => {
        let buffer: Buffer|null = null;
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
