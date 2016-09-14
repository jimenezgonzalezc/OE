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
		.factory('EncuestasFactory', EncuestasFactory);

	/**
	* Factory de encuestas.
	* @param {Object} Servicio que realiza una solicitud al servidor y devuelve una respuesta.
	* @param {Object} Servicio que ayuda a ejecutar funciones de forma asíncrona.
	* @returns {Object} Objeto con los metodos del factory.
	*/
	function EncuestasFactory($http, $q) {
		var factory = {
			store: store,
			getAll: getAll,
			edit: edit,
			destroy: destroy,
			changeState: changeState,
			getQuestions: getQuestions,
			removeQuestions: removeQuestions,
			questionsChanged: questionsChanged,
			addQuestionsToSurvey: addQuestionsToSurvey,
			deleteQuestionsToSurvey: deleteQuestionsToSurvey,
			isAssigned: isAssigned,
			personsChanged: personsChanged,
			getpreguntasEncuestas: getpreguntasEncuestas,
			getEncuestas: getEncuestas,
			getId: getId,
			setId: setId,
			getDescripcion: getDescripcion,
			setDescripcion: setDescripcion,
			getIdAplicacion: getIdAplicacion,
			setIdAplicacion: setIdAplicacion,
			removeItem: removeItem,
			getNumberOfQuestions: getNumberOfQuestions
		};

		var data = {
			idEncuesta: 0,
			descripcion: "",
			idAplicacion: 0
		};

		return factory;

		function getId () {
        	return data.idEncuesta;
    	}
		function setId (id) {
			data.idEncuesta = id;
		}
		function getDescripcion () {
        	return data.descripcion;
    	}
		function setDescripcion (descripcion) {
			data.descripcion = descripcion;
		}
		function getIdAplicacion () {
			return data.idAplicacion;
		}
		function setIdAplicacion (idAplicacion) {
			data.idAplicacion = idAplicacion;
		}

		/**
        * Almacena una nueva encuesta.
        * @param {Object} Objeto con la información de la encuesta.
        * @returns {string} Resultado de agregar la encuesta.
        */
		function store(encuesta) {
			var defered = $q.defer();

			$http({
				method: 'POST',
				url: 'api/encuestas/registro',
				data: encuesta
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
        * Obtiene todas las encuestas.
        * @returns {string} Todas las encuestas de la base de datos.
        */
		function getAll() {
			var defered = $q.defer();

			$http.get('api/encuestas/todas')
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
        * Edita una encuesta.
        * @param {integer} Id de la encuesta.
        * @param {string} Nueva descripción de la encuesta.
        * @param {date} Fecha de modificación de la encuesta.
        * @returns {string} Resultado de editar la encuesta.
        */
		function edit(id, descripcion, fecha) {
			var defered = $q.defer();
			var data = {
				id: id,
				descripcion: descripcion,
				fecha: fecha
			};
			$http({
	            method: 'POST',
	            url: 'api/encuestas/update',
	            data: data
	        })
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
        * Elimina una encuesta.
        * @param {integer} Id de la encuesta.
        * @returns {string} Resultado de eliminar la encuesta.
        */
		function destroy(id) {
			var defered = $q.defer();

			$http({
				method: 'DELETE',
				url: 'api/encuestas/destroy/' + id,
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			})

			return defered.promise;
		}

		/**
        * Cambia el estado de una encuesta.
        * @param {integer} Id de la encuesta.
        * @param {integer} Nuevo estado de la encuesta.
        * @returns {string} Resultado de cambiar el estado de la encuesta.
        */
		function changeState(id, state) {
			var defered = $q.defer();
			var data = {
				id: id,
				state: state
			};

			$http({
				method: 'POST',
				url: 'api/encuestas/changeState',
				data: data
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err)
			});

			return defered.promise;
		}

		/**
        * Obtiene las preguntas de una encuesta.
        * @param {integer} Id de la encuesta.
        * @returns {Array} Array con las preguntas de la encuesta.
        */
		function getQuestions(id)  {
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: 'api/encuestas/getQuestions/' + id
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
        * Elimina un elemento de una lista.
        * @param {Object} Objeto a eliminar.
        * @param {Array} Lista de la que se va a eliminar el objeto.
        * @returns {Array} Lista sin el objeto.
        */
		function removeItem(item, list) {
			list = list.filter(function(question) {
				return question !== item;
			});

			return list;
		}

		/**
        * Elimina de todas las preguntas las preguntas de la encuesta.
        * @param {Array} Lista que contiene 2 sublistas de preguntas, una con todas las preguntas y la otra con las preguntas de la encuesta.
        * @returns {Array} Lista con las preguntas.
        */
		function removeQuestions(list) {
			angular.forEach(list.banco, function(question) {
				angular.forEach(list.preguntas, function(item) {
			  		if(question.pregunta_id === item.id) {
			  			list.preguntas = removeItem(item, list.preguntas);
			  		}
				});
			});

			return list;
		}

		/**
        * Verifica si las preguntas de una encuesta cambiaron.
        * @param {Array} Lista con las preguntas viejas de la encuesta.
        * @param {Array} Lista con las nuevas preguntas de la encuesta.
        * @returns {Array} Lista con las preguntas que se van a agregar y a eliminar de la encuesta.
        */
		function questionsChanged(oldList, currentList) {
			var question = false,
				i = 0,
				j = 0,
				preguntas = {
					'agregar': [],
					'eliminar': []
				};

			// Verifica las preguntas que hay que eliminar de la encuesta.
			for ( ; i < oldList.length; i++) {
				for ( ; j < currentList.length; j++) {
					if(oldList[i].pregunta_id === currentList[j].pregunta_id) {
						question = false;
						break;
			  		}
			  		else {
			  			question = true;
			  		}
				}

				if(question || !currentList.length) {
					preguntas.eliminar.push(oldList[i].id);
				}

				j = 0;
			}

			i = 0;
			j = 0;
			question = false;

			// Verifica las preguntas que hay que agregar a la encuesta.
			for ( ; i < currentList.length; i++) {
				for ( ; j < oldList.length; j++) {
					if(currentList[i].pregunta_id === oldList[j].pregunta_id) {
						question = false;
						break;
			  		}
			  		else {
			  			question = currentList[i];
			  		}
				}

				if(question || !oldList.length) {
					preguntas.agregar.push(currentList[i].id);
				}

				j = 0;
			}

			return preguntas;
		}

		/**
        * Agrega pregunats a una encuesta.
        * @param {integer} Id de la enccuesta.
        * @param {Array} Lista con los ids de las preguntas que se van a agregar a la encuesta.
        * @returns {string} Resultado de agregar las preguntas a la encuesta.
        */
		function addQuestionsToSurvey(encuestaId, questions) {
			var defered = $q.defer(),
				data = {
					encuestaId: encuestaId,
					questions: questions
				};

			$http({
				method: 'POST',
				url: 'api/encuestasPreguntas/store',
				data: data
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
        * Elimina preguntas de una encuesta.
        * @param {Array} Lista con los ids de las encuestas que se van a eliminar.
        * @returns {string} Resultado de eliminar las encuestas.
        */
		function deleteQuestionsToSurvey(questions) {
			var defered = $q.defer();

			$http({
				method: 'DELETE',
				url: 'api/encuestasPreguntas/destroy/' + questions,
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		/**
        * Procesa la lista de personas para ver si cuentan con una aplicación en una encuesta.
        * @param {Array} Lista con las personas que están ligadas a una aplicación.
        * @param {Array} Lista con todas las personas.
        * @returns {Array} Lista con todas las personas, diferenciadas de cuales cuentan con aplicación.
        */
		function isAssigned(listPersons, allPersons) {
			angular.forEach(allPersons, function(person) {
				person.state = false;
				angular.forEach(listPersons, function(person2) {
			  		if(person.id === person2.idPersona) {
			  			person.state = true;
			  			person.idAplicacion = person2.idAplicacion;
			  		}
				});
			});

			return allPersons;
		}

		/**
        * Verifica si los empresarios que cuentan con una aplicación en una encuesta se han eliminado o se han agregado nuevos.
        * @param {Array} Lista con los empresarios viejos que cuontaban con una aplicación en la encuesta.
        * @param {Array} Lista con los nuevos empresarios.
        * @param {bool} Indica si se verifica empresarios (true) o encuestadores (false).
        * @returns {Array} Lista con los empresarios que hay que eliminarles la aplicación y a los que hay que crearle una.
        */
		function personsChanged(oldList, currentList) {
			var index = 0,
				length = oldList.length,
			    persons = {
					'agregar': [],
					'eliminar': []
				};

			for ( ; index < length; index++) {
				if (currentList[index].state !== oldList[index].state) {
					if (currentList[index].state) {
						persons.agregar.push(currentList[index].id);
					}
					else {
						persons.eliminar.push(currentList[index].idAplicacion);
					}
				}
			}

			return persons;
		}

		function getpreguntasEncuestas(id)  {
			var defered = $q.defer(),
				data = {
					id: id
				};

			$http({
				method: 'POST',
				url: 'api/preguntas/encuesta',
				data: data
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

		function getEncuestas(id)  {
			var defered = $q.defer(),
				data = {
					id: id
				};

			$http({
				method: 'POST',
				url: 'api/encuestas/getEncuestas',
				data: data
			})
				.success(function(response) {
					defered.resolve(response);
				})
				.error(function(err) {
					defered.reject(err);
				});

			return defered.promise;
		}

		function getNumberOfQuestions(idEncuesta){
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: 'api/encuestasPreguntas/getNumberOfQuestions/' + idEncuesta
			})
				.success(function(response) {
					defered.resolve(response);
				})
				.error(function(err) {
					defered.reject(err);
				});

			return defered.promise;
		}
	}
})();
