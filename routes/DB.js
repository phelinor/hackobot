
/*Connection info*/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
  user     : 'b1322d31d33360',
  password : '4e2c2e2a'
});

connection.connect();

/*Check if user exists already on DB*/
exports.usuario_registrado = function(codigoFB) {
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

exports.usuario_registrar = function(usuarioNombre,usuarioCodigo){
connection.query('INSERT INTO usuarios(usuarioNombre,usuarioCodigo) VALUES(' + usuarioNombre + ',' + usuarioCodigo + ')',function(error){
	if(error){
		return {status: "error", error : error.message}
	}
	else{
		return {status: "done"}
	}

});
}


exports.consulta_almacenar = function(tienda,producto,precio,precioMasBajo,consulta) {//store a new item searched
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
exports.consulta_obtener = function(idUsuario) {
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
exports.consulta_actualizar = function(idConsulta,nuevoPrecio) {
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



