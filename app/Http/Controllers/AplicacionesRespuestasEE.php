<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\AplicacionesRespuestaEE;

class AplicacionesRespuestasEE extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getAll() {
        return AplicacionesRespuestaEE::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {

        $aplicacion_respuesta = new AplicacionesRespuestaEE;

        $aplicacion_respuesta->pregunta = $request->input('pregunta');
        $aplicacion_respuesta->respuesta = $request->input('respuesta');
        $aplicacion_respuesta->aplicacion_id = $request->input('aplicacion_id');
        $aplicacion_respuesta->comentarios = $request->input('comentario');
        $aplicacion_respuesta->indicador_id = $request->input('indicador_id');
        $aplicacion_respuesta->valor_respuesta = $request->input('valor_respuesta');

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
        $aplicacion = AplicacionesRespuestaEE::find($request->input('id'));
        $aplicacion->delete();

        return 'true';
    }
}
