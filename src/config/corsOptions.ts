import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    }
};

export { corsOptions };