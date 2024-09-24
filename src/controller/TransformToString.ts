import { Request, Response } from "express"
import Chromium from "chrome-aws-lambda";

export default async function TransformToString(req: Request , res: Response) {
    try {
        const { htmlString } = req.body;

        const navegador = await Chromium.puppeteer.launch({
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath,
            headless: Chromium.headless,
          });
        console.log(navegador);
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
        return res.json({success: false, error: error});
    }
}