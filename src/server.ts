import express from "express";
import TransformToString from "./controller/TransformToString";

const server = express();

server.use(express.json());

server.post('/transform', TransformToString);

export default server;