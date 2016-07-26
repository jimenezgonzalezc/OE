<?php

namespace App\Http\Controllers;

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
        return Periodo::all();
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
        $perido = new Periodo;
        $perido->anio = $request->input('year');
        $perido->cuatrimestre = $request->input('quarter');

        $perido->save();

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

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $periodo = Periodo::find($request->input('id'));
        $periodo->anio = $request->input('year');  
        $periodo->cuatrimestre = $request->input('quarter');                
        
        $periodo->save();

        return 'true';
    }
}
