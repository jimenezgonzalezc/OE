<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Aplicacione;
use App\Sectore;
use App\AplicacionesRespuesta;
use App\AplicacionesRespuestaEE;
use Illuminate\Support\Facades\DB;

class Analisis extends Controller
{
	public  function getAnalisis(){
		$analisis = [];
		$analisis[] = array('n' => -1, 'analisis1' => array(), 'analisis2' => array(), 'analisis3' => array(), 'analisis4' => array(), 'totales' => array());
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

	public function createJSON3($indicadores, $sectores){
		$analisisIndices = [];

		for( $i= 0 ; $i < count($indicadores) ; $i++ )
		{
			$analisisIndices[] = array('indicador_id' => $indicadores[$i]['id'], 'nombre' => $indicadores[$i]['nombre'],
				'resultados' => array(),
				'total_indicador' => 0);
			for( $s= 0 ; $s < count($sectores) ; $s++ )
			{
				$analisisIndices[$i]['resultados'][] = array('sector_id' => $sectores[$s]['id'], 'nombre' => $sectores[$s]['nombre'], 'valor' => 0);
			}
		}
		return $analisisIndices;
	}

	public function createJSONTotales($sectores){
		$analisisTotal = ['resultados' => array(), 'total_columna_indicador' => 0];

		for( $s = 0 ; $s < count($sectores) ; $s++ )
		{
			$analisisTotal['resultados'][] = array('sector_id' => $sectores[$s]['id'], 'nombre' => $sectores[$s]['nombre'],
				'valor' => 0);
		}
		return $analisisTotal;
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
		$analisis = self::getNs($request->input('filtroSectores'), $request->input('periodo_id'), $request->input('evolucion'));
		$analisis = self::getNir($analisis, $request->input('filtroIndicadores'), $request->input('periodo_id'), $request->input('evolucion'));
		$analisis = self::getNsir($analisis, $request->input('filtroIndicadores'), $request->input('filtroSectores'), $request->input('periodo_id'), $request->input('evolucion'));
		$analisis = self::getER($analisis, $request->input('filtroIndicadores'), $request->input('filtroSectores'));
		$analisis = self::calcularTotalesSector($analisis, $request->input('filtroSectores'));
		return $analisis;
	}

	public function getNs($sectores, $periodo, $evolucion){
		$analisis = self::getAnalisis();
		$sectores_id = self::getSectoresID($sectores);
		$ns = array();

		if ($evolucion == 1)
			$tabla = 'aplicaciones_respuestas';
		else
			$tabla = 'aplicaciones_respuestas_ee';

		for( $i= 0 ; $i < count($analisis) ; $i++ ){
			$ns = Sectore::select('sectores.id', 'sectores.nombre', DB::raw('count(distinct aplicaciones.id) as ns, 0 as ps'))
				->join('encuestas', 'encuestas.sector_id', '=', 'sectores.id')
				->join('aplicaciones', 'aplicaciones.encuesta_id', '=', 'encuestas.id')
				->join($tabla, $tabla.'.aplicacion_id', '=', 'aplicaciones.id')
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

	public function getNir($analisis, $indicadores, $periodo, $evolucion){
		$analisis2 = self::createJSON1($indicadores);

		/*if ($evolucion == 1)
			$tabla = 'aplicaciones_respuestas';
		else
			$tabla = 'aplicaciones_respuestas_ee';*/

		for( $i= 0 ; $i < count($indicadores) ; $i++ )//indicador
		{
			for( $r= 1 ; $r < 6 ; $r++ )//respuesta
			{
				if ($evolucion == 1){
					$nir = AplicacionesRespuesta::select('aplicaciones_respuestas.id')
						->join('aplicaciones', 'aplicaciones_respuestas.aplicacion_id', '=', 'aplicaciones.id')
						->where('aplicaciones_respuestas.valor_respuesta', '=', $r)
						->where('aplicaciones_respuestas.indicador_id', '=', $indicadores[$i]['id'])
						->where('aplicaciones.periodo_id', '=', $periodo)
						->get()->count();
				}
				else{
					$nir = AplicacionesRespuestaEE::select('aplicaciones_respuestas_ee.id')
						->join('aplicaciones', 'aplicaciones_respuestas_ee.aplicacion_id', '=', 'aplicaciones.id')
						->where('aplicaciones_respuestas_ee.valor_respuesta', '=', $r)
						->where('aplicaciones_respuestas_ee.indicador_id', '=', $indicadores[$i]['id'])
						->where('aplicaciones.periodo_id', '=', $periodo)
						->get()->count();
				}
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

	public function getNsir($analisis, $indicadores, $sectores, $periodo, $evolucion){
		$analisis3 = self::createJSON2($indicadores, $sectores);

		/*if ($evolucion == 1)
			$tabla = 'aplicaciones_respuestas';
		else
			$tabla = 'aplicaciones_respuestas_ee';*/

		for( $s= 0 ; $s < count($analisis3) ; $s++ )//sector
		{
			for( $i= 0 ; $i < count($analisis3[$s]['nsir']); $i++ )//indicador
			{
				for( $r= 1 ; $r < 6 ; $r++ )//respuesta
				{
					if ($evolucion == 1){
						$nsir = AplicacionesRespuesta::select('aplicaciones_respuestas.id')
							->join('aplicaciones', 'aplicaciones.id', '=', 'aplicaciones_respuestas.aplicacion_id')
							->join('encuestas', 'encuestas.id', '=', 'aplicaciones.encuesta_id')
							->join('sectores', 'sectores.id', '=', 'encuestas.sector_id')
							->where('aplicaciones_respuestas.indicador_id', '=', $analisis3[$s]['nsir'][$i]['indicador_id'])
							->where('sectores.id', '=', $analisis3[$s]['sector_id'])
							->where('aplicaciones_respuestas.valor_respuesta', '=', $r)
							->where('aplicaciones.periodo_id', '=', $periodo)
							->get()->count();
					}
					else{
						$nsir = AplicacionesRespuestaEE::select('aplicaciones_respuestas_ee.id')
							->join('aplicaciones', 'aplicaciones.id', '=', 'aplicaciones_respuestas_ee.aplicacion_id')
							->join('encuestas', 'encuestas.id', '=', 'aplicaciones.encuesta_id')
							->join('sectores', 'sectores.id', '=', 'encuestas.sector_id')
							->where('aplicaciones_respuestas_ee.indicador_id', '=', $analisis3[$s]['nsir'][$i]['indicador_id'])
							->where('sectores.id', '=', $analisis3[$s]['sector_id'])
							->where('aplicaciones_respuestas_ee.valor_respuesta', '=', $r)
							->where('aplicaciones.periodo_id', '=', $periodo)
							->get()->count();
					}
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

	public function insertER($analisis4, $indicador_id, $sector_id, $valor){
		for( $i= 0 ; $i < count($analisis4); $i++ )//indicador
		{
			if ($analisis4[$i]['indicador_id'] == $indicador_id)
			{
				for( $s= 0 ; $s < count($analisis4[$i]['resultados']) ; $s++ )//sector
				{
					if ($analisis4[$i]['resultados'][$s]['sector_id'] == $sector_id)
					{
						$analisis4[$i]['resultados'][$s]['valor'] = $valor;
					}
				}
			}

		}
		return $analisis4;
	}

	public function getER($analisis, $indicadores, $sectores){
		$analisis4 = self::createJSON3($indicadores, $sectores);

		for( $s= 0 ; $s < count($analisis[0]['analisis3']) ; $s++ )//sector
		{
			for($i= 0 ; $i < count($analisis[0]['analisis3'][$s]['xsir']); $i++ )//indicador
			{
				$resXsir = 0;
				for( $r= 0 ; $r < count($analisis[0]['analisis3'][$s]['xsir'][$i]['resultados']) ; $r++ )//resultados
				{
					$resXsir += $analisis[0]['analisis3'][$s]['xsir'][$i]['resultados'][$r]['valor_xsir'];
				}
				$resIndicador = ($resXsir * 2)-100;
				$analisis4 =  self::insertER($analisis4, $analisis[0]['analisis3'][$s]['xsir'][$i]['indicador_id'], $analisis[0]['analisis3'][$s]['sector_id'], $resIndicador);
			}
		}
		$analisis4 = self::calcularTotalesIndicador($analisis4);
		$analisis[0]['analisis4'] = $analisis4;
		return $analisis;
	}

	public function insertTotalesIndicador($analisis4, $indicador_id, $valor){
		for( $i= 0 ; $i < count($analisis4); $i++ )//indicador
		{
			if ($analisis4[$i]['indicador_id'] == $indicador_id)
			{
				$analisis4[$i]['total_indicador'] = $valor;
			}
		}
		return $analisis4;
	}

	public function calcularTotalesIndicador($analisis4){
		foreach ($analisis4 as $indicador) {
			$totalIndicador = 0;
			foreach ($indicador['resultados'] as $sector) {
				$totalIndicador += $sector['valor'];
			}
			$valor = $totalIndicador / count($indicador['resultados']);
			$analisis4 = self::insertTotalesIndicador($analisis4, $indicador['indicador_id'], $valor);
		}
		return $analisis4;
	}

	public function insertTotalesSector($analisisTotal, $sector_id, $valor){
		$con = 0;
		for( $i= 0 ; $i < count($analisisTotal['resultados']); $i++ )
		{
			if ($analisisTotal['resultados'][$i]['sector_id'] == $sector_id)
			{
				$analisisTotal['resultados'][$i]['valor'] = $analisisTotal['resultados'][$i]['valor'] + $valor;
			}
			$con+=1;
		}
		return $analisisTotal;
	}

	public function getPs($analisis, $sector_id){
		$ps = 0;
		for( $i= 0 ; $i < count($analisis[0]['analisis1']); $i++ ){
			if ($analisis[0]['analisis1'][$i]['id'] == $sector_id){
				$ps = $analisis[0]['analisis1'][$i]['ps'];
				break;
			}
		}
		return $ps;
	}

	public function calcularTotalesSector($analisis, $sectores){
		$analisisTotal = self::createJSONTotales($sectores);
		$contadorIndicadores = count($analisis[0]['analisis4']);
		for( $i= 0 ; $i < count($analisis[0]['analisis4']); $i++ )//indicador
		{
			for( $s= 0 ; $s < count($analisis[0]['analisis4'][$i]['resultados']) ; $s++ )//sector
			{
				$analisisTotal = self::insertTotalesSector($analisisTotal, $analisis[0]['analisis4'][$i]['resultados'][$s]['sector_id'], $analisis[0]['analisis4'][$i]['resultados'][$s]['valor']);
			}
		}

		for( $i= 0 ; $i < count($analisisTotal['resultados']); $i++ )
		{
			$analisisTotal['resultados'][$i]['valor'] = $analisisTotal['resultados'][$i]['valor'] / $contadorIndicadores;
		}
		$analisis[0]['totales'] = $analisisTotal;

		$tci = 0;
		for( $i= 0 ; $i < count($analisisTotal['resultados']); $i++ )
		{
			$ps = self::getPs($analisis, $analisisTotal['resultados'][$i]['sector_id']);
			$tci = $tci + $analisisTotal['resultados'][$i]['valor'] * $ps;
		}
		$analisisTotal['total_columna_indicador'] = $tci;
		$analisis[0]['totales'] = $analisisTotal;
		return $analisis;
	}
}