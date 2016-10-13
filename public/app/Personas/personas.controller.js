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
        .controller('PersonasController', PersonasController);

    function PersonasController($scope, $http, $timeout, PersonasFactory, $mdDialog, SectoresFactory, PersonasSectoresFactory, RegionesFactory, TerritoriosFactory) {
        $scope.nueva = false;
        $scope.texto = 'Mostrar formulario de agregar nueva persona';
        $scope.registro = false;
        $scope.store = store;
        $scope.mostrarFormulario = mostrarFormulario;
        $scope.modificar = modificar;
        $scope.eliminar = eliminar;
        $scope.getPersonas = getPersonas;
        $scope.editandoPersona = editandoPersona;
        $scope.validateEmail = validateEmail;
        $scope.validateID = validateID;
        $scope.cancelEdit = cancelEdit;
        $scope.update = update;
        //vars
        $scope.territorios = [];

        $scope.selectedRegion = false;

        var currentEmail = "",
        currentCedula = "",
        todosTerritorios = [];        

        /**
        * Recolectar los arreglos de territorios y regiones para mostrar en la interfaz     
        */
        function collectData(){
            RegionesFactory.getAll()
                .then( function (response) {
                    if(response.length > 0){
                        $scope.regiones = response;
                        $scope.selectedRegion = response[0];                        
                    }
                });
                TerritoriosFactory.getAll()
                    .then(function (response) {                 
                            todosTerritorios = response;                                                                                    
                            update();
                    })
        }
        collectData();

        /**
        * Filtrar los select de acuerdo a la región seleccionada para la lista de territorios de 
        * registro
        */
        function update () {            
            $scope.territorios = [];                    
            todosTerritorios.forEach( function(territorio) {                                
                if(territorio.region_id === $scope.selectedRegion.id){                  
                    $scope.territorios.push(territorio);
                }
            });          
            if($scope.territorios.length > 0){
                $scope.selectedTerritorio = $scope.territorios[0];
            }
        }

        /**
         * Inicializar los valores del objeto persona
         */
        function setData() {
            $scope.persona = {
                cedula: '',
                nombre: '',
                apellido1: '',
                apellido2: '',
                email: '',
                contrasena: '',
                contrasenaConf: '',
                tipo: 'A'
            }            
        }
        setData();

        $scope.$watch('persona.contrasenaConf', validatecontrasena);
        $scope.$watch('persona.contrasenaConf', validate);
        $scope.$watch('persona.contrasena', validate);
        $scope.$watch('persona.nombre', validate);
        $scope.$watch('persona.apellido1', validate);
        $scope.$watch('persona.apellido2', validate);
        $scope.$watch('persona.email', validate);
        $scope.$watch('persona.cedula', validate);

        /**
         * Verificar la coincidencia de contraseña y confimación de contraseña
         */
        function validatecontrasena() {
            $scope.errorcontrasena = false;
            if ($scope.persona.contrasena !== $scope.persona.contrasenaConf) {
                $scope.errorcontrasena = true;
            } else {
                $scope.errorcontrasena = false;
            }
        }

        /**
         *Valida que los campos no sean vacios
         */
        function validate() {         
            $scope.emptyData = false;            
            try {                                                        
                if ($scope.persona.nombre === undefined || $scope.persona.contrasena === undefined || $scope.persona.apellido1 === undefined || $scope.persona.apellido2 === undefined || $scope.persona.cedula  === undefined || $scope.persona.email  === undefined
                    || $scope.persona.nombre.length === 0 || $scope.persona.apellido1.length === 0 || $scope.persona.apellido2.length === 0 || $scope.persona.cedula.length === 0 || $scope.persona.email.length === 0) {                                        
                    $scope.emptyData = true;
                } else {
                    $scope.emptyData = false;
                }
            } catch (e) {

            }            
        }

        function validateEdit() {               
            $scope.emptyData = false;            
            try {                                                        
                if ($scope.persona.nombre === undefined || $scope.persona.apellido1 === undefined || $scope.persona.apellido2 === undefined || $scope.persona.cedula  === undefined || $scope.persona.email  === undefined
                    || $scope.persona.nombre.length === 0 || $scope.persona.apellido1.length === 0 || $scope.persona.apellido2.length === 0 || $scope.persona.cedula.length === 0 || $scope.persona.email.length === 0) {                                        
                    $scope.emptyData = true;
                } else {
                    $scope.emptyData = false;
                }
            } catch (e) {

            }            
        }
        /**
         * Almacenar un objeto persona en la base de datos, verifica si la persona existe por su cedula
         * si no existe entonces la almacena
         */
        function store() {
            $scope.registro = false;
            validateEdit();
            $scope.persona.territorio_id = $scope.selectedTerritorio.id;
            if ($scope.emptyData !== true && !$scope.errorcontrasena && !$scope.errorCorreo && !$scope.coincidenciaCedula) {
                PersonasFactory.store($scope.persona)
                    .then(function(response) {
                        if (response === 'true') {
                            PersonasFactory.ifExist($scope.persona.cedula,"cedula")
                            .then(function (insertedPerson) {
                                console.log(insertedPerson);
                                PersonasSectoresFactory.store(insertedPerson.id,$scope.selectedSector.id);
                                $scope.registro = true;
                                $scope.msgRegistro = 'La persona se ha agregado correctamente.';
                                $scope.styleRegistro = 'success-box';
                                $scope.descripcion = '';

                                $timeout(function() {
                                    $scope.registro = false;
                                }, 5000);
                                getPersonas();
                                setData();
                                getSectores();
                            });                            
                        } else {
                            $scope.registro = true;
                            $scope.msgRegistro = 'Error, el email ya se encuentra registrado.';
                            $scope.styleRegistro = 'error-box';
                        }
                    });
            }else{
                $scope.registro = true;
                $scope.msgRegistro = 'Error. Existen errores en el formulario.';
                $scope.styleRegistro = 'error-box';
            }
        }

        /**
         * obtener los sectores de la persona, para mostrar los seleccionados en la vista
         * @param{int} id de la persona que se debe buscar para editar
         */
        function editandoPersona(persona) {
            $scope.persona = persona;     

            $scope.nueva = false;
            currentEmail = $scope.persona.email;     
            currentCedula = $scope.persona.cedula;

            //seleccionar el territorio de la persona
            $scope.territorios.forEach(function (territorio) {
                if(territorio.id === persona.territorio_id){
                    $scope.selectedTerritorio = territorio;
                }
            });

            $scope.editar = false;
            PersonasSectoresFactory.getByPersonId(persona.id)
            .then(function (sectoresDePersona) {
                return sectoresDePersona;                     
            })
            .then(function (sectoresDePersona) {
                var sectores = [];
                // $scope.sectores.forEach( function(sector) {
                //     sectores.push({id:sector.id, nombre: sector.nombre});
                // });
                
                $scope.sectores.forEach( function(sector) {

                    if(sectoresDePersona[0].sector_id === sector.id){
                        $scope.selectedSector = sector;
                    }
                });
            });

        }
        function cancelEdit(){
            getPersonas();
            setData();
        }

        //validar cedula existente
        function validateID() {  
            $scope.coincidenciaCedula = false;
             if(isNaN($scope.persona.cedula)) {
                $scope.coincidenciaCedula = true;
                $scope.msgCedula = "La cédula tiene un formato incorrecto, sólo debe contener números."
            }
            else if($scope.persona.cedula != currentCedula){
                $scope.msgCedula = "";                                            
                PersonasFactory.ifExist($scope.persona.cedula,"cedula")
                    .then(function(response) {
                        if (response !== undefined) {
                            $scope.coincidenciaCedula = true;
                            $scope.msgCedula = "El número de cédula ya está registrado.";
                        }
                        else {
                            $scope.coincidenciaCedula = false;
                        }
                    });
            }
        }

        //validar email existente
        function validateEmail() {   
            $scope.errorCorreo = false;

            if ($scope.persona.email !== currentEmail) {
                if(!/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test($scope.persona.email)) {
                    $scope.errorCorreo = true;
                    $scope.msgCorreo = 'El email tiene un formato inválido.';
                }
                else {
                    PersonasFactory.ifExist($scope.persona.email,"email")
                        .then(function(response) {
                            if (response !== undefined) {
                                $scope.msgCorreo = 'Error, el correo ya existe.';
                                $scope.errorCorreo = true;
                            }
                        });
                }
            }
        }

        function mostrarFormulario() {            
            $scope.nueva = !$scope.nueva;
            setData();

            if ($scope.nueva) {
                $scope.texto = 'Ocultar formulario de agregar nueva persona';
            } else {
                $scope.texto = 'Mostrar formulario de agregar nueva persona';
            }
        }

        /**
         * Modificar los datos de la persona
         * @param{Object} Objeto persona con los nuevos datos
         */
        function modificar(persona) {       
            validate();
            var sectores = []; //lista de sectores a enviar para guardar


            if ($scope.emptyData !== true) {
                persona.territorio_id = $scope.selectedTerritorio.id;   
                PersonasFactory.edit(persona)
                    .then(function(response) {
                        if (response === 'true') {
                            PersonasSectoresFactory.edit(persona.id, $scope.selectedSector.id)
                                .then(function (response) {
                                    console.log(response);
                                    if(response === 'true'){
                                        $scope.editar = true;
                                        $scope.msgEditar = 'La persona se ha modificado correctamente.';
                                        $scope.styleEditar = 'success-box';                                        
                                        setData();   
                                        getPersonas();  
                                    }
                                    else{
                                        $scope.editar = true;
                                        $scope.msgEditar = 'Ha ocurrido un error al modificar los sectores de la persona';
                                        $scope.styleEditar = 'error-box';            
                                    }
                                });
                                /// fin de validar largo de sectores                                                
                        } else {
                            $scope.editar = true;
                            $scope.msgEditar = 'Ha ocurrido un error al modificar la persona.';
                            $scope.styleEditar = 'error-box';
                        }
                    });
            }
            else{
                $scope.editar = true;
                $scope.msgEditar = 'Error. Existen errores en el formulario.';
                $scope.styleEditar = 'error-box';
            }                                        
        }

        /**
         * Elimina la persona dado el id
         * @param{int} id de la persona a eliminar
         */
        function eliminar(ev, id) {
            var confirm = $mdDialog.confirm()
                .title('¿Desea eliminar la persona?')
                .textContent('Si la elimina, se eliminará de todo el sistema.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
                    PersonasFactory.remove(id)
                        .then(function(response) {
                            getPersonas();
                        });
                }, function() {});
        }


        function getPersonas() {       
            $scope.errorConn = false;

            PersonasFactory.getAll()
                .then(function(response) {
                    $scope.personas = response;
                })
                .catch(function(err) {
                    $scope.personas = true;
                    $scope.errorConn = true;
                });
        }

        function getSectores() {
            SectoresFactory.getAll()
                .then(function(response) {
                    $scope.sectores = response;
                    $scope.selectedSector = $scope.sectores[0];
                });               
        }

        function getRegiones() {
            RegionesFactory.getAll()
                .then(function(response) {
                    $scope.regiones = response;
                });               
        }
        function getTerritorios() {
            TerritoriosFactory.getAll()
                .then(function(response) {
                    $scope.territorios = response;                       

                });               
        }

        getSectores();
        getPersonas();        
    }

})();