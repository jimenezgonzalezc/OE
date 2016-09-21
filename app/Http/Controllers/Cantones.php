<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Canton;

class Cantones extends Controller
{
    public function getAll() {
        return Canton::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response id if all its okay
     */
    public function store(Request $request) {
        $canton = new Canton;
        $canton->nombre = $request->input('nombre');

        $canton->save();

        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($id) {
        $canton = Canton::find($id);
        $canton->delete();

        return 'true';
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $canton = Canton::find($request->input('id'));
        $canton->nombre = $request->input('nombre');

        $canton->save();

        return 'true';
    }
}
