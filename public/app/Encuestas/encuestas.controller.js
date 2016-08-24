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
		.controller('EncuestasController', EncuestasController);

    /**
    * Controlador del administrador.
    * @param {Object} Servicio que permite la unión entre el HTML y el controlador.
    * @param {Object} Promesa que resolverá cierto trozo de código cuando determinado tiempo ha pasado.
    * @param {Object} Servicio que da formato a los datos que se muestran al usuario.
    * @param {Object} Proporciona acceso de lectura/escritura a las cookies de navegador.
    * @param {Object} Servicio utilizado para mostrar ventanas de confirmación.
    * @param {Object} Servicio que brinda funciones de las encuestas que ayudan a la funcionalidad del controlador.
    * @param {Object} Servicio que brinda funciones de las preguntas que ayudan a la funcionalidad del controlador.
    * @param {Object} Servicio que brinda funciones de las personas que ayudan a la funcionalidad del controlador.
    * @param {Object} Servicio que brinda funciones de las aplicaciones que ayudan a la funcionalidad del controlador.
    * @param {Object} Servicio que brinda funciones de los periodos que ayudan a la funcionalidad del controlador.
    */
	function EncuestasController($scope, $timeout, $filter, $cookies, $mdDialog, EncuestasFactory, PreguntasFactory, PersonasFactory, AplicacionesFactory, PeriodosFactory, SectoresFactory) {
		$scope.descripcion = '';
		$scope.nueva = false;
		$scope.registro = false;
        $scope.agregar = agregar;
        $scope.guardarEncuesta = guardarEncuesta;
        $scope.modificar = modificar;
        $scope.destroy = destroy;
        $scope.editandoEncuesta = editandoEncuesta;
        $scope.cambiarEstado = cambiarEstado;
        $scope.armandoEncuesta = armandoEncuesta;
        $scope.armar = armar;
        $scope.creandoAplicacion = creandoAplicacion;
        $scope.crearAplicacion = crearAplicacion;
        $scope.marcarTodos = marcarTodos;
        var respaldoPreguntas,
            respaldoEmpresarios,
            respaldoEncuestadores;

        /**
        * Limpia el formulario del cambio de contraseña.
        */
        function cleanForm() {
            $scope.formEncuesta.$setUntouched();
            $scope.formEditarEncuesta.$setUntouched();
        }

        function guardarEncuesta() {
            if ($scope.descripcion !== "")
                agregar();
        }
        
        /**
        * Agrega una encuesta.
        */
        function agregar() {

        	var fechaActual = $filter('date')(new Date(), 'yyyy-MM-dd'),
        	    encuesta = {
                    descripcion: $scope.descripcion,
                    estado: false,
                    fechaCreacion: fechaActual,
                    fechaModificacion: fechaActual,
                    persona_id: $cookies.getObject('session').id,
                    sector_id: $scope.selectedSector.id
        	};

        	EncuestasFactory.store(encuesta)
        	.then(function(response) {
        		if(response === 'true') {
                    getAll();
                    $scope.registro = true;
                    $scope.msgRegistro = 'La encuesta se ha agregado correctamente.';
                    $scope.styleRegistro = 'success-box';
                    $scope.descripcion = '';
                    cleanForm();                   

                    $timeout(function() {
                        $scope.registro = false;
                    }, 5000);
                }
                else {
                    $scope.registro = true;
                    $scope.msgRegistro = 'Ha ocurrido un error al agregar la encuesta.';
                    $scope.styleRegistro = 'error-box';
                }
        	});
        }

        /**
        * Modifica una encuesta.
        */
        function modificar() {
		    EncuestasFactory.edit($scope.id, $scope.descripcionEditar, $filter('date')(new Date(), 'yyyy-MM-dd'))
            .then(function(response) {
                if(response === 'true') {
                    getAll();
                    cleanForm();
                    $scope.editar = true;
                    $scope.msgEditar = 'La encuesta se ha modificado correctamente.';
                    $scope.styleEditar = 'success-box';
                }
                else {
                    $scope.editar = true;
                    $scope.msgEditar = 'Ha ocurrido un error al modificar la encuesta.';
                    $scope.styleEditar = 'error-box';
                }
            });
        }

        /**
        * Elimina una encuesta.
        * @param {Object} Objeto utilizado por la ventana de confirmación.
        * @param {integer} Id de la encuesta.
        */
        function destroy(ev, id) {
            var confirm = $mdDialog.confirm()
            .title('¿Desea eliminar la encuesta?')
            .textContent('Si la elimina, se eliminará de todo el sistema.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Sí')
            .cancel('No');
            
            $mdDialog.show(confirm)
            .then(function() {
                EncuestasFactory.destroy(id)
                .then(function(response) {
                    if(response === 'true') {
                        getAll();
                    }
                    else {
                        
                    }
                });
            }, function() {});
        }

        /**
        * Prepara la información de la encuesta que se va a editar.
        * @param {integer} Id de la encuesta que se va a editar.
        * @param {string} Descripción de la encuesta.
        */
        function editandoEncuesta(id, descripcion) {
            $scope.editar = false;
            $scope.descripcionEditar = descripcion;
            $scope.id = id;
        }

        /**
        * Prepara las preguntas que van a poder ser agregadas o eliminadas de una encuesta.
        * @param {integer} Id de la encuesta.
        */
        function armandoEncuesta(id) {
            $scope.armarOk = false;
            $scope.id = id;
            $scope.preguntas = {
                "banco": [],
                "preguntas": []
            };

            EncuestasFactory.getQuestions(id)
            .then(function(response) {
                respaldoPreguntas = [];
                $scope.preguntas.banco = response;
                
                angular.forEach(response, function(question) {
                    respaldoPreguntas.push(question);
                });
            })
            .then(function() {
                PreguntasFactory.getAll()
                .then(function(response) {
                    $scope.preguntas.preguntas = response;
                })
                .then(function() {
                    $scope.preguntas = EncuestasFactory.removeQuestions($scope.preguntas);
                });
            });
        }

        /**
        * Cambia el estado de una encuesta.
        * @param {Object} La encuesta.
        */
        function cambiarEstado(encuesta) {
            EncuestasFactory.changeState(encuesta.id, 1 - encuesta.estado)
            .then(function(response) {
                encuesta.estado = 1 - encuesta.estado;
            });
        }

        /**
        * Agrega preguntas a una encuesta.
        * @param {Array} Lista de preguntas.
        * @returns {string} Resultado de agregar las preguntas.
        */
        function agregarPreguntas(questions) {
            if(questions.length) {
                EncuestasFactory.addQuestionsToSurvey($scope.id, questions)
                .then(function(response) {
                    return response;
                });
            }

            return 'true';
        }

        /**
        * Elimina preguntas de una encuesta.
        * @param {Array} Lista de preguntas.
        * @returns {string} Resultado de eliminar las preguntas.
        */
        function eliminarPreguntas(questions) {
            if(questions.length) {
                EncuestasFactory.deleteQuestionsToSurvey(questions)
                .then(function(response) {
                    return response;
                });
            }

            return 'true';
        }

        /**
        * Es el encargado de mandar a agregar y eliminar preguntas de una encuesta.
        */
        function armar() {
            var questionsList = EncuestasFactory.questionsChanged(respaldoPreguntas, $scope.preguntas.banco);

            if(agregarPreguntas(questionsList.agregar) === 'true' && eliminarPreguntas(questionsList.eliminar) === 'true') {
                $scope.msgArmar = 'La encuesta se ha armado correctamente.';
                $scope.styleArmar = 'success-box';
            }
            else {
                $scope.msgArmar = 'Ha ocurrido un error al armar la encuesta.';
                $scope.styleArmar = 'error-box';   
            }

            $scope.armarOk = true;
        }

        /**
        * Obtiene todas las encuestas.
        */
        function getAll() {
            $scope.errorConn = false;

        	EncuestasFactory.getAll()
        	.then(function(response) {
        		$scope.encuestas = response;
        	})
            .catch(function(err) {
                $scope.encuestas = true;
                $scope.errorConn = true;
            });
        }

        getAll();

        /**
        * Prepara la asignación de aplicaciones a una encuesta.
        * @param {integer} Id de la encuestas.
        */
        function creandoAplicacion(id) {
            $scope.asignar = false;
            $scope.id = id;

            // Se obtienen todos los empresarios.
            PersonasFactory.getByType('B')
            .then(function(response) {
                return response;
            })
            .then(function(allEntrepreneurs) {
                // Se obtienen los empresarios que están asociados a la encuesta.
                AplicacionesFactory.getForSurvey($scope.id)
                .then(function(entrepreneursSurvey) {
                    respaldoEmpresarios = [];
                    $scope.empresarios = EncuestasFactory.isAssigned(entrepreneursSurvey, allEntrepreneurs);

                    angular.forEach($scope.empresarios, function(entrepreneur) {
                        respaldoEmpresarios.push({id: entrepreneur.id, state: entrepreneur.state});
                    });

                    return entrepreneursSurvey[0];
                })
                .then(function(aplicacion) {
                    // Se obtienen los periodos de la base de datos.
                    PeriodosFactory.getAll()
                    .then(function(response) {
                        response.forEach(function(periodo) {
                            periodo.label = 'Cuatrimestre ' + periodo.cuatrimestre +', ' + periodo.anio;
                        });
                        $scope.periodos = response;

                        if (aplicacion !== undefined) {
                            $scope.periodos.forEach(function(periodo) {
                                if (periodo.id === aplicacion.periodo_id) {
                                    $scope.selectedPeriodo = periodo;
                                }
                            });
                        }
                        else {
                            $scope.selectedPeriodo = $scope.periodos[0];
                        }
                    });
                });
            });
        }

        /**
        * Crea aplicaciones para los empresarios de una encuesta específica.
        * @param {Array} Lista de empresarios.
        * @returns {string} Resultado de crear las aplicaciones.
        */
        function asignarEmpresarios(empresarios) {
            if(empresarios.length) {
                AplicacionesFactory.store(empresarios, $scope.selectedPeriodo.id, $filter('date')(new Date(), 'yyyy-MM-dd'), $scope.id)
                .then(function(response) {
                    return response;
                });
            }

            return 'true';
        }

        /**
        * Elimina aplicaciones de una encuesta.
        * @param {Array} Lista de empresarios.
        * @returns {string} Resultado de eliminar las aplicaciones.
        */
        function desasignarEmpresarios(empresarios) {
            if(empresarios.length) {
                AplicacionesFactory.remove(empresarios)
                .then(function(response) {
                    return response;
                });
            }
            
            return 'true';
        }

        /**
        * Encargado de manda a crear y eliminar aplicaciones de una encuesta.
        */
        function crearAplicacion() {
            var listaEmpresarios = EncuestasFactory.personsChanged(respaldoEmpresarios, $scope.empresarios);
            
            if (asignarEmpresarios(listaEmpresarios.agregar) === 'true' && desasignarEmpresarios(listaEmpresarios.eliminar)  === 'true') {
                $scope.msgAsignar = 'La asignación se ha realizado correctamente.';
                $scope.styleAsignar = 'success-box';
            }
            else {
                $scope.msgAsignar = 'Ha ocurrido un error al asignar.';
                $scope.styleAsignar = 'error-box';
            }

            $scope.asignar = true;
        }

        /**
        * Marca o desmarca todos los empresarios mostrados al momento de crear aplicaciones.
        */
        function marcarTodos() {
            var state = document.getElementById('bussMaster').checked;

            angular.forEach($scope.empresarios, function(empresario) {
                empresario.state = state;
            });
        }

        /**
         * Obtener los sectores y cargarlos en la interfaz(combobox)
         */
        function getSectores(){
            SectoresFactory.getAll()
                .then( function (response) {
                    if(response.length > 0){
                        $scope.sectores = response;
                        $scope.selectedSector = response[0];
                    }
                });
        }
        getSectores();
	}

})();