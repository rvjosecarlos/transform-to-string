import express from "express";
import TransformToString from "./controller/TransformToString";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";

const server = express();

server.use(cors(corsOptions));

server.use(express.json());

server.post('/transform', TransformToString);

export default server;