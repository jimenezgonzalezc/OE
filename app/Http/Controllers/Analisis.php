<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Aplicacione;
use App\Sectore;
use App\AplicacionesRespuesta;
use Illuminate\Support\Facades\DB;

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

	function getRespuestas($idPeriodo) {
		$indicadores = self::getIndicadores();
		return Aplicacione::join('aplicaciones_respuestas', 'aplicaciones.id', '=', 'aplicaciones_respuestas.aplicacion_id')
			->join('encuestas', 'encuestas.id', '=', 'aplicaciones.encuesta_id')
			->join('sectores', 'sectores.id', '=', 'encuestas.sector_id')
			->join('indicadores', 'indicadores.id', '=', 'aplicaciones_respuestas.indicador_id')
			->select('aplicaciones.id AS aplicacion_id', 'aplicaciones_respuestas.valor_respuesta', 'indicadores.id AS indicador_id', 'sectores.id AS sector_id')
			->where('aplicaciones.periodo_id', '=', $idPeriodo)
			->whereIn('indicadores.id', $indicadores)
			->get();
	}

	public  function getAnalisis(){
		$analisis = [];
		$analisis[] = array('n' => -1, 'analisis1' => array(), 'analisis2' => array(), 'analisis3' => array());
		return $analisis;
	}

	public  function getIndicadores(){
		$indicadores = array(1,2,3,4,5);
		return $indicadores;
	}

	public  function getSectores(){
		$sectores = array(1,2,3,4,5);
		return $sectores;
	}

	public function createJSON1(){
		$indicadores = self::getIndicadores();
		$analisis = [];
		for( $i= 0 ; $i < count($indicadores) ; $i++ )
		{
			$analisis[] = array('indicador_id' => $indicadores[$i], 'nir' => array(), 'pir' => array(), 'xir' => array());
		}
		//echo json_encode( $analisis);
		return $analisis;
	}

	public function createJSON2(){
		$indicadores = self::getIndicadores();
		$sectores = self::getSectores();

		$analizadoresSir = [];
		for( $s= 0 ; $s < count($sectores) ; $s++ )
		{
			$analizadoresSir[] = array('sector_id' => $sectores[$s],
				'nsir' => array(),
				'psir' => array(),
				'xsir' => array());
			for( $i= 0 ; $i < count($indicadores) ; $i++ )
			{
				$analizadoresSir[$s]['nsir'][] = array('indicador_id' => $indicadores[$i], 'resultados' => array());
				$analizadoresSir[$s]['psir'][] = array('indicador_id' => $indicadores[$i], 'resultados' => array());
				$analizadoresSir[$s]['xsir'][] = array('indicador_id' => $indicadores[$i], 'resultados' => array());
			}
		}
		return $analizadoresSir;
	}

	public function insertAnalisisNir($analisis, $indicador_id, $valor_respuesta, $nir){
		for( $i= 0 ; $i < count($analisis) ; $i++ )
		{
			if ($analisis[$i]['indicador_id'] == $indicador_id){
				$analisis[$i]['nir'][] = array('valor_respuesta' => $valor_respuesta, 'valor_nir' => $nir);
			}
		}
		return $analisis;
	}

	public function getEquivalent($valor_respuesta){
		$porc = array(1, 0.75, 0.5, 0.25, 0);
		return $porc[$valor_respuesta];
	}

	public function getNs(){
		$analisis = self::getAnalisis();
		$sectores = self::getSectores();
		$ns = array();
		for( $i= 0 ; $i < count($analisis) ; $i++ ){
			$ns = Sectore::select('sectores.id', 'sectores.nombre', DB::raw('count(distinct aplicaciones.id) as ns, 0 as ps'))
				->join('encuestas', 'encuestas.sector_id', '=', 'sectores.id')
				->join('aplicaciones', 'aplicaciones.encuesta_id', '=', 'encuestas.id')
				->join('aplicaciones_respuestas', 'aplicaciones_respuestas.aplicacion_id', '=', 'aplicaciones.id')
				->groupby('encuestas.sector_id')
				->get();
		}
		$n = 0;
		foreach ($ns as &$nsSector) {
			$n += $nsSector->ns;
		}

		foreach ($ns as &$nsSector) {
			$nsSector->ps = $nsSector->ns/$n;
		}

		$analisis[0]['n'] = $n;
		$analisis[0]['analisis1'] = $ns;
		return 	self::getNir($analisis);
	}

	public function getNsbyId($ns, $idSector){
		$nsAux = 0;
		for( $i= 0 ; $i < count($ns) ; $i++ )
		{
			if ($ns[$i]['id'] == $idSector){
				$nsAux = $ns[$i]['ns'];
				break;
			}
		}
		return $nsAux;
	}

	public function getNir($analisis){
		$indicadores = self::getIndicadores();
		$analisis2 = self::createJSON1();

		for( $i= 0 ; $i < count($indicadores) ; $i++ )//indicador
		{
			for( $r= 1 ; $r < 6 ; $r++ )//respuesta
			{
				$nir = AplicacionesRespuesta::select('aplicaciones_respuestas.id')
					->where('aplicaciones_respuestas.valor_respuesta', '=', $r)
					->where('aplicaciones_respuestas.indicador_id', '=', $indicadores[$i])
					->get()->count();

				$analisis2 = self::insertAnalisisNir($analisis2, $indicadores[$i], $r, $nir);
			}
		}
		$analisis[0]['analisis2'] = $analisis2;

		return self::getPir($analisis);
	}

	public function getPir($analisis){
		$analisis[0]['analisis1'];
		for( $i= 0 ; $i < count($analisis[0]['analisis2']) ; $i++ )//indicador
		{
			for($r = 0; $r < count($analisis[0]['analisis2'][$i]['nir']); $r++){
				$pir = ($analisis[0]['analisis2'][$i]['nir'][$r]['valor_nir']*100)/$analisis[0]['n'];
				$analisis[0]['analisis2'][$i]['pir'][] = array('valor_respuesta' => $r, 'valor_pir' => $pir);
			}
		}
		return self::getXir($analisis);
	}

	public function getXir($analisis)
	{
		for( $i= 0 ; $i < count($analisis[0]['analisis2']) ; $i++ )//indicador
		{
			for($r = 0; $r < count($analisis[0]['analisis2'][$i]['nir']); $r++){
				$xir = $analisis[0]['analisis2'][$i]['pir'][$r]['valor_pir']* self::getEquivalent($r);
				$analisis[0]['analisis2'][$i]['xir'][] = array('valor_respuesta' => $r, 'valor_xir' => $xir);
			}
		}
		return self::getNsir($analisis);
	}

	public function getNsirAux($s, $i, $r){
		$respuestas =  self::getRespuestas(3);

		$contador = 0;
		for( $j= 0 ; $j < count($respuestas); $j++ )
		{
			if ($respuestas[$j]['sector_id'] == $s and $respuestas[$j]['indicador_id'] == $i and $respuestas[$j]['valor_respuesta'] == $r){
				$contador++;
			}
		}
		return $contador;
	}

	public function getNsir($analisis){
		$analisis3 = self::createJSON2();

		for( $s= 0 ; $s < count($analisis3) ; $s++ )//sector
		{
			for( $i= 0 ; $i < count($analisis3[$s]['nsir']); $i++ )//indicador
			{
				for( $r= 1 ; $r < 6 ; $r++ )//respuesta
				{
					$nsir = AplicacionesRespuesta::select('aplicaciones_respuestas.id')
						->join('aplicaciones', 'aplicaciones.id', '=', 'aplicaciones_respuestas.aplicacion_id')
						->join('encuestas', 'encuestas.id', '=', 'aplicaciones.encuesta_id')
						->join('sectores', 'sectores.id', '=', 'encuestas.sector_id')
						->where('aplicaciones_respuestas.indicador_id', '=', $analisis3[$s]['nsir'][$i]['indicador_id'])
						->where('sectores.id', '=', $analisis3[$s]['sector_id'])
						->where('aplicaciones_respuestas.valor_respuesta', '=', $r)
						->get()->count();
					//$nsir = self::getNsirAux($analizadoresSir[$s]['sector_id'], $analizadoresSir[$s]['nsir'][$i]['indicador_id'], $r);
					$analisis3[$s]['nsir'][$i]['resultados'][] = array('valor_respuesta' => $r, 'valor_nsir' => $nsir);
				}
			}
		}
		$analisis[0]['analisis3'] = $analisis3;
		return self::getPsir($analisis);
	}

	public function getPsir($analisis){
		for( $s= 0 ; $s < count($analisis[0]['analisis3']) ; $s++ )//sector
		{
			for( $i= 0 ; $i < count($analisis[0]['analisis3'][$s]['nsir']); $i++ )//indicador
			{
				for( $r= 0 ; $r < count($analisis[0]['analisis3'][$s]['nsir'][$i]['resultados']) ; $r++ )//resultados
				{
					$var = self::getNsbyId($analisis[0]['analisis1'], $analisis[0]['analisis3'][$s]['sector_id']);
					$psir =  ($analisis[0]['analisis3'][$s]['nsir'][$i]['resultados'][$r]['valor_nsir']*100)/$var;
					$analisis[0]['analisis3'][$s]['psir'][$i]['resultados'][] = array('valor_respuesta' => $r+1, 'valor_psir' => $psir);
				}
			}
		}
		return self::getXsir($analisis);
	}

	public function getXsir($analisis){
		for( $s= 0 ; $s < count($analisis[0]['analisis3']) ; $s++ )//sector
		{
			for( $i= 0 ; $i < count($analisis[0]['analisis3'][$s]['nsir']); $i++ )//indicador
			{
				for( $r= 0 ; $r < count($analisis[0]['analisis3'][$s]['nsir'][$i]['resultados']) ; $r++ )//resultados
				{
					$xsir = $analisis[0]['analisis3'][$s]['psir'][$i]['resultados'][$r]['valor_psir'] * self::getEquivalent($r);
					$analisis[0]['analisis3'][$s]['xsir'][$i]['resultados'][] = array('valor_respuesta' => $r+1, 'valor_xsir' => $xsir);
				}
			}
		}
		return $analisis;
	}
}
