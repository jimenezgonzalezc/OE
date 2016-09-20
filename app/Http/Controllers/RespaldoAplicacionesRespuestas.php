<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\RespaldoAplicacionesRespuesta;

class RespaldoAplicacionesRespuestas extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getAll() {
        return RespaldoAplicacionesRespuesta::all();
    }

    public function getByAplicacionId($aplicacion_id) {
        return RespaldoAplicacionesRespuesta::where('aplicacion_id', $aplicacion_id)->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {

        $aplicacion_respuesta = new RespaldoAplicacionesRespuesta;

        $aplicacion_respuesta->pregunta = $request->input('pregunta');
        $aplicacion_respuesta->pregunta_id = $request->input('pregunta_id');
        $aplicacion_respuesta->respuesta = $request->input('respuesta');
        $aplicacion_respuesta->aplicacion_id = $request->input('aplicacion_id');
        $aplicacion_respuesta->comentarios = $request->input('comentario');
        $aplicacion_respuesta->indicador_id = $request->input('indicador_id');
        $aplicacion_respuesta->valor_respuesta = $request->input('valor_respuesta');
        $aplicacion_respuesta->tipo_evolucion = $request->input('tipo_evolucion');

        $aplicacion_respuesta->save();

        return 'true';
    }

    public function update(Request $request) {
        $aplicacion_respuesta = RespaldoAplicacionesRespuesta::where('pregunta_id', $request->input('pregunta_id'))
            ->where('tipo_evolucion', $request->input('tipo_evolucion'))
            ->where('aplicacion_id', $request->input('aplicacion_id'))->first();

        $aplicacion_respuesta->respuesta = $request->input('respuesta');
        $aplicacion_respuesta->comentarios = $request->input('comentario');
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
        $aplicacion = RespaldoAplicacionesRespuesta::find($request->input('id'));
        $aplicacion->delete();

        return 'true';
    }

    public function removeByAplicacionId($aplicacion_id) {
        RespaldoAplicacionesRespuesta::where('aplicacion_id', $aplicacion_id)->delete();
        return 'true';
    }
}
