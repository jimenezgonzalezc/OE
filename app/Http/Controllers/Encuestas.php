<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Encuesta;

class Encuestas extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {
        $encuesta = new Encuesta;

        $encuesta->descripcion = $request->input('descripcion');
        $encuesta->estado = $request->input('estado');
        $encuesta->fechaCreacion = $request->input('fechaCreacion');
        $encuesta->fechaModificacion = $request->input('fechaModificacion');
        $encuesta->persona_id = $request->input('persona_id');
        $encuesta->sector_id = $request->input('sector_id');


        $encuesta->save();

        return 'true';
    }

    public function getAll() {
        return Encuesta::join('personas', 'encuestas.persona_id', '=', 'personas.id')
                ->select('encuestas.id', 'encuestas.descripcion', 'encuestas.estado', 'encuestas.fechaCreacion', 'encuestas.fechaModificacion', 'personas.nombre', 'personas.apellido1', 'personas.apellido2')
                ->orderBy('encuestas.id', 'asc')
                ->get();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $encuesta = Encuesta::find($request->input('id'));

        $encuesta->descripcion = $request->input('descripcion');
        $encuesta->fechaModificacion = $request->input('fecha');

        $encuesta->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($id) {
        $encuesta = Encuesta::find($id);

        $encuesta->delete();

        return 'true';
    }

    /**
     * Change the state of a inquest.
     *
     * @param  Request $request
     * @return Response
     */
    public function changeState(Request $request) {
        $encuesta = Encuesta::find($request->input('id'));

        $encuesta->estado = $request->input('state');

        $encuesta->save();

        return 'true';
    }

    /**
     * Get al questions of a test.
     *
     * @param  Int $id
     * @return Response
     */
    public function getQuestions($id) {
        return Encuesta::join('encuestas_preguntas', 'encuestas.id', '=', 'encuestas_preguntas.encuesta_id')
                ->join('preguntas', 'encuestas_preguntas.pregunta_id', '=', 'preguntas.id')
                ->select('encuestas_preguntas.id', 'encuestas_preguntas.pregunta_id', 'preguntas.enunciado')
                ->orderBy('encuestas_preguntas.id', 'asc')
                ->where('encuestas.id', '=', $id)
                ->get();
    }

    /**
     * Obtiene las encuestas buscadas por id
     *
     * @param  Request $request
     * @return Response
     */
    public function getEncuestas(Request $request) {
        return Encuesta::select('encuestas.id', 'encuestas.descripcion', 'encuestas.estado', 'encuestas.persona_id')
                        ->whereIn('encuestas.id', $request->input('id'))
                        ->get();
    }
}
