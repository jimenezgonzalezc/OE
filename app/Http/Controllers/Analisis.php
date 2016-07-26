<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Aplicacione;

class Analisis extends Controller
{
    function get($idPeriodo, $idTerritorio) {
    	return Aplicacione::join('aplicaciones_respuestas', 'aplicaciones.id', '=', 'aplicaciones_respuestas.aplicacion_id')
    			->join('preguntas', 'preguntas.enunciado', '=', 'aplicaciones_respuestas.pregunta')
    			->join('indicadores', 'indicadores.id', '=', 'preguntas.indicador_id')
    			->join('personas_sectores', 'personas_sectores.persona_id', '=', 'aplicaciones.persona_id')
    			->join('sectores', 'sectores.id', '=', 'personas_sectores.sector_id')
                ->join('personas', 'personas.id', '=', 'aplicaciones.persona_id')
    			->select('aplicaciones.id', 'aplicaciones_respuestas.respuesta', 'indicadores.nombre', 'sectores.nombre as sector')
    			->where('aplicaciones.periodo_id', '=', $idPeriodo)
                ->where('personas.territorio_id', '=', $idTerritorio)
    			->get();
    }
}
