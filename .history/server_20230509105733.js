const express = require('express');

const dotenv = require('dotenv').config();
const URL = process.env.URL;
const PORT = process.env.PORT
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));

app.listen(PORT, ()=>{
    console.log(`RGC stream app is running on port ${PORT}`)
})

app.get(`${URL}`,(req,res)=>{
    res.status(200).json({status:true})
})