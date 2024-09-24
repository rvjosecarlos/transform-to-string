import { Request, Response } from "express"
import puppeteer from "puppeteer-core";
import { chromium } from "playwright";

export default async function TransformToString(req: Request , res: Response) {
    try {
        const { htmlString } = req.body;

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlString);
        
        const pdf = await page.pdf({ path: 'output.pdf', format: 'A4' });
        await browser.close();

        const pdfBuffer = Buffer.from(pdf);
        const pdfBase64 = pdfBuffer.toString("base64");
        return res.json({success: true, data: pdfBase64});
    }
    catch(error) {
        return res.json({success: false, error: 'Error al convertir'});
    }
}