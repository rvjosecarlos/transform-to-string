import { Request, Response } from "express"
import Chromium from "chrome-aws-lambda";
import { exec } from "child_process";

export default async function TransformToString(req: Request , res: Response) {
    try {

        /*
        exec('ls -la', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error al listar directorios: ${err}`);
              return;
            }
            console.log(`Contenido de ls SOLITO: ${stdout}`);
          });

        exec('ls .cache/puppeteer', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error al listar directorios de cache pupi: ${err}`);
              return;
            }
            console.log(`Contenido de .cache/puppeteer: ${stdout}`);
          });
          */

          exec('ls -la .cache/puppeteer/chrome/linux-129.0.6668.58', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error al listar directorios: ${err}`);
              return;
            }
            console.log(`Contenido de cache solito: ${stdout}`);
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
            executablePath: '/.cache/puppeteer/chrome/linux-129.0.6668.58/chrome-linux64/chrome',
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