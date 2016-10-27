(function() {
    'use strict';

    angular
        .module('observatoryApp')
        .controller('DatosGraficosController', DatosGraficosController);


    function DatosGraficosController($scope, DatosGraficosFactory, $mdDialog) {
        $scope.getMes = getMes;
        $scope.getEvolucion = getEvolucion;
        $scope.createDataSet = createDataSet;
        $scope.eliminarDatosGraficos =eliminarDatosGraficos;
        $scope.saveCanvas = saveCanvas;
        $scope.getDatosGraficos = getDatosGraficos;

        $scope.etiquetas1 = '';
        $scope.etiquetas2 = '';
        $scope.btnDescargar = false;

        $scope.graficosGenerales = false;
        $scope.graficosSectores = false;
        $scope.graficosIndicadores = false;

        function generarGrafico(ds, num, titulo, etiquetas) {

            var canvasGraf = '';
            var div = '';

            if(num === 1){
                canvasGraf = 'graficoICE1';
                div = 'divGraficoICE1';
            }
            else{
                canvasGraf = 'graficoICE2';
                div = 'divGraficoICE2';
            }

            var parent = document.getElementById(div);
            var child = document.getElementById(canvasGraf);
            parent.removeChild(child);

            var canv = document.createElement('canvas');
            canv.id = canvasGraf;
            parent.appendChild(canv);

            var canvas = document.getElementById(canvasGraf);
            var context = canvas.getContext('2d');

            var myChart = new Chart(context, {
                type: 'bar',
                data: {
                    labels: etiquetas,
                    datasets: ds
                },
                options: {
                    tooltip:{display: true},
                    title: {
                        display: true,
                        text: titulo
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(50, 50, 50)'
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        }

        /**
         * Obtiene cada analisis en las tre categorias de graficos(general, sector, indicador)
         */
        function getDatosGraficos(){
            DatosGraficosFactory.getDatosGraficos()
                .then(function (response) {
                    $scope.datosGraficos = response;
                })
                .catch(function(err) {
                    $scope.datosGraficos = true;
                    $scope.errorConn = true;
                });

            DatosGraficosFactory.getDatosGenerales()
                .then(function (response) {
                    $scope.datosGenerales = response;
                })
                .catch(function(err) {
                    $scope.datosGenerales = true;
                    $scope.errorConn = true;
                });

            DatosGraficosFactory.getDatosSectores()
                .then(function (response) {
                    $scope.datosSectores = response;
                })
                .catch(function(err) {
                    $scope.datosSectores = true;
                    $scope.errorConn = true;
                });

            DatosGraficosFactory.getDatosIndicadores()
                .then(function (response) {
                    $scope.datosIndicadores = response;
                })
                .catch(function(err) {
                    $scope.datosIndicadores = true;
                    $scope.errorConn = true;
                });
        }

        getDatosGraficos();

        function createDataSet() {
            $scope.datasets1 = [];
            $scope.datasets2 = [];
            $scope.graficosGenerales = false;

            $scope.datosGenerales.forEach(function (analisis) {
                analisis.tipo_evoluciones.forEach(function (evolucion) {
                    if(evolucion.selected === true){
                        $scope.graficosGenerales = true;
                        if ($scope.etiquetas1 === ''){
                            $scope.etiquetas1 = DatosGraficosFactory.getLabels(evolucion.tipos[0].valores);
                        }

                        if ($scope.etiquetas2 === ''){
                            $scope.etiquetas2 = DatosGraficosFactory.getLabels(evolucion.tipos[1].valores);
                        }

                        if (evolucion.tipos.length === 2){
                            $scope.datasets1.push(DatosGraficosFactory.getDataSet(evolucion.tipos[0].valores, analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion) ));
                            $scope.datasets2.push(DatosGraficosFactory.getDataSet(evolucion.tipos[1].valores, analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion) ));
                        }
                        $scope.btnDescargar = true;
                    }
                });
            });
            if($scope.datasets1.length !== 0)
                generarGrafico($scope.datasets1, 1, 'Índice medio por sector', $scope.etiquetas1);
            if($scope.datasets2.length !== 0)
                generarGrafico($scope.datasets2, 2, 'Índice medio por indicador', $scope.etiquetas2);
            generarDataSetSectores();
            generarDataSetIndicadores();
        }

        function generarDataSetSectores() {
            $scope.graficosSectores = false;
            $scope.datasetsSectores = [];
            $scope.datosSectores.forEach(function (analisis) {
                analisis.tipo_evoluciones.forEach(function (evolucion) {
                    if(evolucion.selected === true){
                        $scope.graficosSectores = true;
                        evolucion.sectores.forEach(function (sector) {
                            if($scope.datasetsSectores.length === evolucion.sectores.length){
                                $scope.datasetsSectores.forEach(function (sectorAux) {
                                    if (sectorAux.sector_id === sector.sector_id){
                                        var titulo = analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                                        sectorAux.datasets.push(DatosGraficosFactory.getDataSet(sector.valores, titulo));
                                    }
                                });
                            }
                            else{
                                var grafico = {sector_id: 0, titulo: "", datasets: [], labels: ""};
                                var titulo = analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                                grafico.sector_id = sector.sector_id;
                                grafico.titulo = sector.sector_nombre;
                                grafico.labels = DatosGraficosFactory.getLabelsSectores(sector.valores);
                                grafico.datasets.push(DatosGraficosFactory.getDataSet(sector.valores, titulo));
                                $scope.datasetsSectores.push(grafico);
                            }
                        });
                    }
                });
            });
            if ($scope.datasetsSectores !== 0)
                generarGraficosSectores($scope.datasetsSectores);
        }

        function generarDataSetIndicadores() {
            $scope.graficosIndicadores = false;
            $scope.datasetsIndicadores = [];
            $scope.datosIndicadores.forEach(function (analisis) {
                analisis.tipo_evoluciones.forEach(function (evolucion) {
                    if(evolucion.selected === true){
                        $scope.graficosIndicadores = true;
                        evolucion.indicadores.forEach(function (indicador) {
                            if($scope.datasetsIndicadores.length === evolucion.indicadores.length){
                                $scope.datasetsIndicadores.forEach(function (indicadorAux) {
                                    if (indicadorAux.indicador_id === indicador.indicador_id){
                                        var titulo = analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                                        indicadorAux.datasets.push(DatosGraficosFactory.getDataSet(indicador.valores, titulo));
                                    }
                                });
                            }
                            else{
                                var grafico = {indicador_id: 0, titulo: "", datasets: [], labels: ""};
                                var titulo = analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                                grafico.indicador_id = indicador.indicador_id;
                                grafico.titulo = indicador.indicador_nombre;
                                grafico.labels = DatosGraficosFactory.getLabelsIndicadores(indicador.valores);
                                grafico.datasets.push(DatosGraficosFactory.getDataSet(indicador.valores, titulo));
                                $scope.datasetsIndicadores.push(grafico);
                            }
                        });
                    }
                });
            });
            if ($scope.datasetsIndicadores !== 0)
                generarGraficosIndicadores($scope.datasetsIndicadores);
        }

        function generarGraficosSectores(graficos) {
            var i = 1;
            graficos.forEach(function (grafico) {

                var parent = document.getElementById('divGraficoSector' + i);
                var child = document.getElementById('graficoSector' + i);
                parent.removeChild(child);

                var canv = document.createElement('canvas');
                canv.id = 'graficoSector' + i;
                parent.appendChild(canv);

                var canvas = document.getElementById('graficoSector' + i);
                var context = canvas.getContext('2d');

                var myChart = new Chart(context, {
                    type: 'bar',
                    data: {
                        labels: grafico.labels,
                        datasets: grafico.datasets
                    },
                    options: {
                        tooltip:{display: true},
                        title: {
                            display: true,
                            text: grafico.titulo
                        },
                        legend: {
                            display: true,
                            labels: {
                                fontColor: 'rgb(50, 50, 50)'
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
                i++;
            });

        }

        function generarGraficosIndicadores(graficos) {
            var i = 1;
            graficos.forEach(function (grafico) {

                var parent = document.getElementById('divGraficoIndicador' + i);
                var child = document.getElementById('graficoIndicador' + i);
                parent.removeChild(child);

                var canv = document.createElement('canvas');
                canv.id = 'graficoIndicador' + i;
                parent.appendChild(canv);

                var canvas = document.getElementById('graficoIndicador' + i);
                var context = canvas.getContext('2d');

                var myChart = new Chart(context, {
                    type: 'bar',
                    data: {
                        labels: grafico.labels,
                        datasets: grafico.datasets
                    },
                    options: {
                        tooltip:{display: true},
                        title: {
                            display: true,
                            text: grafico.titulo
                        },
                        legend: {
                            display: true,
                            labels: {
                                fontColor: 'rgb(50, 50, 50)'
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
                i++;
            });

        }

        function getMes(numMes) {
            var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
            return meses[numMes-1];
        }

        function getEvolucion(pos) {
            var evol = ["real","esperada"];
            return evol[pos-1];
        }

        function eliminarDatosGraficos(ev, anio) {
            mensajeYN(ev, anio);
        }

        function mensajeYN(ev, anio) {
            var confirm = $mdDialog.confirm('?')
                .title('¿Esta seguro que desea eliminar los datos?')
                .textContent('Se eliminarán todos los datos del año: ' + anio)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function() {
                    DatosGraficosFactory.destroyByAnio(anio)
                        .then(function (response) {
                            getDatosGraficos();
                        })
                }, function() {});
        }

        function saveCanvas(num) {
            var a = '';
            var canvas = '';

            if(num === 1){
                a = 'imgGrafico1';
                canvas = 'graficoICE1';
            }
            else{
                a = 'imgGrafico2';
                canvas = 'graficoICE2';
            }
            var button = document.getElementById(a);
            button.href = document.getElementById(canvas).toDataURL();
            button.download = 'ICE.png';
        }

        $scope.setDataGrafico = function (datoGrafico) {
            $scope.datoGrafico_id = datoGrafico.datos_graficos_id;
        };

        var texto = '';

        $scope.generarDocumento = function () {
            texto = '<!DOCTYPE html><head><meta charset="utf-8"></head>';

            var converted = htmlDocx.asBlob($scope.generarDocumentoByOpcion(), {orientation: 'landscape'});
            saveAs(converted, 'test.docx');
            //var sass = $scope.generarDocumentoByOpcion();
            //console.log(sass);
        };

        $scope.generarDocumentoByOpcion = function () {
            $scope.documentos.forEach(function(documento){
                if (documento.selected) {
                    if (documento.tipo === 1)
                        $scope.getDatosDocumentosGenerales();
                    if (documento.tipo === 2)
                        $scope.getDatosDocumentosSectores();
                    if (documento.tipo === 3)
                        $scope.getDatosDocumentosIndicadores();
                }
            });
            return texto;
        };

        $scope.getDatosDocumentosGenerales = function () {
            angular.forEach($scope.datosGenerales, function(datoGeneral) {
                if (datoGeneral.datos_graficos_id === $scope.datoGrafico_id){
                    $scope.generarDocumentoGenerales(datoGeneral);
                }
            });
        };

        $scope.getDatosDocumentosSectores = function () {
            angular.forEach($scope.datosSectores, function(datoSector) {
                if (datoSector.datos_graficos_id === $scope.datoGrafico_id){
                    $scope.generarDocumentoSectores(datoSector);
                }
            });
        };

        $scope.getDatosDocumentosIndicadores = function () {
            angular.forEach($scope.datosIndicadores, function(datoIndicador) {
                if (datoIndicador.datos_graficos_id === $scope.datoGrafico_id){
                    $scope.generarDocumentoIndicadores(datoIndicador);
                }
            });
        };

        $scope.generarDocumentoSectores = function (datoSector) {
            $scope.datasetsSectores = [];

            datoSector.tipo_evoluciones.forEach(function (evolucion) {
                evolucion.sectores.forEach(function (sector) {
                    if ($scope.datasetsSectores.length === evolucion.sectores.length) {
                        $scope.datasetsSectores.forEach(function (sectorAux) {
                            if (sectorAux.sector_id === sector.sector_id) {
                                var titulo = datoSector.anio + " " + getMes(datoSector.mes_inicio) + " - " + getMes(datoSector.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                                sectorAux.datasets.push(DatosGraficosFactory.getDataSet(sector.valores, titulo));
                            }
                        });
                    }
                    else {
                        var grafico = {sector_id: 0, titulo: "", datasets: [], labels: ""};
                        var titulo = datoSector.anio + " " + getMes(datoSector.mes_inicio) + " - " + getMes(datoSector.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                        grafico.sector_id = sector.sector_id;
                        grafico.titulo = sector.sector_nombre;
                        grafico.labels = DatosGraficosFactory.getLabelsSectores(sector.valores);
                        grafico.datasets.push(DatosGraficosFactory.getDataSet(sector.valores, titulo));
                        $scope.datasetsSectores.push(grafico);
                    }
                });
            });

            if ($scope.datasetsSectores !== 0) {
                $scope.datasetsSectores.forEach(function (grafico) {
                    $scope.generarGrafico(grafico.datasets, grafico.titulo, grafico.labels);
                    var valores = $scope.getDataDocumento(grafico.datasets, grafico.labels);
                    $scope.getGrafico(grafico.titulo, datoSector.descripcion, valores);
                });
            }
        };

        $scope.generarDocumentoIndicadores = function (datoIndicador) {
            $scope.datasetsIndicadores = [];

            datoIndicador.tipo_evoluciones.forEach(function (evolucion) {
                evolucion.indicadores.forEach(function (indicador) {
                    if ($scope.datasetsIndicadores.length === evolucion.indicadores.length) {
                        $scope.datasetsIndicadores.forEach(function (indicadorAux) {
                            if (indicadorAux.indicador_id === indicador.indicador_id) {
                                var titulo = datoIndicador.anio + " " + getMes(datoIndicador.mes_inicio) + " - " + getMes(datoIndicador.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                                indicadorAux.datasets.push(DatosGraficosFactory.getDataSet(indicador.valores, titulo));
                            }
                        });
                    }
                    else {
                        var grafico = {indicador_id: 0, titulo: "", datasets: [], labels: ""};
                        var titulo = datoIndicador.anio + " " + getMes(datoIndicador.mes_inicio) + " - " + getMes(datoIndicador.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);
                        grafico.indicador_id = indicador.indicador_id;
                        grafico.titulo = indicador.indicador_nombre;
                        grafico.labels = DatosGraficosFactory.getLabelsIndicadores(indicador.valores);
                        grafico.datasets.push(DatosGraficosFactory.getDataSet(indicador.valores, titulo));
                        $scope.datasetsIndicadores.push(grafico);
                    }
                });
            });

            if ($scope.datasetsIndicadores !== 0) {
                $scope.datasetsIndicadores.forEach(function (grafico) {
                    console.log(grafico);
                    $scope.generarGrafico(grafico.datasets, grafico.titulo, grafico.labels);
                    var valores = $scope.getDataDocumento(grafico.datasets, grafico.labels);
                    $scope.getGrafico(grafico.titulo, datoIndicador.descripcion, valores);
                });
            }
        };

        $scope.generarDocumentoGenerales = function (datoGeneral) {
            $scope.datasets1 = [];
            $scope.datasets2 = [];
            $scope.graficosGenerales = false;
            $scope.etiquetas1 = '';
            $scope.etiquetas2 = '';

            datoGeneral.tipo_evoluciones.forEach(function (evolucion) {
                    if ($scope.etiquetas1 === ''){
                        $scope.etiquetas1 = DatosGraficosFactory.getLabels(evolucion.tipos[0].valores);
                    }

                    if ($scope.etiquetas2 === ''){
                        $scope.etiquetas2 = DatosGraficosFactory.getLabels(evolucion.tipos[1].valores);
                    }

                    if (evolucion.tipos.length === 2){
                        $scope.datasets1.push(DatosGraficosFactory.getDataSet(evolucion.tipos[0].valores, datoGeneral.anio + " " + getMes(datoGeneral.mes_inicio) + " - " + getMes(datoGeneral.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion) ));
                        $scope.datasets2.push(DatosGraficosFactory.getDataSet(evolucion.tipos[1].valores, datoGeneral.anio + " " + getMes(datoGeneral.mes_inicio) + " - " + getMes(datoGeneral.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion) ));
                    }
            });
            if($scope.datasets1.length !== 0){
                $scope.generarGrafico($scope.datasets1, 'Índice medio por sector', $scope.etiquetas1);
                var valores1 = $scope.getDataDocumento($scope.datasets1, $scope.etiquetas1);
                $scope.getGrafico('Índice medio por sector', datoGeneral.descripcion, valores1);
            }

            if($scope.datasets2.length !== 0){
                $scope.generarGrafico($scope.datasets2, 'Índice medio por indicador', $scope.etiquetas2);
                var valores2 = $scope.getDataDocumento($scope.datasets2, $scope.etiquetas2);
                $scope.getGrafico('Índice medio por indicador', datoGeneral.descripcion, valores2);
            }
        };

        $scope.getDataDocumento = function (datos, etiquetas) {
            var valores = [];

            datos.forEach(function (dato) {
                var dataSet = [];
                var i = 0;
                dato.data.forEach(function (valor) {
                    dataSet.push({nombre: etiquetas[i], valor: valor});
                    i++;
                });
                i = 0;
                valores.push(dataSet);
            });
            return valores;
        };

        //Grafico utilizado en los documentos
        $scope.generarGrafico = function(ds, titulo, etiquetas) {
            var parent = document.getElementById('divgraficoAux');
            var child = document.getElementById('graficoAux');
            parent.removeChild(child);

            var canv = document.createElement('canvas');
            canv.id = 'graficoAux';
            parent.appendChild(canv);

            var canvas = document.getElementById('graficoAux');
            var context = canvas.getContext('2d');

            var myChart = new Chart(context, {
                type: 'bar',
                data: {
                    labels: etiquetas,
                    datasets: ds
                },
                options: {
                    tooltip:{display: true},
                    title: {
                        display: true,
                        text: titulo
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(50, 50, 50)'
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    bezierCurve : false,
                    animation: false
                }
            });
            console.log(myChart);
        };

        $scope.getGrafico = function (titulo, descripcion, valores) {
            var canvasAux = document.getElementById("graficoAux");
            var img    = canvasAux.toDataURL("image/png");
            console.log('grafico', img);
            $scope.datosNV = '';
            valores.forEach(function (valor) {
                valor.forEach(function (item) {
                    $scope.datosNV += '<br><p>' + item.nombre + ' ' + item.valor + '</p>'
                });
            });
            texto += '<h2>' + titulo + '</h2><br><h2>Descripcion</h2><br><p>' + descripcion + '</p><br>' + $scope.datosNV + '<br><img src="' + img + '"><br><br>';
        };

        $scope.documentos = [{selected: false, tipo: 1, nombre: " Documento de gráfico general"},
            {selected: false, tipo: 2, nombre: " Documento de gráfico por Sector"}, {selected: false, tipo: 3, nombre: " Documento de gráfico por Indicador"}];

        $scope.selectAllDocumentos = function() {
            var toggleStatus = $scope.allDocumentos;
            angular.forEach($scope.documentos, function(documento){ documento.selected = toggleStatus; });
        };

        $scope.selectDocumento = function(){
            $scope.allDocumentos = $scope.documentos.every(function(documento){ return documento.selected; });
        };

        $scope.descargarDocumento = function () {
            angular.forEach($scope.documentos, function(documento){ if (documento.selected)console.log(documento.nombre);});
        };

    }
})();