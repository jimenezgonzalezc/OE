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
		.controller('EncuestadorPanelEncuestasController', EncuestadorPanelEncuestasController);

	function EncuestadorPanelEncuestasController($scope, EncuestasFactory, $cookies, AplicacionesFactory, PersonasFactory) {
		$scope.encuestador = $cookies.getObject('session').id;

		$scope.idsAplicaciones =  [];	//Ids Aplicaciones
		$scope.aplicaciones =  null;	//Aplicaciones
        //Encuesta
        $scope.encuestaId = 0;
        $scope.encuestaDescripcion = "";
		//Persona
		$scope.personas = [];
		// Funciones
		$scope.getAplicaciones = getAplicaciones;
		$scope.contestarEncuesta = contestarEncuesta;
		$scope.logOut = logOut;

		function logOut() {
			Auth.logOut();
		}

        function contestarEncuesta(idAplicacion, id, descripcion){
            $scope.encuestaId = id;
            $scope.encuestaDescripcion = descripcion;
			$scope.idAplicacion = idAplicacion;

			EncuestasFactory.setId(id);
			EncuestasFactory.setDescripcion(descripcion);
			EncuestasFactory.setIdAplicacion(idAplicacion);
        }

		function isInArray(value, array) {
			return array.indexOf(value) > -1;
		}

		function destroyAplicacion(aplicaciones, aplicacion) {
			aplicaciones = aplicaciones.filter(function(item) {
				return aplicacion !== item;
			});
			return aplicaciones;
		}

		function groupByPerson(aplicaciones) {
			var i = 0,
				j = 0,
				index = 0,
				personas = [];

			for ( ; i < aplicaciones.length; i++) {
				personas.push({
					id: aplicaciones[i].idEmpresario,
					nombre: aplicaciones[i].nombre + ' ' + aplicaciones[i].apellido1 + ' ' + aplicaciones[i].apellido2,
					encuestas: []
				});
				
				for ( ; j < aplicaciones.length; j++) {
					if (personas[index].id === aplicaciones[j].idEmpresario) {
						personas[index].encuestas.push({
							id: aplicaciones[j].idEncuesta,
							descripcion: aplicaciones[j].descripcion,
							estado: aplicaciones[j].estado,
							idAplicacion: aplicaciones[j].idAplicacion
						});
						aplicaciones = destroyAplicacion(aplicaciones, aplicaciones[j]);
						j--;
					}
				}
				i = -1;
				j = 0;
				index++;
			}

			return personas;
		}
	}
})();
