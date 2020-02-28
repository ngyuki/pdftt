import path from 'path';
import fs from 'fs';
import stream from 'stream';
import { pdftt, Props } from './index'

function usage() {
    console.log(`Usage: ${path.basename(process.argv[1])} <input> <output> <json>`);
}

function usageExit(err: string) {
    console.error(err);
    usage();
    process.exit(1);
}

function help() {
    usage();
    console.log(`
Examples:
    ${path.basename(process.argv[1])} template.pdf output.pdf '[
        {"page":0, "x":100, "y":200, "size":20, "text":"this is test1"},
        {"page":0, "x":100, "y":300, "size":20, "text":"this is test2"},
        {"page":0, "x":100, "y":400, "size":20, "text":"this is test3"}
    ]'

Specify your own font:
    You can specify font path with the environment variable PDFGEN_FONT.

      export PDFGEN_FONT=/usr/share/fonts/ipa-gothic/ipag.ttf
`);
    process.exit(1);
}

function parseArgs(args: Array<string>) {
    for (const arg of args) {
        switch (arg) {
            case '-h':
            case '--help':
                help();
                break;
        }
    }
    if (args.length !== 3) {
        usageExit("Invalid argument count");
    }

    const inputStream = args[0] === '-' ? process.stdin : fs.createReadStream(args[0]);
    const outputStream = args[1] === '-' ? process.stdout : fs.createWriteStream(args[1]);

    const data = JSON.parse(args[2]);
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

    return { inputStream, outputStream, propsList };
}

const { inputStream, outputStream, propsList } = parseArgs(process.argv.slice(2));

(async function(){
    const input = await readStreamAll(inputStream);
    const output = await pdftt(input, propsList);
    writeStreamAll(outputStream, Buffer.from(output));
}());

function readStreamAll(stream: stream.Readable): Promise<Buffer> {
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

function writeStreamAll(stream: stream.Writable, buffer: Buffer): Promise<null> {
    return new Promise((resolve) => {
        stream.write(buffer, ()=> resolve());
    });
}
