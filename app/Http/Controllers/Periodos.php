<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Periodo;

class Periodos extends Controller
{
    /**
     * Obtiene todos los periodos.
     * @return Array Lista con los periodos.
     */
	public function getAll() {     
        return Periodo::orderBy('anio')->orderBy('mes_inicio')->get();
    }
    
    /**
     * Obtiene un periodo para una aplicación.
     * @param  Request $request [description]
     * @return Object           Objeto con la información del periodo.
     */
    public function getForAplicacion(Request $request) {
        return Periodo::where('anio', $request->input('anio'))->where('cuatrimestre', $request->input('cuatrimestre'))->select('id')->get();
    }

    public function store(Request $request) {
        $nPeriodo = new Periodo;
        $nPeriodo->anio = $request->input('anio');
        $nPeriodo->mes_inicio = $request->input('mes_inicio');
        $nPeriodo->mes_fin = $request->input('mes_fin');
        $nPeriodo->modo_periodicidad = $request->input('modo_periodicidad');
        $nPeriodo->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($id) {                  
        $periodo = Periodo::find($id);
        $periodo->delete();

        return 'true';
    }

    public function deleteByYear($anio) {

        DB::table('periodos')->where('anio', $anio)->delete();

        return 'true';
    }

    /**
     * Valida si se ha definido la periodicidad de un año
     *
     * @param  Request  $request
     * @return Response
     */
    public function validarPeriodicidad($anio){
        return Periodo::where('anio', $anio)->count();
    }
}
