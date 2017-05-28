
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
	connection.query('SELECT idusuario FROM usuarios WHERE usuarioCodigo = ' + usuarioCodigo + '', function(error,resp) {// Check user based on FB id
  	if (error){
  		return {status : "error", error : error.message}  	}
  	else{
  		if(resp !== null){
  			return {status : true};
  		}
  		else{
  			return resp;
  		}
  	}
});
}

//Insert new Usuario
exports.usuario_registrar = function(usuarioNombre,usuarioCodigo){
connection.query('INSERT INTO usuarios(usuarioNombre,usuarioCodigo) VALUES("' + usuarioNombre + '","' + usuarioCodigo + '")',function(error,resp){
	if(error){
		return {status: "error", error : error.message}
	}
	else{
  		if(resp !== null){
  			return resp.insertId;
  		}
  		else{
  			return {status : false};
  		}
  	}
});
}

//Insert new consulta
exports.consulta_almacenar = function(idUsuario,tienda,producto,precio,precioMasBajo,consulta) {//store a new item searched
	connection.query('INSERT INTO consultas (idusuario,tienda,producto,precio,precioMasBajo,consulta) VALUES (' + idUsuario + ',"' + tienda + '","' + producto + '",' + precio + ',' + precioMasBajo + ',"' + consulta + '")',function(error){
		if (error) {
			return {status: "error", error : error.message}
		}
		else{
			return {status: "done"}
		}
	});
}

//Return consultas from a user
exports.consulta_obtener = function(idUsuario) {
	connection.query('SELECT producto FROM consultas where idusuario = ' + idUsuario + '',function(error,rows){
		if (error) {
			return {status: "error", error : error.message};
		}
		else{
			return rows;
		}
	});
}

//Update Product Price
exports.consulta_actualizar = function(idConsulta,nuevoPrecio) {
	connection.query("UPDATE consultas set precio = " + nuevoPrecio + " WHERE idconsulta = " + idConsulta + "",function(error){
		if (error) {
			return {status: "error", error : error.message}
		}
		else{
			return {status: "done"}
		}
	});
}

connection.end();



