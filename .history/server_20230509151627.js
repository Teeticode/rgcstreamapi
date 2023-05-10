const express = require('express');

const dotenv = require('dotenv').config();
const URL = process.env.URL;
const PORT = process.env.PORT
const morgan = require('morgan');
const userRoute = require('./routes/userRoute')
const connectToMongo = require('./config/mongo');

const app = express();

app.use(morgan('tiny'));
app.use(`${URL}users`, userRoute)
connectToMongo();
app.listen(PORT, ()=>{
    console.log(`RGC stream app is running on port ${PORT}`)
})

app.get(`${URL}`,(req,res)=>{
    res.status(200).json({status:true})
})