import { Request, Response } from "express"
import puppeteer from "puppeteer";

export default async function TransformToString(req: Request , res: Response) {
    try {
        const { htmlString } = req.body;

        const navegador = await puppeteer.launch({ headless: true });
        const paginaWeb = await navegador.newPage();
        await paginaWeb.setContent(htmlString, { waitUntil: 'domcontentloaded' });
        const pdf = await paginaWeb.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '10mm',
                right: '10mm' 
            }
        });
        await navegador.close();

        const pdfBuffer = Buffer.from(pdf);

        const pdfBase64 = pdfBuffer.toString("base64");

        return res.json({success: true, data: pdfBase64});
    }
    catch(error) {
        console.log(error);
        return res.json({success: false, error: 'Error al convertir'});
    }
}