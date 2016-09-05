/**
* Entrepreneurship Observatory
*
* @authors Fauricio Rojas Hernández, Manfred Artavia Gómez y Carlos Jiménez González.
* @version 1.0
*/
(function () {
	 'use strict';

	 angular.module('observatoryApp')
	 .controller('AnalisisCompletoController', AnalisisCompletoController);

	 /**
	* Controlador del análisis.
	* @param {Object} Servicio que permite la unión entre el HTML y el controlador.
	* @param {Object} Servicio que brinda funciones del analisis al controlador.
	*/
	 function AnalisisCompletoController ($scope, AnalisisFactory, IndicadoresFactory, SectoresFactory, PeriodosFactory, TerritoriosFactory, $timeout) {
		 $scope.getAnalisis = getAnalisis;
		 $scope.analisis1 = null;
		 $scope.analisis2 = null;
		 $scope.analisis3 = null;
		 $scope.msgAnalisis = "";
		 $scope.showMsgAnalisis = false;
		 $scope.styleMsgAnalisis = "";
		 $scope.tiempoMsg = 5000;


		 $scope.selectAllSectores = function() {
			 var toggleStatus = $scope.allSectores;
			 angular.forEach($scope.sectores, function(sector){ sector.selected = toggleStatus; });
		 };

		 $scope.selectSector = function(){
			 $scope.allSectores = $scope.sectores.every(function(sector){ return sector.selected; })
		 };

		 $scope.selectAllIndicadores = function() {
			 var toggleStatus = $scope.allIndicadores;
			 angular.forEach($scope.indicadores, function(indicador){ indicador.selected = toggleStatus; });
		 };

		 $scope.selectIndicador = function(){
			 $scope.allIndicadores = $scope.indicadores.every(function(indicador){ return indicador.selected; })
		 };

		 function getPeriodos() {
			 PeriodosFactory.getAll()
				 .then(function(response) {
					 response.forEach(function(periodo) {
						 periodo.label = 'Cuatrimestre ' + periodo.cuatrimestre +', ' + periodo.anio;
					 });
					 $scope.periodos = response;
					 $scope.selectedPeriodo = $scope.periodos[0];
				 })
				 .catch(function(err) { });
		 }

		 function getSectores() {
			 SectoresFactory.getAll()
				 .then(function (response) {
					 $scope.sectores = response;
					 $scope.sectores.forEach(function (sector) {
						 sector.selected = false;
					 });
				 });
		 }

		 function getIndicadores() {
			 IndicadoresFactory.getAll()
				 .then(function (response) {
					 $scope.indicadores = response;
					 $scope.indicadores.forEach(function (indicador) {
						 indicador.selected = false;
					 });
				 });
		 }

		 function createHeaderSector(indicador){
			 indicador.forEach(function (indice) {

			 });
		 }

		 function getAnalisis() {
			 var filtroSectores = [];
			 $scope.sectores.forEach(function (sector) {
				 if (sector.selected === true)
				 {
					 var nSector = { id: sector.id, nombre: sector.nombre };
					 filtroSectores.push(nSector);
				 }
			 });
			 var filtroIndicadores = [];
			 $scope.indicadores.forEach(function (indicador) {
				 if (indicador.selected === true)
				 {
					 var nIndicador = { id: indicador.id, nombre: indicador.nombre };
					 filtroIndicadores.push(nIndicador);
				 }
			 });
			 var filtro = { filtroSectores: filtroSectores, filtroIndicadores: filtroIndicadores,
				 periodo_id: $scope.selectedPeriodo.id };

		 	if (filtroSectores.length === 0){
				 $scope.showMsgAnalisis = true;
				 $scope.msgAnalisis = "No se han seleccionado Sectores";
				 $scope.styleMsgAnalisis = "error-box";
				$scope.tiempoMsg = 5000;
			 }
			 else if (filtroIndicadores.length === 0){
				 $scope.showMsgAnalisis = true;
				 $scope.msgAnalisis = "No se han seleccionado Indicadores";
				 $scope.styleMsgAnalisis = "error-box";
				$scope.tiempoMsg = 5000;
			 }
			 else{
				 AnalisisFactory.getAnalisis(filtro)
					 .then(function (response) {
						 $scope.analisis = response;

						 if ($scope.analisis[0].analisis1.length === 0){
							 $scope.showMsgAnalisis = true;
							 $scope.msgAnalisis = "No hay resultados que mostrar";
							 $scope.styleMsgAnalisis = "info-box";
							 $scope.tiempoMsg = 6000;
						 }
						 else{
							 $scope.analisis1 = $scope.analisis[0].analisis1;
							 $scope.analisis2 = $scope.analisis[0].analisis2;
							 $scope.analisis3 = $scope.analisis[0].analisis3;
							 $scope.analisis4 = $scope.analisis[0].analisis4;
							 if ($scope.analisis4.length > 0)
							 	$scope.headerSector = $scope.analisis4[0].resultados;
							 $scope.totales = $scope.analisis[0].totales;
						 }
					 })
					 .catch(function(err) { });
			 }
			 $timeout(function() {
				 $scope.showMsgAnalisis = false;
			 }, $scope.tiempoMsg);
		 }

		 getPeriodos();
		 getSectores();
		 getIndicadores();
	 }
})();