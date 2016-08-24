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
        .controller('SectoresController', SectoresController);

    function SectoresController($scope, $timeout, SectoresFactory, RegionesFactory, TerritoriosFactory, filterFilter, TerritoriosSectoresFactory,$mdDialog) {    	
    	//functions
    	$scope.store = store;
    	$scope.eliminar = eliminar;
    	$scope.update = update;
        $scope.updateEdit = updateEdit;
        $scope.cancelEdit = cancelEdit;
    	$scope.editandoSector = editandoSector;
    	$scope.modificar = modificar;
        $scope.selectTerritorio = selectTerritorio;
        $scope.selectTerritorioEdit = selectTerritorioEdit;
        $scope.guardarSector = guardarSector;

        //vars
    	$scope.territorios = [];
    	$scope.regiones = [];
    	var todosTerritorios,
    		viejoTerritorio,
            selectedTerritorios = [],
            selectedTerritoriosEditar = [];//sectores que se editan;


    	$scope.$watch('sector.nombre', validate);
    	$scope.$watch('sector.descripcion', validate);
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

        function selectTerritorio(id){                    
            if(!selectedTerritorios.length){
                selectedTerritorios.push(id);
            }
            else{                
                var index = selectedTerritorios.indexOf(id);
                if(index > -1){
                    selectedTerritorios.splice(index, 1);
                }
                else{
                    selectedTerritorios.push(id);
                }
            }  
        }

        function selectTerritorioEdit(territorio){                                          
            var index = selectedTerritoriosEditar.indexOf(territorio);            
            if(index > -1){                                    
                if( selectedTerritoriosEditar[index].state === true){
                    selectedTerritoriosEditar[index].state = false;
                }else{
                    selectedTerritoriosEditar[index].state = true;                       
                }                
            }                                   
            $scope.selectedTerritoriosEditar = selectedTerritoriosEditar;
        }
    	
    	/**
		* Filtrar los select de acuerdo a la región seleccionada para la lista de territorios de 
        * registro
		*/
    	function update () {            
			$scope.territorios = [];	
            selectedTerritorios = [];            
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
        * Filtrar los select de acuerdo a la región seleccionada para la lista de territorios de 
        * registro cuando se va a editar
        */
        function updateEdit () {
            $scope.territorios = [];    
            $scope.territoriosEditar = [];

            selectedTerritorios = [];
            selectedTerritoriosEditar = [];            
            $scope.territoriosEditar = [];

            
            todosTerritorios.forEach( function(territorio) {                                                                        
                if(territorio.region_id === $scope.selectedRegion.id){  
                    //territorio.state = false;                
                    $scope.territoriosEditar.push(territorio);
                    selectedTerritoriosEditar.push(territorio);
                }
            });          
            if($scope.territorios.length > 0){
                $scope.territoriosEditar = $scope.territorios[0];
                selectedTerritoriosEditar = $scope.territorios[0];
            }
        }

		collectData();		

        function setData () {
	    	$scope.sector = {
	    		nombre: "",
	    		descripcion: "",
	    		region_id: "",
	    	}
        }		
        setData();


        function cancelEdit(){
            collectData();
            setData();
            getSectores();
        }	

        /*
		* Obtiene la lista de sectores registrados
        */
        function getSectores() {
            $scope.sectores = false;

            SectoresFactory.getAll()
                .then(function(response) {                	
                    $scope.sectores = response;
                })
                .catch(function(err) {
                    $scope.sectores = true;
                    $scope.errorConn = true;
                });               
        }
        getSectores();

        /*
		* Valida que no existan espacion en blanco
        */
        function validate () {
        	$scope.emptyData = false;        
        	
        	if ($scope.sector.nombre === undefined || $scope.sector.descripcion === undefined || $scope.sector.nombre.length === 0 || $scope.sector.descripcion.length === 0 ) {                                                	        			
                $scope.emptyData = true;            	
            }
            else{
              	$scope.emptyData = false;
            }
        }

        /*
		* Preparar los datos para la vista de editar
        */
        function editandoSector (sector) {
        	$scope.sector = sector;                
        	viejoTerritorio = $scope.selectedTerritorio.id;    	        	
        	                       
            // obtener los territorios del sector, para mostrar los seleccionados
            // en la vista
            TerritoriosSectoresFactory.getBySectorId(sector.id)
                .then(function (territoriosDeSector) {
                    return territoriosDeSector;                     
                })
                    .then(function (territoriosDeSector) {    
                        var territorios = [];
                        //todos los territorios en la base de datos
                        // crea un arreglo con los objetos, para poder mostrar la información como la vista lo requiere
                        todosTerritorios.forEach( function(territorio) {                    
                            territorios.push({id:territorio.id, nombre: territorio.nombre, descripcion: territorio.descripcion, region_id: territorio.region_id});
                        });            
                        //verifica a que territorio(os) pertenece el sector y lo marca, para mostrarlo en la interfaz
                        territorios.forEach( function(territorio) {
                           territorio.state = false;                   
                           territoriosDeSector.forEach( function(element) {                        
                                if(element.territorio_id === territorio.id){
                                    territorio.state = true;
                                }
                            });                   
                        });                                 
                                                    
                        //segun el territorio marcar también la región a la que pertenece el mismo
                        territorios.forEach( function(territorio, index) {
                            $scope.regiones.forEach( function(region, index) {                        
                                if(territorio.state === true && territorio.region_id === region.id){
                                    $scope.selectedRegion = region;
                                }                        
                            });
                            
                        });

                        // filtrar unicamente los territorios que pertenecen a la región seleccionad. Esto para la primera vez que se muestran 
                        var territoriosAux = [];
                        territorios.forEach( function(element, index) {
                            if(element.region_id === $scope.selectedRegion.id){
                                territoriosAux.push(element);
                            }
                        });


                        selectedTerritoriosEditar = territorios;           
                        $scope.territoriosEditar = territoriosAux;//lista de territorios para editar              
                    });

        }

        /*
        * Modificar el sector y la relación en la base de datos,
        * primero guarda los cambios del sector y luego su relación con los territorios
        * utiliza un arreglo con los ids de los territorios seleccionados y los envía a insertar,
        */
        function modificar(sector){    
            var territorios = []; //lista de sectores a enviar para guardar
            selectedTerritoriosEditar.forEach( function(territorio) {
                if(territorio.state === true){
                    territorios.push(territorio.id);
                }
            });

			$scope.sector.region_id = $scope.selectedRegion.id;//asignar la region seleccionada
			if ($scope.emptyData !== true && territorios.length > 0) {   
                SectoresFactory.update(sector)
                    .then(function(response) {
                        if (response === 'true') {
                            TerritoriosSectoresFactory.update(sector.id, territorios)
                                .then(function (response) {
                                    if(response === 'true'){                                        
                                        selectedTerritoriosEditar.forEach( function(territorio) {
                                            territorio.state = false;                                             
                                        });
                                        //notificar
                                        $scope.editar = true;
                                        $scope.msgEditar = 'El sector se ha modificado correctamente.';
                                        $scope.styleEditar = 'success-box'; 
                                        $timeout(function() {
                                            $scope.editar = false;
                                        }, 5000);  

                                        //refrescar                                     
                                        setData();   
                                        getSectores();  
                                    }
                                    else{
                                        $scope.editar = true;
                                        $scope.msgEditar = 'Ha ocurrido un error al modificar los territorios del sector';
                                        $scope.styleEditar = 'error-box';            
                                    }
                                });
                                /// fin de validar largo de sectores                                                
                        } else {
                            $scope.editar = true;
                            $scope.msgEditar = 'Ha ocurrido un error al modificar el sector.';
                            $scope.styleEditar = 'error-box';
                        }
                    });
            }
            else{
                $scope.editar = true;
                $scope.msgEditar = 'Error, debe seleccionar al menos un territorio.';
                $scope.styleEditar = 'error-box';
            }
        }

        function guardarSector() {
            if(!$scope.emptyData){
                store();
            }
        }

        function store() {            
            $scope.registro = false;            
            if ($scope.emptyData !== true && selectedTerritorios.length > 0) {
                SectoresFactory.store($scope.sector)
                    .then(function(response) {                        
                        TerritoriosSectoresFactory.store(response,selectedTerritorios).then(function (response) {
                        });
                        $scope.registro = true;
                        $scope.msgRegistro = 'El sector se ha agregado correctamente.';
                        $scope.styleRegistro = 'success-box';
                        $scope.descripcion = '';

                        $timeout(function() {
                            $scope.registro = false;
                        }, 5000);

                        collectData();
                        setData();
                        getSectores();                        
                        update(); 
                    });
            }else{
                $scope.registro = true;
                $scope.msgRegistro = 'Error. Existen errores en el formulario.';
                $scope.styleRegistro = 'error-box';
            }
        }

		function eliminar(ev, id) {
	        var confirm = $mdDialog.confirm()
	            .title('¿Desea eliminar el sector?')
	            .textContent('Si lo elimina, se eliminará de todo el sistema.')
	            .ariaLabel('Lucky day')
	            .targetEvent(ev)
	            .ok('Sí')
	            .cancel('No');

	        $mdDialog.show(confirm)
	            .then(function() {
	                SectoresFactory.destroy(id)
	                    .then(function(response) {
	                        getSectores();
	                    });
	            }, function() {});
        }                
    }
})();