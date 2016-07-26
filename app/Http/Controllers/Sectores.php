<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Sectore;

class Sectores extends Controller
{
    public function getAll() {    	
        return Sectore::all();
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {       
        $sector = new Sectore;
        $sector->nombre = $request->input('nombre');
        $sector->descripcion = $request->input('descripcion');
        
        $sector->save();

        return $sector->id;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($id) {          
        $sector = Sectore::find($id);

        $sector->delete();

        return 'true';
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $sector = Sectore::find($request->input('id'));
        $sector->nombre = $request->input('nombre');  
        $sector->descripcion = $request->input('descripcion');        
        
        
        $sector->save();

        return 'true';
    }
}
