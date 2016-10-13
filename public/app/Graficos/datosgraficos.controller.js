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
                    $scope.datosGraficos = true;
                    $scope.errorConn = true;
                });

            DatosGraficosFactory.getDatosSectores()
                .then(function (response) {
                    $scope.datosSectores = response;
                })
                .catch(function(err) {
                    $scope.datosGraficos = true;
                    $scope.errorConn = true;
                });

            DatosGraficosFactory.getDatosIndicadores()
                .then(function (response) {
                    $scope.datosIndicadores = response;
                    console.log(response);
                })
                .catch(function(err) {
                    $scope.datosGraficos = true;
                    $scope.errorConn = true;
                });
        }

        getDatosGraficos();

        function createDataSet() {
            $scope.datasets1 = [];
            $scope.datasets2 = [];
                
            $scope.datosGenerales.forEach(function (analisis) {
                analisis.tipo_evoluciones.forEach(function (evolucion) {

                    if(evolucion.selected === true){
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
            $scope.datasetsSectores = [];
            $scope.datosSectores.forEach(function (analisis) {
                analisis.tipo_evoluciones.forEach(function (evolucion) {
                    if(evolucion.selected === true){
                        evolucion.sectores.forEach(function (sector) {
                            if($scope.datasetsSectores.length === evolucion.sectores.length){
                                $scope.datasetsSectores.forEach(function (sectorAux) {
                                    if (sectorAux.sector_id === sector.sector_id){
                                        var titulo = analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);;
                                        sectorAux.datasets.push(DatosGraficosFactory.getDataSet(sector.valores, titulo));
                                    }
                                });
                            }
                            else{
                                var grafico = {sector_id: 0,titulo: "", datasets: [], labels: ""};
                                var titulo = analisis.anio + " " + getMes(analisis.mes_inicio) + " - " + getMes(analisis.mes_fin) + " Evolucion " + getEvolucion(evolucion.tipo_evolucion);;
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
            $scope.datasetsIndicadores = [];
            $scope.datosIndicadores.forEach(function (analisis) {
                analisis.tipo_evoluciones.forEach(function (evolucion) {
                    if(evolucion.selected === true){
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
                                var grafico = {indicador_id: 0,titulo: "", datasets: [], labels: ""};
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
                            getDatosGraficosParametros();
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
    }
})();