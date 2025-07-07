const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('AI Interview Assistant');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server is listening on PORT', PORT);
});