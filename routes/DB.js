
//Connection info
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS
});

connection.connect();

//Check if user exists already on DB
exports.usuario_registrado = function(usuarioCodigo) {
	return new Promise((resolve,reject) => {
		connection.query('SELECT idusuario FROM usuarios WHERE usuarioCodigo = ' + usuarioCodigo + '', function(error,resp) {// Check user based on FB id
  		if (error){
  			reject({status : "error", error : error.message})  	}
  		else{
  			if(resp !== null){
  				resolve(resp);
  			}
  			else{
  				reject({status : false, error : resp});
  			}
  		}
		});
	});
}

//Insert new Usuario
exports.usuario_registrar = function(usuarioNombre,usuarioCodigo){
return new Promise((resolve,reject) => {
connection.query('INSERT INTO usuarios(usuarioNombre,usuarioCodigo) VALUES("' + usuarioNombre + '","' + usuarioCodigo + '")',function(error,resp){
	if(error){
		reject({status: "error", error : error.message});
	}
	else{
  		if(resp !== null){
  			resolve(resp.insertId);
  		}
  		else{
  			resolve({status : false});
  		}
  	}
});
});
}

//Insert new consulta
exports.consulta_almacenar = function(idUsuario,tienda,producto,precio,precioMasBajo,consulta) {//store a new item searched
	return new Promise((resolve,reject) => {
	connection.query('INSERT INTO consultas (idusuario,tienda,producto,precio,precioMasBajo,consulta) VALUES (' + idUsuario + ',"' + tienda + '","' + producto + '",' + precio + ',' + precioMasBajo + ',"' + consulta + '")',function(error){
		if (error) {
			reject({status: "error", error : error.message});
		}
		else{
			resolve({status: "done"});
		}
	});
	});
}

//Return consultas from a user
exports.consulta_obtener = function(idUsuario) {
	return new Promise((resolve,reject) => {
	connection.query('SELECT producto FROM consultas where idusuario = ' + idUsuario + '',function(error,rows){
		if (error) {
			reject({status: "error", error : error.message});
		}
		else{
			resolve(rows);
		}
	});
	});
}

//Update Product Price
exports.consulta_actualizar = function(idConsulta,nuevoPrecio) {
	return new Promise((resolve,reject) => {
	connection.query("UPDATE consultas set precio = " + nuevoPrecio + " WHERE idconsulta = " + idConsulta + "",function(error){
		if (error) {
			reject({status: "error", error : error.message});
		}
		else{
			resolve({status: "done"});
		}
	});
	});
}

connection.end();



