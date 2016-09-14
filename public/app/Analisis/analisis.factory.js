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
		.factory('AnalisisFactory', AnalisisFactory);

	function AnalisisFactory($http, $q) {
		var factory = {
			get: get,
            getAnalisis: getAnalisis,
            calculateICEBySector: calculateICEBySector,
			groupByEntrepreneur: groupByEntrepreneur,
            calculateNs: calculateNs,
            calculatePs: calculatePs,
            calculateN: calculateN,
            calculateNir: calculateNir,
            calculatePir: calculatePir,
            calculateXir: calculateXir,
            calculateNsir: calculateNsir,
            calculatePsir: calculatePsir,
            calculateXsir: calculateXsir,
            calculateIndicadoresER: calculateIndicadoresER,
            calculateITS: calculateITS,
            calculateITI: calculateITI,
            prom: prom,
            manipulateInfo: manipulateInfo
		};

		return factory;

		function get(idPeriodo, idTerritorio) {
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: 'api/analisis/get/' + idPeriodo + '/' + idTerritorio
			})
			.success(function(response) {
				defered.resolve(response);
			})
			.error(function(err) {
				defered.reject(err);
			});

			return defered.promise;
		}

        function getAnalisis(filtro) {
            var defered = $q.defer();

            $http({
                method: 'POST',
                url: 'api/analisis/getAnalisis',
                data: filtro
            })
                .success(function(response) {
                    defered.resolve(response);
                })
                .error(function(err) {
                    defered.reject(err);
                });

            return defered.promise;
        }
        function calculateValue(value){
            var result;
            switch (value){
                case 'Muy bueno':
                    result = 1;
                    break;
                case 'Bueno':
                    result = 2;
                    break;
                case 'Regular':
                    result = 3;
                    break;
                case 'Malo':
                    result = 4;
                    break;
                case 'Muy malo':
                    result = 5;
                    break;
            }
            return result;
        }

		function calculateICEBySector(sector, entrepreneurs) {
            var ICEbySector = {
                sector: sector,
                scores: []
            },
                index = 0;

            entrepreneurs.forEach(function(entrepreneur){

                ICEbySector.scores.push({
                    resultadoNegocios: 0,
                    empleo: 0,
                    inversiones: 0,
                    precios: 0,
                    costesTotales: 0
                });

                if(entrepreneur.sector === sector) {
                    entrepreneur.answers.forEach(function(answer){
                       	switch (answer.indicador){
                           	case 'Resultado de negocio':
                               ICEbySector.scores[index].resultadoNegocios += calculateValue(answer.answer);
                               break;
                           	case 'Empleo':
                               ICEbySector.scores[index].empleo += calculateValue(answer.answer);
                               break;
                           	case 'Inversiones':
                               ICEbySector.scores[index].inversiones += calculateValue(answer.answer);
                               break;
                           	case 'Precios':
                               ICEbySector.scores[index].precios += calculateValue(answer.answer);
                               break;
                           	case 'Costes totales':
                               ICEbySector.scores[index].costesTotales += calculateValue(answer.answer);
                               break;
                      	}
                    });
                    index ++;
                }
            });

            return ICEbySector;
		}

		function destroyAnswer(answers, answer) {
			answers = answers.filter(function(item) {
				return answer !== item;
			});

			return answers;
		}

		function groupByEntrepreneur(answers){
			var i = 0,
				j = 0,
				index = 0,
				entrepreneurs = [];

			for ( ; i < answers.length; i++) {

				entrepreneurs.push({
					id: answers[i].id,
                    sector: answers[i].sector,
					answers: []
				});

				for ( ; j < answers.length; j++) {
					if (entrepreneurs[index].id === answers[j].id) {
						entrepreneurs[index].answers.push({
							indicador: answers[j].nombre,
							answer: answers[j].respuesta
						});
						answers = destroyAnswer(answers, answers[j]);
						j--;
					}
				}

				i = -1;
				j = 0;
				index++;
			}

			return entrepreneurs;
		}

        /*
        * Calcular el Ns de las encuestas
        * @param{Array} encuestas aplicadas, utilizadas para determinar a que sector pertenece cada aplicacion
        * */
        function calculateNs(ICEBySector){
            var nsResults = {
                agricola: 0,
                manufactura: 0,
                comercio: 0,
                turismo: 0,
                servicios: 0
            };
            
            ICEBySector.forEach(function(entrepreneur){
                entrepreneur.scores.forEach(function (score) {
                    if(score.costesTotales !== 0 || score.empleo !== 0 || score.inversiones !== 0
                        || score.precios !== 0 || score.resultadoNegocios !== 0) {
                        switch(entrepreneur.sector){
                            case 'Agricultura y pesca':
                                nsResults.agricola ++;
                                break;
                            case 'Industria manufacturera':
                                nsResults.manufactura ++;
                                break;
                            case 'Comercio y reparación':
                                nsResults.comercio ++;
                                break;
                            case 'Turismo':
                                nsResults.turismo ++;
                                break;
                            case 'Otros servicios':
                                nsResults.servicios ++;
                                break;
                        }
                    }
                })
            });

            return nsResults;
        }

        /*
        * Calcular el Ps, que corresponde al ponderado de aplicaciones por sector (peso en la medicion)
        * @param{Object} Ns con los valores que indican el numero de encuestas por sector
        * */
        function calculatePs(ns, total){
            return {
                agricola: ns.agricola / total,
            	manufactura: ns.manufactura / total,
                comercio: ns.comercio / total,
                turismo: ns.turismo / total,
                servicios: ns.servicios / total
            };

        }

        function calculateN(ns){
            return ns.agricola + ns.manufactura + ns.comercio + ns.turismo + ns.servicios;
        }

        function getPosition(value) {
        	var i = -1;
        	switch(value) {
        		case 1:
        			i = 0;
        			break;
        		case 2:
        			i = 1;
        			break;
        		case 3:
        			i = 2;
        			break;
        		case 4:
        			i = 3;
        			break;
        		case 5:
        			i = 4;
        			break;
        	}

        	return i;
        }

        function getScoreForSectorForNir(score, indicadores, nir) {
        	var i;
        	indicadores.forEach(function(indicador) {
        		switch(indicador.nombre) {
	        		case 'Resultado de negocio':
	        			i = getPosition(score.resultadoNegocios);
	        			if (i >= 0) {
	        				nir[0].scores[i] += 1;
	        			}
	                   	break;
	               	case 'Empleo':
	               		i = getPosition(score.empleo);
	        			if (i >= 0) {
	        				nir[1].scores[i] += 1;
	        			}
	                   	break;
	               	case 'Inversiones':
	               		i = getPosition(score.inversiones);
	        			if (i >= 0) {
	        				nir[2].scores[i] += 1;
	        			}
	                   	break;
	               	case 'Precios':
	               		i = getPosition(score.precios);
	        			if (i >= 0) {
	        				nir[3].scores[i] += 1;
	        			}
	                   	break;
	               	case 'Costes totales':
	               		i = getPosition(score.costesTotales);
	        			if (i >= 0) {
	        				nir[4].scores[i] += 1;
	        			}
	                   	break;
	        	}
        	});
			return nir;
        }

        function calculateNir(ICEBySector, indicadores) {
        	var nir = [
    			{
    				indicador: 'Resultado de negocio',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Empleo',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Inversiones',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Precios',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Costes totales',
    				scores: [0, 0, 0, 0, 0]
    			}
    		];

    		ICEBySector.forEach(function(ICE) {
        		ICE.scores.forEach(function(score) {
        			nir = getScoreForSectorForNir(score, indicadores, nir)
        		});
        	});

        	return nir;
        }

        function calculatePir(nir, n) {
        	var i = 0,
        		j = 0,
        		pir = [
    			{
    				indicador: 'Resultado de negocio',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Empleo',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Inversiones',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Precios',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Costes totales',
    				scores: [0, 0, 0, 0, 0]
    			}
    		];

        	nir.forEach(function(indicador) {
        		indicador.scores.forEach(function(score) {
        			pir[i].scores[j] = (nir[i].scores[j] * 100) / n;
        			j++;
        		});
        		i++;
        		j = 0;
        	});
        	
        	return pir;
        }

        function getPercent(value) {
        	var percent = 0;
        	switch(value) {
        		case 1:
        			percent = 1;
        			break;
        		case 2:
        			percent = 0.75;
        			break;
        		case 3:
        			percent = 0.5;
        			break;
        		case 4:
        			percent = 0.25;
        			break;
        	}

        	return percent;
        }

        function calculateXir(pir) {
        	var i = 0,
        		j = 0,
        		xir = [
    			{
    				indicador: 'Resultado de negocio',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Empleo',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Inversiones',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Precios',
    				scores: [0, 0, 0, 0, 0]
    			},
    			{
    				indicador: 'Costes totales',
    				scores: [0, 0, 0, 0, 0]
    			}
    		];

        	pir.forEach(function(indicador) {
        		indicador.scores.forEach(function(score) {
        			xir[i].scores[j] = pir[i].scores[j] * getPercent(j + 1);
        			j++;
        		});
        		i++;
        		j = 0;
        	});
        	
        	return xir;
        }

        function getScoreForSectorForNsir(score, indicadores, nsir) {
            var i;
            indicadores.forEach(function(indicador) {
                switch(indicador.nombre) {
                    case 'Resultado de negocio':
                        i = getPosition(score.resultadoNegocios);
                        if (i >= 0) {
                            nsir.values[0].scores[i] += 1;
                        }
                        break;
                    case 'Empleo':
                        i = getPosition(score.empleo);
                        if (i >= 0) {
                            nsir.values[1].scores[i] += 1;
                        }
                        break;
                    case 'Inversiones':
                        i = getPosition(score.inversiones);
                        if (i >= 0) {
                            nsir.values[2].scores[i] += 1;
                        }
                        break;
                    case 'Precios':
                        i = getPosition(score.precios);
                        if (i >= 0) {
                            nsir.values[3].scores[i] += 1;
                        }
                        break;
                    case 'Costes totales':
                        i = getPosition(score.costesTotales);
                        if (i >= 0) {
                            nsir.values[4].scores[i] += 1;
                        }
                        break;
                }
            });
            return nsir;
        }

        function calculateNsir(ICEBySector, indicadores, sector) {
            var nsir = {
                sector: sector.nombre,
                values: [
                    {
                        indicador: 'Resultado de negocio',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Empleo',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Inversiones',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Precios',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Costes totales',
                        scores: [0, 0, 0, 0, 0]
                    }
                ]
            };

            ICEBySector.forEach(function(ICE) {
                if (ICE.sector === sector.nombre) {
                    ICE.scores.forEach(function(score) {
                        nsir = getScoreForSectorForNsir(score, indicadores, nsir)
                    });
                }
            });

            return nsir;
        }

        function getNsForSector(sector, ns) {
            var value;
            switch (sector) {
                case 'Agricultura y pesca':
                    value = ns.agricola;
                    break;
                case 'Industria manufacturera':
                    value = ns.manufactura;
                    break;
                case 'Comercio y reparación':
                    value = ns.comercio;
                    break;
                case 'Turismo':
                    value = ns.turismo;
                    break;
                case 'Otros servicios':
                    value = ns.servicios;
                    break;
            }
            return (value === 0 ? 1 : value);
        }        

        function createPsir(sector) {
            return {
                sector: sector,
                values: [
                    {
                        indicador: 'Resultado de negocio',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Empleo',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Inversiones',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Precios',
                        scores: [0, 0, 0, 0, 0]
                    },
                    {
                        indicador: 'Costes totales',
                        scores: [0, 0, 0, 0, 0]
                    }
                ]
            };
        }

        function calculatePsir(nsir, ns) {
            var i = 0,
                j = 0,
                psir = [],
                psirSector;

            nsir.forEach(function(nsirSector) {
                psirSector = createPsir(nsirSector.sector);

                nsirSector.values.forEach(function(indicador) {
                    for ( ; j < indicador.scores.length; j++) {

                        psirSector.values[i].scores[j] = (indicador.scores[j] * 100) / getNsForSector(nsirSector.sector, ns);
                    }
                    i++;
                    j = 0;
                });
                i = 0;
                psir.push(psirSector);
            });
            
            return psir;
        }

        function calculateXsir(psir){
            var i = 0,
                j = 0,
                xsir = [],
                xsirSector;

            psir.forEach(function(psirSector){
                xsirSector = createPsir(psirSector.sector)

                psirSector.values.forEach(function(indicador) {
                    for ( ; j < indicador.scores.length; j++) {
                        xsirSector.values[i].scores[j] = (indicador.scores[j] * getPercent(j+1));
                    }
                    i++;
                    j = 0;
                });
                i = 0;
                xsir.push(xsirSector);
            });
            
            return xsir;
        }

        function calculateIndicadoresER(territorio,xsir){
            var j = 0,
                indicadoresER = {
                    territorio: territorio,
                    sectores: []                    
                },
                tempSector,
                tempIndicador;

            xsir.forEach(function(xsirSector) {
                tempSector = {
                    sector: xsirSector.sector,
                    indicadores: []
                };

                xsirSector.values.forEach(function(indicador) {
                    tempIndicador = {
                        indicador: indicador.indicador,
                        value: 0
                    };

                    for ( ; j < indicador.scores.length; j++) {                        
                        tempIndicador.value += indicador.scores[j]
                    }
                    tempIndicador.value = (tempIndicador.value * 2) - 100;

                    j = 0;
                    tempSector.indicadores.push(tempIndicador);
                });

                indicadoresER.sectores.push(tempSector);
            });

            return indicadoresER;
        }

        function calculateITS(xsir) {
            var its = [],
                j = 0,
                tempIts;

            xsir.forEach(function(xsirSector) {
                tempIts = {
                    sector: xsirSector.sector,
                    value: 0
                };

                xsirSector.values.forEach(function(indicador) {                    
                    for ( ; j < indicador.scores.length; j++) {                        
                        tempIts.value += indicador.scores[j]
                    }                    
                    j = 0;                    
                });
                tempIts.value = (2*(tempIts.value/5))-100;
                its.push(tempIts);
            });

            return its;
        }


        function calculateITI(ier, ps) {
            var iti = createITI(ier.sectores[0]),
                j = 0;
            ier.sectores.forEach(function(ierSector) {  
                for(; j < ierSector.indicadores.length; j++){
                    iti[j].value += ierSector.indicadores[j].value * getPsForSector(ierSector.sector, ps);
                }
                
                j = 0;  
            });

            return iti;
        }

        function createITI(ier){
            var iti = [];
            ier.indicadores.forEach(function(indicador) {
                iti.push({indicador: indicador.indicador, value: 0});
            });

            return iti;
        }

        function getPsForSector(sector, ps) {
            var value;
            
            switch (sector) {
                case 'Agricultura y pesca':
                    value = ps.agricola;
                    break;
                case 'Industria manufacturera':
                    value = ps.manufactura;
                    break;
                case 'Comercio y reparación':
                    value = ps.comercio;
                    break;
                case 'Turismo':
                    value = ps.turismo;
                    break;
                case 'Otros servicios':
                    value = ps.servicios;
                    break;
            }
            
            return value;
        }

        function prom(its, ps) {
            var prom = 0;

            its.forEach((sector) => {
                prom += sector.value * getPsForSector(sector.sector, ps);
            });

            return prom;
        }

        function createInfo(indicadores) {
            var info = [];

            indicadores.forEach((indicador) => {
                info.push({
                    indicador: indicador.indicador,
                    agricola: 0,
                    manufactura: 0,
                    comercio: 0,
                    turismo: 0,
                    servicios: 0,
                    rubro: 0
                });
            });

            info.push({
                indicador: 'Indicador territorial',
                agricola: 0,
                manufactura: 0,
                comercio: 0,
                turismo: 0,
                servicios: 0,
                rubro: 0
            });

            return info;
        }

        function insertIntoInfo(info, indicador, sector, value) {
            var i = 0,
                length = info.length;

            for ( ; i < length; i++) {
                if (info[i].indicador === indicador) {
                    switch (sector) {
                        case 'Agricultura y pesca':
                            info[i].agricola = value;
                            break;
                        case 'Industria manufacturera':
                            info[i].manufactura = value;
                            break;
                        case 'Comercio y reparación':
                            info[i].comercio = value;
                            break;
                        case 'Turismo':
                            info[i].turismo = value;
                            break;
                        case 'Otros servicios':
                            info[i].servicios = value;
                            break;
                    }
                    break;
                }
            }

            return info;
        }

        function insertIts(info, its, prom) {
            its.forEach((sector) => {
                switch (sector.sector) {
                    case 'Agricultura y pesca':
                        info.agricola = sector.value;
                        break;
                    case 'Industria manufacturera':
                        info.manufactura = sector.value;
                        break;
                    case 'Comercio y reparación':
                        info.comercio = sector.value;
                        break;
                    case 'Turismo':
                        info.turismo = sector.value;
                        break;
                    case 'Otros servicios':
                        info.servicios = sector.value;
                        break;
                }
            });

            info.rubro = prom;

            return info;
        }

        function insertIti(info, iti) {
            var i = 0,
                length = iti.length;

            info.forEach((indicador) => {
                for ( ; i < length; i++) {
                    if (indicador.indicador === iti[i].indicador) {
                        indicador.rubro = iti[i].value;
                    }
                }
                i = 0;
            });

            return info;
        }

        function manipulateInfo(indicadoresER, its, iti, prom) {
            var info = createInfo(indicadoresER.sectores[0].indicadores);

            indicadoresER.sectores.forEach((sector) => {
                sector.indicadores.forEach((indicador) => {
                    info = insertIntoInfo(info, indicador.indicador, sector.sector, indicador.value);
                });
            });

            info[info.length-1] = insertIts(info[info.length-1], its, prom);
            info = insertIti(info, iti);

            return info;
        }

	}
})();