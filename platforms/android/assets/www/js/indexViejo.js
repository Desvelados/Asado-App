//Variables globales
var AppFolder = "Scioli2015";
var ImagesFolder = "Imagenes";
var	ParamsFile = "ScConfig.txt";
var NumeroFormulario;
var CantFormsToPic;
var cerrarForm = false;
var foto1 = false;
var foto2 = false;
var aval = false;
var firma = false;
var DatosEscribir = "";
var doc;
var tipo;
var DatosForm  = new Array();
var DatoABorrar = "";
var salgoDet = false;

var app = {
    //Constructor
    initialize: function() {
		/*
		var fechaActual = new Date();
        diaHoy = fechaActual.getDate().toString();
        if (diaHoy.length == 1) {
            diaHoy = "0" + diaHoy;
        }
        mesHoy = fechaActual.getMonth() + 1;
        anioHoy =  fechaActual.getFullYear();
		var mesS = app.formatMes(mesHoy);
		document.getElementById("notFecha").innerHTML = diaHoy + " de " + mesS + " de " + anioHoy;
		document.getElementById("notDetFecha").innerHTML = diaHoy + " de " + mesS + " de " + anioHoy;		
		*/
        //init combos
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
        
		$(document).ready(function(){
			/*$(document).click(function(e) {
				var target = e.target;
				if (!$(target).is('.slider') && !$(target).parents().is('.slider')) {
					$('#menu').removeClass("girado");
					$('.slider').stop().animate({
					right: '-80px'    
					}, 400); 
				}
				else{
					$('#menu').addClass("girado");					
					$('.slider').stop().animate({
						right: 0    
					}, 400);        
				}        
			});*/
		});	
		
        this.bindEvents();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		navigator.splashscreen.hide();
		
		document.addEventListener("menubutton", app.nativeMenuButton, false);
		document.addEventListener("backbutton", app.onBackKeyDown, false);
		
		var a = window.localStorage.getItem("CargaInicial");
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
		}
    },
	nativeMenuButton: function(){
		/*if(menuOpened){
			menuOpened = false;
			$('body').removeClass('menu-open');
			$('nav').removeClass('open');
		}
		else{
			menuOpened = true;
			$('nav.left').addClass('open');
			$('body').addClass('menu-open');
		}*/
	},		
	onBackKeyDown: function(){
		//poner para limpiar el form
	},
    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },*/
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		$(document).on("pagebeforeshow","#formulario",function(){
			leerConfig();
		});
		$(document).on("pagebeforeshow","#cargaInicial",function(){
			//para debug
			//localStorage.removeItem("CargaInicial");
			
		});
		$(document).on("pagebeforeshow","#detalleForm",function(){
			for(var i = 0; i<DatosForm.length;i++)
            {
                app.addLi(i);   
            }			
		});
    },
	finCA: function(){
		var r = document.getElementById("Responsable").value;
		var z = document.getElementById("Zona").value;
		if (r != "" && z != ""){
			DatosEscribir = r+";ZonaTrabajo:"+z;
			escribirResp();
		}
	},
	newForm: function(){
		var numform = document.getElementById("numForm").value;
		if(numform.match(/^\d+$/)){
			NumeroFormulario = numform;
			checkIfFileExists(AppFolder+"/"+numform+".txt");
		}
		else{
			alert("Escriba un numero correcto");
		}
	},
	altaForm: function(){
		var nom = document.getElementById("nombre").value;
		var ape = document.getElementById("apellido").value;
		var sex = document.getElementById("genero").value;
		doc = document.getElementById("docu").value;
		
		var dom = document.getElementById("domicilio").value;
		var loc = document.getElementById("localidad").value;
		var prov = document.getElementById("provincia").value;
		var partido = document.getElementById("partido").value;
		
		if(nom != "" && ape != ""){
			if(doc != "" && doc.match(/^\d+$/)){
				if (aval) {
					if(foto1 && foto2)
					{	
						//DatosEscribir = nom+";"+ape+";"+sex+";"+doc+";"+dom+";"+loc+";"+prov+";"+partido+";"+aval+"*";
						DatosForm.push(nom+";"+ape+";"+sex+";"+doc+";"+dom+";"+loc+";"+prov+";"+partido+";"+aval+"*");
						document.getElementById("pepito").innerHTML = DatosForm.length;		
						app.resetForm();
						//escribirData();
					}
					else{
						alert("Por favor, tome ambas fotografías del documento");
					}
				}
				else if(firma){
					//DatosEscribir = nom+";"+ape+";"+sex+";"+doc+";"+dom+";"+loc+";"+prov+";"+partido+";"+aval+"*";	
					DatosForm.push(nom+";"+ape+";"+sex+";"+doc+";"+dom+";"+loc+";"+prov+";"+partido+";"+aval+"*");
					document.getElementById("pepito").innerHTML = DatosForm.length;
					app.resetForm();
					//escribirData();
				}
				else{
					alert("Por favor seleccione un tipo de registro");
				}
			}
			else{
				alert("Por favor, ingrese un numero de documento valido");
			}
		}
		else{
			alert("Por favor ingrese el Nombre y Apellido");
		}
	},
	cerrarForm: function(){
		cerrarForm = true;
		DatosEscribir = ""
		for(var i = 0; i < DatosForm.length; i++){
			DatosEscribir += DatosForm[i];
		}
		escribirData();
	},
	finForm: function(){
		window.localStorage.setItem("FormActivo", "no");
		NumeroFormulario = null;
		DatosForm.length = 0;
		document.getElementById("numForm").value = "";
		document.getElementById("pepito").innerHTML = "0";
        document.getElementById("fotoForm").src = "style/images/photo.png";
        document.getElementById("fnFrm").disabled = true;
		location.href = "#altaForm";
	},
	chk1: function(){
		firma = true;
		aval = false;
		document.getElementById("foto1").style.display = "none";
		document.getElementById("foto2").style.display = "none";
	},
	chk2: function(){
		firma = false;
		aval = true;
		document.getElementById("foto1").style.display = "table-cell";
		document.getElementById("foto2").style.display = "table-cell";
	},
	tomarF1: function(){
		doc = document.getElementById("docu").value;
		if(doc != "" && doc.match(/^\d+$/)){
			tipo="A";
			capturePhoto();
		}
		else{
			alert("Por favor, ingrese un numero de documento valido");
		}
	},
	tomarF2: function(){
		doc = document.getElementById("docu").value;
		if(doc != ""){
			tipo="R";
			capturePhoto2();
		}
		else{
			alert("Por favor, ingrese un numero de documento valido");
		}
		
	},
    tomarF3: function(){
        if(document.getElementById("fotoForm").src == "style/images/photo.png"){
            alert("Por favor, tome una fotografia al formulario");
        }
        else{
            capturePhotoForm();
        }
    },
    addLi: function(idx) {
		var listado = document.getElementById("listado");
        
        li = document.createElement("li");
		nom = document.createElement("label");
		doc = document.createElement("label");
		aval = document.createElement("label");
        cont = document.createElement("div");
        tach = document.createElement("img");
			
        li.setAttribute("id", "li"+idx);
        tach.setAttribute("id", "trash"+idx);
        
        nom.setAttribute("class", "cell");
        doc.setAttribute("class", "cell");
        aval.setAttribute("class", "cell");
        cont.setAttribute("class", "cell");
        tach.setAttribute("class", "trash");
        
        nom.setAttribute("style", "width: 45%");
        doc.setAttribute("style", "width: 35%");
        aval.setAttribute("style", "width: 15%");
        cont.setAttribute("style", "width: 20%");
        tach.setAttribute("src", "style/images/trash.png");
        
        
		li.setAttribute("onClick", "mark("+idx+");");
		tach.setAttribute("onClick", "showPrompt();");
        
		//valores de indices modificados
        var datt = DatosForm[idx].split(";");
        if(!datt[8])
            datt[8] = "Aval";
        else
            datt[8] = "Firma";
        
		nom.innerHTML = datt[1]+", "+datt[0];
		doc.innerHTML = datt[3];
		aval.innerHTML = datt[8];
        		
		li.appendChild(nom);
		li.appendChild(doc);
		li.appendChild(aval);
		cont.appendChild(tach);
		li.appendChild(cont);
		listado.appendChild(li);
    },
	resetForm: function(){
		document.getElementById("nombre").value = "";
		document.getElementById("apellido").value = "";
		document.getElementById("docu").value = "";
		document.getElementById("domicilio").value = "";
		document.getElementById("localidad").value = "";		
		document.getElementById("provincia").value = "";
		document.getElementById("partido").value = "";
		document.getElementById("foto1").src = "style/images/photo.png";
		document.getElementById("foto2").src = "style/images/photo.png";
		doc = "";
		foto1 = false;
		foto2 = false;
		tipo="";
		if(DatosForm.length == CantFormsToPic){
			app.cerrarForm();
		}
	},
    back2Form: function(){
        salgoDet = true;
        for(var i = 0; i < DatosForm.length; i++){
			DatosEscribir += DatosForm[i];
		}
        escribirData();
    },
	salir: function(){
		var url = window.location.href;
		if(endsWith(url, "#formulario")){
			if(DatosForm.length > 0){
				DatosEscribir = ""
				for(var i = 0; i < DatosForm.length; i++){
					DatosEscribir += DatosForm[i];
				}
				escribirData();
			}
			else{
				sessionStorage.clear();
				navigator.app.exitApp();
			}
		}
		else{
			sessionStorage.clear();
			navigator.app.exitApp();
		}
	},
	formatMes: function(mesI){
		var mesO;
		switch(mesI) {
			case 1:
				mesO = "Enero";
				break;
			case 2:
				mesO = "Febrero";
				break;
			case 3:
				mesO = "Marzo";
				break;
			case 4:
				mesO = "Abril";
				break;
			case 5:
				mesO = "Mayo";
				break;
			case 6:
				mesO = "Junio";
				break;
			case 7:
				mesO = "Julio";
				break;
			case 8:
				mesO = "Agosto";
				break;
			case 9:
				mesO = "Septiembre";
				break;
			case 10:
				mesO = "Octubre";
				break;
			case 11:
				mesO = "Nobiembre";
				break;
			case 12:
				mesO = "Diciembre";
				break;
		}
		return mesO;
	}
};

app.initialize();




function escribirResp(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSW, onFileFail);

	function gotFSW(fileSystem) {
		fileSystem.root.getFile(AppFolder+"/"+ParamsFile, {create: true, exclusive: false}, gotFileEntryW, onFileFail);
	}
	function gotFileEntryW(fileEntry) {
		fileEntry.createWriter(gotFileWriter, onFileFail);
	}
	function gotFileWriter(writer) {
		writer.onwrite = function(evt) {
			//append completo
			DatosEscribir="";
			window.localStorage.setItem("CargaInicial", "si");
			location.href = "#altaForm";
		};
		writer.seek(writer.length);
		writer.write(DatosEscribir);
	}
	function onFileFail(error) {
		alert("Error al guardar los datos. " + error.message);
	}
}
//SACAR FOTO******************
function capturePhoto() {
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 100, destinationType: Camera.DestinationType.FILE_URI  });
}

//Callback function when the picture has been successfully taken
function onPhotoDataSuccess(imageData) {
    var smallImage = document.getElementById('foto1');
    smallImage.style.display = 'table-cell';
    smallImage.src = imageData;
	//file1= imageData;
	foto1 = true;
	movePic(imageData);
}

//Callback function when the picture has not been successfully taken
function onFail(message) {
    alert('Error en la a captura de la imagen: ' + message);
}
//SACAR FOTO*********************
//SACAR FOTO*********************2
function capturePhoto2() {
    navigator.camera.getPicture(onPhotoDataSuccess2, onFail2, { quality: 100, destinationType: Camera.DestinationType.FILE_URI  });
}

//Callback function when the picture has been successfully taken
function onPhotoDataSuccess2(imageData) {
    var smallImage = document.getElementById('foto2');
    smallImage.style.display = 'table-cell';
    smallImage.src = imageData;
	//file1= imageData;
	foto2 = true;
	movePic(imageData);
}

//Callback function when the picture has not been successfully taken
function onFail2(message) {
    alert('Error en la a captura de la imagen: ' + message);
}
//SACAR FOTO*********************2
//SACAR FOTO*********************3
function capturePhotoForm() {
    navigator.camera.getPicture(onPhotoDataSuccess3, onFail3, { quality: 100, destinationType: Camera.DestinationType.FILE_URI  });
}

//Callback function when the picture has been successfully taken
function onPhotoDataSuccess3(imageData) {
    var smallImage = document.getElementById('fotoForm');
    smallImage.src = imageData;
	movePic2(imageData);
}

//Callback function when the picture has not been successfully taken
function onFail3(message) {
    alert('Error en la a captura de la imagen: ' + message);
}
//SACAR FOTO*********************3
//MOVER FOTO*********************
function movePic(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
    //var d = new Date();
    //var n = d.getTime();
    //var newFileName = n + ".jpg";
	var newFileName = doc + tipo +".jpg";
	
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( AppFolder+"/"+ImagesFolder,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //I do my insert with "entry.fullPath" as for the path
}

function resOnError(error) {
    alert(error.code);
}
//MOVER FOTO*********************
//MOVER FOTO*********************2
function movePic2(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess2, resOnError2); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccess2(entry){ 
	var newFileName = NumeroFormulario +".jpg";
	
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( AppFolder,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove2, resOnError2);
                    },
                    resOnError2);
                    },
    resOnError2);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove2(entry) {
    //I do my insert with "entry.fullPath" as for the path
    //app.finForm();
    //enable button
    document.getElementById("fnFrm").disabled = false;
}

function resOnError2(error) {
    alert(error.code);
}
//MOVER FOTO*********************2
function escribirData(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSW2, onFileFail2);

	function gotFSW2(fileSystem) {
		fileSystem.root.getFile(AppFolder+"/"+NumeroFormulario+".txt", {create: true, exclusive: false}, gotFileEntryW2, onFileFail2);
	}
	function gotFileEntryW2(fileEntry) {
		fileEntry.createWriter(gotFileWriter2, onFileFail2);
	}
	function gotFileWriter2(writer) {
		writer.onwrite = function(evt) {
			DatosEscribir="";
            if(salgoDet){
                //vacio tabla
                $('#listado').empty()
                salgoDet = false;
                $("#firma").prop("checked", true);
                app.chk1();
                location.href = "#formulario";
            }
            else{
                if(cerrarForm){
                    cerrarForm = false;
                    //app.finForm();
                    location.href = "#bajaForm";
                }
                else{
                    sessionStorage.clear();
                    navigator.app.exitApp();
                }
            }
		};
		//writer.seek(writer.length);
		writer.write(DatosEscribir);
	}
	function onFileFail2(error) {
		alert("Error al guardar los datos. " + error.message);
	}
}

function leerConfig(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSR, fail);
	
	function gotFSR(fileSystem) {
		fileSystem.root.getFile(AppFolder+"/"+ParamsFile, null, gotFileEntryR, fail);
	}
	function gotFileEntryR(fileEntry) {
		fileEntry.file(gotFileR, fail);
	}
	function gotFileR(file){
		readAsTextR(file);
	}					
	function readAsTextR(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			var evtSrt = evt.target.result;
			var arrConfig = evtSrt.split(";");
			arrConfig = arrConfig[2].split(":");
			CantFormsToPic = arrConfig[1];
			document.getElementById("pepote").innerHTML = CantFormsToPic;
			leerData();
		};
		reader.readAsText(file);
	}
	function fail(error) {
		alert("Error cargando la configuracion: " + error.message);
		console.log(error);
		console.log(error.message);
		console.log(error.code);
	}
}

function leerData(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSR, fail);
	
	function gotFSR(fileSystem) {
		fileSystem.root.getFile(AppFolder+"/"+NumeroFormulario+".txt", null, gotFileEntryR, fail);
	}
	function gotFileEntryR(fileEntry) {
		fileEntry.file(gotFileR, fail);
	}
	function gotFileR(file){
		readAsTextR(file);
	}					
	function readAsTextR(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			var evtSrt = evt.target.result;
            if(evtSrt!=""){
                evtSrt = evtSrt.substring(0, evtSrt.length-1);
                DatosForm = evtSrt.split("*");
                for(var i = 0; i < DatosForm.length; i++){
                    DatosForm[i] = DatosForm[i]+"*";
                }
            }
            else{
                DatosForm = new Array();   
            }
            if(DatosForm.length < CantFormsToPic){
                document.getElementById("pepito").innerHTML = DatosForm.length;
            }
            else{
                location.href = "#bajaForm";                
            }
		};
		reader.readAsText(file);
	}
	function fail(error) {
	}
}

function checkIfFileExists(path){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
	}, getFSFail);
	
	function fileExists(fileEntry){
		alert("El formulario que trata de dar de alta ya existe");
	}
	function fileDoesNotExist(){
		window.localStorage.setItem('FormActivo', NumeroFormulario);
		location.href = "#formulario";
	}
	function getFSFail(evt) {
		console.log(evt.target.error.code);
	}
}
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/*function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}*/

function mark(Id){
    if(DatoABorrar != ""){
        unmark(DatoABorrar);
    }
    DatoABorrar = Id;
    document.getElementById("li" + Id).style.backgroundColor = "#f4802e";
    document.getElementById("trash" + Id).style.visibility = "visible";
}			
function unmark(Id){
	document.getElementById("li" + Id).style.backgroundColor = "";
	document.getElementById("trash" + Id).style.visibility = "hidden";
}
function borradoDefinitivo(){
    hidePrompt();
    if(DatoABorrar != ""){
		unmark(DatoABorrar);
	}
	var elem = document.getElementById('li'+DatoABorrar);
	elem.parentNode.removeChild(elem);
    DatosForm.splice(DatoABorrar,1);
    DatoABorrar = "";
}
function showPrompt(){
    $("#popup").fadeIn("fast");
}
function hidePrompt(){
    $("#popup").fadeOut(1000);
}


 

