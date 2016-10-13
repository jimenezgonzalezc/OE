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
		.factory('PersonasFactory', PersonasFactory);

	function PersonasFactory($http, $q, API_URL) {
		var factory = {
			store: store,
			getAll: getAll,
			getByType: getByType,
            ifExist: ifExist,
            edit: edit,
            remove: remove,
            isPass: isPass,
            changePass: changePass,
            getByTerritory: getByTerritory,
            getBySector : getBySector,
			getPersona: getPersona,
			getPersonas: getPersonas
		};

		return factory;

		function store(persona) {
            console.log(persona);
			var defered = $q.defer();
			var promise = defered.promise;

			$http({
				method: 'POST',
				url: API_URL + '/api/personas/registro',
				data: persona
			})
			.success(function(response) {				
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}
        function remove(id){
            var defered = $q.defer();
            $http({
                method: 'DELETE',
                url: API_URL + '/api/personas/destroy/' + id
            }).success(function(response){
                defered.resolve(response);
            })
            .error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }

		function getAll() {
			var defered = $q.defer();
			var promise = defered.promise;
			
			$http.get(API_URL + '/api/personas/todas')
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}

		function getByType(type) {
			var defered = $q.defer();

			$http.get(API_URL + '/api/personas/getByType/' + type)
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

        //obtener los registros de personas que coinciden con un determinado territorio
        function getByTerritory(territory) {
            var defered = $q.defer();

            $http.get(API_URL + '/api/personas/getByTerritory/' + territory)
            .success(function(response) {
                defered.resolve(response);
            })
            .error(function(err) {
                defered.reject(err);
            });

            return defered.promise;
        }

        //obtener los registros de personas que coinciden con un determinado territorio
        function getBySector(sector) {
            var defered = $q.defer();

            $http.get(API_URL + '/api/personas/getBySector/' + sector)
            .success(function(response) {
                defered.resolve(response);
            })
            .error(function(err) {
                defered.reject(err);
            });

            return defered.promise;
        }

		function getPersona(idPersona) {
			var defered = $q.defer();

			$http({
				method: 'POST',
				url: API_URL + '/api/personas/getPersona/',
				data: {id:idPersona}
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

        function ifExist(field,fieldToValidate){             
            var defered = $q.defer();            
            $http({
				method: 'POST',
				url: API_URL + '/api/personas/ifExist',
				data: {
					field:field,
					fieldToValidate: fieldToValidate }                
			})
            .success(function(response){            	    
                defered.resolve(response[0]);
            })
            .error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }
        
        function edit(persona){
            var defered = $q.defer();
            console.log(persona);
            $http({
				method: 'POST',
				url: API_URL + '/api/personas/update',
				data: persona
			})
            .success(function(response){
                defered.resolve(response);
            })
            .error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }

        function isPass(id, currentPass) {
        	var defered = $q.defer();

        	$http({
        		method: 'GET',
        		url: API_URL + '/api/personas/isPass/' + id + '/'+ currentPass
        	})
        	.success(function(response) {
        		defered.resolve(response[0]);
        	})
        	.error(function(err) {
        		defered.reject(err);
        	});

        	return defered.promise;
        }

        function changePass(id, pass) {
        	var defered = $q.defer(),
        		data = {
        			id: id,
        			pass: pass
        		};

        	$http({
        		method: 'POST',
        		url: API_URL + '/api/personas/changePass',
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

		function getPersonas(aplicaciones) {
			var deferred = $q.defer();
			var persona, personas = [];

			aplicaciones.forEach(function(aplicacion) {

				getPersona(aplicacion.persona_id)
				.then(function(response) {
					persona = response;
					persona.encuestas = [];
					personas.push(persona);

					if (aplicaciones.indexOf(aplicacion) === aplicaciones.length-1)
						deferred.resolve(personas);
				})
			});
			return deferred.promise;
		}
	}

})();