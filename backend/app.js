const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');

const lembreteRoutes = require ('./rotas/lembretes');
const usersRoutes = require('./rotas/usersRoutes');


mongoose.connect('mongodb+srv://usuario_base:outrasenha@cluster0.2ifyd.mongodb.net/app-mean?retryWrites=true&w=majority')
.then(() => {
  console.log("Conexão OK")
}).catch((e) => {
  console.log("Conexão NOK:" + e);
});

mongoose.Promise = global.Promise;

app.use (bodyParser.json());

app.use('/imagens', express.static(path.join("backend/imagens")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
})

app.use('/api/principal', lembreteRoutes);
app.use('/auth', usersRoutes);



module.exports = app;
