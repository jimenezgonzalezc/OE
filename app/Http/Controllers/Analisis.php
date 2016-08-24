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
    /*function get($idPeriodo, $idTerritorio) {
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
    }*/

	public  function getAnalisis(){
		$analisis = [];
		$analisis[] = array('n' => -1, 'analisis1' => array(), 'analisis2' => array(), 'analisis3' => array());
		return $analisis;
	}

	public  function getSectoresID($sectores){
		$sectores_id = [];
		for( $i= 0 ; $i < count($sectores) ; $i++ )
		{
			$sectores_id[] = $sectores[$i]['id'];
		}
		return $sectores_id;
	}

	public function createJSON1($indicadores){
		$analisis = [];
		for( $i= 0 ; $i < count($indicadores) ; $i++ )
		{
			$analisis[] = array('indicador_id' => $indicadores[$i]['id'], 'nombre' => $indicadores[$i]['nombre'], 'nir' => array(), 'pir' => array(), 'xir' => array());
		}
		return $analisis;
	}

	public function createJSON2($indicadores, $sectores){
		$analizadoresSir = [];
		for( $s= 0 ; $s < count($sectores) ; $s++ )
		{
			$analizadoresSir[] = array('sector_id' => $sectores[$s]['id'], 'nombre' => $sectores[$s]['nombre'],
				'nsir' => array(),
				'psir' => array(),
				'xsir' => array());
			for( $i= 0 ; $i < count($indicadores) ; $i++ )
			{
				$analizadoresSir[$s]['nsir'][] = array('indicador_id' => $indicadores[$i]['id'], 'nombre' => $indicadores[$i]['nombre'], 'resultados' => array());
				$analizadoresSir[$s]['psir'][] = array('indicador_id' => $indicadores[$i]['id'], 'nombre' => $indicadores[$i]['nombre'], 'resultados' => array());
				$analizadoresSir[$s]['xsir'][] = array('indicador_id' => $indicadores[$i]['id'], 'nombre' => $indicadores[$i]['nombre'], 'resultados' => array());
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

	public function getICE(Request $request){
		$analisis = self::getNs($request->input('filtroSectores'), $request->input('periodo_id'));
		$analisis = self::getNir($analisis, $request->input('filtroIndicadores'), $request->input('periodo_id'));
		$analisis = self::getNsir($analisis, $request->input('filtroIndicadores'), $request->input('filtroSectores'), $request->input('periodo_id'));
		return $analisis;
	}

	public function getNs($sectores, $periodo){
		$analisis = self::getAnalisis();
		$sectores_id = self::getSectoresID($sectores);
		$ns = array();
		for( $i= 0 ; $i < count($analisis) ; $i++ ){
			$ns = Sectore::select('sectores.id', 'sectores.nombre', DB::raw('count(distinct aplicaciones.id) as ns, 0 as ps'))
				->join('encuestas', 'encuestas.sector_id', '=', 'sectores.id')
				->join('aplicaciones', 'aplicaciones.encuesta_id', '=', 'encuestas.id')
				->join('aplicaciones_respuestas', 'aplicaciones_respuestas.aplicacion_id', '=', 'aplicaciones.id')
				->whereIn('sectores.id', $sectores_id)
				->where('aplicaciones.periodo_id', '=', $periodo)
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
		return $analisis;
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

	public function getNir($analisis, $indicadores, $periodo){
		$analisis2 = self::createJSON1($indicadores);

		for( $i= 0 ; $i < count($indicadores) ; $i++ )//indicador
		{
			for( $r= 1 ; $r < 6 ; $r++ )//respuesta
			{
				$nir = AplicacionesRespuesta::select('aplicaciones_respuestas.id')
					->join('aplicaciones', 'aplicaciones_respuestas.aplicacion_id', '=', 'aplicaciones.id')
					->where('aplicaciones_respuestas.valor_respuesta', '=', $r)
					->where('aplicaciones_respuestas.indicador_id', '=', $indicadores[$i]['id'])
					->where('aplicaciones.periodo_id', '=', $periodo)
					->get()->count();

				$analisis2 = self::insertAnalisisNir($analisis2, $indicadores[$i]['id'], $r, $nir);
			}
		}
		$analisis[0]['analisis2'] = $analisis2;

		return self::getPir($analisis);
	}

	public function getPir($analisis){
		if ($analisis[0]['n'] != 0){
			for( $i= 0 ; $i < count($analisis[0]['analisis2']) ; $i++ )//indicador
			{
				for($r = 0; $r < count($analisis[0]['analisis2'][$i]['nir']); $r++){
					$pir = ($analisis[0]['analisis2'][$i]['nir'][$r]['valor_nir']*100)/$analisis[0]['n'];
					$analisis[0]['analisis2'][$i]['pir'][] = array('valor_respuesta' => $r+1, 'valor_pir' => $pir);
				}
			}
		}
		return self::getXir($analisis);
	}

	public function getXir($analisis)
	{
		for( $i= 0 ; $i < count($analisis[0]['analisis2']) ; $i++ )//indicador
		{
			for($r = 0; $r < count($analisis[0]['analisis2'][$i]['nir']); $r++){
				if (!empty($analisis[0]['analisis2'][$i]['pir'])){
					$xir = $analisis[0]['analisis2'][$i]['pir'][$r]['valor_pir']* self::getEquivalent($r);
					$analisis[0]['analisis2'][$i]['xir'][] = array('valor_respuesta' => $r+1, 'valor_xir' => $xir);
				}
			}
		}
		return $analisis;
	}

	public function getNsir($analisis, $indicadores, $sectores, $periodo){
		$analisis3 = self::createJSON2($indicadores, $sectores);

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
						->where('aplicaciones.periodo_id', '=', $periodo)
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
					if ($var != 0){
						$psir =  ($analisis[0]['analisis3'][$s]['nsir'][$i]['resultados'][$r]['valor_nsir']*100)/$var;
						$analisis[0]['analisis3'][$s]['psir'][$i]['resultados'][] = array('valor_respuesta' => $r+1, 'valor_psir' => $psir);
					}
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
					if (!empty($analisis[0]['analisis3'][$s]['psir'][$i]['resultados'])){
						$xsir = $analisis[0]['analisis3'][$s]['psir'][$i]['resultados'][$r]['valor_psir'] * self::getEquivalent($r);
						$analisis[0]['analisis3'][$s]['xsir'][$i]['resultados'][] = array('valor_respuesta' => $r+1, 'valor_xsir' => $xsir);
					}
				}
			}
		}
		return $analisis;
	}
}
