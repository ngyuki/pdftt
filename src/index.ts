import { readFileSync } from 'fs'
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

const fontBytes = process.env.PDFGEN_FONT && process.env.PDFGEN_FONT.length
    ? readFileSync(process.env.PDFGEN_FONT)
    : StandardFonts.TimesRoman;

export interface Props {
    page: number,
    x: number,
    y: number,
    size: number,
    text: string,
}

export async function pdftt (input: Buffer, propsList: Array<Props>){
    const pdfDoc = await PDFDocument.load(input)
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes);
    const pages = pdfDoc.getPages();
    for (const props of propsList) {
        inject(pages, font, props);
    }
    return await pdfDoc.save();
};

function inject(pages: PDFPage[], font: PDFFont, props: Props) {
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
