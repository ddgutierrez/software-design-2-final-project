const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/create', proxy(process.env.CREATE_MS_URL));
app.use('/update', proxy(process.env.UPDATE_MS_URL));
app.use('/read', proxy(process.env.READ_MS_URL));
app.use('/delete', proxy(process.env.DELETE_MS_URL));
app.use('/log', proxy(process.env.LOG_MS_URL));

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

//app.get('/', (req, res) => {
//    return res.status(200).json({ message: 'Root' });
//  });
