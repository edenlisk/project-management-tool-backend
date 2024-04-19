import express, {Request, Response} from "express";
import {config} from "dotenv";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan"
// import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import projectsRouter from "../routes/projectsRouter";
import taskRouter from "../routes/taskRouter";
import usersRouter from "../routes/usersRouter";
import messagesRouter from "../routes/messageRouter";
import chatRouter from "../routes/chatRouter";

config()


const PORT = process.env.PORT;



const app = express();
app.use(express.json({limit: "50mb"}));
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public')));
const corsOptions = {
    origin:'*',
    credentials: true,
    optionSuccessStatus:200,
}
app.use(cors<Request>(corsOptions));
// const limiter = rateLimit(
//     {
//         max: 5000,
//         windowMs: 60 * 60 * 1000,
//         message: "Too many requests from this IP, please try again in an hour"
//     }
// )
app.use(cookieParser());
app.use(hpp());
app.use(helmet());
// app.use('/api', limiter);
app.set('port', PORT);

// app.use('/', (req: Request, res: Response) => {
//     res.send('lmao');
// })
app.use(logger('dev'));
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/chats', chatRouter);


mongoose.connect(process.env.MONGO_URL_DEV as string, {dbName: "project-management-tool"})
    .then(() => console.log("Database connection is successful"))
    .catch((err: Error) => console.log(err.message));

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})