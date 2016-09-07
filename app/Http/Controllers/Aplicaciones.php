<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Aplicacione;
use Carbon\Carbon;

class Aplicaciones extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getAll() {
        return Aplicacione::all();
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getForSurvey(Request $request) {
    	$idEncuesta = $request->input('idEncuesta');

        return Aplicacione::join('personas', 'aplicaciones.persona_id', '=', 'personas.id')
        		->where('aplicaciones.encuesta_id', '=', $idEncuesta)
                ->select('aplicaciones.id as idAplicacion', 'personas.id as idPersona', 'personas.nombre', 'personas.apellido1', 'personas.apellido2', 'personas.email', 'personas.tipo','aplicaciones.periodo_id')
                ->orderBy('aplicaciones.id', 'asc')
                ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {
        $idEncuesta = $request->input('idEncuesta');
        $idPeriodo = $request->input('idPeriodo');
        $fecha = $request->input('fecha');
        $entrepreneursId = substr(json_encode($request->input('entrepreneurs')), 1, -1);
        $entrepreneursId = explode(',', $entrepreneursId);

        foreach ($entrepreneursId as $id) {
            $aplicacion = new Aplicacione;

            $aplicacion->fechaAplicacion = $fecha;
            $aplicacion->encuesta_id = $idEncuesta;
            $aplicacion->persona_id = (int)$id;
            $aplicacion->periodo_id = $idPeriodo;

            $aplicacion->save();
        }

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($aplications) {
        $aplications = substr(json_encode($aplications), 1, -1);
        $aplications = explode(',', $aplications);

        foreach ($aplications as $id) {
            $aplicacion = Aplicacione::find((int)$id);
            $aplicacion->delete();
        }

        return 'true';
    }

    /**
     * Retorna las aplicaciones(Encuestas) que corresponden a la persona dada.
     *
     * @param  Request  $request
     * @return Response
     */
    public function getAplicacionesByPersona(Request $request) {
        $idPersona = $request->input('persona_id');
        
        $date = $this->getFechaActual();
        $month = $date->month;
        $year = $date->year;
        $periodo = $this->getPeriodoActual($month);

      $aplicacion = Aplicacione::join('periodos', 'periodos.id', '=', 'aplicaciones.periodo_id')
          ->select('aplicaciones.id', 'aplicaciones.fechaAplicacion', 'aplicaciones.encuesta_id', 'aplicaciones.persona_id', 'aplicaciones.periodo_id')
          ->where('persona_id', $idPersona)
          ->where('periodos.anio',(int)$year)
          //->where('periodos.cuatrimestre',(int)$periodo)
          ->get();
      return $aplicacion;
    }


    public function getAplicacionesPersonasEncuestas() {
        $date = $this->getFechaActual();
        $month = $date->month;
        $year = $date->year;
        $periodo = $this->getPeriodoActual($month);

        return Aplicacione::join('encuestas', 'encuestas.id', '=', 'aplicaciones.encuesta_id')
            ->join('personas', 'personas.id', '=', 'aplicaciones.persona_id')
            ->join('periodos', 'periodos.id', '=', 'aplicaciones.periodo_id')
            ->select('aplicaciones.id as idAplicacion', 'aplicaciones.fechaAplicacion', 'aplicaciones.encuesta_id',
                'aplicaciones.persona_id as idEmpresario', 'aplicaciones.periodo_id', 
                'encuestas.id as idEncuesta', 'encuestas.descripcion', 'encuestas.estado', 'encuestas.fechaCreacion', 
                'encuestas.fechaModificacion', 'personas.nombre', 
                'personas.apellido1', 'personas.apellido2', 'personas.tipo')
            ->where('periodos.anio',(int)$year)
            //->where('periodos.cuatrimestre',(int)$periodo)
            ->where('aplicaciones.encuestador', '=', '')
            ->get();
    }

    /**
     * Update the resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $idAplicacion = $request->input('id');
        $nombreEncuestador = $request->input('encuestador');

        $aplicacion = Aplicacione::find((int)$idAplicacion);
        $aplicacion->encuestador = $nombreEncuestador;

        $aplicacion->save();

        return 'true';
    }

    public function getFechaActual(){

        $date = Carbon::now();

        return $date;
    }
    public function getPeriodoActual($month){

        if ($month>=1 and $month<=4)
            return 1;
        else if ($month>=5 and $month<=8)
            return 2;
        else
            return 3;
    }
}
