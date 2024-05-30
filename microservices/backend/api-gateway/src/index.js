const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// Custom error handler middleware
app.get('/status', (req, res) => {
  res.status(200).send('Server is running!');
});
//app.use('/create', proxy(process.env.CREATE_MS_URL));
app.use('/create', proxy(process.env.CREATE_MS_URL, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ENOTFOUND':    
      { 
        return res.status(503).json({ error:'Create microservice is not available' });
      }
      case 'EAI_AGAIN':    
      { 
        return res.status(503).json({ error:'Create microservice is not available' });
      }
      default:              
      { 
        console.log(":(");
        next(err); 
      }
    }
}}));
app.use('/update', proxy(process.env.UPDATE_MS_URL, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ENOTFOUND':    
      { 
        return res.status(503).json({ error:'Update microservice is not available' });
      }
      default:              
      { 
        console.log(":(");
        next(err); 
      }
    }
}}));
app.use('/read', proxy(process.env.READ_MS_URL, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ENOTFOUND':    
      { 
        return res.status(503).json({ error:'Read microservice is not available' });
      }
      default:              
      { 
        console.log(":(");
        next(err); 
      }
    }
}}));
app.use('/delete', proxy(process.env.DELETE_MS_URL, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ENOTFOUND':    
      { 
        return res.status(503).json({ error:'Delete microservice is not available' });
      }
      default:              
      { 
        console.log(":(");
        next(err); 
      }
    }
}}));
app.use('/log', proxy(process.env.LOG_MS_URL, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ENOTFOUND':    
      { 
        return res.status(503).json({ error:'Log microservice is not available' });
      }
      default:              
      { 
        console.log(":(");
        next(err); 
      }
    }
}}));


app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

//app.get('/', (req, res) => {
//    return res.status(200).json({ message: 'Root' });
//  });


