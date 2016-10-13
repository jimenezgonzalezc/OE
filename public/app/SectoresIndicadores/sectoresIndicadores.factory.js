(function() {
	'use strict';

	angular
		.module('observatoryApp')
		.factory('SectoresIndicadoresFactory', SectoresIndicadoresFactory);

	/**
	* Factory de sectores indicadores.
	* @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	* @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
	* @returns {Object} Objeto con los metodos del factory.
	*/
	function SectoresIndicadoresFactory($http, $q, API_URL) {
		var factory = {
			store: store,
			remove: remove,
			getForIndicador: getForIndicador,
			sectoresChanged: sectoresChanged
		};

		return factory;

		/**
		 * Agrega sectores a un indicador.
		 * @param  {integer} Id del indicador.
		 * @param  {Array} Arreglo con los ids de los sectores a agregar.
		 * @return {Srring} Resultado de agregar los sectores.
		 */
		function store(indicadorId, sectoresId) {
			var defered = $q.defer(),
				data = {
					indicadorId: indicadorId,
					sectoresId: sectoresId
				};

			$http({
				method: 'POST',
				url: API_URL + '/api/sectoresIndicadores/store',
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
		 * Elimina sectores de un indicador.
		 * @param  {Array} Arreglo con los ids de los SectoresIndicador a eliminar.
		 * @return {String} Resultado de eliminar los sectores.
		 */
		function remove(ids) {
			var defered = $q.defer();

			$http({
				method: 'DELETE',
				url: API_URL + '/api/sectoresIndicadores/destroy/' + ids
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
		 * Obtiene los sectores de un indicador.
		 * @param  {iteger} Id del indicador.
		 * @return {Array}  Arreglo con los sectores del indicador.
		 */
		function getForIndicador(id) {
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: API_URL + '/api/sectoresIndicadores/getForIndicador/' + id
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
        * Verifica si los sectores de un indicador cambiaron.
        * @param {Array} Lista con los sectores viejos de la encuesta.
        * @param {Array} Lista con los nuevos sectores de la encuesta.
        * @returns {Array} Lista con los sectores que se van a agregar y a eliminar del indicador.
        */
		function sectoresChanged(oldList, currentList) {
			var index = 0,
				length = oldList.length,
			    sectores = {
					'agregar': [],
					'eliminar': []
				};

			for ( ; index < length; index++) {
				if (currentList[index].state !== oldList[index].state) {
					if (currentList[index].state) {
						sectores.agregar.push(currentList[index].id);
					}
					else {
						sectores.eliminar.push(currentList[index].idSI);
					}
				}
			}

			return sectores;
		}
	}
})();