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
		.controller('AutenticacionController', AutenticacionController);

	/**
	* Controlador del administrador.
	* @param {Object} Servicio que permite la unión entre el HTML y el controlador.
	* @param {Object} Servicio que proporciona autenticación y renderización de vistas.
	* @param {Object} Servicio que brinda funciones del log in al controlador.
	*/
	function AutenticacionController($scope, Auth, LoginFactory) {
		$scope.email = 'fauri@gmail.com';
		$scope.contrasena = '12345';
		$scope.error = false;
		$scope.logIn = logIn;

		/**
		* Realiza el log in.
		*/
		function logIn() {
			$scope.error = false;

			LoginFactory.logIn($scope.email, $scope.contrasena)
			.then(function(response) {
				if(response !== undefined) {
					Auth.logIn(response);
				}
				else {
					$scope.error = true;
				}
			});
		}

	}

})();