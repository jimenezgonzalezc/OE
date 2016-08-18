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
	function ContestarEncuestasController($scope, EncuestasFactory, $cookies, AplicacionesFactory, AplicacionesRespuestasFactory, $timeout) {
		$scope.encuestador =  $cookies.getObject('session');


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
		// Mensaje
		$scope.mensaje = false;
		$scope.styleEnviarEncuesta = "";
		$scope.msgEnviarEncuesta = "";

        $scope.opcionesRespuesta = [
            {"id": 1, "alternativa": "Muy bueno"},
            {"id": 2, "alternativa": "Bueno"},
            {"id": 3, "alternativa": "Regular"},
            {"id": 4, "alternativa": "Malo"},
            {"id": 5, "alternativa": "Muy malo"}
        ];

        $scope.getpreguntasByEncuesta = getpreguntasByEncuesta;
        $scope.guardarRespuesta = guardarRespuesta;
		$scope.guardarEncuesta = guardarEncuesta;

		/**
		 * Obtiene datos del factory
		 */
        function getEncuesta(){
            $scope.encuestaId = EncuestasFactory.getId();
            $scope.encuestaDescripcion = EncuestasFactory.getDescripcion();
			$scope.idAplicacion = EncuestasFactory.getIdAplicacion();
            getpreguntasByEncuesta($scope.encuestaId);
        }

		getEncuesta();

		/**
		 * Obtiene las preguntas de la encuesta seleccionada
		 */
        function getpreguntasByEncuesta(id) {
            EncuestasFactory.getpreguntasEncuestas(id)
                .then(function(response) {
                    $scope.preguntasEncuesta = response;
					var i = 0;
                    $scope.preguntasEncuesta.forEach(function(pregunta) {
                        if (i===0)
                            pregunta.clase = "active";
                        else
                            pregunta.clase = "";

                        pregunta.vistaId = i;
                        i++;

                        if (pregunta.tipo === "f")
                            pregunta.tipo = false;
                        else
                            pregunta.tipo = true;
                    });
                });
        }

		/**
		 * Guarda las respuestas
		 */
        function guardarRespuesta(pregunta, respuesta, comentario) {
			//console.log('comentario',comentario);
			if (comentario == null)
				comentario = "";
			//console.log('comentario',comentario);

			var data = {
                pregunta_id: pregunta.pregunta_id,
                enunciado: pregunta.enunciado,
                alternativa: respuesta.alternativa,
                comentario: comentario
            };
						
			if ($scope.preguntasRespondidas === null)
				$scope.preguntasRespondidas = [];

			if (existePregunta($scope.preguntasRespondidas, pregunta.pregunta_id))
				modificarPregunta($scope.preguntasRespondidas, pregunta.pregunta_id, respuesta.alternativa, comentario)
			else
				$scope.preguntasRespondidas.push(data);
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
		function guardarEncuesta() {
			//console.log('guardarEncuesta');

			if ($scope.preguntasRespondidas === null){
				//console.log('No se ha respondido ni una pregunta');

				$scope.mensaje = true;
				$scope.msgEnviarEncuesta = 'No se ha respondido ni una pregunta';
				$scope.styleEnviarEncuesta = 'error-box';
			}
			else if ($scope.preguntasRespondidas.length < $scope.preguntasEncuesta.length){
				//console.log('Faltan preguntas por responder');

				$scope.mensaje = true;
				$scope.msgEnviarEncuesta = 'Faltan preguntas por responder';
				$scope.styleEnviarEncuesta = 'error-box';
			}
			else{
				//console.log('forEach');

				$scope.preguntasRespondidas.forEach(function(pregunta) {
					enviarEncuesta(pregunta.enunciado, pregunta.alternativa, $scope.idAplicacion, pregunta.comentario);
					AplicacionesFactory.update($scope.idAplicacion, $scope.encuestador.nombre + " " + $scope.encuestador.apellido1 + " " + $scope.encuestador.apellido2);
				});
			}
			ocultarMensaje();
        }

		/**
		 * Guardas datos en el factory
		 */
		function enviarEncuesta(pregunta, respuesta, aplicacion_id, comentario) {
			//console.log(pregunta, comentario);

			var data = {pregunta: pregunta, respuesta: respuesta, aplicacion_id: aplicacion_id, comentario: comentario};

            AplicacionesRespuestasFactory.store(data)
				.then(function(response) {
					if(response === 'true') {
						//console.log('guardo');
						$scope.mensaje = true;
		                $scope.msgEnviarEncuesta = 'La encuesta ha sido guardada y enviada';
		                $scope.styleEnviarEncuesta = 'success-box';
						ocultarMensaje();
					} else {
						//console.log('Error al guardar');
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
			}, 5000);
		}
	}
})();
