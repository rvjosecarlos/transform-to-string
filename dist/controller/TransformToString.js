"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TransformToString;
const puppeteer_1 = __importDefault(require("puppeteer"));
function TransformToString(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { htmlString } = req.body;
            const navegador = yield puppeteer_1.default.launch({ headless: true });
            const paginaWeb = yield navegador.newPage();
            yield paginaWeb.setContent(htmlString, { waitUntil: 'domcontentloaded' });
            const pdf = yield paginaWeb.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    bottom: '20mm',
                    left: '10mm',
                    right: '10mm'
                }
            });
            yield navegador.close();
            const pdfBuffer = Buffer.from(pdf);
            const pdfBase64 = pdfBuffer.toString("base64");
            return res.json({ success: true, data: pdfBase64 });
        }
        catch (error) {
            return res.json({ success: false, error: error });
        }
    });
}
