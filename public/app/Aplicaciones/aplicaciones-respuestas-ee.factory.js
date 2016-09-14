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
		.factory('AplicacionesRespuestasEEFactory', AplicacionesRespuestasEEFactory);

	/**
	 * Factory de aplicaciones-respuestas.
	 * @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	 * @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
	 * @returns {Object} Objeto con los metodos del factory.
	 */

	function AplicacionesRespuestasEEFactory($http, $q) {
		var factory = {
			store: store,
			remove: remove,
			getAll: getAll
		};

		return factory;

		/**
		 * Guarda las respuestas de cada aplicacion
		 * @param {object} data. Respuestas de aplicacion.
		 * @returns {string} Resultado del almacenamiento.
		 */
		function store(data) {
			var defered = $q.defer();

			$http({
				method: 'POST',
				url: 'api/aplicaciones-respuestas-ee/store',
				data: data
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
		 * Elimina un registro buscado por id
		 * @param {integer} id. Respuesta que se desea guardar.
		 * @returns {string} Resultado al eliminar.
		 */
		function remove(id) {
			var defered = $q.defer(),
				data = {
					id: id
				};

			$http({
				method: 'POST',
				url: '/aplicaciones-respuestas-ee/remove',
				data: data
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
		 * Obtiene todas las respuestas
		 * @returns {string} Obtiene todas las respuestas que estan en base de datos
		 */
		function getAll() {
			var defered = $q.defer();

			$http.get('api/aplicaciones-respuestas-ee/todas')
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

	}

})();
