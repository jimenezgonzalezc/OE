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
		.factory('TerritoriosSectoresFactory', TerritoriosSectoresFactory);

		function TerritoriosSectoresFactory($http, $q) {
		var factory = {						
			store: store,
			update: update,
			ifExist: ifExist,
			getBySectorId: getBySectorId,
		};

		return factory;

		/**
		* Almacenar la relación de un sector con un territorio
		* @param {Object} sector_id: id del sector a almacenar	
		* @param {Object} territorio_id: territorio al que está ligado el sector
		* @returns {Object} El resultado del request de almacenar, si es correcto, devuelve true
		*/
		function store(sector_id, territorios_id){			
			var defered = $q.defer();
			var promise =  defered.promise;

			var data = {
				sector_id: sector_id,
				territorios_id: territorios_id
			};						
			
			$http({
				method: 'POST',
				url: 'api/territoriosSectores/registro',
				data: data
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
		* Actualizar la relación de un sector con un territorio
		* @param {Object} sector_id: id del sector a almacenar	
		* @param {Object} territorio_id: territorio al que está ligado el sector
		* @returns {Object} El resultado del request de almacenar, si es correcto, devuelve true
		*/
		function update(sector_id, territorios_id){
			var defered = $q.defer();
			var promise =  defered.promise;
			var data = {				
				sector_id: sector_id,
				territorios_id: territorios_id
			};
			console.log(data);
			
			$http({
				method: 'POST',
				url: 'api/territoriosSectores/editar',
				data: data
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
		* Obtener el id de la relacion entre el territorio y el sector
		* @param {Object} sector_id: id del sector a almacenar	
		* @param {Object} territorio_id: territorio al que está ligado el sector
		* @returns {Object} El resultado del request de almacenar, si es correcto, devuelve true
		*/
		function ifExist(sector_id, territorio_id){
			var defered = $q.defer();
			var promise =  defered.promise;
			var data = {				
				sector_id: sector_id,
				territorios_id: territorio_id
			};			
			
			$http({
				method: 'GET',
				url: 'api/territoriosSectores/ifExist',
				data: data
			})
				.success(function(response){
					console.log(response);
					defered.resolve(response);
				})
				.error(function(err){
					defered.reject(err);
				});			

			return promise;
		}

		/*
		Obtener la lista de sectores asignados a la persona
		@Param: id de la persona
		@return: lista de sectores asignados a la persona
		*/
		function getBySectorId(sectorId) {
			
			 var defered = $q.defer(),
			 data = {	
			 	sector_id : sectorId			 	
			 };
			 $http({
			 	method: 'POST',
			 	url:'api/territoriosSectores/getBySectorId',
			 	data: data
			 }).success(function(response){			 
			 	defered.resolve(response);
			 }).error(function(err){
			 	defered.reject(err);
			 });		 
			 return defered.promise;
		}			
	}
})();