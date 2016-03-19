var Productos = new Array();
var selProd = new Array();
var Hombres,Mujeres,Ninios = 0;
var prodCargados = false;
var app = {
     //Constructor
    initialize: function() {
        //init combos
        app.cargoCombo();
		$(document).ready(function(){
            
		});	
        this.bindEvents();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//navigator.splashscreen.hide();
		
		document.addEventListener("menubutton", app.nativeMenuButton, false);
		document.addEventListener("backbutton", app.onBackKeyDown, false);
		
        cargarBBDD("PRODUCTOS");
        
		/*var a = window.localStorage.getItem("CargaInicial");
		if(a == null){
			location.href = "#cargaInicial";
		}
		else if(a == "si"){
			var b = window.localStorage.getItem("FormActivo");
			if(b == null || b == "no"){
				location.href = "#altaForm";
			}
			else{
				NumeroFormulario = b;
				location.href = "#formulario";
			}
		}*/
    },
	nativeMenuButton: function(){
		//para cuando apretan boton opciones
	},		
	onBackKeyDown: function(){
		//para cuando apreta para atras
	},
    //paposdk
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		$(document).on("pagebeforeshow","#almacen",function(){
            for(var i=0; i<Productos.length;i++){
                app.addLiProducto(Productos[i].nombre);
            }
		});
    },
    cargoCombo: function(){
    var Combo = document.getElementById("hombre");
		for(var i = 0; i<41; i++){
            op = document.createElement("option");
            op.setAttribute("value",i);
            op.innerHTML = i;
            Combo.appendChild(op);
        }
        Combo = document.getElementById("mujer");
		for(var i = 0; i<41; i++){
            op = document.createElement("option");
            op.setAttribute("value",i);
            op.innerHTML = i;
            Combo.appendChild(op);
        }
        Combo = document.getElementById("ninio");
		for(var i = 0; i<41; i++){
            op = document.createElement("option");
            op.setAttribute("value",i);
            op.innerHTML = i;
            Combo.appendChild(op);
        }
    },
    nuevoElemento: function(id, nom, un, imp, vh, vm, vn, ic){
        var elemento = {idObjeto: id,nombre: nom,unidad: un,importe: imp,valH: vh,valM: vm,valN: vn,icon: ic};
        return elemento;
    },
    cargarProdDefault: function(){
        Productos.push(app.nuevoElemento(1,"Asado","Kg",83.99,1,0.9,0.5,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(2,"Vacio","Kg",89.99,1,0.9,0.5,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(3,"Entraña","Kg",99.99,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(4,"Pollo","Kg",19.99,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(5,"Bondiola","Kg",96.99,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(6,"Chorizo","Unidad",9.60,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(7,"Morcilla","Kg",36.99,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(8,"Molleja","Kg",98.99,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(9,"Riñon","Kg",35.99,1,1,1,"style/elemIcon/"));
        Productos.push(app.nuevoElemento(10,"Chinchulin","Kg",17.99,1,1,1,"style/elemIcon/"));
        
        prodCargados = true;
        guardarBBDD("PRODUCTOS", Productos)
    },
    addLiProducto: function(nom){
        var lista = document.getElementById("lista");
        input = document.createElement("input");
		label = document.createElement("label");
        
		input.setAttribute("type", "checkbox");
		input.setAttribute("name", nom);
		input.setAttribute("id", nom);
		label.setAttribute("for", nom);
		label.innerHTML = nom;
        
		lista.appendChild(input);
		lista.appendChild(label);
    },
    selComensales: function(){
        Hombres = parseInt(document.getElementById("hombre").value);
        Mujeres = parseInt(document.getElementById("mujer").value);
        Ninios = parseInt(document.getElementById("ninio").value);
        if(Hombres == "NaN")
            Hombres=0;
        if(Mujeres == "NaN")
            Mujeres=0;
        if(Ninios == "NaN")
            Ninios=0;
        location.href = '#almacen';
    }
}

app.initialize();