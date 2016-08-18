<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\AplicacionesRespuesta;

class AplicacionesRespuestas extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getAll() {
        return AplicacionesRespuesta::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {

        $aplicacion_respuesta = new AplicacionesRespuesta;

        $aplicacion_respuesta->pregunta = $request->input('pregunta');
        $aplicacion_respuesta->respuesta = $request->input('respuesta');
        $aplicacion_respuesta->aplicacion_id = $request->input('aplicacion_id');
        $aplicacion_respuesta->comentarios = $request->input('comentario');

        $aplicacion_respuesta->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function remove(Request $request) {
      $aplicacion = AplicacionesRespuesta::find($request->input('id'));
      $aplicacion->delete();

      return 'true';
    }

    // /**
    //  * Retorna las aplicaciones(Encuestas) que corresponden a la persona dada.
    //  *
    //  * @param  Request  $request
    //  * @return Response
    //  */
    // public function getAplicacionesByPersona(Request $request) {
    //   $idPersona = $request->input('persona_id');
    //
    //   $aplicacion = Aplicacione::select('aplicaciones.id', 'aplicaciones.fechaAplicacion', 'aplicaciones.encuesta_id', 'aplicaciones.persona_id', 'aplicaciones.periodo_id')
    //       ->where('persona_id', $idPersona)
    //       ->get();
    //   return $aplicacion;
    // }

    // /**
    //  * Display a listing of the resource.
    //  *
    //  * @return Response
    //  */
    // public function getForSurvey(Request $request) {
    // 	$idEncuesta = $request->input('idEncuesta');
    //
    //     return Aplicacione::join('personas', 'aplicaciones.persona_id', '=', 'personas.id')
    //     		->where('aplicaciones.encuesta_id', '=', $idEncuesta)
    //             ->select('aplicaciones.id as idAplicacion', 'personas.id as idPersona', 'personas.nombre', 'personas.apellido1', 'personas.apellido2', 'personas.email', 'personas.tipo')
    //             ->orderBy('aplicaciones.id', 'asc')
    //             ->get();
    // }
}
