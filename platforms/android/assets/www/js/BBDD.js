var shortName = 'Productos';
var version = '1.0';
var displayName = 'Productos';
var maxSize = 200000;
var db;

function guardarBBDD(tipo, data){
	datos = data;
	Tipo = tipo;
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(populateDB, errorCB, successCB);
}
function cargarBBDD(tipo){
	Tipo = tipo
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(ListDBValues, errorCB, successCB);
}
// Populate the database
//
function populateDB(tx) {
    switch (Tipo) {
		case "PRODUCTOS":
			tx.executeSql('DROP TABLE IF EXISTS PRODUCTOS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTOS(Id INTEGER NOT NULL PRIMARY KEY, nombre TEXT NOT NULL, unidad TEXT NOT NULL, importe TEXT NOT NULL, valH TEXT NOT NULL, valM TEXT, valN TEXT, icon TEXT)');//,[],nullHandler,errorCB);
			for (var i = 0; i < datos.length; i++) {
				tx.executeSql("INSERT INTO PRODUCTOS (nombre, unidad, importe, valH, valM, valN, icon) VALUES ('"+datos[i].nombre+"', '"+datos[i].unidad+"', '"+datos[i].importe+"', '"+datos[i].valH+"', '"+datos[i].valM+"', '"+datos[i].valN+"', '"+datos[i].icon+"')");
			}
			break;
		case "TRANSAC":
		
		break;
	}
}

function nullHandler(){}
// Transaction error callback
//
function errorCB(tx, err) {
	alert("Error de SQL: "+err.message);
}

// Transaction success callback
//
function successCB() {
}

function ListDBValues() {
	switch (Tipo) {
		case "PRODUCTOS":
			db.transaction(function(transaction) {
               transaction.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTOS(Id INTEGER NOT NULL PRIMARY KEY, nombre TEXT NOT NULL, unidad TEXT NOT NULL, importe TEXT NOT NULL, valH TEXT NOT NULL, valM TEXT, valN TEXT, icon TEXT)');
			   transaction.executeSql('SELECT * FROM PRODUCTOS;', [],
				 function(transaction, result) {
				  if (result != null && result.rows.length != 0) {
				  Productos = new Array();
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						Productos.push(row);
					}
				  }
				  else{
                    app.cargarProdDefault();
				  }
				},errorCB);
			},errorCB,nullHandler);
		prodCargados = true;
		return;
		break;
		case "TRANSAC":
		
		break;
	}
}