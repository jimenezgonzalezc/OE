<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Indicadore;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class Indicadores extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getAll($id = null) {

        return Indicadore::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {
        $indicador = new Indicadore;

        $indicador->nombre = $request->input('name');
        $indicador->descripcion = $request->input('description');

        $indicador->save();

        return $indicador->id;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request) {
        $indicador = Indicadore::find($request->input('id'));

        $indicador->nombre = $request->input('name');
        $indicador->descripcion = $request->input('description');
        $indicador->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $indicador = Indicadore::find($id);

        $indicador->delete();

        return 'true';
    }
}

