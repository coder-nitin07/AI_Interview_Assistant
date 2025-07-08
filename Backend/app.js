const express = require('express');
const { questionRouter } = require('./routes/questionRoutes');
const cors = require("cors");
const app = express();
require('dotenv').config();

// cors
app.use(cors());

app.use(express.json());

// routes
app.use('/questions', questionRouter);

app.get('/', (req, res)=>{
    res.send('AI Interview Assistant');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server is listening on PORT', PORT);
});