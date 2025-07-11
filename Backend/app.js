const express = require('express');
const { questionRouter } = require('./routes/questionRoutes');
const previewRouter = require('./routes/previewRoutes');
const cors = require("cors");
const connectDB = require('./config/db');
const app = express();
require('dotenv').config();

// cors
app.use(cors());

// DB
connectDB();

app.use(express.json());

// routes
app.use('/questions', questionRouter);
app.use('/preview', previewRouter);

app.get('/', (req, res)=>{
    res.send('AI Interview Assistant');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server is listening on PORT', PORT);
});