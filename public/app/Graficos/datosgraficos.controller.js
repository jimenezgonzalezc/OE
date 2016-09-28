(function() {
    'use strict';

    angular
        .module('observatoryApp')
        .controller('DatosGraficosController', DatosGraficosController);


    function DatosGraficosController($scope, DatosGraficosFactory) {
        $scope.getMes = getMes;
        $scope.getEvolucion = getEvolucion;
        $scope.selectEvolucion = selectEvolucion;
        $scope.ckcTipo = false;

        function getDatosGraficos () {
            $scope.cantones = false;

            DatosGraficosFactory.getParametros()
                .then(function (response) {
                    $scope.datosGraficos = response;
                })
                .catch(function(err) {
                    $scope.datosGraficos = true;
                    $scope.errorConn = true;
                });
        }
        getDatosGraficos();

        function selectEvolucion(periodo, tipo_evolucion) {
            console.log(periodo, tipo_evolucion);
            DatosGraficosFactory.getDatosGrafico(periodo, tipo_evolucion)
                .then(function (response) {
                    $scope.datos = response;
                })
                .catch(function(err) {
                    $scope.datos = true;
                    $scope.errorConn = true;
                });
            console.log($scope.ckcTipo);

        }

        function getMes(numMes) {
            var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
            return meses[numMes-1];
        }

        function getEvolucion(pos) {
            var evol = ["real","esperada"];
            return evol[pos-1];
        }
    }
})();