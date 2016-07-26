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
		.factory('PeriodosFactory', PeriodosFactory);

	/**
	* Factory de periodos.
	* @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	* @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
	* @returns {Object} Objeto con los metodos del factory.
	*/
	function PeriodosFactory($http, $q) {
		var factory = {
			store: store,
			remove: remove,
			update: update,
			getAll: getAll,
			generateyYears: generateyYears
		};

		return factory;

		/**
		 * Almacena un periodo en la base de datos.
		 * @param  {Object} Contiene la información del perido a almacenar.
		 * @return {String} Respuesta de almacenar el periodo.
		 */
		function store(periodo) {
			var defered = $q.defer();

			$http({
				method: 'POST',
				url: 'api/periodos/store',
				data: periodo
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			})

			return defered.promise;
		}

		/**
		 * Eliminar un periodo de la base de datos.
		 * @param  {int} Id del periodo a eliminar.
		 * @return {String} Resultado de eliminar el periodo.
		 */
		function remove(id) {
			var defered = $q.defer();

			$http({
				method: 'DELETE',
				url: 'api/periodos/destroy/' + id
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			})

			return defered.promise;
		}

		/**
		 * Modfica un periodo en la base de datos.
		 * @param  {Object} Información del periodo a editar.
		 * @return {String} Resultado de editar el periodo.
		 */
		function update(periodo) {
			var defered = $q.defer();

			$http({
				method: 'POST',
				url: 'api/periodos/update',
				data: periodo
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(er);
			})

			return defered.promise;
		}

		/**
		* Obtiene todos los peridos de la base de datos.
		* @returns {Array} Lista con los peridos.
		*/
		function getAll() {
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: 'api/periodos/getAll'
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
		 * Genera los años para mostrar en la vista de agregar periodo.
		 * @return {Array} Lista con los años generados.
		 */
		function generateyYears() {
			var id = 1,
			    date = new Date(),
			    year = 2016,
				yearFinish = date.getFullYear() + 5,
				years = [];

			for ( ; year < yearFinish; year++) {
				years.push({id: id, year: year});
				id++;
			}

			return years;
		}
	}
})();