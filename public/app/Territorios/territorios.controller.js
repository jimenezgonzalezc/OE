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
        .controller('TerritoriosController', TerritoriosController);

    function TerritoriosController($scope, $timeout, $mdDialog,  TerritoriosFactory, RegionesFactory) {
    	$scope.store = store;
        $scope.eliminar = eliminar;
        $scope.editandoTerritorio = editandoTerritorio;
        $scope.cancelEdit = cancelEdit;
        $scope.modificar = modificar;
        $scope.guardarTerritorio = guardarTerritorio;
        $scope.getRegionesTerritorios =getRegionesTerritorios;


        //watch para validar datos
    $scope.$watch('territorio.nombre', validate);
    $scope.$watch('territorio.descripcion', validate);
  	/*
	  * Limpiar los datos de la territorio del scope
  	*/
  	function setData (argument) {
  		 $scope.territorio = {'nombre' : '', 'descripcion' : '', 'region': ''}
  	}
    setData();
  	
    /*
  	* Obtener la lista de territorios almacenados en la base de datos y asignarla a la lista d eterritorios del scope.
  	*/
    function getTerritorios () {
      $scope.territorios = false;

     	TerritoriosFactory.getAll()
     	  .then(function (response) {                		             	 
  	 	   	$scope.territorios = response;
  	    })
        .catch(function(err) {
            $scope.territorios = true;
            $scope.errorConn = true;
        });       	 	
    }    
    //getTerritorios();

        function getRegionesTerritorios () {
            RegionesFactory.getRegionesTerritorios()
                .then(function (response) {
                    $scope.regionesterritorios = response;
                })
                .catch(function(err) {
                    $scope.regionesterritorios = true;
                    $scope.errorConn = true;
                });
        }
        getRegionesTerritorios();
        /*
        * Obtener la lista de regiones almacenadas en la base de datos y asignarla a la lista de territorios del scope.
        */
    function getRegiones () {
      RegionesFactory.getAll()
        .then(function (response) {                                   
          $scope.regiones = response;
          if(response.length > 0){
            $scope.selectedRegion = response[0];
          }
        });           
    }
    getRegiones();


      /*
      * Valida que no existan espacion en blanco
      */
      function validate () {
        $scope.emptyData = false;                
        if ($scope.selectedRegion === undefined || $scope.territorio.nombre === undefined || $scope.territorio.descripcion === undefined || $scope.territorio.nombre.length === 0 || $scope.territorio.descripcion.length === 0 ) {                                                                
              $scope.emptyData = true;              
          }
          else{
              $scope.emptyData = false;
          }
      }

        function guardarTerritorio() {
            if(!$scope.emptyData){
                store();
            }
        }
       /*
       * Almacenar una territorio
       */
      function store () {
        $scope.registro = false;
        //si los campos no están vacíos
        $scope.territorio.region_id =  $scope.selectedRegion.id;       
        if($scope.emptyData === false){         
           	 TerritoriosFactory.store($scope.territorio)
           	 	.then(function (response) {       	 		 
       	 		 	   //registro guardado exitosamente
                if(response === 'true'){ 
                  $scope.registro = true;
                  $scope.msgRegistro = "El territorio se registró exitosamente";
                  $scope.styleRegistro = "success-box";

                }
                // error en el registro
                else{
                  $scope.registro = true;
                  $scope.msgRegistro = "Error registrando el territorio";
                  $scope.styleRegistro = "error-box";
                }

                $timeout(function () {
                   $scope.registro = false
                },5000);
                //refrescar información
                setData();
                    getRegionesTerritorios();
         	 	})
          }       

       }

      function eliminar (ev,id) {
          var confirm = $mdDialog.confirm()
              .title('¿Desea eliminar el territorio?')
              .textContent('Si lo elimina, se eliminará de todo el sistema')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Sí')
              .cancel('No');
          $mdDialog.show(confirm)          
              .then(function() {
                  TerritoriosFactory.destroy(id)
                      .then(function(response) {
                          getRegionesTerritorios();
                      });
              }, function() {});
       }

       /*
        * Modificar la región              
        */
      function modificar (territorio) {
          $scope.editar = false;
          territorio.region_id =  $scope.selectedRegion.id;   
          TerritoriosFactory.update(territorio)
            .then(function (response) {
                //registro guardado exitosamente
                if(response === 'true'){ 
                  $scope.editar = true;
                  $scope.msgEditar = "El territorio se modificó exitosamente";
                  $scope.styleEditar = "success-box";
                }
                //error en el registro
                else{
                  $scope.editar = true;
                  $scope.msgEditar = "Error modificando el territorio";
                  $scope.styleEditar = "error-box";
                }

                $timeout(function () {
                   $scope.editar = false
                },5000);    

                //refrescar información
                setData();
                getRegionesTerritorios();
            })
      }

         /*
      *Preparar los datos a mostrar cuando se edita la territorio
      */
      function editandoTerritorio (territorio) {           
        $scope.territorio =  territorio;
        $scope.regiones.forEach( function(region) {
          if(region.id === territorio.region_id){
            $scope.selectedRegion = region;
          }
        });
      }

      /*Refrescar datos si se cancela la función de editar de una región*/
      function cancelEdit () {
        if($scope.regiones.length > 0){
          $scope.selectedRegion = $scope.regiones[0];
        }
        setData();
          getRegionesTerritorios();
      }

    }  	
})();