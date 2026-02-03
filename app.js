const express = require('express');
const mongoose = require('mongoose');







const app = express();
const port = 3000;

const gadgets = [
    {id:1, name : "iPhone 16 Pro Max", price : "N 1,800,000", condition : "New"},
    {id:2, name : "Macbook Air M2", price : "N 1,200,000", condition : "Used"},
    {id:3 , name: "Samsung Galaxy S23 Ultra", price : "N 1,500,000", condition : "New" }
]

app.get('/products', (req, res) =>{
    res.json(gadgets);
})

app.listen (port , () => {
    console.log(`Server is running on http://locahhost:${port}`);
})