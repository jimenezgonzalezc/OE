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
        .controller('PreguntasController', PreguntasController);

    function PreguntasController($scope, $timeout, PreguntasFactory, IndicadoresFactory, $mdDialog) {
        $scope.store = store;
        var indicadores = '';
        $scope.indicadores = indicadores;
        $scope.editandoPregunta = editandoPregunta;
        $scope.modificar = modificar;
        $scope.eliminar = eliminar;
        $scope.getPreguntas = getPreguntas;
        $scope.guardarEncuesta = guardarEncuesta;

        $scope.registro = false;

        function cleanForm() {
            $scope.formPregunta.$setUntouched();
            $scope.formEditarPregunta.$setUntouched();
        }

        function setData() {
            $scope.enunciado = '';
            $scope.tipo = 'false';
            $scope.indicador_id = 1;
        }
        setData();

        function guardarEncuesta() {
            if ($scope.enunciado !== ""){
                store();
            }
        }
        function store() {
            
            var data = {
                enunciado: $scope.enunciado,
                tipo: $scope.tipo,
                indicador_id: $scope.selectedIndicador.id
            };

            PreguntasFactory.store(data)
                .then(function(response) {
                    if(response === 'true') {
                        $scope.registro = true;
                        $scope.msgRegistro = 'La pregunta se ha agregado correctamente.';
                        $scope.styleRegistro = 'success-box';
                        setData();
                        $scope.preguntas = "";
                        getPreguntas();
                        cleanForm();

                        $timeout(function() {
                            $scope.registro = false;
                        }, 5000);
                    }
                    else {
                        $scope.registro = true;
                        $scope.msgRegistro = 'Ha ocurrido un error al guardar la pregunta';
                        $scope.styleRegistro = 'error-box';
                    }
                });
        }

        function editandoPregunta(pregunta) {
            $scope.id = pregunta.id;
            $scope.enunciado = pregunta.enunciado;
            $scope.editar = false;     
            $scope.tipo = pregunta.tipo;       
            if (pregunta.tipo === 't') {
                $scope.tipo = "true";
            }
            else {
                $scope.tipo = "false";
            }

            $scope.indicadores.forEach((indicador) => {
                if (indicador.nombre === pregunta.indicador_id) {
                    $scope.selectedIndicador = indicador;
                }
            });

            console.log(pregunta);
        }

        function getTipo(tipo){
            if (tipo === "true")
                return 't';
            else if (tipo === "false")
                return 'f';
            else
                return tipo;
        }

        function modificar() {
            var data = {
                id: $scope.id,
                enunciado: $scope.enunciado,
                tipo: getTipo($scope.tipo),
                indicador_id: $scope.selectedIndicador.id
            };

            PreguntasFactory.edit(data)
                .then(function(response) {
                    if(response === 'true') {
                        $scope.msgEditar = 'La pregunta se ha modificado correctamente.';
                        $scope.styleEditar = 'success-box';
                        getPreguntas();
                        cleanForm();
                    }
                    else {
                        $scope.msgEditar = 'Ha ocurrido un error al modificar la pregunta.';
                        $scope.styleEditar = 'error-box';
                    }

                    $scope.editar = true;
                });
        }

        //Elimina pregunta
        function eliminar(ev, id) {
            var confirm = $mdDialog.confirm('?')
                .title('¿Esta seguro que desea eliminar esta pregunta?')
                .textContent('La pregunta se eliminará de todo el sistema.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
                    PreguntasFactory.destroy(id)
                        .then(function(response) {
                            getPreguntas();
                        });
                }, function() {});
        }

        function getIndicadores() {
            IndicadoresFactory.getAll()
                .then(function(response) {
                    $scope.indicadores = response;
                    indicadores = response;
                    $scope.selectedIndicador = $scope.indicadores[0];
                });
        }
        getIndicadores();

        function getPreguntas() {
            $scope.preguntas = false;

            PreguntasFactory.getAll()
                .then(function(response) {
                    $scope.preguntas = response;
                    setNombreIndicador();
                })
                .catch(function(err) {
                    $scope.preguntas = true;
                    $scope.errorConn = true;
                });
        }

        getPreguntas();

        function setNombreIndicador() {
            if ($scope.preguntas.length>0){
                for (var i=0; i<$scope.preguntas.length; i++){
                    $scope.preguntas[i].indicador_id = $scope.indicadores[$scope.preguntas[i].indicador_id - 1].nombre;
                    if ($scope.preguntas[i].tipo === 't') {
                        $scope.preguntas[i].tipo = "Abierta";
                    }
                    else {
                        $scope.preguntas[i].tipo = "Cerrada";
                    }
                }
            }
        }
    }

})();