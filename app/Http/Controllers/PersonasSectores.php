<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\PersonasSectore;

class PersonasSectores extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {
        $personaId = $request->input('personaId');
        $sectorId = $request->input('sectorId');
        

        $personaSector = new PersonasSectore;
        $personaSector->sector_id = $sectorId;
        $personaSector->persona_id = $personaId;

        $personaSector->save();

        return 'true';
    }

    /**
     * get all sectors of a person by person id.
     *
     * @param  Request  $request
     * @return Response
     */
    public function getByPersonId(Request $request) {                
        return PersonasSectore::where('persona_id',$request->input('personId'))->select('sector_id')->get();  
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {        
        $personaId = $request->input('personaId');
        $sectorId = $request->input('sectorId');

        // $persona = Persona::find($request->input('id'));

        $idPersonaSector = PersonasSectore::where('persona_id', $personaId)->select('id')->get();
        $personaSector = PersonasSectore::find($idPersonaSector[0]->id);        
        $personaSector->sector_id = $sectorId;

        $personaSector->save();


        return 'true';
    }
    
}
