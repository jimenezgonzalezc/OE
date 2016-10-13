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
		.factory('SectoresFactory', SectoresFactory);

		function SectoresFactory($http, $q, API_URL) {
		var factory = {
			getAll: getAll,
			destroy: destroy,
			store: store,
			update: update
		};

		return factory;

		function getAll() {
			var defered = $q.defer();
			var promise = defered.promise;
			
			$http.get(API_URL + '/api/sectores/todos')
			.success(function(response) {				
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}

		/**
		* Almacenar un sector
		* @param {Object} Sector: Objeto a almacenar	
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function store(sector){
			var defered = $q.defer();
			var promise =  defered.promise;
			
			$http({
				method: 'POST',
				url: API_URL + '/api/sectores/registro',
				data: sector
			})
				.success(function(response){
					defered.resolve(response);
				})
				.error(function(err){
					defered.reject(err);
				});			

			return promise;
		}


		/**
		* Actualiza los datos de un sector
		* @param {Object} sector: objeto a actualizar, se utiliza el campo id del objeto, para actualizar el registro
		* correspondiente
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function update(sector){
			var defered = $q.defer();
			var promise =  defered.promise;
			
			$http({
				method: 'POST',
				url: API_URL + '/api/sectores/editar/',
				data: sector
			})
				.success(function(response){
					defered.resolve(response);
				})
				.error(function(err){
					defered.reject(err);
				});			

			return promise;
		}	

		/**
		* Eliminar un sector
		* @param {Object} id: id del sector a eliminar
		* @returns {Object}  si se eliminar correctarmente retorna true
		*/
		function destroy(id){
			var defered = $q.defer();
			var promise =  defered.promise;			

			$http({
				method: 'DELETE',
				url: API_URL + '/api/sectores/destroy/' + id
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