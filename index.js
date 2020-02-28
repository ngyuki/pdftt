const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const fontBytes = process.env.PDFGEN_FONT && process.env.PDFGEN_FONT.length
    ? fs.readFileSync(process.env.PDFGEN_FONT)
    : StandardFonts.TimesRoman;

module.exports = async function (input, propsList){
    const pdfDoc = await PDFDocument.load(input)
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes);
    const pages = pdfDoc.getPages();
    for (const props of propsList) {
        inject(pages, font, props);
    }
    return await pdfDoc.save();
};

function inject(pages, font, props) {
    console.error(props);
    const page = pages[props.page];
    page.drawText(props.text, {
        x: props.x,
        y: props.y,
        size: props.size,
        font: font,
        color: rgb(0, 0, 0),
    });
}
