import server from "./server";

const port = process.env.PORT || 4000;

server.listen(port, () => {
    try {
        console.log("Servidor en Linea");
    }
    catch(error) {
        console.log("ERROR:", error);
    }
});