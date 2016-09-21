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
		.factory('CantonesFactory', CantonesFactory);

	function CantonesFactory($http, $q) {
		var factory = {
			getAll: getAll,
			store: store,
			update: update,
			destroy: destroy
		};

		return factory;

		function getAll() {
			var defered = $q.defer();
			var promise = defered.promise;
			
			$http.get('/api/cantones/todos')
			.success(function(response) {				
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}


		/**
		* Almacenar un canton
		* @param {Object} Sector: Objeto a almacenar	
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function store (canton) {
			 var defered = $q.defer();
			 var promise = defered.promise;			 			
 			 $http({
			 	'method': 'POST',
			 	'url' : 'api/cantones/registro',
			 	'data' : canton
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
		* Eliminar un canton
		* @param {Object} id: id de la región a eliminar
		* @returns {Object}  si se eliminar correctarmente retorna true
		*/
		function destroy (id) {
			 var defered = $q.defer();
			 var promise = defered.promise;			 
 			 $http({
			 	'method': 'DELETE',
			 	'url' : 'api/cantones/eliminar/'+id
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
		* Actualiza los datos de un canton
		* @param {Object} sector: objeto a actualizar, se utiliza el campo id del objeto, para actualizar el registro
		* correspondiente
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function update(canton){
			var defered = $q.defer();
			var promise =  defered.promise;			
			$http({
				method: 'POST',
				url: 'api/cantones/editar/',
				data: canton
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