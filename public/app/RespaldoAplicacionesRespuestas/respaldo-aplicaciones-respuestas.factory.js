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
        .factory('RespaldoAplicacionesRespuestasFactory', RespaldoAplicacionesRespuestasFactory);

    /**
     * Factory de encuestas.
     * @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
     * @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
     * @returns {Object} Objeto con los metodos del factory.
     */
    function RespaldoAplicacionesRespuestasFactory($http, $q) {
        var factory = {
            store: store,
            update: update,
            getByAplicacionId: getByAplicacionId,
            removeByAplicacionId: removeByAplicacionId
        };

        return factory;

        /**
         * Guarda las respuestas de cada aplicacion como un respaldo
         * @param {object} data. Respuestas de aplicacion.
         * @returns {string} Resultado del almacenamiento.
         */
        function store(data) {
            var defered = $q.defer();

            $http({
                method: 'POST',
                url: 'api/respaldo-aplicaciones-respuestas/store',
                data: data
            })
                .success(function(response) {
                    defered.resolve(response);
                    //console.log('response');

                })
                .error(function(err) {
                    defered.reject(err);
                    //console.log(data);
                });

            return defered.promise;
        }

        function update(data) {
            var defered = $q.defer();

            $http({
                method: 'POST',
                url: 'api/respaldo-aplicaciones-respuestas/update',
                data: data
            })
                .success(function(response) {
                    defered.resolve(response);
                    //console.log('response');

                })
                .error(function(err) {
                    defered.reject(err);
                    //console.log(data);
                });

            return defered.promise;
        }

        function getByAplicacionId(aplicacion_id) {
            var defered = $q.defer();

            $http({
                method: 'GET',
                url: 'api/respaldo-aplicaciones-respuestas/get/' + aplicacion_id
            })
                .success(function(response) {
                    defered.resolve(response);
                })
                .error(function(err) {
                    defered.reject(err);
                });

            return defered.promise;
        }

        function removeByAplicacionId(aplicacion_id) {
            var defered = $q.defer();

            $http({
                method: 'DELETE',
                url: 'api/respaldo-aplicaciones-respuestas/remove/' + aplicacion_id
            })
                .success(function(response) {
                    defered.resolve(response);
                })
                .error(function(err) {
                    defered.reject(err);
                });

            return defered.promise;
        }
    }
})();
