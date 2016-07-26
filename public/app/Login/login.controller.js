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
		.controller('LoginController', LoginController);

	/**
	* Controlador de log in.
	* @param {Object} Servicio que permite la unión entre el HTML y el controlador.
	* @param {Object} Servicio que brinda funciones del log in que ayudan a la funcionalidad del controlador.
	* @param {Object} Servicio que proporciona autenticación y renderización de vistas.
	*/
	function LoginController($scope, LoginFactory, Auth) {
		$scope.email = 'fauri@gmail.com';
		$scope.contrasena = '12345';
		$scope.error = false;
		$scope.logIn = logIn;
		$scope.goBottom = goBottom;

		/**
		* Realiza el log in.
		*/
		function logIn() {		
			$scope.error = false;
			$scope.errorConn = false;

			LoginFactory.logIn($scope.email, $scope.contrasena)
			.then(function(response) {
				if(response !== undefined) {
					Auth.logIn(response);					
				}
				else {
					$scope.error = true;
				}
			})
			.catch(function(err) {
				$scope.errorConn = true;
			});
		}

		/**
		* Mueve el scroll hasta arriba.
		*/
		function goBottom() {
	        $('html, body').animate({ 
	        	scrollTop: $(document).height() 
	        }, 1500);
		}
	}

})();