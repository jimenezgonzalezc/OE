<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\EncuestasPregunta;

class EncuestasPreguntas extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {
        $encuestaId = $request->input('encuestaId');
        $questionsId = substr(json_encode($request->input('questions')), 1, -1);
        $questionsId = explode(',', $questionsId);

        foreach ($questionsId as $id) {
            $encuestasPregunta = new EncuestasPregunta;

            $encuestasPregunta->pregunta_id = (int)$id;
            $encuestasPregunta->encuesta_id = $encuestaId;

            $encuestasPregunta->save();
        }

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($questions) {
        $questionsId = substr(json_encode($questions), 1, -1);
        $questionsId = explode(',', $questionsId);

        foreach ($questionsId as $id) {
            $encuestasPregunta = EncuestasPregunta::find((int)$id);
            $encuestasPregunta->delete();
        }

        return 'true';
    }

    public function getNumberOfQuestions($idEncuesta) {
        return EncuestasPregunta::where('encuestas_preguntas.encuesta_id', '=', $idEncuesta)->count();
    }
}
