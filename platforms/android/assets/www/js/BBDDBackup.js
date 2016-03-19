var shortName = 'Procampo';
var version = '1.0';
var displayName = 'Procampo';
var maxSize = 200000;
var db;


function guardarBBDD(tipo, data){
	datos = data;
	Tipo = tipo;
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(populateDB, errorCB, successCB);
}
function guardarBBDDdesc(tit, cue){
	Titulo = tit;
	Cuerpo = cue;
	Tipo = "CONVENIOSDET";
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(populateDB, errorCB, successCB);
}
function cargarBBDD(tipo){
	Tipo = tipo
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(ListDBValues, errorCB, successCB);
}
function consultaBBDD(params){
	var row;
	Titulo = params
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(ListDBValuesCONV, errorCB, successCB);
}
// Populate the database
//
function populateDB(tx) {
	switch (Tipo) {
		case "NOTICIAS":
			tx.executeSql('DROP TABLE IF EXISTS NOTICIAS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS NOTICIAS(Id INTEGER NOT NULL PRIMARY KEY, titulo TEXT NOT NULL, entrada TEXT NOT NULL, texto_ppal TEXT NOT NULL, fecha TEXT NOT NULL, imagen_ch TEXT, imagen TEXT)');//,[],nullHandler,errorCB);
			for (var i = 0; i < datos.length; i++) {
				tx.executeSql("INSERT INTO NOTICIAS (titulo, entrada, texto_ppal, fecha, imagen_ch, imagen) VALUES ('"+datos[i].titulo+"', '"+datos[i].entrada+"', '"+datos[i].texto_ppal+"', '"+datos[i].fecha+"', '"+datos[i].imagen_ch+"', '"+datos[i].imagen+"')");
			}
			break;
		case "CONVENIOS":
			tx.executeSql('DROP TABLE IF EXISTS CONVENIOS');
			//para los detalles va a haber otra tabla que si no es volatil
			tx.executeSql('CREATE TABLE IF NOT EXISTS CONVENIOS(Id INTEGER NOT NULL PRIMARY KEY, titulo TEXT NOT NULL, url TEXT NOT NULL, imagen TEXT NOT NULL)');//,[],nullHandler,errorCB);
			for (var i = 0; i < datos.length; i++) {
				tx.executeSql("INSERT INTO CONVENIOS (titulo, url, imagen) VALUES ('"+datos[i].titulo+"', '"+datos[i].url+"', '"+datos[i].imagen+"')");
			}
			break;
		case "CREDITOS":
			tx.executeSql('DROP TABLE IF EXISTS CREDITOS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS CREDITOS(Id INTEGER NOT NULL PRIMARY KEY, titulo TEXT NOT NULL, entrada TEXT NOT NULL, texto_ppal TEXT NOT NULL, fecha TEXT NOT NULL, imagen_ch TEXT, imagen TEXT)');//,[],nullHandler,errorCB);
			for (var i = 0; i < datos.length; i++) {
				tx.executeSql("INSERT INTO CREDITOS (titulo, entrada, texto_ppal, fecha, imagen_ch, imagen) VALUES ('"+datos[i].titulo+"', '"+datos[i].entrada+"', '"+datos[i].texto_ppal+"', '"+datos[i].fecha+"', '"+datos[i].imagen_ch+"', '"+datos[i].imagen+"')");
			}
			break;
		case "PROCAMPOTARJ":
			tx.executeSql('DROP TABLE IF EXISTS PROCAMPOTARJ');
			tx.executeSql('CREATE TABLE IF NOT EXISTS PROCAMPOTARJ(Id INTEGER NOT NULL PRIMARY KEY, titulo TEXT NOT NULL, entrada TEXT NOT NULL, texto_ppal TEXT NOT NULL, fecha TEXT NOT NULL, imagen_ch TEXT, imagen TEXT)');//,[],nullHandler,errorCB);
			for (var i = 0; i < datos.length; i++) {
				tx.executeSql("INSERT INTO PROCAMPOTARJ (titulo, entrada, texto_ppal, fecha, imagen_ch, imagen) VALUES ('"+datos[i].titulo+"', '"+datos[i].entrada+"', '"+datos[i].texto_ppal+"', '"+datos[i].fecha+"', '"+datos[i].imagen_ch+"', '"+datos[i].imagen+"')");
			}
			break;
		case "CONVENIOSDET":
			//REVISAR PORQUE HAY QUE CONSULTAR ANTES DE GRABAR PORQUE SI; ESTA NO VA A SER VOLATIL ASIQUE NO HAY QUE DUPLICAR ROWS
			tx.executeSql('CREATE TABLE IF NOT EXISTS CONVENIOSDET(Id INTEGER NOT NULL PRIMARY KEY, titulo TEXT NOT NULL, cuerpo TEXT NOT NULL)');//,[],nullHandler,errorCB);
			tx.executeSql("INSERT INTO CONVENIOSDET (titulo, cuerpo) VALUES ('"+Titulo+"', '"+Cuerpo+"')");
			break;
	}
}

function nullHandler(){}
// Transaction error callback
//
function errorCB(tx, err) {
	alert("Error de SQL: "+tx.message);
}

// Transaction success callback
//
function successCB() {
}

function ListDBValues() {
	switch (Tipo) {
		case "NOTICIAS":
			db.transaction(function(transaction) {
			   transaction.executeSql('SELECT * FROM NOTICIAS;', [],
				 function(transaction, result) {
				  if (result != null && result.rows != null) {
				  arrDatos = new Array();
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						arrDatos.push(row);
						app.addLi(row.titulo, row.entrada, row.fecha, row.Id, row.imagen, "Noticias");
					}
				  }
				},errorCB);
			},errorCB,nullHandler);
			notasCargadas = true;
			return;
			break;
		case "CONVENIOS":
			db.transaction(function(transaction) {
			   transaction.executeSql('SELECT * FROM CONVENIOS;', [],
				 function(transaction, result) {
				  if (result != null && result.rows != null) {
				  arrDatosConvenios = new Array();
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						arrDatosConvenios.push(row);
						app.addLiConvenio(row.titulo, row.imagen, i)
					}
				  }
				},errorCB);
			},errorCB,nullHandler);
			conveniosCargado = true;
			break;
		case "CREDITOS":
			db.transaction(function(transaction) {
			   transaction.executeSql('SELECT * FROM CREDITOS;', [],
				 function(transaction, result) {
				  if (result != null && result.rows != null) {
				  arrDatosCreditos = new Array();
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						arrDatosCreditos.push(row);
						app.addLi(row.titulo, row.entrada, row.fecha, row.Id, row.imagen, "Creditos");
					}
				  }
				},errorCB);
			},errorCB,nullHandler);
			creditosCargado = true;
			break;
		case "PROCAMPOTARJ":
			db.transaction(function(transaction) {
			   transaction.executeSql('SELECT * FROM PROCAMPOTARJ;', [],
				 function(transaction, result) {
				  if (result != null && result.rows != null) {
				  arrDatosProcampo = new Array();
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						arrDatosProcampo.push(row);
					}
					sessionStorage.setItem('FechaNota', arrDatosProcampo[0].fecha);
					sessionStorage.setItem('TituloNota', arrDatosProcampo[0].titulo);
					sessionStorage.setItem('procampoEntrada', arrDatosProcampo[0].entrada);
					sessionStorage.setItem('CuerpoNota', arrDatosProcampo[0].texto_ppal);
					sessionStorage.setItem('ImagenNota', arrDatosProcampo[0].imagen);
					sessionStorage.setItem('Tipo', "Procampo ");
					var Url1 = window.location.href;
					if(Url1.substring(Url1.length - 8, Url1.length) == "#notaDiv"){
						location.href = "#notDiv";					
						location.href = "#notaDiv";
					}
					else{
						location.href = "#notaDiv";
					}
				  }
				},errorCB);
			},errorCB,nullHandler);
			procampoCargado = true;
			break;
	}
}



function ListDBValuesCONV() {
	db.transaction(function(transaction) {
	   transaction.executeSql('CREATE TABLE IF NOT EXISTS CONVENIOSDET(Id INTEGER NOT NULL PRIMARY KEY, titulo TEXT NOT NULL, cuerpo TEXT NOT NULL)');
	   transaction.executeSql('SELECT * FROM CONVENIOSDET WHERE titulo = "'+Titulo+'";', [],
		 function(transaction, result) {
			if (result != null && result.rows != null && result.rows.length != 0) {
				row = result.rows.item(0);
				//return row;
				alert(row.titulo);
			}
			else{
				//return "popo";
				alert("no hay nada");
			}
		},errorCB);
	},errorCB,nullHandler);
}