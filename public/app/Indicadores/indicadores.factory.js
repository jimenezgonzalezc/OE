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
        .factory('IndicadoresFactory', IndicadoresFactory);

    /**
    * Factory de indicadores.
    * @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
    * @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
    * @returns {Object} Objeto con los metodos del factory.
    */
    function IndicadoresFactory($http, $q, API_URL) {
        var factory = {
            getAll: getAll,
            store: store,
            update: update,
            remove: remove
        };

        return factory;

        function getAll() {
            var defered = $q.defer();

            $http.get(API_URL + '/api/indicadores/todos')
                .success(function(response) {
                    defered.resolve(response);
                })
                .error(function(err) {
                    defered.reject(err);
                });

            return defered.promise;
        }

        /**
         * Almacena un indicador en la base de datos.
         * @param  {Object} Contiene la información del indicador a almacenar.
         * @return {String} Respuesta de almacenar el indicador.
         */
        function store(indicador) {
            var defered = $q.defer();

            $http({
                method: 'POST',
                url: API_URL + '/api/indicadores/store',
                data: indicador
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
         * Elimina un indicador de la base de datos.
         * @param  {int} Id del indicador a eliminar.
         * @return {String} Resultado de eliminar el indicador.
         */
        function remove(id) {
            var defered = $q.defer();

            $http({
                method: 'DELETE',
                url: API_URL + '/api/indicadores/destroy/' + id
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
         * Modfica un indicador en la base de datos.
         * @param  {Object} Información del indicador a editar.
         * @return {String} Resultado de editar el indicador.
         */
        function update(periodo) {
            var defered = $q.defer();

            $http({
                method: 'POST',
                url: API_URL + '/api/indicadores/update',
                data: periodo
            })
            .success(function(response) {
                defered.resolve(response);
            })
            .error(function(err) {
                defered.reject(er);
            });

            return defered.promise;
        }
    }

})();