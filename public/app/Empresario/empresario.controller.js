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
		.controller('EmpresarioController', EmpresarioController);

	/**
	 * Controlador del administrador.
	 * @param {Object} $scope. Servicio que permite la unión entre el HTML y el controlador.
	 * @param {Object} EncuestasFactory. Servicio que brinda funciones de las encuestas que ayudan a la funcionalidad del controlador.
	 * @param {Object} $cookies. Proporciona acceso de lectura/escritura a las cookies de navegador.
	 * @param {Object} AplicacionesFactory. Servicio que brinda funciones de las aplicaciones que ayudan a la funcionalidad del controlador.
	 * @param {Object} Auth. Servicio que proporciona autenticación y renderización de vistas.
	 */
	function EmpresarioController($scope, EncuestasFactory, $cookies, AplicacionesFactory, Auth) {
		$scope.user = $cookies.getObject('session');
		$scope.empresario = $cookies.getObject('session').id;

		$scope.idAplicacion = 0;		//Aplicacion
		$scope.aplicaciones =  null;	//Aplicaciones
        //Encuesta
        $scope.encuestaId = 0;
        $scope.encuestaDescripcion = "";
		// Funciones
		$scope.contestarEncuesta = contestarEncuesta;
		$scope.getAplicacionesByPersona = getAplicacionesByPersona;
		$scope.logOut = logOut;

		/**
		 * Modifica la información del usuario.
		 */
		function logOut() {
			Auth.logOut();
		}

		/**
		 * Guarda datos en el factory
		 */
        function contestarEncuesta(id, descripcion){
            $scope.encuestaId = id;
            $scope.encuestaDescripcion = descripcion;
			$scope.idAplicacion = getIdAplicacion(id);

			EncuestasFactory.setId(id);
			EncuestasFactory.setDescripcion(descripcion);
			EncuestasFactory.setIdAplicacion($scope.idAplicacion);
        }

		/**
		 * Obtiene las Aplicaciones del empresario con la sesion iniciada
		 */
		function getAplicacionesByPersona() {
            AplicacionesFactory.getAplicacionesByPersona($scope.empresario)
				.then(function(response) {
					$scope.aplicaciones = response;
					getEncuestas();
				})
        }

		getAplicacionesByPersona();

		/**
		 * Obtiene las Encuestas del empresario con la sesion iniciada
		 */
		function getEncuestas() {
			$scope.encuestas = false;
			var ids = [];
			$scope.aplicaciones.forEach(function(aplicacion) {
				ids.push(aplicacion.encuesta_id);
			});

			EncuestasFactory.getEncuestas(ids)
				.then(function(response) {
					$scope.encuestas = response;
					$scope.encuestas.forEach(function(encuesta) {
						EncuestasFactory.getNumberOfQuestions(encuesta.id)
							.then(function (response) {
								if (encuesta.estado === 0)//Estado para aplicar
									$scope.encuestas = EncuestasFactory.removeItem(encuesta, $scope.encuestas);
								else
									encuesta.numeroPreguntas = parseInt(response);
							})
					});
				})
	            .catch(function(err) {
	                $scope.encuestas = true;
	                $scope.errorConn = true;
	            });
		}

		/**
		 * Obtiene el id de la Aplicacion
		 */
		function getIdAplicacion(idEncuesta) {
			var idAplicacion = 0;
			$scope.aplicaciones.forEach(function(aplicacion) {
				if(aplicacion.encuesta_id === idEncuesta)
					idAplicacion = aplicacion.id;
			});
			return idAplicacion;
		}

	}
})();
