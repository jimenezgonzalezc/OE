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
		.factory('TerritoriosFactory', TerritoriosFactory);

	function TerritoriosFactory($http, $q) {
		var factory = {
			getAll: getAll,
			store: store,
			update: update,
			destroy: destroy,
		};

		return factory;

		function getAll() {
			var defered = $q.defer();
			var promise = defered.promise;
			
			$http.get('/api/territorios/todos')
			.success(function(response) {				
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}


		/**
		* Almacenar una region
		* @param {Object} Sector: Objeto a almacenar	
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function store (territorio) {			
			 var defered = $q.defer();
			 var promise = defered.promise;			 			
 			 $http({
			 	'method': 'POST',
			 	'url' : 'api/territorios/registro',
			 	'data' : territorio
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
		* Eliminar una región
		* @param {Object} id: id de la región a eliminar
		* @returns {Object}  si se eliminar correctarmente retorna true
		*/
		function destroy (id) {			
			 var defered = $q.defer();
			 var promise = defered.promise;			 
 			 $http({
			 	'method': 'DELETE',
			 	'url' : 'api/territorios/destroy/'+id
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
		* Actualiza los datos de una región
		* @param {Object} sector: objeto a actualizar, se utiliza el campo id del objeto, para actualizar el registro
		* correspondiente
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function update(region){
			var defered = $q.defer();
			var promise =  defered.promise;			
			$http({
				method: 'POST',
				url: 'api/territorios/editar/',
				data: region
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