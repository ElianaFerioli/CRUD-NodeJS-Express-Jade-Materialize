
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var dbUrl = 'mongodb://127.0.0.1:27017/gestion';
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
//esta línea sirve para inicializar las vistas
app.set('view engine', 'jade');
//esta línea sirve para poder recoger todo lo que viene por post
app.use(bodyParser.urlencoded({extended: true}));

//Mapeos
//Inicio
app.get('/', function (req, res) {
  let datos = {};
  mongodb.connect(dbUrl, function(err, db){
      db.collection('usuarios').find().toArray(function(err, docs){
          datos.usuarios = docs;
          res.render('index', datos);
      });
  });
});

//Formulario para insertar Usuario
app.get('/formulario', function (req, res) {
  res.render('formulario');
});


//Insertar usuario
//para post hay que hacer npm install body-parser --save
app.post('/inserta-usuario', function (req, res) {
  //Inserto el usuario
  mongodb.connect(dbUrl, function(err, db){     
      datos = {};
      let usuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad,
        pais: req.body.pais
      }
      datos.usuario = usuario;
      //Insert
      db.collection('usuarios').insert(usuario);
      //Carga la vista
      //res.render('inserta-usuario', datos);
      res.redirect("/"); 
  });
});


//Recibe el id del usuario a modificar y carga sus datos en un formulario
app.get('/modificar', function (req, res) {
  //Extracción de los datos necesarios de la url
  var id = req.query.id;  
  //Busca el usuario
  mongodb.connect(dbUrl, function(err, db){
      db.collection('usuarios').find({"_id": new ObjectId(id)}).toArray(function(fff, doc) {
          datos = {};
          let usuario = {
            _id:doc[0]._id,
            nombre:doc[0].nombre,
            apellido: doc[0].apellido,
            edad: doc[0].edad,
            pais: doc[0].pais
          }
          datos.usuario = usuario;
          res.render('modificar-usuario', datos);
      });      
  });
});

//Modificacion (Recibe los datos del usuario a modificar y lo modifica)
app.post('/index', function (req, res) {
  let usuario = {
        _id: req.body._id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad,
        pais: req.body.pais
      }
  mongodb.connect(dbUrl, function(err, db){  
    //Update
    db.collection('usuarios').update({"_id": new ObjectId(usuario._id)}, {$set: {nombre: usuario.nombre, apellido: usuario.apellido, edad: usuario.edad, pais: usuario.pais}});   
  });
 res.redirect("/");  
});


//Borrado
app.get('/borrar', function (req, res) {
  //Extracción de los datos necesarios de la url
  var id = req.query.id;  
  mongodb.connect(dbUrl, function(err, db){
      db.collection('usuarios').remove({"_id": new ObjectId(id)});
      res.redirect("/");
  });
});


app.listen(8080, function () {
  console.log('Servidor arrancado en http://localhost:8080');
});

