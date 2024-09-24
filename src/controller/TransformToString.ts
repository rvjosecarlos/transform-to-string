import { Request, Response } from "express"
import Chromium from "chrome-aws-lambda";
import { exec } from "child_process";

export default async function TransformToString(req: Request , res: Response) {
    try {

        exec('ls -la', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error al listar directorios: ${err}`);
              return;
            }
            console.log(`Contenido de /opt/render/.cache/puppeteer: ${stdout}`);
          });

        exec('ls /opt/render/.cache/puppeteer', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error al listar directorios: ${err}`);
              return;
            }
            console.log(`Contenido de /opt/render/.cache/puppeteer: ${stdout}`);
          });

        const { htmlString } = req.body;

        console.log('CHROMIUM',await Chromium);
        console.log('URL DEL NAVEGADOR', await Chromium.executablePath, await Chromium.args);

        const navegador = await Chromium.puppeteer.launch({
            args: [
                ...Chromium.args, 
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            defaultViewport: Chromium.defaultViewport,
            executablePath: '/opt/render/.cache/puppeteer/chrome',
            headless: true,
          });
        console.log(navegador);
        const paginaWeb = await navegador.newPage();
        await paginaWeb.setContent(htmlString, { waitUntil: 'domcontentloaded' });
        const pdf = await paginaWeb.pdf({
            format: 'a4',
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
        return res.json({success: false, error: error});
    }
}