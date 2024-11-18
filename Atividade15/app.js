var app = require('./exercicios/app/config/server'); 
var rotaHome = require('./exercicios/app/routes/home'); // só está definindo
rotaHome(app); // está executando
var rotaAdicionarUsuario = require('./exercicios/app/routes/adicioar_usuario'); 
rotaAdicionarUsuario(app); 
var rotaHistoria = require('./exercicios/app/routes/historia'); 
rotaHistoria(app); 
var rotaCursos = require('./exercicios/app/routes/cursos'); 
rotaCursos(app); // está executando 
var rotaProfessores = require('./exercicios/app/routes/professores'); // só está definindo 
rotaProfessores(app); // está executando 
/* poderia executar assim também*/ 
/* 
var rotaAdicionarUsuario = require('./app/routes/adicionar_usuario')(app); 
*/ 
app.listen(3000, function(){ 
 console.log("servidor iniciado"); 
}); 
