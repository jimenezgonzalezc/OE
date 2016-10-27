<?php

namespace App\Http\Controllers;

use App\DatosSectorIndicador;
use App\Indicadore;
use App\Sectore;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\DatosGrafico;
use App\DatosGeneral;

class DatosGraficos extends Controller
{
    public function getParametros() {
        $datosGrafico = DatosGrafico::join('periodos', 'periodos.id', '=', 'datos_graficos.periodo_id')
            //->select('datos_graficos.id', 'datos_graficos.nombre_sector', 'datos_graficos.descripcion', 'datos_graficos.valor', 'datos_graficos.tipo_evolucion', 'periodos.anio')
            ->select('datos_graficos.tipo_evolucion', 'periodos.anio', 'periodos.id as periodo_id', 'periodos.mes_inicio', 'periodos.mes_fin', 'datos_graficos.descripcion')
            ->groupby('periodos.id')->groupby('datos_graficos.tipo_evolucion')
            ->orderby('datos_graficos.id')
            ->get();

        $periodosAux = [];
        $id = 0;
        foreach ($datosGrafico as $dato) {
            if ($id != $dato['periodo_id']){
                $id = $dato['periodo_id'];
                $periodosAux[] = array("periodo_id" => $dato['periodo_id'], "anio" => $dato['anio'], "mes_inicio" => $dato['mes_inicio'], "mes_fin" => $dato['mes_fin'], "evoluciones" => array(), "descripcion" => $dato['descripcion']);
            }
        }
        $periodos = [];
        foreach ($periodosAux as $periodo) {
            $periodos[] = self::insertEvoluciones($datosGrafico, $periodo);
        }

        return $periodos;
    }

    public function getDatosGraficos() {
        return DatosGrafico::join('periodos', 'periodos.id', '=', 'datos_graficos.periodo_id')
            ->select('datos_graficos.id as datos_graficos_id', 'datos_graficos.descripcion', 'periodos.anio', 'periodos.mes_inicio',
                'periodos.mes_fin', 'periodos.id as periodo_id')
            ->orderby('datos_graficos.periodo_id')->get();
    }

    public function getDatosGenerales(){
        $datosGraficos = self::getDatosGraficos();
        foreach ($datosGraficos as $datoGrafico) {
            $datoGrafico->setAttribute('tipo_evoluciones',self::getTiposEvoluciones($datoGrafico['datos_graficos_id']));
        }
        return $datosGraficos;
    }

    public function getTiposEvoluciones($datoGrafico_id){
        $tipo_evoluciones = [];
        $tipo_evoluciones[] = array('tipo_evolucion' => 1, 'tipos' => self::getTipos($datoGrafico_id, 1), 'selected' => false);
        $tipo_evoluciones[] = array('tipo_evolucion' => 2, 'tipos' => self::getTipos($datoGrafico_id, 2), 'selected' => false);
        return $tipo_evoluciones;
    }

    public function getTipos($datoGrafico_id, $tipo_evolucion){
        $tipo = [];
        $tipo[] = array('tipo' => 1, 'valores' => self::getDatosGeneralesByAnalisis($datoGrafico_id, $tipo_evolucion, 1));
        $tipo[] = array('tipo' => 2, 'valores' => self::getDatosGeneralesByAnalisis($datoGrafico_id, $tipo_evolucion, 2));
        return $tipo;
    }

    public function getDatosGeneralesByAnalisis($datoGrafico_id, $tipo_evolucion, $tipo) {
        return DatosGeneral::where('datos_generales.datos_graficos_id', $datoGrafico_id)
            ->where('datos_generales.tipo_evolucion', $tipo_evolucion)
            ->where('datos_generales.tipo', $tipo)->get();
    }

    /**
     * Funciones para obtener datos para los los graficos por sectores
     */
    //SELECT * FROM `datos_sectores_indicadores` WHERE `datos_graficos_id` = 5 AND `sector_id` = 1 AND `tipo_evolucion` = 1
    public function getDatosSectores(){
        $datosGraficos = self::getDatosGraficos();
        foreach ($datosGraficos as $datoGrafico) {
            $datoGrafico->setAttribute('tipo_evoluciones',self::getSectorTiposEvoluciones($datoGrafico['datos_graficos_id']));
        }
        return $datosGraficos;
    }

    public function getSectorTiposEvoluciones($datoGrafico_id){
        $sector_tipo_evoluciones = [];
        $sector_tipo_evoluciones[] = array('tipo_evolucion' => 1, 'sectores' => self::getSectoresValores($datoGrafico_id, 1), 'selected' => false);
        $sector_tipo_evoluciones[] = array('tipo_evolucion' => 2, 'sectores' => self::getSectoresValores($datoGrafico_id, 2), 'selected' => false);
        return $sector_tipo_evoluciones;
    }

    public function getSectoresValores($datoGrafico_id, $tipo_evolucion){
        $sectoresValores = [];
        $sectores = self::getSectores();
        foreach ($sectores as $sector) {
            $sectoresValores[] = array('sector_id' => $sector['id'], 'sector_nombre' => $sector['nombre'],
                'valores' => self::getDatosSectoresByAnalisis($datoGrafico_id, $sector['id'], $tipo_evolucion));
        }
        return $sectoresValores;
    }

    public function getDatosSectoresByAnalisis($datoGrafico_id, $sector_id, $tipo_evolucion) {
        return DatosSectorIndicador::select('datos_sectores_indicadores.id', 'datos_sectores_indicadores.nombre_indicador',
            'datos_sectores_indicadores.indicador_id', 'datos_sectores_indicadores.valor')
            ->where('datos_sectores_indicadores.datos_graficos_id', $datoGrafico_id)
            ->where('datos_sectores_indicadores.sector_id', $sector_id)
            ->where('datos_sectores_indicadores.tipo_evolucion', $tipo_evolucion)
            ->orderBy('datos_sectores_indicadores.indicador_id')->get();
    }

    public function getSectores(){
        return Sectore::all();
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * Funciones para obtener datos para los los graficos por indicador
     */
    public function getDatosIndicadores(){
        $datosGraficos = self::getDatosGraficos();
        foreach ($datosGraficos as $datoGrafico) {
            $datoGrafico->setAttribute('tipo_evoluciones',self::getIndicadorTiposEvoluciones($datoGrafico['datos_graficos_id']));
        }
        return $datosGraficos;
    }

    public function getIndicadorTiposEvoluciones($datoGrafico_id){
        $indicador_tipo_evoluciones = [];
        $indicador_tipo_evoluciones[] = array('tipo_evolucion' => 1, 'indicadores' => self::getIndicadoresValores($datoGrafico_id, 1), 'selected' => false);
        $indicador_tipo_evoluciones[] = array('tipo_evolucion' => 2, 'indicadores' => self::getIndicadoresValores($datoGrafico_id, 2), 'selected' => false);
        return $indicador_tipo_evoluciones;
    }

    public function getIndicadoresValores($datoGrafico_id, $tipo_evolucion){
        $indicadoresValores = [];
        $indicadores = self::getIndicadores();
        foreach ($indicadores as $indicador) {
            $indicadoresValores[] = array('indicador_id' => $indicador['id'], 'indicador_nombre' => $indicador['nombre'],
                'valores' => self::getDatosIndicadoresByAnalisis($datoGrafico_id, $indicador['id'], $tipo_evolucion));
        }
        return $indicadoresValores;
    }

    public function getDatosIndicadoresByAnalisis($datoGrafico_id, $indicador_id, $tipo_evolucion) {
        return DatosSectorIndicador::select('datos_sectores_indicadores.id', 'datos_sectores_indicadores.nombre_sector',
            'datos_sectores_indicadores.sector_id', 'datos_sectores_indicadores.valor')
            ->where('datos_sectores_indicadores.datos_graficos_id', $datoGrafico_id)
            ->where('datos_sectores_indicadores.indicador_id', $indicador_id)
            ->where('datos_sectores_indicadores.tipo_evolucion', $tipo_evolucion)
            ->orderBy('datos_sectores_indicadores.indicador_id')->get();
    }

    public function getIndicadores(){
        return Indicadore::all();
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     */

    public function insertEvoluciones($datosGrafico, $periodo){
        foreach ($datosGrafico as $dato) {
            if ($dato['periodo_id'] == $periodo['periodo_id'])
                $periodo["evoluciones"][] = $dato;
        }
        return $periodo;
    }

    public function getDatosGraficoPeriodo() {
        return DatosGrafico::join('periodos', 'periodos.id', '=', 'datos_graficos.periodo_id')
            ->select('datos_graficos.id', 'datos_graficos.nombre_sector', 'datos_graficos.descripcion', 'datos_graficos.valor', 'datos_graficos.tipo_evolucion', 'periodos.anio', 'periodos.id as periodo_id', 'periodos.mes_inicio', 'periodos.mes_fin')
            ->groupby('datos_graficos.tipo_evolucion')
            ->groupby('periodos.id')
            ->orderby('datos_graficos.id')
            ->get();
    }

    // Gestion

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response id if all its okay
     */
    /*
     * {"datosGraficos" : [{"nombre": "Resultado de negocio",	"resultados": [{"nombre": "Agricultura y pesca","valor": "30"}, {"nombre": "Industria manufacturera","valor": "0"}]},
					{"nombre": "Empleo", 				"resultados": [{"nombre": "Agricultura y pesca","valor": "30"}, {"nombre": "Industria manufacturera","valor": "100"}]}] }*/

    public function guardarDatosGraficos(Request $request){
        $datosGraficos = $request->input('datosGraficos');
        $datos1 = $datosGraficos["datos1"];
        $datos2 = $datosGraficos["datos2"];

        $totales = $request->input('totales');
        $total1 = $totales["total1"];
        $total2 = $totales["total2"];

        $datosGrafico = array("periodo_id" => $request->input('periodo_id'), "descripcion" => $request->input('descripcion'));
        $datosGrafico = self::store($datosGrafico);

        foreach ($datos1 as $datoI) {
            $datosGenerales = array("datos_graficos_id" => $datosGrafico["id"], "nombre" => $datoI['nombre'],
                "valor" => $datoI["total_indicador"], "tipo" => 2, // indicador
                "tipo_evolucion" => 1, "id_valor" => $datoI["indicador_id"]);

            self::storeDatosGenerales($datosGenerales);

            foreach ($datoI["resultados"] as $resultado) {
                $datosSI = array("datos_graficos_id" => $datosGrafico["id"], "indicador_id" => $datoI['indicador_id'],
                    "nombre_indicador" => $datoI['nombre'], "sector_id" => $resultado['sector_id'],
                    "nombre_sector" => $resultado['nombre'], "valor" => $resultado['valor'],
                    "tipo" => 1,"tipo_evolucion" => 1);
                $a = self::storeDatosSectoresIndicadores($datosSI);
                if (!$a)
                    return 'false';
            }
        }

        foreach ($datos2 as $datoI) {
            $datosGenerales = array("datos_graficos_id" => $datosGrafico["id"], "nombre" => $datoI['nombre'],
                "valor" => $datoI["total_indicador"], "tipo" => 2,
                "tipo_evolucion" => 2, "id_valor" => $datoI["indicador_id"]);

            self::storeDatosGenerales($datosGenerales);

            foreach ($datoI["resultados"] as $resultado) {
                $datosSI = array("datos_graficos_id" => $datosGrafico["id"], "indicador_id" => $datoI['indicador_id'],
                    "nombre_indicador" => $datoI['nombre'], "sector_id" => $resultado['sector_id'],
                    "nombre_sector" => $resultado['nombre'], "valor" => $resultado['valor'],
                    "tipo" => 1,"tipo_evolucion" => 2);
                $a = self::storeDatosSectoresIndicadores($datosSI);
                if (!$a)
                    return 'false';
            }
        }

        foreach ($total1["resultados"] as $resultados) {
            $datosGenerales = array("datos_graficos_id" => $datosGrafico["id"], "nombre" => $resultados['nombre'],
                "valor" => $resultados["valor"], "tipo" => 1, // sector
                "tipo_evolucion" => $total1["tipo_evolucion"], "id_valor" => $resultados["sector_id"]);
            self::storeDatosGenerales($datosGenerales);
        }

        foreach ($total2["resultados"] as $resultados) {
            $datosGenerales = array("datos_graficos_id" => $datosGrafico["id"], "nombre" => $resultados['nombre'],
                "valor" => $resultados["valor"], "tipo" => 1, // sector
                "tipo_evolucion" => $total2["tipo_evolucion"], "id_valor" => $resultados["sector_id"]);
            self::storeDatosGenerales($datosGenerales);
        }
        //return $datosGrafico;
        return 'true';
    }

    public function store($request) {
        $datosGrafico = new DatosGrafico;

        $datosGrafico->periodo_id = $request['periodo_id'];
        $datosGrafico->descripcion = $request['descripcion'];

        $datosGrafico->save();

        return $datosGrafico;
    }

    public function storeDatosGenerales($request) {
        $datosGeneral = new DatosGeneral;

        $datosGeneral->datos_graficos_id = $request['datos_graficos_id'];
        $datosGeneral->nombre = $request['nombre'];
        $datosGeneral->valor = $request['valor'];
        $datosGeneral->tipo = $request['tipo'];
        $datosGeneral->tipo_evolucion = $request['tipo_evolucion'];
        $datosGeneral->id_valor = $request['id_valor'];

        $datosGeneral->save();

        return 'true';
    }

    public function storeDatosSectoresIndicadores($request) {
        $datosSectoresIndicadores = new DatosSectorIndicador;

        $datosSectoresIndicadores->datos_graficos_id = $request['datos_graficos_id'];
        $datosSectoresIndicadores->indicador_id = $request['indicador_id'];
        $datosSectoresIndicadores->nombre_indicador = $request['nombre_indicador'];
        $datosSectoresIndicadores->sector_id = $request['sector_id'];
        $datosSectoresIndicadores->nombre_sector = $request['nombre_sector'];
        $datosSectoresIndicadores->valor = $request['valor'];
        $datosSectoresIndicadores->tipo = $request['tipo'];
        $datosSectoresIndicadores->tipo_evolucion = $request['tipo_evolucion'];

        $datosSectoresIndicadores->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return Response
     */
    public function destroy($id) {
        $datosGrafico = DatosGrafico::find($id);
        $datosGrafico->delete();

        return 'true';
    }

    public function destroyByAnio($anio) {
        $datosGrafico = DatosGrafico::join('periodos', 'periodos.id', '=', 'datos_graficos.periodo_id')
        ->where('periodos.anio', $anio)->delete();

        return 'true';
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $datosGrafico = DatosGrafico::find($request->input('id'));
        $datosGrafico->periodo_id = $request->input('periodo_id');
        $datosGrafico->descripcion = $request->input('descripcion');

        $datosGrafico->save();

        return 'true';
    }

}
