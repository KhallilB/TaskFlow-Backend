import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.listen(process.env.PORT, () => {
  console.log(`[server]: Server running on port ${process.env.PORT}`);
})