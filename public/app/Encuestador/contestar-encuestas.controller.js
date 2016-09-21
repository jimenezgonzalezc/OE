/**
* Entrepreneurship Observatory
*
* @authors Fauricio Rojas Hernández, Manfred Artavia Gómez y Carlos Jiménez González.
* @version 1.0
*/
(function() {
	'use strict';

	angular
		.module('observatoryApp')
		.controller('ContestarEncuestasController', ContestarEncuestasController);

	/**
	 * Controlador del administrador.
	 * @param {Object} $scope. Servicio que permite la unión entre el HTML y el controlador.
	 * @param {Object} EncuestasFactory. Servicio que brinda funciones de las encuestas que ayudan a la funcionalidad del controlador.
	 * @param {Object} $cookies. Proporciona acceso de lectura/escritura a las cookies de navegador.
	 * @param {Object} AplicacionesFactory. Servicio que brinda funciones de las aplicaciones que ayudan a la funcionalidad del controlador.
	 * @param {Object} AplicacionesRespuestasFactory. Servicio que brinda funciones de las aplicaciones-espuestas que ayudan a la funcionalidad del controlador.
	 * @param {Object} $timeout. Promesa que resolverá cierto trozo de código cuando determinado tiempo ha pasado.
	 */
	function ContestarEncuestasController($scope, EncuestasFactory, $cookies, AplicacionesFactory, AplicacionesRespuestasFactory, $timeout, $mdDialog, AplicacionesRespuestasEEFactory, $state, RespaldoAplicacionesRespuestasFactory) {
		$scope.encuestador =  $cookies.getObject('session');
		$scope.botonEnviar = false;

		$scope.idAplicacion = 0;
        //Encuesta
        $scope.encuestaId = 0;
        $scope.encuestaDescripcion = "";
        //Pregunta
        $scope.preguntaId = 0;
        $scope.preguntaEnunciado = "";
        $scope.preguntaTipo = false;
        $scope.preguntaBloqueNegocio = 0;
        $scope.preguntaRespuesta = "";
        //Preguntas
        $scope.preguntas = null;
        //contestar-encuestas
        $scope.preguntasEncuesta = null;
        $scope.preguntasRespondidas = null;
		$scope.preguntasRespondidasEE = null;
		$scope.respaldoRespuestas = null;
		// Mensaje
		$scope.mensaje = false;
		$scope.styleEnviarEncuesta = "";
		$scope.msgEnviarEncuesta = "";

        $scope.opcionesRespuesta = [
            {"id": 1, "alternativa": "Muy bueno", "valor": 1},
            {"id": 2, "alternativa": "Bueno", "valor": 2},
            {"id": 3, "alternativa": "Regular", "valor": 3},
            {"id": 4, "alternativa": "Malo", "valor": 4},
            {"id": 5, "alternativa": "Muy malo", "valor": 5}
        ];

		$scope.comentario = '';

        $scope.getpreguntasByEncuesta = getpreguntasByEncuesta;
        $scope.guardarRespuesta = guardarRespuesta;
		$scope.guardarEncuesta = guardarEncuesta;
		$scope.cancelarEncuesta = cancelarEncuesta;
		$scope.guardarRespaldo = guardarRespaldo;
		$scope.modificarRespaldo = modificarRespaldo;
		$scope.getValor = getValor;
		$scope.guardarRespuestaRespaldo = guardarRespuestaRespaldo;
		/**
		 * Obtiene datos del factory
		 */
        function getEncuesta(){
            $scope.encuestaId = EncuestasFactory.getId();
            $scope.encuestaDescripcion = EncuestasFactory.getDescripcion();
			$scope.idAplicacion = EncuestasFactory.getIdAplicacion();
            getpreguntasByEncuesta($scope.encuestaId, $scope.idAplicacion);
        }

		getEncuesta();

		/**
		 * Obtiene las preguntas de la encuesta seleccionada
		 */
        function getpreguntasByEncuesta(id, idAplicacion) {
            EncuestasFactory.getpreguntasEncuestas(id)
                .then(function(response) {
                    $scope.preguntasEncuesta = response;
					$scope.preguntasEncuestaEE = angular.copy($scope.preguntasEncuesta);
                    $scope.preguntasEncuesta.forEach(function(pregunta) {
						$scope.botonEnviar = true;
						if (pregunta.tipo === "f")
                            pregunta.tipo = false;
                        else
                            pregunta.tipo = true;
                    });
					$scope.preguntasEncuestaEE.forEach(function(pregunta) {
						if (pregunta.tipo === "f")
							pregunta.tipo = false;
						else
							pregunta.tipo = true;
					});

                });
			RespaldoAplicacionesRespuestasFactory.getByAplicacionId(idAplicacion)
				.then(function(response) {
					$scope.respaldoRespuestas = response;
				});
        }

		function getValor(pregunta_id, tipo, valor){
			var check = false;
			if ($scope.respaldoRespuestas !== null){
				for(var i=0; i<$scope.respaldoRespuestas.length; i++){
					if ($scope.respaldoRespuestas[i].pregunta_id === pregunta_id && $scope.respaldoRespuestas[i].tipo_evolucion === tipo && $scope.respaldoRespuestas[i]. 	valor_respuesta === valor){
						check = true;

						var pregunta = {
							pregunta_id : $scope.respaldoRespuestas[i].pregunta_id,
							enunciado : $scope.respaldoRespuestas[i].pregunta,
							indicador_id : $scope.respaldoRespuestas[i].indicador_id
						};
						guardarRespuestaRespaldo(pregunta, $scope.respaldoRespuestas[i].respuesta, $scope.respaldoRespuestas[i].comentarios, $scope.respaldoRespuestas[i].tipo_evolucion);
						i = $scope.respaldoRespuestas.length;
					}
				}
			}
			return check;
		}



		/**
		 * Guarda las respuestas
		 */
        function guardarRespuesta(pregunta, respuesta, comentario, tipo) {
			if (tipo === 1) {// Tipo 1: Evolucion Real
				$scope.preguntasRespondidasAux = $scope.preguntasRespondidas;
			}
			else {// Tipo 2: Evolucion Esperada
				$scope.preguntasRespondidasAux = $scope.preguntasRespondidasEE;
			}

			if (comentario == null)
				comentario = "";
			var data = {
				pregunta_id: pregunta.pregunta_id,
				enunciado: pregunta.enunciado,
				alternativa: respuesta.alternativa,
				comentario: comentario,
				indicador_id: pregunta.indicador_id
			};

			if ($scope.preguntasRespondidasAux === null)
				$scope.preguntasRespondidasAux = [];

			if (existePregunta($scope.preguntasRespondidasAux, pregunta.pregunta_id)) {
				modificarPregunta($scope.preguntasRespondidasAux, pregunta.pregunta_id, respuesta.alternativa, comentario);
				modificarRespaldo(pregunta.pregunta_id, respuesta.alternativa, comentario, tipo);
			}
			else{
				$scope.preguntasRespondidasAux.push(data);
				guardarRespaldo(pregunta, respuesta, comentario, tipo)
			}


			if (tipo===1){// Tipo 1: Evolucion Real
				$scope.preguntasRespondidas = $scope.preguntasRespondidasAux;
			}
			else{// Tipo 2: Evolucion Esperada
				$scope.preguntasRespondidasEE = $scope.preguntasRespondidasAux;
			}
        }

		function guardarRespuestaRespaldo(pregunta, respuesta, comentario, tipo) {
			if (tipo === 1) {// Tipo 1: Evolucion Real
				$scope.preguntasRespondidasAux = $scope.preguntasRespondidas;
			}
			else {// Tipo 2: Evolucion Esperada
				$scope.preguntasRespondidasAux = $scope.preguntasRespondidasEE;
			}

			if (comentario == null)
				comentario = "";
			var data = {
				pregunta_id: pregunta.pregunta_id,
				enunciado: pregunta.enunciado,
				alternativa: respuesta.alternativa,
				comentario: comentario,
				indicador_id: pregunta.indicador_id
			};

			if ($scope.preguntasRespondidasAux === null)
				$scope.preguntasRespondidasAux = [];

			if (existePregunta($scope.preguntasRespondidasAux, pregunta.pregunta_id)) {
				modificarPregunta($scope.preguntasRespondidasAux, pregunta.pregunta_id, respuesta.alternativa, comentario);
			}
			else{
				$scope.preguntasRespondidasAux.push(data);
			}


			if (tipo===1){// Tipo 1: Evolucion Real
				$scope.preguntasRespondidas = $scope.preguntasRespondidasAux;
			}
			else{// Tipo 2: Evolucion Esperada
				$scope.preguntasRespondidasEE = $scope.preguntasRespondidasAux;
			}
		}
		function guardarRespaldo(pregunta, respuesta, comentario, tipo) {
			var data = {
				pregunta_id: pregunta.pregunta_id,
				pregunta: pregunta.enunciado,
				respuesta: respuesta.alternativa,
				aplicacion_id: $scope.idAplicacion,
				valor_respuesta: getValorRespuesta(respuesta.alternativa),
				indicador_id: pregunta.indicador_id,
				comentario: comentario,
				tipo_evolucion: tipo
			};
			RespaldoAplicacionesRespuestasFactory.store(data)
				.then(function(response) {
					if(response === 'true') {
						//console.log('guardo la respuesta');
					}
				}, function(err) {
					//console.log('error al guardar la respuesta:', err);
				});
		}

		function modificarRespaldo(pregunta, respuesta, comentario, tipo) {
			var data = {
				pregunta_id: pregunta,
				respuesta: respuesta,
				valor_respuesta: getValorRespuesta(respuesta),
				comentario: comentario,
				tipo_evolucion: tipo,
				aplicacion_id: $scope.idAplicacion
			};
			RespaldoAplicacionesRespuestasFactory.update(data)
				.then(function(response) {
					if(response === 'true') {
						//console.log('modifico la respuesta');
					}
				}, function(err) {
					//console.log('error al modificar la respuesta:', err);
				});
		}

		/**
		 * Verifica si existe una pregunta con el mismo id
		 */
		function existePregunta (preguntas, idPregunta) {
			var existe = false;
			preguntas.forEach(function(pregunta) {
				if (pregunta.pregunta_id == idPregunta)
					existe = true;
			});
			return existe;
		}

		/**
		 * Modifica los datos(respuestas) de las preguntas
		 */
		function modificarPregunta (preguntas, idPregunta, respuesta, comentario) {
			preguntas.forEach(function(pregunta) {
				if (pregunta.pregunta_id == idPregunta){
					pregunta.alternativa = respuesta;
					pregunta.comentario = comentario;
				}
			});
		}

		/**
		 * Obtiene las encustas de las aplicaciones
		 */
		function getEncuestas() {
			var ids = [];
			$scope.aplicaciones.forEach(function(aplicacion) {
				ids.push(aplicacion.encuesta_id);
			});

			EncuestasFactory.getEncuestas(ids)
			.then(function(response) {
				$scope.encuestas = response;
			});
		}

		/**
		 * Guarda las respuestas de la encuesta
		 */
		function guardarEncuesta(ev) {
			if ($scope.preguntasRespondidas === null && $scope.preguntasRespondidasEE === null){
				$scope.mensaje = true;
				$scope.msgEnviarEncuesta = 'No se ha respondido ninguna pregunta';
				$scope.styleEnviarEncuesta = 'error-box';
				ocultarMensaje();
			}
			else if ($scope.preguntasRespondidas.length < $scope.preguntasEncuesta.length || $scope.preguntasRespondidasEE.length < $scope.preguntasEncuesta.length){
				$scope.mensaje = true;
				$scope.msgEnviarEncuesta = 'Faltan preguntas por responder';
				$scope.styleEnviarEncuesta = 'error-box';
				ocultarMensaje();
			}
			else{
				var confirm = $mdDialog.confirm('?')
					.title('Enviar encuesta')
					.textContent('La encuesta sera enviada y guardada. Una vez enviada no se podrá modificar. ¿Desea Continuar?')
					.ariaLabel('Lucky day')
					.targetEvent(ev)
					.ok('Sí')
					.cancel('No');
				$mdDialog.show(confirm)
					.then(function() {
						$scope.botonEnviar = false;
						$scope.preguntasRespondidas.forEach(function(pregunta) {
							pregunta.comentario = $('textarea#er-' + pregunta.pregunta_id).val();
							enviarEncuesta(pregunta.enunciado, pregunta.alternativa, $scope.idAplicacion, pregunta.comentario, pregunta.indicador_id);
						});
						$scope.preguntasRespondidasEE.forEach(function(pregunta) {
							pregunta.comentario = $('textarea#ee-' + pregunta.pregunta_id).val();
							enviarEncuestaEE(pregunta.enunciado, pregunta.alternativa, $scope.idAplicacion, pregunta.comentario, pregunta.indicador_id);
						});
						AplicacionesFactory.update($scope.idAplicacion, $scope.encuestador.nombre + " " + $scope.encuestador.apellido1 + " " + $scope.encuestador.apellido2);
						ocultarMensaje();
						RespaldoAplicacionesRespuestasFactory.removeByAplicacionId($scope.idAplicacion)
							.then(function(response) {
								//console.log('se han eliminado los respaldos');
							});
					}, function() {});
			}
        }

		function cancelarEncuesta(ev){
			var confirm = $mdDialog.confirm('?')
				.title('¿Esta seguro que desea salir de la encuesta?')
				.textContent('Ninguna respuesta de la encuesta se guardará')
				.ariaLabel('Lucky day')
				.targetEvent(ev)
				.ok('Sí')
				.cancel('No');

			$mdDialog.show(confirm)
				.then(function() {
					$state.go("encuestador.encuestas");
				}, function() {});
		}

		function getValorRespuesta(respuesta){
			if (respuesta === 'Muy bueno'){
				return 1;
			}
			if (respuesta === 'Bueno'){
				return 2;
			}
			if (respuesta === 'Regular'){
				return 3;
			}
			if (respuesta === 'Malo'){
				return 4;
			}
			if (respuesta === 'Muy malo'){
				return 5;
			}
		}

		/**
		 * Guardar todas las preguntas
		 */
		function enviarEncuesta(pregunta, respuesta, aplicacion_id, comentario, indicador_id) {
			var valor_respuesta = getValorRespuesta(respuesta);
			var data = {pregunta: pregunta, respuesta: respuesta, aplicacion_id: aplicacion_id, comentario: comentario, indicador_id: indicador_id, valor_respuesta: valor_respuesta};

            AplicacionesRespuestasFactory.store(data)
				.then(function(response) {
					if(response === 'true') {
						$scope.mensaje = true;
		                $scope.msgEnviarEncuesta = 'La encuesta ha sido guardada y enviada';
		                $scope.styleEnviarEncuesta = 'success-box';
						ocultarMensaje();
					} else {
						$scope.mensaje = true;
						$scope.msgEnviarEncuesta = 'Error al guardar la encuesta';
						$scope.styleEnviarEncuesta = 'error-box';
						ocultarMensaje();
					}
				});
        }

		function enviarEncuestaEE(pregunta, respuesta, aplicacion_id, comentario, indicador_id) {
			var valor_respuesta = getValorRespuesta(respuesta);
			var data = {pregunta: pregunta, respuesta: respuesta, aplicacion_id: aplicacion_id, comentario: comentario, indicador_id: indicador_id, valor_respuesta: valor_respuesta};

			AplicacionesRespuestasEEFactory.store(data)
				.then(function(response) {
					if(response === 'true') {
						$scope.mensaje = true;
						$scope.msgEnviarEncuesta = 'La encuesta ha sido guardada y enviada';
						$scope.styleEnviarEncuesta = 'success-box';
						ocultarMensaje();
					} else {
						$scope.mensaje = true;
						$scope.msgEnviarEncuesta = 'Error al guardar la encuesta';
						$scope.styleEnviarEncuesta = 'error-box';
						ocultarMensaje();
					}
				});
		}

		/**
		 * Oculta el mensaje de la vista
		 */
		function ocultarMensaje() {
			$timeout(function() {
				$scope.mensaje = false;
			}, 6000);
		}
	}
})();