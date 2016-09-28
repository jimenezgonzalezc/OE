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
		.factory('DatosGraficosFactory', DatosGraficosFactory);

	function DatosGraficosFactory($http, $q) {
		var factory = {
			getParametros: getParametros,
			store: store,
			update: update,
			destroy: destroy,
			getDatosGrafico:getDatosGrafico,
			getDatosGraficoPeriodo: getDatosGraficoPeriodo
		};

		return factory;

		function getParametros() {
			var defered = $q.defer();
			var promise = defered.promise;
			
			$http.get('/api/datosGraficos/parametros')
			.success(function(response) {				
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}

		/**
		 * Obtiene los datos buscados por periodo
		 * @param {Object} periodo_id: id del periodo
		 * @param {Object} tipo_evolucion: tipo de evolucion
		 * @returns {Object} datos
		 */
		function getDatosGrafico (periodo_id, tipo_evolucion) {
			var defered = $q.defer();
			var promise = defered.promise;
			$http({
				'method': 'GET',
				'url' : 'api/datosGraficos/getDatosGrafico/' + periodo_id + '/' + tipo_evolucion
			})
				.success(function (response) {
					defered.resolve(response);
				})
				.error(function (err) {
					defered.reject(err);
				});

			return promise;
		}

		function getDatosGraficoPeriodo () {
			var defered = $q.defer();
			var promise = defered.promise;
			$http({
				'method': 'GET',
				'url' : 'api/datosGraficos/todosByPeriodo'
			})
				.success(function (response) {
					defered.resolve(response);
				})
				.error(function (err) {
					defered.reject(err);
				});

			return promise;
		}

		/**
		* Almacenar datos para generacion de graficos
		* @param {Object} datosGrafico: Objeto a almacenar	
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function store (datosGrafico) {
			 var defered = $q.defer();
			 var promise = defered.promise;			 			
 			 $http({
			 	'method': 'POST',
			 	'url' : 'api/datosGraficos/registro',
			 	'data' : datosGrafico
			 })
			 	.success(function (response) {			 	
				 	defered.resolve(response);
				 })
			 	.error(function (err) {
			 		defered.reject(err);
			 	});

		 	return promise;

		}

		/**
		* Eliminar datos para generacion de graficos
		* @param {Object} id: del datos que desea eliminar
		* @returns {Object}  si se eliminar correctarmente retorna true
		*/
		function destroy (id) {
			 var defered = $q.defer();
			 var promise = defered.promise;			 
 			 $http({
			 	'method': 'DELETE',
			 	'url' : 'api/datosGraficos/eliminar/'+id
			 })
			 	.success(function (response) {			 	
				 	defered.resolve(response);
				 })
			 	.error(function (err) {
			 		defered.reject(err);
			 	});

		 	return promise;
		}

		/**
		* Actualiza los datos para generacion de graficos
		* @param {Object} datosGrafico: objeto a actualizar, se utiliza el campo id del objeto, para actualizar el registro
		* correspondiente
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function update(datosGrafico){
			var defered = $q.defer();
			var promise =  defered.promise;			
			$http({
				method: 'POST',
				url: 'api/datosGraficos/editar/',
				data: datosGrafico
			})
				.success(function(response){					
					defered.resolve(response);
				})
				.error(function(err){
					defered.reject(err);
				});			

			return promise;
		}		
	}
})();