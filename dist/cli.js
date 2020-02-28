"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index_1 = require("./index");
function usage() {
    console.log(`Usage: ${path_1.default.basename(process.argv[1])} <input> <output> <json>`);
}
function usageExit(err) {
    console.error(err);
    usage();
    process.exit(1);
}
function help() {
    usage();
    console.log(`
Example:
    ${path_1.default.basename(process.argv[1])} template.pdf output.pdf '[
        {"page":0, "x":100, "y":200, "size":20, "text":"this is test1"},
        {"page":0, "x":100, "y":300, "size":20, "text":"this is test2"},
        {"page":0, "x":100, "y":400, "size":20, "text":"this is test3"}
    ]'
`);
    process.exit(1);
}
function parseArgs(args) {
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
    const inputStream = args[0] === '-' ? process.stdin : fs_1.default.createReadStream(args[0]);
    const outputStream = args[1] === '-' ? process.stdout : fs_1.default.createWriteStream(args[1]);
    const data = JSON.parse(args[2]);
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
    return { inputStream, outputStream, propsList };
}
const { inputStream, outputStream, propsList } = parseArgs(process.argv.slice(2));
(async function () {
    const input = await readStreamAll(inputStream);
    const output = await index_1.pdftt(input, propsList);
    writeStreamAll(outputStream, Buffer.from(output));
}());
function readStreamAll(stream) {
    return new Promise((resolve) => {
        let buffer = null;
        stream.on('end', () => resolve(buffer ? buffer : Buffer.alloc(0)));
        stream.on('data', (data) => {
            if (buffer) {
                buffer = Buffer.concat([buffer, data]);
            }
            else {
                buffer = data;
            }
        });
    });
}
function writeStreamAll(stream, buffer) {
    return new Promise((resolve) => {
        stream.write(buffer, () => resolve());
    });
}
