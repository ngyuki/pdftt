"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const pdf_lib_1 = require("pdf-lib");
const fontkit_1 = __importDefault(require("@pdf-lib/fontkit"));
const fontBytes = process.env.PDFGEN_FONT && process.env.PDFGEN_FONT.length
    ? fs_1.readFileSync(process.env.PDFGEN_FONT)
    : pdf_lib_1.StandardFonts.TimesRoman;
async function pdftt(input, propsList) {
    const pdfDoc = await pdf_lib_1.PDFDocument.load(input);
    pdfDoc.registerFontkit(fontkit_1.default);
    const font = await pdfDoc.embedFont(fontBytes);
    const pages = pdfDoc.getPages();
    for (const props of propsList) {
        inject(pages, font, props);
    }
    return await pdfDoc.save();
}
exports.pdftt = pdftt;
;
function inject(pages, font, props) {
    console.error(props);
    const page = pages[props.page];
    page.drawText(props.text, {
        x: props.x,
        y: props.y,
        size: props.size,
        font: font,
        color: pdf_lib_1.rgb(0, 0, 0),
    });
}
