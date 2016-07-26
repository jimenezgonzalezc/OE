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
		.factory('LoginFactory', LoginFactory);

	/**
	* Factory de log in.
	* @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	* @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
	* @returns {Object} Objeto con los metodos del factory.
	*/
	function LoginFactory($http, $q) {
		var factory = {
			logIn: logIn
		};

		return factory;

		/**
		* Factory de encuestas.
		* @param {string} Email del usuario.
		* @param {string} Contraseña del usuario.
		* @returns {Object} Información del usuario que inicia sesión o undefined si el log in es incorrecto.
		*/
		function logIn(email, contrasena) {
			var defered = $q.defer();
			var promise = defered.promise;

			var data = {
				email: email,
				contrasena: contrasena
			}

			$http({
				method: 'POST',
				url: '/api/login',
				data: data
			})
			.success(function(response) {
				defered.resolve(response[0]);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}
	}

})();