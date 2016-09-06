<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Territorio;

class Territorios extends Controller
{
    public function getAll() {
        return Territorio::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response id if all its okay
     */
    public function store(Request $request) {     
        $territorio = new Territorio;        
        $territorio->nombre = $request->input('nombre');
        $territorio->descripcion = $request->input('descripcion');
        $territorio->region_id = $request->input('region_id');

        $territorio->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($id) {                  
        $territorio = Territorio::find($id);
        $territorio->delete();

        return 'true';
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $territorio = Territorio::find($request->input('id'));
        $territorio->nombre = $request->input('nombre');  
        $territorio->descripcion = $request->input('descripcion');                
        $territorio->region_id = $request->input('region_id');
        
        $territorio->save();

        return 'true';
    }
}
