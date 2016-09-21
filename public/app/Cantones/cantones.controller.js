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
        .controller('CantonesController', CantonesController);

    function CantonesController($scope, $timeout, $mdDialog,  CantonesFactory) {

        $scope.registro = false;

        $scope.guardarCanton = guardarCanton;
        $scope.eliminarCanton = eliminarCanton;
        $scope.editarCanton = editarCanton;
        $scope.editandoCanton = editandoCanton;
        $scope.cancelEdit = cancelEdit;

        function mostrarMensaje(titulo, texto, boton){
            var alert = $mdDialog.alert({
                title: titulo,
                textContent: texto,
                ok: boton
            });

            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        }

        function ocultarMensaje(milisegundos) {
            $timeout(function() {
                $scope.registro = false;
            }, milisegundos);
        }

        /*
        * Obtener la lista de territorios almacenados en la base de datos y asignarla a la lista d eterritorios del scope.
        */
        function getCantones () {
            $scope.cantones = false;

            CantonesFactory.getAll()
                .then(function (response) {
                    $scope.cantones = response;
            })
                .catch(function(err) {
                    $scope.cantones = true;
                    $scope.errorConn = true;
                });
        }
        getCantones();
        
        function guardarCanton(nombre) {
            var canton = {
                nombre : nombre
            };
            CantonesFactory.store(canton)
                .then(function(response) {
                    if(response === 'true') {
                        $scope.registro = true;
                        $scope.msgRegistro = 'El cantón se ha agregado correctamente';
                        $scope.styleRegistro = 'success-box';
                        ocultarMensaje(6000);
                        getCantones();
                    } else {
                        $scope.registro = true;
                        $scope.msgRegistro = 'Error al guardar el cantón';
                        $scope.styleRegistro = 'error-box';
                        ocultarMensaje(6000);
                        getCantones();
                    }
                });
        }

        function eliminarCanton(ev, idCanton) {
            var confirm = $mdDialog.confirm('?')
                .title('¿Esta seguro que desea eliminar el cantón?')
                .textContent('El cantón va a ser eliminado')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
                    CantonesFactory.destroy(idCanton)
                        .then(function(response) {
                            if(response === 'true') {
                                mostrarMensaje("Exito al eliminar el cantón","El cantón se ha eliminado","Continuar");
                                getCantones();
                            } else {
                                mostrarMensaje("Error al eliminar el cantón","Ocurrion un error al eliminar el cantón","Continuar");
                                getCantones();
                            }
                        });
                }, function() {});
        }

        function editandoCanton(canton) {
            $scope.canton = canton;
        }

        function editarCanton(canton) {
            CantonesFactory.update(canton)
                .then(function(response) {
                    if(response === 'true') {
                        $scope.registro = true;
                        $scope.msgRegistro = 'El cantón se ha modificado correctamente';
                        $scope.styleRegistro = 'success-box';
                        ocultarMensaje(6000);
                        getCantones();
                    } else {
                        $scope.registro = true;
                        $scope.msgRegistro = 'Error al modificar el cantón';
                        $scope.styleRegistro = 'error-box';
                        ocultarMensaje(6000);
                        getCantones();
                    }
                });
        }

        function cancelEdit () {
            getCantones();
        }
    }
})();