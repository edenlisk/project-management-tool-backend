import express, {Request} from "express";
import {config} from "dotenv";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import projectsRouter from "../routes/projectsRouter";

config()


const PORT = process.env.PORT;



const app = express();
app.use(express.json({limit: "50mb"}));
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public')));
const corsOptions ={
    origin:'*',
    credentials: true,
    optionSuccessStatus:200,
}
app.use(cors<Request>(corsOptions));
const limiter = rateLimit(
    {
        max: 5000,
        windowMs: 60 * 60 * 1000,
        message: "Too many requests from this IP, please try again in an hour"
    }
)
app.use(cookieParser());
app.use(hpp());
app.use(helmet());
app.use('/api', limiter);
app.set('port', PORT);


app.use('/api/v1/projects', projectsRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})