import { Request, Response } from "express";
export default function TransformToString(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
