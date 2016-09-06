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
        .controller('RegionesController', RegionesController);

    function RegionesController($scope, $timeout, $mdDialog,  RegionesFactory) {    	
    	$scope.store = store;
        $scope.eliminar = eliminar;
        $scope.editandoRegion = editandoRegion;
        $scope.cancelEdit = cancelEdit;
        $scope.modificar = modificar;
        $scope.guardarRegion = guardarRegion;


        //watch para validar datos
    $scope.$watch('region.nombre', validate);
    $scope.$watch('region.descripcion', validate);
  	/*
	  * Limpiar los datos de la region del scope
  	*/
  	function setData (argument) {
  		 $scope.region = {'nombre' : '', 'descripcion' : ''}
  	}
    setData();
  	
    /*
  	* Obtener la lista de regiones almacenadas en la base de datos y asignarla a la lista d eregiones del
  	* scope.
  	*/
    function getRegiones () {
      $scope.regiones = false;
      
     	RegionesFactory.getAll()
     	  .then(function (response) {       	 		             	 	
  	 	   	$scope.regiones = response;
  	    })
        .catch(function(err) {
            $scope.regiones = true;
            $scope.errorConn = true;
        });       	 	
    }
    getRegiones();


      /*
      * Valida que no existan espacios en blanco
      */
      function validate () {
        $scope.emptyData = false;                
        if ($scope.region.nombre === undefined || $scope.region.descripcion === undefined || $scope.region.nombre.length === 0 || $scope.region.descripcion.length === 0 ) {                                                                
              $scope.emptyData = true;              
          }
          else{
              $scope.emptyData = false;
          }
      }
        function guardarRegion() {
            if(!$scope.emptyData)
                store();
        }

       /*
       * Almacenar una region
       */
      function store () {
        $scope.registro = false;
        //si los campos no están vacíos
        if($scope.emptyData === false){
           	 RegionesFactory.store($scope.region)
           	 	.then(function (response) {       	 		 
       	 		 	   //registro guardado exitosamente
                if(response === 'true'){ 
                  $scope.registro = true;
                  $scope.msgRegistro = "La región se registró exitosamente";
                  $scope.styleRegistro = "success-box";

                }
                else{// error en el registro
                  $scope.registro = true;
                  $scope.msgRegistro = "Error registrando la región";
                  $scope.styleRegistro = "error-box";
                }

                $timeout(function () {
                   $scope.registro = false
                },5000);
                //refrescar información
                setData();
                getRegiones();
         	 	})
          }

       }

      function eliminar (ev,id) {
          var confirm = $mdDialog.confirm()
              .title('¿Desea eliminar la región?')
              .textContent('Si la elimina, se eliminará de todo el sistema')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Sí')
              .cancel('No');
          $mdDialog.show(confirm)          
              .then(function() {
                  RegionesFactory.destroy(id)
                      .then(function(response) {
                          getRegiones();
                      });
              }, function() {});
       }

       /*
        * Modificar la región              
        */
      function modificar (region) {
          $scope.editar = false;
          RegionesFactory.update(region)
            .then(function (response) {
                //registro guardado exitosamente
                if(response === 'true'){ 
                  $scope.editar = true;
                  $scope.msgEditar = "La región se modificó exitosamente";
                  $scope.styleEditar = "success-box";
                }
                //error en el registro
                else{
                  $scope.editar = true;
                  $scope.msgEditar = "Error modificando la región";
                  $scope.styleEditar = "error-box";
                }

                $timeout(function () {
                   $scope.editar = false
                },5000);

                //refrescar información
                setData();
                getRegiones();
            })
      }

         /*
      *Preparar los datos a mostrar cuando se edita la region
      */
      function editandoRegion (region) {        
         $scope.region =  region;
      }

      /*Refrescar datos si se cancela la función de editar de una región*/
      function cancelEdit () {
         setData();
         getRegiones();
      }

    }  	
})();