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
		.controller('PeriodosController', PeriodosController);

	/**
    * Controlador de periodos.
    * @param {Object} Servicio que permite la unión entre el HTML y el controlador.
    * @param {Object} Promesa que resolverá cierto trozo de código cuando determinado tiempo ha pasado.
    * @param {Object} Servicio utilizado para mostrar ventanas de confirmación.
    * @param {Object} Servicio que brinda funciones de los periodos que ayudan a la funcionalidad del controlador.
    */
	function PeriodosController($scope, $timeout, $mdDialog, PeriodosFactory) {
		$scope.store = store;
		$scope.editandoPeriodo = editandoPeriodo;
		$scope.remove = remove;
		$scope.update = update;
		$scope.setData = setData;
		$scope.definirPeriodicidad = definirPeriodicidad;
		$scope.getMes = getMes;
		$scope.validarPeriodicidad = validarPeriodicidad;
		$scope.p = [{value: "4", label: "Cuatrimestre"}, {value: "6", label: "Semestre"}, {value: "12", label: "Anual"}];
		/**
		 * Almacena un nuevo periodo en la base de datos.
		 * @return {String} Resultado de almacenar el periodo.
		 */
		function store(periodos) {
			var err = false;
			periodos.forEach(function(periodo) {
				PeriodosFactory.store(periodo)
					.then(function(response) {
						if (response !== 'true') {
							err = true;
						}
					});
			});
			if (err){
				$scope.periodoMsg = 'Ha ocurrido un error al definir la periodicidad';
				$scope.peridoClass = 'alert error-box';
				deleteByYear($scope.selectedYear.year);
			}
			else{
				$scope.periodoMsg = 'Se ha definido la periodicidad. Los periodos se han agregado correctamente.';
				$scope.peridoClass = 'alert success-box';
				getAll();
			}
			$timeout(function() {
				$scope.periodoMsg = '';
			}, 5000);
		}

		/**
		 * Prepara la información para editar un periodo.
		 * @param  {Object} Información del periodo a editar.
		 */
		function editandoPeriodo(periodo) {
			$scope.periodicidad = $scope.p[getP(periodo.modo_periodicidad)];
			$scope.selectedYear = $scope.years[getAnio(periodo.anio)];
		}

		function getP(nombre) {
			var i;
			for (i=0; i<$scope.p.length; i++){
				if($scope.p[i].label === nombre){
					break;
				}
			}
			return i;
		}

		function getAnio(anio) {
			var i;
			for (i=0; i<$scope.years.length; i++){
				if($scope.years[i].year === anio){
					break;
				}
			}
			return i;
		}


		/**
		 * Elimina un periodo de la base de datos.
		 * @param  {Object} Evento.
		 * @param  {int} Id del periodo a eliminar.
		 * @return {String} Resultado de eliminar el periodo.
		 */
		function remove(ev, anio) {
			var confirm = $mdDialog.confirm('?')
                .title('¿Esta seguro que desea eliminar este periodo?')
                .textContent('Se eliminaran todos los periodos del año: ' + anio)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
					deleteByYear(anio);
                }, function() {});
		}

		function deleteByYear(anio) {
			PeriodosFactory.deleteByYear(anio)
				.then(function(response) {
					getAll();
				});
		}

		/**
		 * Edita un periodo en la base de datos.
		 * @return {String} Resultado de editar el periodo.
		 */
		function update() {
			$scope.periodoMsg = '';
			deleteByYear($scope.selectedYear.year);
			definirPeriodicidad();
			$scope.periodoMsg = 'El periodo se ha editado correctamente.';
			$scope.peridoClass = 'alert success-box';
			$timeout(function() {
				$scope.periodoMsg = '';
			}, 5000);
		}

		/**
		 * Limpia las variables.
		 */
		function setData() {
			$scope.periodicidad = $scope.p[0];
			$scope.selectedYear = $scope.years[0];
		}

		/**
		 * Obtiene los años para ser mostrados en la UI.
		 */
		function getYears() {
			$scope.years = PeriodosFactory.generateyYears();
			$scope.selectedYear = $scope.years[0];
			$scope.periodicidad = $scope.p[0];
		}

		/**
		 * Obtiene todos los indicadores de la base de datos.
		 */
		function getAll() {
			$scope.periodos = false;

			PeriodosFactory.getAll()
			.then(function(response) {
				$scope.periodos = response;
			})
	        .catch(function(err) {
	            $scope.periodos = true;
	            $scope.errorConn = true;
	        });
		}
		
		function getMes(numMes) {
			var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
			return meses[numMes-1];
		}

		function validarPeriodicidad() {
			$scope.periodoMsg = '';
			PeriodosFactory.validarPeriodicidad($scope.selectedYear.year).then(function(vp) {
				if (vp > 0){
					$scope.periodoMsg = 'Ya se ha definido la periodicidad de ese año';
					$scope.peridoClass = 'alert error-box';
					$timeout(function() {
						$scope.periodoMsg = '';
					}, 6000);
				}
				else{
					definirPeriodicidad();
				}
			});
		}

		function definirPeriodicidad() {
			var numMeses = parseInt($scope.periodicidad.value);
			var meses = [1,2,3,4,5,6,7,8,9,10,11,12];
			var periodos = [];
			var i,j,periodo;
			for (i=0,j=meses.length; i<j; i+=numMeses) {
				periodo = meses.slice(i,i+numMeses);
				var pAux = {anio: $scope.selectedYear.year, mes_inicio: periodo[0], mes_fin: periodo[periodo.length-1], modo_periodicidad: $scope.periodicidad.label};
				periodos.push(pAux);
			}
			store(periodos);
		}

		getAll();
		getYears();
		setData();
	}
})();