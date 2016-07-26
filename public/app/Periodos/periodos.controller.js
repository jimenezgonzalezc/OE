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

		/**
		 * Almacena un nuevo periodo en la base de datos.
		 * @return {String} Resultado de almacenar el periodo.
		 */
		function store() {
			var data = {
				year: $scope.selectedYear.year,
				quarter: parseInt($scope.quarter)
			};

			PeriodosFactory.store(data)
			.then(function(response) {
				if (response === 'true') {
					$scope.periodoMsg = 'El periodo se ha agregado correctamente.';
					$scope.peridoClass = 'alert success-box';
					getAll();
					setData();
				}
				else {
					$scope.periodoMsg = 'Ha ocurrido un error al agregar el periodo.';
					$scope.peridoClass = 'alert error-box';
				}

				$timeout(function() {
					$scope.periodoMsg = '';
				}, 5000);
			});
		}

		/**
		 * Prepara la información para editar un periodo.
		 * @param  {Object} Información del periodo a editar.
		 */
		function editandoPeriodo(periodo) {
			$scope.id = periodo.id;
			$scope.quarter = periodo.cuatrimestre.toString();
			$scope.years.forEach((year) => {
				if (year.year === periodo.anio) {
					$scope.selectedYear = year;
				}
			});
		}

		/**
		 * Elimina un periodo de la base de datos.
		 * @param  {Object} Evento.
		 * @param  {int} Id del periodo a eliminar.
		 * @return {String} Resultado de eliminar el periodo.
		 */
		function remove(ev, id) {
			var confirm = $mdDialog.confirm('?')
                .title('¿Esta seguro que desea eliminar este periodo?')
                .textContent('El periodo se eliminará de todo el sistema.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
                    PeriodosFactory.remove(id)
                        .then(function(response) {
                            getAll();
                        });
                }, function() {});
		}

		/**
		 * Edita un periodo en la base de datos.
		 * @return {String} Resultado de editar el periodo.
		 */
		function update() {
			var data = {
				id: $scope.id,
				year: $scope.selectedYear.year,
				quarter: parseInt($scope.quarter)
			};

			PeriodosFactory.update(data)
			.then(function(response) {
				if (response === 'true') {
					$scope.periodoMsg = 'El periodo se ha editado correctamente.';
					$scope.peridoClass = 'alert success-box';
					getAll();
					setData();
				}
				else {
					$scope.periodoMsg = 'Ha ocurrido un error al editar el periodo.';
					$scope.peridoClass = 'alert error-box';
				}

				$timeout(function() {
					$scope.periodoMsg = '';
				}, 5000);
			});
		}

		/**
		 * Limpia las variables.
		 */
		function setData() {
			$scope.quarter = '1';
			$scope.selectedYear = $scope.years[0];
		}

		/**
		 * Obtiene los años para ser mostrados en la UI.
		 */
		function getYears() {
			$scope.years = PeriodosFactory.generateyYears();
			$scope.selectedYear = $scope.years[0];
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

		getAll();
		getYears();
		setData();
	}
})();