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
		.controller('PerfilController', PerfilController);

	/**
	* Controlador del perfil.
	* @param {Object} Servicio que permite la unión entre el HTML y el controlador.
	* @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	* @param {Object} Proporciona acceso de lectura/escritura a las cookies de navegador.
	* @param {Object} Promesa que resolverá cierto trozo de código cuando determinado tiempo ha pasado.
	* @param {Object} Servicio que proporciona autenticación y renderización de vistas.
	* @param {Object} Servicio que brinda funciones de las personas que ayudan a la funcionalidad del controlador.	
	*/
	function PerfilController($scope, $http, $cookies, $timeout, Auth, PersonasFactory) {
		$scope.user = $cookies.getObject('session');
		$scope.update = update;
		$scope.changePass = changePass;

		setData();

		/**
		* Pone vacías las variables del cambio de contraseña.
		*/
		function setData() {
			$scope.currentPass = '';
			$scope.newPass = '';
			$scope.passConf = '';
		}

		/**
		* Limpia el formulario del cambio de contraseña.
		*/
		function cleanForm() {
            $scope.formPass.$setPristine();
        }

        /**
		* Modifica la información del usuario.
		*/
		function update() {
			console.log('UPDATE');
		}

		/**
		* Cambia la contraseña del usuario.
		*/
		function changePass() {
			$scope.errorPassConf = false;
			$scope.errorCurrentPass = false;
			$scope.passState = false;

			if ($scope.newPass === $scope.passConf) {
				PersonasFactory.isPass($scope.user.id, $scope.currentPass)
				.then(function(response) {
					if (response !== undefined) {
						PersonasFactory.changePass($scope.user.id, $scope.newPass)
						.then(function(response) {
							$scope.passState = true;
							
							if (response === 'true') {
								$scope.passClass = 'margin success-box';
								$scope.passMsg = 'La contraseña se ha cambiado correctamente.';
								setData();
								cleanForm();
							}
							else {
								$scope.passClass = 'margin error-box';
								$scope.passMsg = 'Ha ocurrido un error al cambiar la contraseña.';
							}

							$timeout(function() {
						        $scope.passState = false;
						    }, 10000);
						});
					}
					else {
						$scope.errorCurrentPass = true;
					}
				});
			}
			else {
				$scope.errorPassConf = true;
			}
		}
	}

})();