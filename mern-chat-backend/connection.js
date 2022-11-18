const mongoose = require('mongoose');
require('dotenv').config();

//estrae i dati del db dal file .env . Il link per connettersi lo si trova andando sul sito di mongodb e cliccando "Connect" affianco a Cluster0
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@xxxx/?retryWrites=true&w=majority`, ()=> {
  console.log('connected to mongodb')
  
})