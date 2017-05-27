
var express = require('express');
var router = express.Router();

/*Route for the module*/
//Existe usuario
router.get('/usuario', function (req, res) {
  var codigoFB = req.params.codigoFB;

  res.json(usuario_registrado(codigoFB));
});

//Ingresa Usuario
router.post('/producto', function(req,res){
  var codigoFB = req.body.codigoFB;
  var nombre = req.body.nombre;
  res.json(usuario_registrar(nombre,codigoFB));
});

//ingresa Consulta
router.post('/consulta', function (req, res) {
  var tienda = req.body.tienda;
  var producto = req.body.producto;
  var precio = req.body.precio;
  var precioMasBajo = req.body.precioMasBajo;
  var consulta = req.body.consulta;
  res.json(consulta_almacenar(tienda,producto,precio,precioMasBajo,consulta));
});

//obtener consultas
router.get('/consulta', function (req, res) {
  var idUsuario = req.params.idUsuario;
  res.json(consulta_obtener(idUsuario));
});

//modifica precio
router.put('/consulta', function (req, res) {
  var idConsulta = req.body.idConsulta;
  var nuevoPrecio = req.body.nuevoPrecio;
  res.json(consulta_actualizar(idConsulta,nuevoPrecio));
});
/*Connection info*/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
  user     : 'b1322d31d33360',
  password : '4e2c2e2a'
});

connection.connect();

/*Check if user exists already on DB*/
function usuario_registrado(codigoFB) {
	connection.query('SELECT usuarioCodigo FROM user WHERE usuarioCodigo = ' + codigoFB + '', function(error,resp) {// Check user based on FB id
  	if (error){
  		return {status : "error", error : error.message}  	}
  	else{
  		if(resp !== null){
  			return {status : true};
  		}
  		else{
  			return {status : false};
  		}

  	}
});
}

function usuario_registrar(usuarioNombre,usuarioCodigo){
connection.query('INSERT INTO usuarios(usuarioNombre,usuarioCodigo) VALUES(' + usuarioNombre + ',' + usuarioCodigo + ')',function(error){
	if(error){
		return {status: "error", error : error.message}
	}
	else{
		return {status: "done"}
	}

});
}


function consulta_almacenar(tienda,producto,precio,precioMasBajo,consulta) {//store a new item searched
	connection.query('INSERT INTO consulta (tienda,producto,precio,precioMasBajo,consulta) VALUES (' + tienda + ',' + producto + ',' + precio + ',' + precioMasBajo + ',' + consulta + ')',function(error){
		if (error) {
			return {status: "error", error : error.message}
		}
		else{
			return {status: "done"}
		}
	});
}

//Return items for an user
function consulta_obtener(idUsuario) {
	connection.query('SELECT producto FROM consultas where idUsuario = ' + idUsuario + '',function(error,rows){
		if (error) {
			return {status: "error", error : error.message};
		}
		else{
			return rows;
		}
	});
}

//Modify
function consulta_actualizar(idConsulta,nuevoPrecio) {
	connection.query("UPDATE consultas set precioActual = " + nuevoPrecio + " WHERE consulta = " + idConsulta + "",function(error){
		if (error) {
			return {status: "error", error : error.message}
		}
		else{
			return {status: "done"}
		}
	});
}

connection.end();



