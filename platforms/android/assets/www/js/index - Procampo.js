//Variables globales
var diaHoy;
var mesHoy;
var anioHoy;
var fechaHabil;
var arrDatos;
var arrDatosConvenios;
var arrDatosProcampo;
var arrDatosCreditos;
var refPage;
var notasCargadas = false;
var conveniosCargado = false;
var creditosCargado = false;
var procampoCargado = false;
var mat2Cargado = false;
var MdeLCargado = false;
var MdeLCargado2 = false;
var MdeLCargado3 = false;
var menuOpened = false;
var isOnline = true;
var Lat = "";
var Long = "";
var SrvrDir = "http://ws.bancoprovincia.com.ar/dataservice.svc/";
//var SrvrDir = "http://200.5.102.109/dataservice/dataservice.svc/";

var app = {
    //Constructor
    initialize: function() {
		var fechaActual = new Date();
        diaHoy = fechaActual.getDate().toString();
        if (diaHoy.length == 1) {
            diaHoy = "0" + diaHoy;
        }
        mesHoy = fechaActual.getMonth() + 1;
        anioHoy =  fechaActual.getFullYear();
		var mesS = app.formatMes(mesHoy);
		document.getElementById("notFecha").innerHTML = diaHoy + " de " + mesS + " de " + anioHoy;
		var dia = fechaActual.getDate();
		var n = fechaActual.getDay();
		if(n == 0)
			dia = dia - 2;
		else if(n == 6)
			dia = dia - 1;
		var mesFor;
		if(mesHoy.toString().length == 1)
			mesFor = "0"+mesHoy;
		if(dia.toString().length == 1)
			dia = "0"+dia;
		fechaHabil = anioHoy+"-"+mesFor+"-"+dia;
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
    },
	nativeMenuButton: function(){
		if(menuOpened){
			menuOpened = false;
			$('body').removeClass('menu-open');
			$('nav').removeClass('open');
		}
		else{
			menuOpened = true;
			$('nav.left').addClass('open');
			$('body').addClass('menu-open');
		}
	},		
	onBackKeyDown: function(){
		var tipo = sessionStorage.getItem('BackBttn');
		switch(tipo) {
			case "Noticias":
				location.href = "#noticiasDiv";
				break;
			case "Creditos":
				location.href = "#creditosDiv";
				break;
			case "Convenios":
				location.href = "#conveniosDiv";
				break;
			case "Cotizaciones":
				location.href = "#cotizacionDiv";
				break;
		}
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		$(document).on("pagebeforeshow","#noticiasDiv",function(){
					
			if(notasCargadas == false){
				if(isOnline){
					app.obtenerNotiQA();
				}
				/*else{
					cargarBBDD("NOTICIAS");
				}*/
			}
		});
		$(document).on("pagebeforeshow","#notaDiv",function(){
			var dir;
			switch(sessionStorage.getItem('BackBttn')) {
				case "Noticias":
					dir = "#noticiasDiv";
					break;
				case "Creditos":
					dir = "#creditosDiv";
					break;
				case "Convenios":
					dir = "#conveniosDiv";
					break;
				case "Cotizaciones":
					dir = "#cotizacionDiv";
					break;
			}
			document.getElementById("atras").href = dir;
			
			app.initNota();
		});
		$(document).on("pagebeforeshow","#conveniosDiv",function(){
				if(isOnline){
					app.initConvenios();
				}
				else{
					cargarBBDD("CONVENIOS");
				}
		});
		$(document).on("pagebeforeshow","#convDetDiv",function(){
			app.convDetInit();
		});
		$(document).on("pagebeforeshow","#climaDiv",function(){
			if(Lat == "" && Long == "")
			{
				navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
			}
			else{
				app.initClima();
			}
		});
		$(document).on("pagebeforeshow","#creditosDiv",function(){
				if(isOnline){
					app.initCreditos();
				}
				else{
					cargarBBDD("CREDITOS");
				}
		});
		$(document).on("pagebeforeshow","#matba1",function(){
				document.getElementById("iframe1").style.display = "inline";
		});
		$(document).on("pagebeforeshow","#matba2",function(){
			if(isOnline){
				app.initMatba2();
			}
		});
		$(document).on("pagebeforeshow","#mdeL1",function(){
			if(isOnline){
				var DP = document.getElementById("datePicker1");
				DP.value = fechaHabil;
				//DP.max = fechaHabil;
				var date = fechaHabil.split('-');
				app.initMdeL1(date[0], date[1], date[2]);
			}
			else{
				app.msjCot("MdeLSel1", "No se puede establecer una conexion con el servidor");
			}
		});
		$(document).on("pagebeforeshow","#mdeL2",function(){
			if(isOnline){
				var DP = document.getElementById("datePicker2");
				DP.value = fechaHabil;
				//DP.max = fechaHabil;
				var date = document.getElementById("datePicker2").value.split('-');
				app.initMdeL2(date[0], date[1], date[2]);
			}
			else{
				app.msjCot("MdeLSel2", "No se puede establecer una conexion con el servidor");
			}
		});
		$(document).on("pagebeforeshow","#mdeL3",function(){
			if(isOnline){
				var DP = document.getElementById("datePicker3");
				DP.value = fechaHabil;
				//DP.max = fechaHabil;
				var date = fechaHabil.split('-');
				app.initMdeL3(date[0], date[1], date[2]);
			}
			else{
				app.msjCot("MdeLSel3", "No se puede establecer una conexion con el servidor");
			}
		});
    },
	obtenerNotiQA: function() {
		$.ajax({
			url: SrvrDir + "ObtenerNoticias",
			cache: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            data: '{"idTipo": 5}',
            success: function (data) {
				notasCargadas = true;
				arrDatos = data.ObtenerNoticiasResult;
				if(arrDatos.length != 0){
						var f = arrDatos[0].fecha.split(' ');
						arrDatos[0].fecha = f[0];
						app.addLi(arrDatos[0].titulo, arrDatos[0].entrada, arrDatos[0].fecha, arrDatos[0].Id, arrDatos[0].imagen, "Noticias", true);
						for(var k = 1; k<arrDatos.length; k++){
							var f = arrDatos[k].fecha.split(' ');
							arrDatos[k].fecha = f[0];
							app.addLi(arrDatos[k].titulo, arrDatos[k].entrada, arrDatos[k].fecha, arrDatos[k].Id, arrDatos[k].imagen, "Noticias", false);
						}
					guardarBBDD("NOTICIAS", arrDatos);
				}
				else{
					app.addLi("No se encontraron noticias", "", "", "", "style/images/nothing.png", "Noticias", false);
				}
            },
			error: function (request) {
				 if (request.status == 0) {
					cargarBBDD("NOTICIAS");
				}
			},
            statusCode: {
                201: function (data) {
                    alert('error  de comunicacion con el servidor');;
                }
            }
        });
	},
	addLi: function(descripcion, copeteTxt, datoFecha, id, imagenSrc, clase, img) {
		var click;
		switch(clase) {
			case "Noticias":
				clase = "listado";
				click = 'app.go("' + id.toString() + '", "not");';
				break;
			case "Creditos":
				clase = "listadoProd";
				click = 'app.go("' + id.toString() + '", "cred");';
				break;
		}
		var listado = document.getElementById(clase);
        li = document.createElement("li");
		
        noticia = document.createElement("a");
		fecha = document.createElement("time");
		titulo = document.createElement("span");
        copete = document.createElement("p");
		
		
		fecha.setAttribute("class", "fechnoti");
		titulo.setAttribute("class", "titnoti");
		copete.setAttribute("class", "copetenoti");
        
		noticia.setAttribute("onClick", click);
		//background para los elementos de la lista
		//noticia.setAttribute("style", "background-color: #ECEAF2");
		
		fecha.innerHTML = datoFecha;
		titulo.innerHTML = descripcion;
        copete.innerHTML = copeteTxt;
		
		imagen = document.createElement("img");
		imagen.setAttribute("src", imagenSrc);
		imagen.setAttribute("alt", descripcion);
		imagen.setAttribute("onerror", "app.imgError(this);");
		imagen.setAttribute("title", descripcion);
		imagen.setAttribute("class", "ImgNot");
			
		if(img){
			titulo.setAttribute("style", "font-size: 1.298em;");			
			noticia.appendChild(titulo);
			noticia.appendChild(fecha);
			noticia.appendChild(imagen);
			overlay = document.createElement("div");
			overlay.innerHTML = "LO ULTIMO";
			overlay.setAttribute("class", "overlayNot");
			noticia.appendChild(overlay);
		}
		else{
			noticia.appendChild(titulo);
			noticia.appendChild(imagen);
			//noticia.appendChild(fecha);
		}
		noticia.appendChild(copete);
		li.appendChild(noticia);
		listado.appendChild(li);
    },
	addLiConvenio: function(tit, img, idx) {
		var listado = document.getElementById("listadoConv");
        li = document.createElement("li");
        href = document.createElement("div");
		titulo = document.createElement("label");
		container = document.createElement("div");
		lblFantasma = document.createElement("label");
        logo = document.createElement("img");
				
		href.setAttribute("class", "listadoConv");
		titulo.setAttribute("class", "convenioTitulo");
		container.setAttribute("class", "convenioCell");
		lblFantasma.setAttribute("class", "ghostLbl");
		logo.setAttribute("class", "convenioImg");
        
		href.setAttribute("onClick", 'app.goConv(' + idx + ');');
		titulo.innerHTML = tit;		
		logo.setAttribute("src", img);
		logo.setAttribute("alt", tit);
		logo.setAttribute("onerror", "app.imgErrorConv(this);");
		logo.setAttribute("title", tit);
		
		container.appendChild(lblFantasma);
		container.appendChild(logo);
		href.appendChild(titulo);
		href.appendChild(container);
		li.appendChild(href);
		listado.appendChild(li);
    },
	go: function(id, tipo, idx){
		if(tipo == "not"){
			sessionStorage.setItem('BackBttn', "Noticias");
            for (var i = 0; i< arrDatos.length; i++){
                if(arrDatos[i].Id == id){
                    sessionStorage.setItem('FechaNota', arrDatos[i].fecha);
                    sessionStorage.setItem('TituloNota', arrDatos[i].titulo);
                    sessionStorage.setItem('procampoEntrada', arrDatos[i].entrada);
                    sessionStorage.setItem('CuerpoNota', arrDatos[i].texto_ppal);
                    sessionStorage.setItem('ImagenNota', arrDatos[i].imagen);
                    sessionStorage.setItem('Tipo', "Novedades ");
                    location.href = "#notaDiv";
                    break;
                }
            }
        }
        else if (tipo == "cred"){
			sessionStorage.setItem('BackBttn', "Creditos");
            for (var i = 0; i< arrDatosCreditos.length; i++){
                if(arrDatosCreditos[i].Id == id){
                    sessionStorage.setItem('FechaNota', "");
                    sessionStorage.setItem('TituloNota', arrDatosCreditos[i].titulo);
                    sessionStorage.setItem('procampoEntrada', arrDatosCreditos[i].entrada);
                    sessionStorage.setItem('CuerpoNota', arrDatosCreditos[i].texto_ppal);
                    sessionStorage.setItem('ImagenNota', arrDatosCreditos[i].imagen);
                    sessionStorage.setItem('Tipo', "Creditos ");
                    location.href = "#notaDiv";
                    break;
                }
            }
        }
	},
	goConv: function(idx){
		sessionStorage.setItem('BackBttn', "Convenios");
        sessionStorage.setItem('TituloConv', arrDatosConvenios[idx].titulo);
        sessionStorage.setItem('ImagenConv', arrDatosConvenios[idx].imagen);
		//CAMINO CORRECTO PARA CONSULTAR QUE ESTE
		//consultaBBDD(arrDatosConvenios[idx].titulo);
		//CLAVADO PARA QUE SEA SOLO CONSULTAS POR INTERNET, campo de la base de datos chico? O caracter extraño que provoca error en sql
		$.ajax({
				url: SrvrDir + "ObtenerContenidoPagina",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'POST',
				data: '{"pagina":"' + arrDatosConvenios[idx].url + '"}',
				success: function (data) {
					//borro hasta '">' (tags </CENTER> y <BR> inconsistentes) para sacar la referencia a la imagen y reemplazarla por la del servicio
					var cuerpo = data.ObtenerContenidoPaginaResult[0].contenido;
					var fin = cuerpo.indexOf('">');
					cuerpo = cuerpo.substring(fin + 2, cuerpo.length);
					cuerpo = "<CENTER><IMG border=0 alt='' src='"+sessionStorage.getItem('ImagenConv')+"'></CENTER>" + cuerpo;
					
					var find = 'src="/Content/';
					var re = new RegExp(find, 'g');
					cuerpo = cuerpo.replace(re, 'src="http://bancoprovincia.com.ar/Content/');

					find = 'src="/content/';
					re = new RegExp(find, 'g');
					cuerpo = cuerpo.replace(re, 'src="http://bancoprovincia.com.ar/Content/');
					
					
					var cuerpoOk = app.replaceHref(cuerpo);
					sessionStorage.setItem('CuerpoConv', cuerpoOk);
					//guardarBBDDdesc(sessionStorage.getItem('TituloConv'), cuerpo);
					location.href = "#convDetDiv";

				},
				error: function (request) {
					if (request.status == 0) {
						//verificar si esta en la base y cargar desde ahi
						//consultaBBDD(arrDatosConvenios[idx].titulo);
					}
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
			
	},
	initNota: function(){
		var fech = sessionStorage.getItem('FechaNota')
		if(fech != ''){
			fech = fech.split('/');
			var mesS = app.formatMes(parseInt(fech[1]));
			document.getElementById("notDetFecha").innerHTML = fech[0] + " de " + mesS + " de " + fech[2];
		}
		else{
			document.getElementById("notDetFecha").innerHTML = '';
		}
		document.getElementById("notSubHeader").innerHTML = sessionStorage.getItem('Tipo');
		document.getElementById("tituloDesc").innerHTML = sessionStorage.getItem('TituloNota');
		//TOQUE********************************************************************************
		document.getElementById("procampoEntrada").innerHTML = sessionStorage.getItem('procampoEntrada');
		//document.getElementById("procampoEntrada").innerHTML = sessionStorage.getItem('procampoEntrada');
		document.getElementById("NotDescCont").innerHTML = app.replaceHref(sessionStorage.getItem('CuerpoNota'));
		var img = document.getElementById("ImgNotDesc");
		img.setAttribute("onerror", "app.imgError(this);");
		img.setAttribute("src", sessionStorage.getItem('ImagenNota'));
		img.setAttribute("alt", sessionStorage.getItem('TituloNota'));
		img.setAttribute("title", sessionStorage.getItem('TituloNota'));
	},
	initProcampo: function(){
		if(procampoCargado){
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
		else{
			$.ajax({
				url: SrvrDir + "ObtenerNoticias",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'POST',
				data: '{"idTipo": 7}',
				success: function (data) { 
					if(data.ObtenerNoticiasResult.length != 0){
						arrDatosProcampo = data.ObtenerNoticiasResult;
						guardarBBDD("PROCAMPOTARJ", arrDatosProcampo);
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
					else{
                        //rellenar nota con popo
					}
				},
				error: function (request) {
					if (request.status == 0) {
						cargarBBDD("PROCAMPOTARJ");
					}
				},
				statusCode: {
					201: function (data) {
						alert('error 201');;
					}
				}
			});
		}
	},
	initClima: function(){
		if(Lat == "" && Long == ""){
			Lat = "-34.6029505";
			Long = "-58.3838502";
		}
		var query = 'select * from weather.forecast where woeid in (SELECT woeid FROM geo.placefinder WHERE text="'+Lat+','+Long+'" and gflags="R") AND u="c"';
				//seteo el cachebuster en 20 min para que dentro de este lapso solo haga request a los datos en el cache y no consuma un request innecesario (el update minimo aproximado de los datos en el origen es de 1 hora)
				var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);
				var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&_nocache=' + cacheBuster;
			 
				window['wxCallback'] = function(data) {
					var DateNow=new Date();
					var hours=DateNow.getHours();
					var minutes=DateNow.getMinutes();
					var dn=" am";
					if (hours>12){
						dn=" pm";
						hours=hours-12;
					}
					if (hours==0)
						hours=12;
					if (minutes<=9)
						minutes="0"+minutes;
					var FechaTotal = diaHoy + " de " + app.formatMes(mesHoy) + ", " + hours+":"+minutes+dn;
					if(data.query.results.channel.location.region == "")
						document.getElementById('climaZona').innerHTML = data.query.results.channel.location.city;
					else
						document.getElementById('climaZona').innerHTML = data.query.results.channel.location.city + ", " + data.query.results.channel.location.region;
					document.getElementById('climaFecha').innerHTML = FechaTotal;
					switch(data.query.results.channel.item.condition.text){
						case "Sunny":
							document.getElementById('climaState').innerHTML = "Soleado";
							document.getElementById('climaMainIcon').src = "style/images/soleado.png";
							break;
						case "Dust":
							document.getElementById('climaState').innerHTML = "Ventoso";
							document.getElementById('climaMainIcon').src = "style/images/ventoso.png";
							break;
						case "Blowing Dust":
							document.getElementById('climaState').innerHTML = "Ventoso";
							document.getElementById('climaMainIcon').src = "style/images/ventoso.png";
							break;
						case "Partly Cloudy":
							document.getElementById('climaState').innerHTML = "Parcialmente nublado";
							document.getElementById('climaMainIcon').src = "style/images/nublado.png";
							break;
						case "Mostly Cloudy":
							document.getElementById('climaState').innerHTML = "Mayormente nublado";
							document.getElementById('climaMainIcon').src = "style/images/nublado.png";
							break;
						case "Cloudy":
							document.getElementById('climaState').innerHTML = "Nublado";
							document.getElementById('climaMainIcon').src = "style/images/nublado.png";
							break;
						case "Haze":
							document.getElementById('climaState').innerHTML = "Neblina";
							document.getElementById('climaMainIcon').src = "style/images/fog.png";
							break;
						case "Fair":
							document.getElementById('climaState').innerHTML = "Agradable";
							document.getElementById('climaMainIcon').src = "style/images/soleado.png";
							break;
						case "Fog":
							document.getElementById('climaState').innerHTML = "Niebla";
							document.getElementById('climaMainIcon').src = "style/images/fog.png";
							break;
						case "Foggy":
							document.getElementById('climaState').innerHTML = "Brumoso";
							document.getElementById('climaMainIcon').src = "style/images/fog.png";
							break;
						case "Light Rain":
							document.getElementById('climaState').innerHTML = "Lluvia ligera";
							document.getElementById('climaMainIcon').src = "style/images/lluvia.png";
							break;
						case "Rain":
							document.getElementById('climaState').innerHTML = "Lluvia";
							document.getElementById('climaMainIcon').src = "style/images/lluvia.png";
							break;
						case "Rains":
							document.getElementById('climaState').innerHTML = "Lluvia";
							document.getElementById('climaMainIcon').src = "style/images/lluvia.png";
							break;
						case "Storm":
							document.getElementById('climaState').innerHTML = "Tormenta";
							document.getElementById('climaMainIcon').src = "style/images/tormenta.png";
							break;
						case "Thunderstorm":
							document.getElementById('climaState').innerHTML = "Tormenta Electrica";
							document.getElementById('climaMainIcon').src = "style/images/tormenta.png";
							break;
						case "Hailstorm":
							document.getElementById('climaState').innerHTML = "Granizo";
							document.getElementById('climaMainIcon').src = "style/images/granizo.png";
							break;
						default:
							document.getElementById('climaState').innerHTML = data.query.results.channel.item.condition.text;
							document.getElementById('climaMainIcon').src = "style/images/nublado.png";
							break;
					}
					document.getElementById('climaNow').innerHTML = data.query.results.channel.item.condition.temp + "°C";
					document.getElementById('climaST').innerHTML = "ST: " + data.query.results.channel.wind.chill +"°C";
					document.getElementById('climaMaxMin').innerHTML = data.query.results.channel.item.forecast[0].high+"°C/"+data.query.results.channel.item.forecast[0].low + "°C";
					document.getElementById('humedad').innerHTML = data.query.results.channel.atmosphere.humidity + "%";
					document.getElementById('visibilidad').innerHTML = data.query.results.channel.atmosphere.visibility + " km";
					document.getElementById('presion').innerHTML = data.query.results.channel.atmosphere.pressure + " hPa";
					document.getElementById('viento').innerHTML = data.query.results.channel.wind.speed + "km/h";
					document.getElementById('orientacion').innerHTML = app.formatWind(data.query.results.channel.wind.direction);
					
					
					//$('#wxIcon').css({
					//	backgroundPosition: '-' + (61 * info.code) + 'px 0'
					//}).attr({
					//	title: info.text
					//});
					//$('#wxIcon2').append('<img src="http://l.yimg.com/a/i/us/we/52/' + info.code + '.gif" width="34" height="34" title="' + info.text + '" />');
					//$('#wxTemp').html(info.temp + '&deg;' + (u.toUpperCase()));
				};
			 
				$.ajax({
					url: url,
					dataType: 'jsonp',
					cache: true,
					jsonpCallback: 'wxCallback'
				});
	},
	initConvenios: function(){
		if(conveniosCargado == false){
			$.ajax({
				url: SrvrDir + "ObtenerBeneficiosProcampo",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'GET',
				success: function (data) {
					arrDatosConvenios = data;
                    if(arrDatosConvenios.length != 0){
                        for(var k = 0; k<arrDatosConvenios.length; k++){
							app.addLiConvenio(arrDatosConvenios[k].titulo, arrDatosConvenios[k].imagen, k);
						}
						guardarBBDD("CONVENIOS", arrDatosConvenios);
                    }
                    else{
                        app.addLiConvenio("No se encontraron convenios", "style/images/nothing.png", 0);
                    }
					conveniosCargado = true;
				},
				error: function (request) {
					if (request.status == 0) {
						cargarBBDD("CONVENIOS");
					}
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
		}
	},
	convDetInit: function(){
		var cuerpo = sessionStorage.getItem('CuerpoConv');
		//borro hasta '">' (</CENTER> y <BR> inconsistentes) para sacar la referencia a la imagen y reemplazarla por la del servicio
		/*var fin = cuerpo.indexOf('">');
		cuerpo = cuerpo.substring(fin + 2, cuerpo.length);
		cuerpo = "<CENTER><IMG border=0 alt='' src='"+sessionStorage.getItem('ImagenConv')+"'></CENTER>" + cuerpo;	*/
		$('#CuerpoConv').empty()
		$('#CuerpoConv').append(cuerpo);
	},
	initCreditos: function(){
		if(creditosCargado == false){
			$.ajax({
				url: SrvrDir + "ObtenerNoticias",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'POST',
				data: '{"idTipo": 6}',
				success: function (data) {
					arrDatosCreditos = data.ObtenerNoticiasResult;
                    if(arrDatosCreditos.length != 0){
                        for(var k = 0; k<arrDatosCreditos.length; k++){
							var fechaFormateada = app.formatFecha(arrDatosCreditos[k].fecha);
							arrDatosCreditos[k].fecha = fechaFormateada;
							app.addLi(arrDatosCreditos[k].titulo, arrDatosCreditos[k].entrada, arrDatosCreditos[k].fecha, arrDatosCreditos[k].Id, arrDatosCreditos[k].imagen, "Creditos", false);
						}
						guardarBBDD("CREDITOS", arrDatosCreditos);
                    }
                    else{
                        app.addLi("No se encontraron creditos", "", "", "", "style/images/nothing.png", "Creditos", false);
                    }
					creditosCargado = true;
				},
				error: function (request) {
					if (request.status == 0) {
						cargarBBDD("CREDITOS");
					}
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
		}
	},
	initMatba2: function(){
		if(mat2Cargado == false){
				$.ajax({
				url: SrvrDir + "getAjustes",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'GET',
				success: function (data) {
                    if(data.length != 0){
						var arrDatosMat2 = new Array();
						for(var i = 0; i<data.length; i++){
							arrDatosMat2.push(JSON.parse(data[i]));
						}
                        for(var k = 0; k<arrDatosMat2.length; k++){
							app.addLiMat2(arrDatosMat2[k].Ajustes.PRODUCTO, arrDatosMat2[k].Ajustes.ENTREGA, arrDatosMat2[k].Ajustes.VOLUMEN, arrDatosMat2[k].Ajustes.PRECIO_AJUSTE, arrDatosMat2[k].Ajustes.Dif, arrDatosMat2[k].Ajustes.fecha);
						}
                    }
                    else{
						app.msjCot("mat2Sel", "No se encontraron datos");
                    }
					mat2Cargado = true;
				},
				error: function (request) {
					app.msjCot("mat2Sel", "No se puede establecer una conexion con el servidor");
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
		}			
	},
	addLiMat2: function(producto, entrega, volumen, ajuste, dif, fecha){
		var listado = document.getElementById("mat2Sel");		
        ul = document.createElement("ul");
		ul.setAttribute("class", "listado");
		
		volumen += "";
		if (volumen == 'undefined')
			volumen = "0";
		
		for(var i =0; i<=5; i++){		
			li = document.createElement("li");		
			divContenedor = document.createElement("div");
			Subdiv = document.createElement("div");
			desc = document.createElement("label");
			dato = document.createElement("label");
			
			divContenedor.setAttribute("class", "divLiClima");
			Subdiv.setAttribute("class", "divLiClimaIn");
			desc.setAttribute("class", "climaDato");
			dato.setAttribute("class", "climaDesc cotDat");
			
			switch(i){
				case 0:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Producto";
					dato.innerHTML = producto;
					break;
				case 1:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Entrega";
					dato.innerHTML = entrega;
					break;
				case 2:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Volumen";
					dato.innerHTML = volumen +" tn";
					break;
				case 3:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Precio / Ajuste";
					dato.innerHTML = ajuste;
					break;
				case 4:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Dif. con ajuste anterior";
					dato.innerHTML = dif;
					break;
				case 5:
					li.setAttribute("class", "liClima mat2Fecha");
					desc.innerHTML = "Fecha";
					dato.innerHTML = fecha;
					break;
			}
			
			Subdiv.appendChild(desc);
			divContenedor.appendChild(Subdiv);
			divContenedor.appendChild(dato);
			li.appendChild(divContenedor);
			ul.appendChild(li);
		}
        listado.appendChild(ul);
	},
	initMdeL1: function(anio, mes, dia){
		if(MdeLCargado == false){
			$.ajax({
				url: SrvrDir + "getHacienda",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'POST',
				data: '{"anio": '+anio+', "mes": '+mes+', "dia": '+dia+'}',
				success: function (data) {
                    if(data.getHaciendaResult.length != 0){
						var arrDatosMdeL = new Array();
						for(var i = 0; i<data.getHaciendaResult.length; i++){
							arrDatosMdeL.push(JSON.parse(data.getHaciendaResult[i]));
						}
                        for(var k = 0; k<arrDatosMdeL.length; k++){
							app.addLiMdeL(arrDatosMdeL[k].Records.Cabezas, arrDatosMdeL[k].Records.Categoria, arrDatosMdeL[k].Records.Importe, arrDatosMdeL[k].Records.Kgs[0], arrDatosMdeL[k].Records.Maximo, arrDatosMdeL[k].Records.Mediana, arrDatosMdeL[k].Records.Minimo, arrDatosMdeL[k].Records.Promedio);
						}
                    }
                    else{
						app.msjCot("MdeLSel1", "No se encontraron datos para esta fecha");
                    }
					MdeLCargado = true;
				},
				error: function (request) {
					app.msjCot("MdeLSel1", "No se puede establecer una conexion con el servidor");
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
		}			
	},
	addLiMdeL: function(cabezas, categoria, importe, kgs, maximo, mediana, minimo, promedio){
		var listado = document.getElementById("MdeLSel1");		
        ul = document.createElement("ul");
		ul.setAttribute("class", "listado");
				
		for(var i =0; i<=7; i++){		
			li = document.createElement("li");		
			divContenedor = document.createElement("div");
			Subdiv = document.createElement("div");
			desc = document.createElement("label");
			dato = document.createElement("label");
			icon = document.createElement("img");
			
			divContenedor.setAttribute("class", "divLiClima");
			Subdiv.setAttribute("class", "divLiClimaIn");
			desc.setAttribute("class", "climaDato");
			dato.setAttribute("class", "climaDesc cotDat");
			icon.setAttribute("class", "climaIconDesc mdeLImg");
			
			switch(i){
				case 0:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Categoria";
					dato.innerHTML = categoria;
					icon.setAttribute("src", "style/images/categoria.png");
					break;
				case 1:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Minimo";
					dato.innerHTML = minimo;
					icon.setAttribute("src", "style/images/minimo.png");
					break;
				case 2:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Maximo";
					dato.innerHTML = maximo;
					icon.setAttribute("src", "style/images/maximo.png");
					break;
				case 3:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Promedio";
					dato.innerHTML = promedio;
					icon.setAttribute("src", "style/images/promedio.png");
					break;
				case 4:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Mediana";
					dato.innerHTML = mediana;
					icon.setAttribute("src", "style/images/mediana.png");
					break;
				case 5:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Cabezas";
					dato.innerHTML = cabezas;
					icon.setAttribute("src", "style/images/cabezas.png");
					break;
				case 6:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Importe";
					dato.innerHTML = importe;
					icon.setAttribute("src", "style/images/importe.png");
					break;
				case 7:
					li.setAttribute("class", "liClima MdeLUlFin");
					desc.innerHTML = "Kgs";
					dato.innerHTML = kgs;
					icon.setAttribute("src", "style/images/kgs.png");
					break;
			}
			
			Subdiv.appendChild(icon);
			Subdiv.appendChild(desc);
			divContenedor.appendChild(Subdiv);
			divContenedor.appendChild(dato);
			li.appendChild(divContenedor);
			ul.appendChild(li);
		}
        listado.appendChild(ul);
	},
	initMdeL2: function(anio, mes, dia){
		if(MdeLCargado2 == false){
			$.ajax({
				url: SrvrDir + "getPCorrientes",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'POST',
				data: '{"anio": '+anio+', "mes": '+mes+', "dia": '+dia+'}',
				success: function (data) {
                    if(data.getPCorrientesResult.length != 0){
						var arrDatosMdeL2 = new Array();
						for(var i = 0; i<data.getPCorrientesResult.length; i++){
							arrDatosMdeL2.push(JSON.parse(data.getPCorrientesResult[i]));
						}
                        for(var k = 0; k<arrDatosMdeL2.length; k++){
							app.addLiMdeL2(arrDatosMdeL2[k].Records.CABEZAS, arrDatosMdeL2[k].Records.Categoria, arrDatosMdeL2[k].Records.Desde, arrDatosMdeL2[k].Records.Hasta, arrDatosMdeL2[k].Records.Plaza, arrDatosMdeL2[k].Records.Variacion);
						}
                    }
                    else{
						app.msjCot("MdeLSel2", "No se encontraron datos para esta fecha");
                    }
					MdeLCargado2 = true;
				},
				error: function (request) {
					app.msjCot("MdeLSel2", "No se puede establecer una conexion con el servidor");
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
		}			
	},
	addLiMdeL2: function(cabezas, categoria, desde, hasta, plaza, variacion){
		var listado = document.getElementById("MdeLSel2");		
        ul = document.createElement("ul");
		ul.setAttribute("class", "listado");
				
		for(var i =0; i<=5; i++){		
			li = document.createElement("li");		
			divContenedor = document.createElement("div");
			Subdiv = document.createElement("div");
			desc = document.createElement("label");
			dato = document.createElement("label");
			icon = document.createElement("img");
			
			divContenedor.setAttribute("class", "divLiClima");
			Subdiv.setAttribute("class", "divLiClimaIn");
			desc.setAttribute("class", "climaDato");
			dato.setAttribute("class", "climaDesc cotDat");
			icon.setAttribute("class", "climaIconDesc mdeLImg");
			
			switch(i){
				case 0:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Categoria";
					dato.innerHTML = categoria;
					icon.setAttribute("src", "style/images/categoria.png");
					break;
				case 1:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Cabezas";
					dato.innerHTML = cabezas;
					icon.setAttribute("src", "style/images/cabezas.png");
					break;
				case 2:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Desde";
					dato.innerHTML = desde;
					icon.setAttribute("src", "style/images/minimo.png");
					break;
				case 3:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Hasta";
					dato.innerHTML = hasta;
					icon.setAttribute("src", "style/images/maximo.png");
					break;
				case 4:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Plaza";
					dato.innerHTML = plaza;
					icon.setAttribute("src", "style/images/mediana.png");
					break;
				case 5:
					li.setAttribute("class", "liClima MdeLUlFin");
					desc.innerHTML = "Variacion";
					dato.innerHTML = variacion;
					icon.setAttribute("src", "style/images/promedio.png");
					break;
			}
			
			Subdiv.appendChild(icon);
			Subdiv.appendChild(desc);
			divContenedor.appendChild(Subdiv);
			divContenedor.appendChild(dato);
			li.appendChild(divContenedor);
			ul.appendChild(li);
		}
        listado.appendChild(ul);
	},
	initMdeL3: function(anio, mes, dia){
		if(MdeLCargado3 == false){
			$.ajax({
				url: SrvrDir + "getOperaciones",
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				type: 'POST',
				data: '{"anio": '+anio+', "mes": '+mes+', "dia": '+dia+'}',
				success: function (data) {
                    if(data.getOperacionesResult.length != 0){
						var arrDatosMdeL3 = new Array();
						for(var i = 0; i<data.getOperacionesResult.length; i++){
							arrDatosMdeL3.push(JSON.parse(data.getOperacionesResult[i]));
						}
                        for(var k = 0; k<arrDatosMdeL3.length; k++){
							app.addLiMdeL3(arrDatosMdeL3[k].Records);
						}
                    }
                    else{
						app.msjCot("MdeLSel3", "No se encontraron datos para esta fecha");
                    }
					MdeLCargado3 = true;
				},
				error: function (request) {
					app.msjCot("MdeLSel3", "No se puede establecer una conexion con el servidor");
				},
				statusCode: {
					201: function (data) {
						alert('error');;
					}
				}
			});
		}			
	},
	addLiMdeL3: function(linea){
		var listado = document.getElementById("MdeLSel3");		
        ul = document.createElement("ul");
		ul.setAttribute("class", "listado");
				
		for(var i =0; i<=12; i++){		
			li = document.createElement("li");		
			divContenedor = document.createElement("div");
			Subdiv = document.createElement("div");
			desc = document.createElement("label");
			dato = document.createElement("label");
			//icon = document.createElement("img");
			
			divContenedor.setAttribute("class", "divLiClima");
			Subdiv.setAttribute("class", "divLiClimaIn");
			desc.setAttribute("class", "climaDato");
			dato.setAttribute("class", "climaDesc cotDat");
			//icon.setAttribute("class", "climaIconDesc mdeLImg");
						
			switch(i){
				case 0:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Cabezas";
					dato.innerHTML = linea.CABEZAS;
					//icon.setAttribute("src", "style/images/categoria.png");
					break;
				case 1:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Entrada";
					dato.innerHTML = linea.ENTRADA;
					//icon.setAttribute("src", "style/images/cabezas.png");
					break;
				case 2:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Fecha";
					dato.innerHTML = linea.FECHA;
					//icon.setAttribute("src", "style/images/minimo.png");
					break;
				case 3:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Fecha Proyectada";
					dato.innerHTML = linea.FECHAPROYECTADO;
					//icon.setAttribute("src", "style/images/maximo.png");
					break;
				case 4:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Importe";
					dato.innerHTML = "$"+linea.IMPORTE;
					//icon.setAttribute("src", "style/images/mediana.png");
					break;
				case 5:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Indice General";
					dato.innerHTML = linea.INDICEGENERAL;
					//icon.setAttribute("src", "style/images/promedio.png");
					break;
					
				case 6:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Indice Arrendamiento";
					dato.innerHTML = linea.INDICEARRENDAMIENTO;
					//icon.setAttribute("src", "style/images/categoria.png");
					break;
				case 7:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Pesada";
					dato.innerHTML = linea.PESADA;
					//icon.setAttribute("src", "style/images/cabezas.png");
					break;
				case 8:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Precio Novillo";
					dato.innerHTML = linea.PRECIONOVILLO;
					//icon.setAttribute("src", "style/images/minimo.png");
					break;
				case 9:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Porcentaje";
					dato.innerHTML = linea.Porcentaje;
					//icon.setAttribute("src", "style/images/maximo.png");
					break;
				case 10:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Remanente";
					dato.innerHTML = linea.REMANENTE;
					//icon.setAttribute("src", "style/images/mediana.png");
					break;
				case 11:
					li.setAttribute("class", "liClima");
					desc.innerHTML = "Remanente Anterior";
					dato.innerHTML = linea.REMANENTEANT;
					//icon.setAttribute("src", "style/images/promedio.png");
					break;
				case 12:
					li.setAttribute("class", "liClima MdeLUlFin");
					desc.innerHTML = "Total Proyectado";
					dato.innerHTML = linea.TOTALPROYECTADO;
					//icon.setAttribute("src", "style/images/promedio.png");
					break;
			}
			
			//Subdiv.appendChild(icon);
			Subdiv.appendChild(desc);
			divContenedor.appendChild(Subdiv);
			divContenedor.appendChild(dato);
			li.appendChild(divContenedor);
			ul.appendChild(li);
		}
        listado.appendChild(ul);
	},
	imgError: function(image) {
		image.onerror = "";
		image.src = "style/images/imgNoDisponible.png";
		return true;
	},
	imgErrorConv: function(image) {
		image.onerror = "";
		image.src = "style/images/imgNoDisponibleSmall.png";
		return true;
	},
	onSuccess: function(position) {
		Lat = position.coords.latitude;
		Long = position.coords.longitude;
		app.initClima();
	}, 
	onError: function(error){
		app.initClima();
	},		
	formatFecha: function(campo){
		var fecha = new Date(campo);
		var result = fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear();
		return result;
	},
	salir: function(){
		sessionStorage.clear();
		navigator.app.exitApp();
	},
    goToPage: function(pageTo){
        window.open(pageTo, '_system');
    },
	toggleMdL: function(){
		$("#mdl1").slideToggle(600, function() {});
		$("#mdl2").slideToggle(500, function() {});
		$("#mdl3").slideToggle(400, function() {});
			/*
		if ( $( "#mdl1:first" ).is( ":hidden" ) ) {
			$("#mdl1").slideDown( "slow" );
			$("#mdl2").slideDown( "slow" );
			$("#mdl3").slideDown( "slow" );
		} 
		else {
			$("#mdl1").slideUp("fast");
			$("#mdl2").slideUp("fast");
			$("#mdl3").slideUp("fast");
		}	
			*/
	},
	irFecha: function(id){
		$("#MdeLSel"+id).empty();
		var date = document.getElementById("datePicker"+id).value.split('-');
		switch(id){
			case 1:
				MdeLCargado = false;
				app.initMdeL1(date[0], date[1], date[2]);
				break;
			case 2:
				MdeLCargado2 = false;
				app.initMdeL2(date[0], date[1], date[2]);
				break;
			case 3:
				MdeLCargado3 = false;
				app.initMdeL3(date[0], date[1], date[2]);
				break;
		}
	},
	msjCot: function(sel, msj){
		var listado = document.getElementById(sel);		
		msg = document.createElement("p");
		msg.innerHTML = msj;
		msg.setAttribute("style", "margin-top: 20%;	font-size: 1.2em; color: #3e6e3e;");
		listado.appendChild(msg);
	},
//ORIGINAL + PERFORMANTE
/*	replaceHref: function(val){
		var idxAF = 0;
		while(val.indexOf("href=") != -1){
			/**
				Comentarios por tags <a> inconsistentes, pedir normalizacion de ingreso
			**/
			//if(val.indexOf('<a', idxAF) != -1){
/*				var idxAI = val.indexOf('<a', idxAF);
				idxAF = val.indexOf('</a>', idxAI) + 4;
				var a = val.substring(idxAI, idxAF);
				var idxHI = a.indexOf('href=');
				if(idxHI != -1)
				{
					var idxHF = a.indexOf('>');
					var dir = a.substring(idxHI + 5, idxHF);
					if(dir.substring(0,1) == '/'){
						dir = "https://www.bancoprovincia.com.ar"+dir;
					}
					a = a.substring(0, idxHI) + "onclick=" + '"' + "app.goToPage('" + dir + "');" + '"' + a.substring(idxHF, a.length);
					val = val.substring(0, idxAI) + a + val.substring(idxAF, val.length);
				}
			/*}
			else if(val.indexOf('<A', idxAF) != -1){
				var idxAI = val.indexOf('<A', idxAF);
				idxAF = val.indexOf('</A>', idxAI) + 4;
				var a = val.substring(idxAI, idxAF);
				var idxHI = a.indexOf('href=');
				if(idxHI != -1)
				{
					var idxHF = a.indexOf('>');
					var dir = a.substring(idxHI + 5, idxHF);
					if(dir.substring(0,1) == '/'){
						dir = "https://www.bancoprovincia.com.ar"+dir;
					}
					a = a.substring(0, idxHI) + "onclick=" + '"' + "app.goToPage('" + dir + "');" + '"' + a.substring(idxHF, a.length);
					val = val.substring(0, idxAI) + a + val.substring(idxAF, val.length);
				}
			}*/
/*		}
		val = val.replace(/ target=_blank/g, "");
		val = val.replace(/ tabindex=-1/g, "");
		return val;	
	},
*/
	
	
	/**
		/Momentaneo
	**/
	
	replaceHref: function(val){
		var idxAF = 0;
		var count = app.occurrences(val, "href=", false);
		for(var i=0; i<=count; i++){
				var idxAI = val.indexOf('<a', idxAF);
				idxAF = val.indexOf('</a>', idxAI) + 4;
				var a = val.substring(idxAI, idxAF);
				var idxHI = a.indexOf('href=');
				if(idxHI != -1)
				{
					var idxHF = a.indexOf('>');
					var dir = a.substring(idxHI + 5, idxHF);
					if(dir.substring(0,1) == '/'){
						dir = "https://www.bancoprovincia.com.ar"+dir;
					}
					a = a.substring(0, idxHI) + "onclick=" + '"' + "app.goToPage('" + dir + "');" + '"' + a.substring(idxHF, a.length);
					val = val.substring(0, idxAI) + a + val.substring(idxAF, val.length);
				}
		}
		val = val.replace(/ target=_blank/g, "");
		val = val.replace(/ tabindex=-1/g, "");
		return val;	
	},
	occurrences: function(string, subString, allowOverlapping){
		string+=""; subString+="";
		if(subString.length<=0) return string.length+1;

		var n=0, pos=0;
		var step=(allowOverlapping)?(1):(subString.length);

		while(true){
			pos=string.indexOf(subString,pos);
			if(pos>=0){ n++; pos+=step; } else break;
		}
		return(n);
	},
	
	/**
		/Momentaneo
	**/
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
	},
	formatWind: function(degree){
		var output;
		if (degree > 348.75 || degree < 11.25)
			output = "Norte";
		else if (degree > 11.25 && degree < 33.75)
			output = "NNE";
		else if (degree > 33.75 && degree < 56.25)
			output = "NE";
		else if (degree > 56.25 && degree < 78.75)
			output = "ENE";
		else if (degree > 78.75 && degree < 101.25)
			output = "Este";
		else if (degree > 101.25 && degree < 123.75)
			output = "ESE";
		else if (degree > 123.75 && degree < 146.25)
			output = "SE";
		else if (degree > 146.25 && degree < 168.75)
			output = "SSE";
		else if (degree > 168.75 && degree < 191.25)
			output = "Sur";
		else if (degree > 191.25 && degree < 213.75)
			output = "SSO";
		else if (degree > 213.75 && degree < 236.25)
			output = "SO";
		else if (degree > 236.25 && degree < 258.75)
			output = "OSO";
		else if (degree > 258.75 && degree < 281.25)
			output = "Oeste";
		else if (degree > 281.25 && degree < 303.75)
			output = "ONO";
		else if (degree > 303.75 && degree < 326.25)
			output = "NO";
		else if (degree > 326.25 && degree < 348.75)
			output = "NNO";
		return output;
	}
};

app.initialize();