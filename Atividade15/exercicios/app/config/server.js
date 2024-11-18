var express = require('express'); 
var app=express(); // executando o express 
app.set('view engine', 'ejs'); // o mecanismo de engine a ser usado
app.set('views','./exercicios/app/views'); // diretório onde os arquivos estão localizados
module.exports = app; 