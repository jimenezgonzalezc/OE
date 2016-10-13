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
		.factory('DatosGraficosFactory', DatosGraficosFactory);

	function DatosGraficosFactory($http, $q, API_URL) {
		var factory = {
			store: store,
			update: update,
			destroy: destroy,
			getDatosGrafico:getDatosGrafico,
			getDatosGenerales: getDatosGenerales,
			getDatosSectores: getDatosSectores,
			getDatosIndicadores: getDatosIndicadores,
			getDatosGraficoPeriodo: getDatosGraficoPeriodo,
			getDataSet: getDataSet,
			getLabels: getLabels,
			destroyByAnio: destroyByAnio,
			getDatosGraficos: getDatosGraficos,
			getLabelsSectores: getLabelsSectores,
			getLabelsIndicadores: getLabelsIndicadores
		};

		return factory;

		function getDatosGraficos() {
			var defered = $q.defer();
			var promise = defered.promise;

			$http.get(API_URL + '/api/datosGraficos/getDatosGraficos')
				.success(function(response) {
					defered.resolve(response);
				})
				.error(function(err) {
					defered.reject(err);
				});

			return promise;
		}

		function getDatosGenerales() {
			var defered = $q.defer();
			var promise = defered.promise;

			$http.get(API_URL + '/api/datosGraficos/getDatosGenerales')
				.success(function(response) {
					defered.resolve(response);
				})
				.error(function(err) {
					defered.reject(err);
				});

			return promise;
		}

		function getDatosSectores() {
			var defered = $q.defer();
			var promise = defered.promise;
			
			$http.get(API_URL + '/api/datosGraficos/getDatosSectores')
			.success(function(response) {				
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return promise;
		}

		function getDatosIndicadores() {
			var defered = $q.defer();
			var promise = defered.promise;

			$http.get(API_URL + '/api/datosGraficos/getDatosIndicadores')
				.success(function(response) {
					defered.resolve(response);
				})
				.error(function(err) {
					defered.reject(err);
				});

			return promise;
		}

		/**
		 * Obtiene los datos buscados por periodo
		 * @param {Object} datos: id del periodo
		 * @returns {Object} datos
		 */
		function getDatosGrafico (datos) {
			var defered = $q.defer();
			var promise = defered.promise;

			var data = {datos: datos};
			$http({
				'method': 'POST',
				'url' : API_URL + '/api/datosGraficos/getDatosGrafico',
				'data' : data
			})
				.success(function (response) {
					defered.resolve(response);
				})
				.error(function (err) {
					defered.reject(err);
				});
			return promise;
		}

		function getDatosGraficoPeriodo () {
			var defered = $q.defer();
			var promise = defered.promise;
			$http({
				'method': 'GET',
				'url' : API_URL + '/api/datosGraficos/todosByPeriodo'
			})
				.success(function (response) {
					defered.resolve(response);
				})
				.error(function (err) {
					defered.reject(err);
				});

			return promise;
		}

		/**
		* Almacenar datos para generacion de graficos
		* @param {Object} datosGrafico: Objeto a almacenar	
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function store (datosGrafico) {
			 var defered = $q.defer();
			 var promise = defered.promise;			 			
 			 $http({
			 	'method': 'POST',
			 	'url' : API_URL + '/api/datosGraficos/registro',
			 	'data' : datosGrafico
			 })
			 	.success(function (response) {			 	
				 	defered.resolve(response);
				 })
			 	.error(function (err) {
			 		defered.reject(err);
			 	});

		 	return promise;

		}

		/**
		* Eliminar datos para generacion de graficos
		* @param {Object} id: del datos que desea eliminar
		* @returns {Object}  si se eliminar correctarmente retorna true
		*/
		function destroy (id) {
			 var defered = $q.defer();
			 var promise = defered.promise;			 
 			 $http({
			 	'method': 'DELETE',
			 	'url' : API_URL + '/api/datosGraficos/eliminar/'+id
			 })
			 	.success(function (response) {			 	
				 	defered.resolve(response);
				 })
			 	.error(function (err) {
			 		defered.reject(err);
			 	});

		 	return promise;
		}

		function destroyByAnio (anio) {
			var defered = $q.defer();
			var promise = defered.promise;
			$http({
				'method': 'DELETE',
				'url' : API_URL + '/api/datosGraficos/eliminarDatos/'+anio
			})
				.success(function (response) {
					defered.resolve(response);
				})
				.error(function (err) {
					defered.reject(err);
				});

			return promise;
		}

		/**
		* Actualiza los datos para generacion de graficos
		* @param {Object} datosGrafico: objeto a actualizar, se utiliza el campo id del objeto, para actualizar el registro
		* correspondiente
		* @returns {Object} El resultado del request de almacenar, si es correcto, da true
		*/
		function update(datosGrafico){
			var defered = $q.defer();
			var promise =  defered.promise;			
			$http({
				method: 'POST',
				url: API_URL + '/api/datosGraficos/editar/',
				data: datosGrafico
			})
				.success(function(response){					
					defered.resolve(response);
				})
				.error(function(err){
					defered.reject(err);
				});			

			return promise;
		}

		/**
		 * Obtiene los datos para el grafico
		 */
		function getDataSet(totales, titulo) {
			var color = getRandomColor();

			var dataSetbyGrafico = {
				label: titulo,
				data: getData(totales),
				backgroundColor: getColor(totales.length, color, '0.2'),
				borderColor: getColor(totales.length, color, '0.1'),
				borderWidth: 1};
			return dataSetbyGrafico;
		}

		function getTitulo(total) {
			if (total.length > 0)
				return total.anio + ' ' + getMes(total.mes_inicio) + ' - ' + getMes(total.mes_fin) + ' Evolucion ' + getEvolucion(total.tipo_evolucion);
			else
				return '';
		}
		function getMes(numMes) {
			var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
			return meses[numMes-1];
		}

		function getEvolucion(pos) {
			var evol = ["real","esperada"];
			return evol[pos-1];
		}

		function getData(totales) {
			var valores = [];
			totales.forEach(function (item) {
				valores.push(item.valor);
			});
			return valores;
		}

		function getColor(con, color, op) {
			var colores = [];
			for (var i=0; i<con; i++) {
				colores.push(color + op + ')');
			}
			return colores;
		}

		function getRandomColor() {
			return 'rgba(' + (Math.floor(Math.random() * 256)) + ',' +
				(Math.floor(Math.random() * 256)) + ',' +
				(Math.floor(Math.random() * 256)) + ', ';
		}

		function getLabels(valores) {
			var nombres = [];
			valores.forEach(function (valor) {
				nombres.push(valor.nombre);
			});
			return nombres;
		}

		function getLabelsSectores(valores) {
			var nombres = [];
			valores.forEach(function (valor) {
				nombres.push(valor.nombre_indicador);
			});
			return nombres;
		}

		function getLabelsIndicadores(valores) {
			var nombres = [];
			valores.forEach(function (valor) {
				nombres.push(valor.nombre_sector);
			});
			return nombres;
		}
	}
})();