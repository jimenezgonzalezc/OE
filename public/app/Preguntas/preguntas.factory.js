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
        .factory('PreguntasFactory', PreguntasFactory);

    function PreguntasFactory($http, $q, API_URL) {
        var factory = {
            store: store,
            edit: edit,
            destroy: destroy,
            getAll: getAll
        };

        return factory;

        function store(pregunta) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: API_URL + '/api/preguntas/registro',
                data: pregunta
            })
                .success(function(response) {
                    defered.resolve(response);
                })
                .error(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAll() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(API_URL + '/api/preguntas/todas')
                .success(function(response) {
                    defered.resolve(response);
                })
                .error(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function edit(pregunta) {
            var defered = $q.defer();

            $http({
                method: 'POST',
                url: API_URL + "/api/preguntas/editar",
                data: pregunta
                
            }).success(function(response) {
                defered.resolve(response);

            }).error(function(err) {
                defered.reject(err);

            });
            return defered.promise;
        }

        function destroy(id){
            var defered = $q.defer();

            $http({
                method: 'DELETE',
                url: API_URL + '/api/preguntas/destroy/' + id,
            })
            .success(function(response){
                    defered.resolve(response);
            })
            .error(function(err){
                    defered.reject(err);
            });

            return defered.promise;
        }
    }

})();