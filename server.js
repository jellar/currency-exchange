require('dotenv').config();
const { getRates } = require('./lib/fixer-service');
const { convertCurrency } = require('./lib/free-currency-service');

const express = require('express');
const app = express();
const port = process.env.port || 3000;

app.use(express.static('public'));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

const errorHandler = (err, req, res) => {
    if(err.response){
        res.status(403).send({title: 'Server responded with an error', message: err.message});
    } else if(err.request){
        res.status(503).send({title: 'Unable to comminicate with server', message: err.message});
    } else{
        res.status(500).send({title: 'An unexpected error occurred', message: err.message});
    }
}

app.get('/api/rates', async(req,res)=>{
    try{
        const data = await getRates();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch(error){
        errorHandler(error, req, res);
    }
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
    console.log('listening on %d', port);
});