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
		.controller('IndicadoresController', IndicadoresController);

	/**
    * Controlador de indicadores.
    * @param {Object} Servicio que permite la unión entre el HTML y el controlador.
    * @param {Object} Promesa que resolverá cierto trozo de código cuando determinado tiempo ha pasado.
    * @param {Object} Servicio utilizado para mostrar ventanas de confirmación.
    * @param {Object} Servicio que brinda funciones de los indicadores que ayudan a la funcionalidad del controlador.
    * @param {Object} Servicio que brinda funciones de los sectores que ayudan a la funcionalidad del controlador.
    * @param {Object} Servicio que brinda funciones de los sectores indicadores que ayudan a la funcionalidad del controlador.
    */
	function IndicadoresController($scope, $timeout, $mdDialog, IndicadoresFactory, SectoresFactory, SectoresIndicadoresFactory) {
		$scope.selectedSectores = [];
		$scope.store = store;
		$scope.editandoIndicador = editandoIndicador;
		$scope.update = update;
		$scope.remove = remove;
		$scope.setData = setData;
		$scope.validate = validate;
		$scope.guardarIndicador = guardarIndicador;

		var respaldoSectores = [];

		/**
		 * Muestra un mensaje.
		 * @param  {String} Mensaje a mostrar.
		 * @param  {String} Clase del mensaje.
		 */
		function showMessage(message, clase) {
			$scope.indicadorMsg = message;
			$scope.indicadorClass = clase;
		}

		/**
		 * Valida que se haya seleccionado al menos un sector para el indicador.
		 */
		function validate() {
			$scope.sectoresState = false;
			var i = 0;
			var	length = $scope.sectores.length;

			for ( ; i < length; i++) {
				if ($scope.sectores[i].state) {
					$scope.sectoresState = true;
					break;
				}
			}
		}

		/**
		 * Manda a almacenar los sectores a los que pertenece el indicador recién agregado.
		 * @param  {int} indicadorId Id del indicador recién agregado.
		 */
		function storeSectoresIndicadores(indicadorId) {
			var sectoresId = [];
			
			$scope.sectores.forEach((sector) => {
				if (sector.state) {
					sectoresId.push(sector.id);
					sector.state = false;
				}
			});
			
			SectoresIndicadoresFactory.store(indicadorId, sectoresId)
			.then(function(response) { });
		}
		
		function guardarIndicador() {
			if ($scope.sectoresState){
				store();
			}
			else
				showMessage('Debe seleccionar al menos un indicador.', 'alert error-box');
		}

		/**
		 * Almacena un nuevo indicador en la base de datos.
		 * @return {String} Resultado de almacenar el indicador.
		 */
		function store() {
			IndicadoresFactory.store($scope.indicador)
			.then(function(response) {
				try {
					response = parseInt(response);

					showMessage('El indicador se ha agregado correctamente.', 'alert success-box');
					cleanForm();
					getAll();
				} catch (e) {
					showMessage('Ha ocurrido un error al agregar el indicador.', 'alert error-box');
				}

				$timeout(function() {
					$scope.indicadorMsg = '';
				}, 5000);

				return(response);
			})
			.then(function(indicadorId) {
				if (typeof(indicadorId) === 'number') { 
					storeSectoresIndicadores(indicadorId);
					setData();
				}
			});
		}

		/**
		 * Prepara la información para editar un indicador.
		 * @param  {Object} Información del indicador a editar.
		 */
		function editandoIndicador(indicador) {
			setData();
			$scope.id = indicador.id;
			$scope.indicador = {
				name: indicador.nombre,
				description: indicador.descripcion
			};

			SectoresIndicadoresFactory.getForIndicador($scope.id)
			.then(function(response) {
				$scope.sectores.forEach((sector) => {
					response.forEach((sectorIndicador) => {
						if (sector.id === sectorIndicador.sector_id) {
							sector.state = true;
							sector.idSI = sectorIndicador.id;
						}
					});
				});

				$scope.sectores.forEach((sector) => {
					respaldoSectores.push({sector_id: sector.id, state: sector.state});
				});
			})
			.catch(function(err) {
				console.log(err);
			});
		}

		/**
		 * Agregar sectores a un indicador.
		 * @param  {Array} Arreglo con los ids de los sectores.
		 * @return {String} Resultado de agregar los sectores.
		 */
		function agregarSectoresIndicador(sectores) {
			if(sectores.length) {
                SectoresIndicadoresFactory.store($scope.id, sectores)
                .then(function(response) {
                    return response;
                });
            }

            return 'true';
		}

		/**
		 * Elimina sectores de un indicador.
		 * @param  {Array} Arreglo con los ids de los SectoresIndicadores.
		 * @return {String} Resultado de aliminar los SectoresIndicadores.
		 */
		function eliminarSectoresIndicador(sectores) {
			if(sectores.length) {
                SectoresIndicadoresFactory.remove(sectores)
                .then(function(response) {
                    return response;
                });
            }

            return 'true';
		}

		/**
		 * Edita un indicador en la base de datos.
		 * @return {String} Resultado de editar el indicador.
		 */
		function update() {
			$scope.indicador.id = $scope.id;

			var sectores = SectoresIndicadoresFactory.sectoresChanged(respaldoSectores, $scope.sectores);

			IndicadoresFactory.update($scope.indicador)
			.then(function(response) {
				return response;
			})
			.then(function(state) {
				if (state === 'true') {
					if(agregarSectoresIndicador(sectores.agregar) === 'true' && eliminarSectoresIndicador(sectores.eliminar) === 'true') {
						showMessage('El indicador se ha editado correctamente.', 'alert success-box');
						cleanForm();
						getAll();
		            }
		            else {
		                showMessage('Ha ocurrido un error al editar el indicador.', 'alert error-box');   
		            }
				}
				else {
					showMessage('Ha ocurrido un error al editar el indicador.', 'alert error-box');
				}

				$timeout(function() {
					$scope.indicadorMsg = '';
				}, 5000);
			});
		}

		/**
		 * Elimina un indicador de la base de datos.
		 * @param  {Object} Evento.
		 * @param  {int} Id del indicador a eliminar.
		 * @return {String} Resultado de eliminar el indicador.
		 */
		function remove(ev, id) {
			var confirm = $mdDialog.confirm('?')
                .title('¿Esta seguro que desea eliminar este indicador?')
                .textContent('El indicador se eliminará de todo el sistema.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
                    IndicadoresFactory.remove(id)
                        .then(function(response) {
                            getAll();
                        });
                }, function() {});
		}

		/**
		 * Limpia las variables.
		 */
		function setData() {
			$scope.sectores.forEach((sector) => {
				sector.state = false;
			});
			$scope.id = '';
			$scope.indicador = {
				name: '',
				description: ''
			};
			respaldoSectores = [];
		}

		/**
		 * Obtiene todos los indicadores de la base de datos.
		 */
		function getAll() {
			$scope.indicadores = false;

			IndicadoresFactory.getAll()
			.then(function(response) {
				$scope.indicadores = response;
			})
	        .catch(function(err) {
	            $scope.indicadores = true;
	            $scope.errorConn = true;
	        });
		}

		/**
		 * Obtiene todos los sectores.
		 */
		function getSectores() {
			SectoresFactory.getAll()
			.then(function(response) {
				$scope.sectores = response;

				$scope.sectores.forEach((sector) => {
					sector.state = false;
				})
			});
		}

		/**
		* Limpia el formulario del cambio de contraseña.
		*/
		function cleanForm() {
            $scope.formIndicador.$setPristine();
        }

		getAll();
		getSectores();
	}

})();