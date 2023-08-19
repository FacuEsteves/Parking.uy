var parking = new Array(50), preciohora, preciodia;
var cobradoT1 = 0, cobradoT2 = 0, cobradoT3 = 0;

function userAdmin() {
	var user, pass;

	user = document.getElementById("user").value;
	pass = document.getElementById("pass").value;

	if (user == "admin" & pass == "123456") {
		document.getElementById("administrador").style.display = "none"
		document.getElementById("Tarifa").style.display = "block"

		document.getElementById("user").value = ""
		document.getElementById("pass").value = ""
	} else {
		alert("El usuario o la contraseña es inconrrecta, intente de nuevo")
	}

}

function definirTarifa() {
	preciodia = Number(document.getElementById("diaTarifa").value);
	preciohora = Number(document.getElementById("horaTarifa").value);
	document.getElementById("tarifaDia").innerText = preciodia;
	document.getElementById("tarifaHora").innerText = preciohora;

	//esconder inputs de definicion
	document.getElementById("diaTarifa").style.display = "none"
	document.getElementById("horaTarifa").style.display = "none"
	document.getElementById("defT").style.display = "none"

	//Mostar los precios
	document.getElementById("tarifaDia").style.display = "inline"
	document.getElementById("tarifaHora").style.display = "inline"
	document.getElementById("camT").style.display = "inline"
}

function cambiarTarifa() {
	//Mostar los precios
	document.getElementById("tarifaDia").style.display = "none"
	document.getElementById("tarifaHora").style.display = "none"
	document.getElementById("camT").style.display = "none"

	//Mostrar los inputs de definicion
	document.getElementById("diaTarifa").style.display = "inline"
	document.getElementById("horaTarifa").style.display = "inline"
	document.getElementById("defT").style.display = "inline"
}

function VerificarTurno() {
	var intervalo = setInterval(turnos, 1000);
	var intervalo2 = setInterval(lugaresLibres, 1000);
}

function mostrarCant() {
	document.getElementById("cantdia").style.display = "block"
}

function ocultarCant() {
	document.getElementById("cantdia").style.display = "none"
}

function guardar() {
	if (preciodia == null & preciohora == null) {
		//mensaje de tarifa no definida
		popup('guardarP');
	} else {
		var existe = false, datos, matricula, nombre, cedula, celular, memory, reserva, cantidad_D, fechaR = new Date(), fechaS = new Date();

		//Turnos
		var dd = fechaR.getDate();
		var mm = fechaR.getMonth();
		var yy = fechaR.getFullYear();
		turno1S = new Date(yy, mm, dd, 8, 0, 0);
		turno2S = new Date(yy, mm, dd, 16, 0, 0);

		//guardar datos de los input
		mat = document.getElementById("matricula").value;
		nombre = document.getElementById("nomP").value;
		cedula = Number(document.getElementById("cedP").value);
		celular = document.getElementById("celP").value;
		memory = document.getElementsByName("por"); // guarda las opciones del radio button
		cantidad_D = document.getElementById("diasC").value;

		for (i = 0; i < memory.length; i++) {  //recorre las opciones para saber cual esta seleccionada
			if (memory[i].checked) {
				reserva = memory[i].value;
			}
		}

		// Verificar si los datos no estan vacios
		if (mat == "" || nombre == "") {
			//mensaje de datos vacios
			popup('guardarV')
		} else {

			//Buscar auto ya registrado
			for (var i = 0; i < parking.length; i++) {
				if (parking[i] != null) {
					if (mat == parking[i].Matricula) {
						popup();
						existe = true;
						alert("Vehiculo encontrado")
						if (parking[i].Adentro == "No") {
							parking[i].Adentro = "Si"
							alert("El vehiculo " + parking[i].Matricula + " ingreso de nuevo al estacionamiento")
						} else {
							alert("El vehiculo " + parking[i].Matricula + " ya se encuentra dentro")
						}
						setTimeout(limpiar, 3000)
						break;
					}
				}

			}

			//guardar datos segun el tipo de reserva
			if (existe == false) {
				if (reserva == "Por_Dia") {
					Adentro = "Si"
					addTime = cantidad_D * 86400; //Tiempo en segundos aquivalentes a un dia
					fechaS.setSeconds(addTime); //Añado el tiempo
					precio = cantidad_D * preciodia
					datos = { 'Matricula': mat, 'Nombre': nombre, 'Cedula': cedula, 'Celular': celular, 'Reserva': reserva, 'FyH_Ingreso': fechaR, 'FyH_Salida': fechaS, 'A_pagar': precio, "Adentro": Adentro };
				} else {
					addTime = 3600; //Tiempo en segundos aquivalentes a una hora
					fechaS.setSeconds(addTime); //Añado el tiempo
					datos = { 'Matricula': mat, 'Nombre': nombre, 'Cedula': cedula, 'Celular': celular, 'Reserva': reserva, 'FyH_Ingreso': fechaR, 'FyH_Salida': fechaS, 'A_pagar': preciohora };
				}

				//guardad los datos en el arreglo
				for (var index = 0; index < parking.length; index++) {
					if (parking[index] == null) {
						parking[index] = datos;
						popup("guardarD", index)

						//cargar cobrado cuando es auto por dia
						if (parking[index].Reserva == "Por_Dia") {
							if (fechaR <= turno1S) {
								cobradoT1 += parking[index].A_pagar
							} else {
								if (fechaR <= turno2S) {
									cobradoT2 += parking[index].A_pagar
								} else {
									cobradoT3 += parking[index].A_pagar
								}
							}
						}
						break;
					}
				}
				//limpiar los registros en pantalla
				limpiar()
			}
			//Cargar en la tabla
			cargar_tabla()
			cargarMatriculas()
		}


	}
}

function salida() {
	var mat, FHactual = new Date(), seleccionado;

	//Turnos
	var dd = FHactual.getDate();
	var mm = FHactual.getMonth();
	var yy = FHactual.getFullYear();
	turno1S = new Date(yy, mm, dd, 8, 0, 0);
	turno2S = new Date(yy, mm, dd, 16, 0, 0);

	seleccionado = document.getElementById("selector").selectedIndex;
	mat = document.getElementById("selector").options[seleccionado].value;

	for (var index = 0; index < parking.length; index++) {
		if (parking[index] != null) { //verificar que el puesto no este vacio.

			if (parking[index].Matricula == mat) { //Verificar si es igual o no la matricula a buscar

				if (parking[index].Reserva == "Por_Hora") { //Calcular segun el tipo de reserva

					if (FHactual <= parking[index].FyH_Salida) { // Saber si la hora actual es menor que la hora esperada de salida

						//mostrar precio a pagar
						alert("El total a pagar es: $" + parking[index].A_pagar)
						for (var piso = 0; piso < 5; piso++) {
							document.getElementById("estacionamiento").rows[index + 1].cells[piso].innerHTML = "<img src='cocheLibre.png' alt='Disponible' width='40' height='40'>";
						}

						//guarda lo cobrado a la salida del auto
						if (FHactual <= turno1S) {
							cobradoT1 += parking[index].A_pagar
						} else {
							if (FHactual <= turno2S) {
								cobradoT2 += parking[index].A_pagar
							} else {
								cobradoT3 += parking[index].A_pagar
							}
						}

						parking[index] = null
						alert("Salida exitosa")
						break
					} else {
						//Calcular cuantas tiempo extra hizo
						tiempoExtra = FHactual - parking[index].FyH_Salida;
						T_ExtraHoras = tiempoExtra / (1000 * 60 * 60); //convertir milisegundos a horas
						horas = Math.round(T_ExtraHoras * 10) / 10; //convertir a decimal de dos cifras

						//Calcular si es mayor a media hora
						if (horas >= 0.5) {
							total = parking[index].A_pagar + (horas * preciohora)
						} else {
							total = parking[index].A_pagar + (preciohora / 2)
						}

						//mostrar precio a pagar
						alert("El total a pagar es: $" + total)

						//liberar lugar en la tabla
						for (var piso = 0; piso < 5; piso++) {
							document.getElementById("estacionamiento").rows[index + 1].cells[piso].innerHTML = "<img src='cocheLibre.png' alt='Disponible' width='40' height='40'>";
						}

						//guarda lo cobrado a la salida del auto
						if (FHactual <= turno1S) {
							cobradoT1 += total
						} else {
							if (FHactual <= turno2S) {
								cobradoT2 += total
							} else {
								cobradoT3 += total
							}
						}

						parking[index] = null
						alert("Salida exitosa")
						break
					}
					//salida por dia si se pasa de hora esperada
				} else {

					var statusConfirm = confirm("¿Es la salida definitiva?");
					if (statusConfirm == true) {
						if (FHactual <= parking[index].FyH_Salida) {
							for (var piso = 0; piso < 5; piso++) {
								document.getElementById("estacionamiento").rows[index + 1].cells[piso].innerHTML = "<img src='cocheLibre.png' alt='Disponible' width='40' height='40'>";
							}
							parking[index] = null
							alert("Salida exitosa")
							break
						} else {
							//Calcular cuantas tiempo extra hizo
							tiempoExtra = FHactual - parking[index].FyH_Salida;
							T_ExtraHoras = tiempoExtra / (1000 * 60 * 60); //convertir milisegundos a horas
							horas = Math.round(T_ExtraHoras * 10) / 10; //convertir a decimal de dos cifras

							//Calcular si es mayor a media hora
							if (horas >= 0.5) {
								total = horas * preciohora
							} else {
								total = preciohora / 2
							}

							//mostrar precio a pagar
							alert("Quedan por pagar: $" + total + " por el tiempo extra")

							//liberar lugar en la tabla
							for (var piso = 0; piso < 5; piso++) {
								document.getElementById("estacionamiento").rows[index + 1].cells[piso].innerHTML = "<img src='cocheLibre.png' alt='Disponible' width='40' height='40'>";
							}

							//guarda lo cobrado a la salida del auto
							if (FHactual <= turno1S) {
								cobradoT1 += total
							} else {
								if (FHactual <= turno2S) {
									cobradoT2 += total
								} else {
									cobradoT3 += total
								}
							}

							parking[index] = null
							alert("Salida exitosa")
							break
						}
					}
					else {
						parking[index].Adentro = "No"
						alert("El vehiculo " + parking[index].Matricula + " marcado como afuera del estacionamiento")
						break
					}

				}
			}

		}

	}

	limpiar()

	//Actualizar en la tabla
	cargar_tabla()
	cargarMatriculas()
}

function cargar_tabla() {
	var contador = 0;
	for (var piso = 0; piso < 5; piso++) {
		for (var lugar = 0; lugar < 10; lugar++) {

			if (parking[contador] != null) {
				if (parking[contador].Reserva == "Por_Dia") {
					if (parking[contador].Adentro == "Si") {
						document.getElementById("estacionamiento").rows[lugar + 1].cells[piso].innerHTML = "<img src='cocheOcupado.png' alt='Ocupado' width='40' height='40' style='vertical-align: middle;'>  </img><img src='Dia.png' alt='Dia' width='30' height='30' style='vertical-align: middle;'></img>" + "<br>" + parking[contador].Nombre + "<br>" + parking[contador].Matricula + "<br>" + parking[contador].Celular;
					} else {
						document.getElementById("estacionamiento").rows[lugar + 1].cells[piso].innerHTML = "<img src='cocheAusente.png' alt='Ocupado' width='40' height='40'></img>" + "<br>" + parking[contador].Nombre + "<br>" + parking[contador].Matricula + "<br>" + parking[contador].Celular;
					}
				} else {
					document.getElementById("estacionamiento").rows[lugar + 1].cells[piso].innerHTML = "<img src='cocheOcupado.png' alt='Ocupado' width='40' height='40' style='vertical-align: middle;'></img>  <img src='hora.png' alt='Hora' width='30' height='30' style='vertical-align: middle;'></img>" + "<br>" + parking[contador].Nombre + "<br>" + parking[contador].Matricula + "<br>" + parking[contador].Celular;
				}
			}
			contador++;
		}
	}
}

function turnos() {
	var actual = new Date(), turno1E, turno1S, turno2E, turno2S, turno3E, turno3S;

	var dd = actual.getDate();
	var mm = actual.getMonth();
	var yy = actual.getFullYear();
	turno1E = new Date(yy, mm, dd, 0, 0, 0);
	turno1S = new Date(yy, mm, dd, 8, 0, 0);
	turno2E = new Date(yy, mm, dd, 8, 0, 0);
	turno2S = new Date(yy, mm, dd, 16, 0, 0);
	turno3E = new Date(yy, mm, dd, 16, 0, 0);
	turno3S = new Date(yy, mm, dd, 24, 0, 0);

	if (turno1E.getHours() <= actual.getHours() & actual.getHours() < turno1S.getHours()) {
		document.getElementById("turno").innerText = "Primer Turno"
		document.getElementById("caja").innerText = "$" + cobradoT1
	} else {
		if (turno2E.getHours() <= actual.getHours() & actual.getHours() < turno2S.getHours()) {
			document.getElementById("turno").innerText = "Segundo Turno"
			document.getElementById("caja").innerText = "$" + cobradoT2
		} else {
			document.getElementById("turno").innerText = "Tercer Turno"
			document.getElementById("caja").innerText = "$" + cobradoT3
		}
	}

	//hacer recuento de plata por turno

	if (actual.getHours() == turno1S.getHours() & actual.getMinutes() == turno1S.getMinutes() & actual.getSeconds() == turno1S.getSeconds()) {
		alert("El total cobrado al final de la jornada es: " + cobradoT1)
	} else {
		if (actual.getHours() == turno2S.getHours() & actual.getMinutes() == turno2S.getMinutes() & actual.getSeconds() == turno2S.getSeconds()) {
			alert("El total cobrado al final de la jornada es: " + cobradoT2)
		} else {
			if (actual.getHours() == turno3S.getHours() & actual.getMinutes() == turno3S.getMinutes() & actual.getSeconds() == turno3S.getSeconds()) {
				alert("El total cobrado al final de la jornada es: " + cobradoT3)
				cobradoT1 = 0;
				cobradoT2 = 0;
				cobradoT3 = 0;
			}
		}
	}
}

function limpiar() {
	//entrada
	document.getElementById("matricula").value = "";
	document.getElementById("nomP").value = "";
	document.getElementById("cedP").value = "";
	document.getElementById("celP").value = "";
	document.getElementById("cantdia").value = "1";
	document.querySelector('#hora').checked = true;
	document.getElementById("cantdia").style.display = "none"

	//salida
	document.getElementById("nomPS").value = "";
	document.getElementById("cedPS").value = "";
	document.getElementById("celPS").value = "";
}

function buscar() {

	var mat2, seleccionado;

	seleccionado = document.getElementById("selector").selectedIndex;
	mat2 = document.getElementById("selector").options[seleccionado].value;

	for (var i = 0; i < parking.length; i++) {
		if (parking[i] != null) {
			if (mat2 == parking[i].Matricula) {
				document.getElementById("nomPS").value = parking[i].Nombre;
				document.getElementById("cedPS").value = parking[i].Cedula;
				document.getElementById("celPS").value = parking[i].Celular;
				break;
			} else {

				document.getElementById("nomPS").value = "No se encontro";
				document.getElementById("cedPS").value = "No se encontro";
				document.getElementById("celPS").value = "No se encontro";

			}
		}

	}
}

function buscar2() { 

	var mat1;

	mat1 = document.getElementById("matricula").value;

	for (var i = 0; i < parking.length; i++) {
		if (parking[i] != null) {
			if (mat1 == parking[i].Matricula) {
				document.getElementById("nomP").value = parking[i].Nombre;
				document.getElementById("cedP").value = parking[i].Cedula;
				document.getElementById("celP").value = parking[i].Celular;
				if(parking[i].Reserva == "Por_Dia"){
					document.querySelector('#dia').checked = true;
				}
				break;
			} else {
				document.getElementById("nomP").value = "No se encontro";
				document.getElementById("cedP").value = "No se encontro";
				document.getElementById("celP").value = "No se encontro";

			}
		}

	}
}

function lugaresLibres() {

	var contador = 0;

	for (var i = 0; i < parking.length; i++) {
		if (parking[i] == null) {
			contador++
		}
	}
	document.getElementById("cont").innerText = contador
}

// funcion para Cargar los campos en el <select>
function cargarMatriculas() {
	addOptions("selector", "Mat", parking);
}

// Rutina para agregar opciones a un <select>
function addOptions(id, opciones, array) {
	var seleccionar = document.getElementsByName(opciones)[0];

	x = document.getElementById(id);
	x.innerHTML = ""
	var option = document.createElement("option");
	option.text = "Seleccione una matricula...";
	seleccionar.add(option);
	for (var index = 0; index <= array.length; index++) {
		if (array[index] != null) {
			var option = document.createElement("option");
			option.text = array[index].Matricula + "-" + array[index].Nombre;
			option.value = array[index].Matricula;
			seleccionar.add(option);
		}
	}
}

function popup(funcion, indice) {
	document.getElementById("popup").style.display = "block"

	switch (funcion) {
		case "guardarP":
			//Declaraciones ejecutadas cuando el resultado de expresión coincide
			document.getElementById("tituloPopup").innerText = "Antes de guardar defina los precios"
			document.getElementById("datosG").innerText = "Defina el precio de la tarifa de dia"
			document.getElementById("precioD").innerText = "Defina el precio de la tarifa de hora"
			break;
		case "guardarV":
			//Declaraciones ejecutadas cuando el resultado de expresión coincide
			document.getElementById("tituloPopup").innerText = "Ingrese los todos los datos del vehiculo"
			document.getElementById("datosG").style.display = "none"
			document.getElementById("precioD").style.display = "none"
			document.getElementById("irTarifa").style.display = "none"
			break;
		case "guardarD":
			//Declaraciones ejecutadas cuando el resultado de expresión
			document.getElementById("tituloPopup").innerText = "Vehiculo ingresado correctamente"
			document.getElementById("datosG").style.display = "block"
			document.getElementById("datosG").innerText = "Se le asigno el lugar numero: " + (indice + 1)
			document.getElementById("precioD").style.display = "none"
			document.getElementById("irTarifa").style.display = "none"
			if (parking[indice].Reserva == "Por_Dia") {
				document.getElementById("precioD").style.display = "block"
				document.getElementById("precioD").innerText = "A pagar: " + parking[indice].A_pagar
			}
			break;
		default:
			//Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
			document.getElementById("popup").style.display = "none"
			break;
	}

}
