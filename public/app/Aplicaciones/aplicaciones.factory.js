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
		.factory('AplicacionesFactory', AplicacionesFactory);

	/**
	* Factory de aplicaciones.
	* @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	* @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
	* @returns {Object} Objeto con los metodos del factory.
	*/
	function AplicacionesFactory($http, $q) {
		var factory = {
			getAll: getAll,
			getForSurvey: getForSurvey,
			store: store,
			remove: remove,
			update: update,
			getAplicacionesByPersona : getAplicacionesByPersona,
			getAplicacionesPersonasEncuestas: getAplicacionesPersonasEncuestas,
			getAplicacionesByPeriodo : getAplicacionesByPeriodo
		};

		return factory;

		/**
		 * Obtiene todas las aplicaciones.
		 * @returns {string} Todas las aplicaciones de la base de datos.
		 */
		function getAll() {
			var defered = $q.defer();

			$http.get('api/aplicaciones/todas')
				.success(function(response) {
					defered.resolve(response);
				})
				.error(function(err) {
					defered.reject(err);
				});

			return defered.promise;
		}

		/**
		* Obtiene las aplicaciones de una encuesta.
		* @param {integer} Id de la encuesta.
		* @returns {Array} Arreglo con las aplicaciones de la encuesta.
		*/
		function getForSurvey(idEncuesta) {
			var defered = $q.defer(),
				data = {
					idEncuesta: idEncuesta
				};

			$http({
				method: 'POST',
				url: 'api/aplicaciones/getForSurvey',
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
		* Almacena nuevas aplicaciones.
		* @param {Array} Arreglo con los id de los empresarios a los que se les va a crear una aplicación.
		* @param {integer} Id del periodo al que se va a asignar la encuesta.
		* @param {date} Fecha actual.
		* @param {integer} Id de la encuesta a la que se le va a crear aplicaciones.
		* @returns {string} Resultado del almacenamiento.
		*/
		function store(entrepreneurs, idPeriodo, fecha, idEncuesta) {
			var defered = $q.defer(),
				data = {
					entrepreneurs: entrepreneurs,
					idPeriodo: idPeriodo,
					fecha: fecha,
					idEncuesta: idEncuesta
				};

			$http({
				method: 'POST',
				url: 'api/aplicaciones/store',
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
		* Elimina aplicaciones.
		* @param {Array} Arreglo con los id de las aplicaciones que se van a eliminar.
		* @returns {string} Resultado de eliminar.
		*/
		function remove(aplications) {
			var defered = $q.defer();

			$http({
				method: 'DELETE',
				url: 'api/aplicaciones/destroy/' + aplications
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
		* Obtiene aplicaciones de encuestas de una persona dada
		* @param {Integer} Id de la persona que se quiere obtener las aplicaciones
		* @returns {Array} Objetos de las aplicaciones
		*/
		function getAplicacionesByPersona(idPersona) {
			var defered = $q.defer(),
				data = {
					persona_id: idPersona
				};

			$http({
				method: 'POST',
				url: 'api/aplicaciones/getAplicacionesByPersona',
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

		function getAplicacionesPersonasEncuestas() {
			var defered = $q.defer();

			$http.get('api/aplicaciones/personasEncuestas')
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;

		}

		function update(idAplicacion, encuestador) {
			var defered = $q.defer(),
				data = {
					id: idAplicacion,
					encuestador: encuestador
				};

			$http({
				method: 'POST',
				url: 'api/aplicaciones/update',
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
		 * Se utiliza para validar si un periodo se puede modificar o eliminar,
		 * tomando en cuenta si tiene datos(aplicaciones) asociadas
		 */
		function getAplicacionesByPeriodo(anio) {
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: 'api/aplicaciones/byPeriodo/' + anio
			})
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
