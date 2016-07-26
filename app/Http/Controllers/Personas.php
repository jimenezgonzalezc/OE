<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Persona;

class Personas extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {       
        $persona = new Persona;

        $persona->cedula = $request->input('cedula');
        $persona->nombre = $request->input('nombre');
        $persona->apellido1 = $request->input('apellido1');
        $persona->apellido2 = $request->input('apellido2');
        $persona->email = $request->input('email');
        $persona->contrasena = md5($request->input('contrasena'));
        $persona->tipo = $request->input('tipo');        
        $persona->territorio_id = $request->input('territorio_id');
        $persona->save();

        return 'true';
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $persona = Persona::find($request->input('id'));
        $persona->nombre = $request->input('nombre');  
        $persona->apellido1 = $request->input('apellido1');
        $persona->apellido2 = $request->input('apellido2');
        $persona->email = $request->input('email');          
        $persona->cedula = $request->input('cedula'); 
        $persona->tipo = $request->input('tipo');  
        $persona->territorio_id = $request->input('territorio_id');
        
        $persona->save();

        return 'true';
    }
    
    /**
     * Verify an existing email
     *
     * @param  Request  $request
     * @return Response
     */
    public function ifExist(Request $request) {
        return Persona::where($request->input('fieldToValidate'), $request->input('field'))->select('email','id')->get();
    }

    /**
     * Obtiene la persona buscada por id
     *
     * @param  Request  $request
     * @return Response
     */
    public function getPersona(Request $request) {
        return Persona::find($request->input('id'));
    }
    
    /**
     * Return a specific user by email.
     *
     * @return Response
     */
    public function logIn(Request $request) {
        return Persona::where('email', $request->input('email'))->where('contrasena', md5($request->input('contrasena')))->select('id', 'cedula', 'nombre', 'apellido1', 'apellido2', 'email', 'tipo')->get();
    }

    /**
     * Return all records
     *
     * @return Response
     */
    public function getAll() {
        return Persona::all();
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function destroy($id) {          
        $persona = Persona::find($id);

        $persona->delete();

        return 'true';
    }

    /**
     * Get rows related to an specific territory
     *
     * @param  Request  $request
     * @return Response
     */
    public function getByTerritory($territorio) {          
        return Persona::where('territorio_id',$territorio)->where('tipo', 'B')->get();
    }

    /**
     * Get rows related to an specific sector
     *
     * @param  Request  $request
     * @return Response
     */
    public function getBySector($sector) {          

        return Persona::join('personas_sectores', 'persona_id', '=', 'personas.id')        
                ->where('personas_sectores.sector_id', '=', $sector)
                ->where('tipo','B')
                ->select('personas_sectores.id as idSector', 'personas.id as idPersona', 'personas.nombre', 'personas.apellido1', 'personas.apellido2', 'personas.email', 'personas.tipo')                
                ->get();
    }

    /**
     * Get all bussinessmen of the database.
     *
     * @param  Request  $request
     * @return Response
     */
    public function getByType($type) {
        return Persona::where('tipo', $type)->get();  
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function isPass($id, $currentPass) {
        return Persona::where('id', $id)->where('contrasena', md5($currentPass))->select('id')->get();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function changePass(Request $request) {
        $persona = Persona::find($request->input('id'));
        $persona->contrasena = md5($request->input('pass'));
        
        $persona->save();

        return 'true';
    }
}
