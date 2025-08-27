import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv'

import city from "./api/routers/city.js";
import apartment from "./api/routers/apartment.js";
import advertiser from "./api/routers/advertiser.js";
import category from "./api/routers/category.js";
import { sendMail } from "./api/nodemailer.js";

const app = express()
const port = 3001

dotenv.config();
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(`mongodb://localhost:27017/rentApartments_db`)
    .then(() => {
        console.log('connected to mongoDB!');
    })
    .catch(err => {
        console.log({ error: err.message });
    })

app.use('/uploads', express.static('uploads'))
app.use('/city', city)
app.use('/apartment', apartment)
app.use('/advertiser', advertiser)
app.use('/category', category)
app.use('/nodemailer', sendMail)
app.get('', (req, res) => {
    res.send("a path wasn't sended")
})

// יצירת מאזין
app.listen(port, () => {
    console.log(`my application is listening on http://localhost:${port}`);
})
