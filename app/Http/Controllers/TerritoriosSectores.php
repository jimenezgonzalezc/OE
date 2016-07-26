<?php

namespace App\Http\Controllers;
use App\TerritoriosSectore;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;


class TerritoriosSectores extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request) {     

        $sectorId = $request->input('sector_id');
        $territoriosId = $request->input('territorios_id');   
        

        foreach ($territoriosId as $id) {
            $territorioSector = new TerritoriosSectore;                     
            $territorioSector->territorio_id = $id;                    
            $territorioSector->sector_id = $sectorId;        

            $territorioSector->save();        
        }
        return 'true';
        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function ifExist(Request $request) {       
        return TerritoriosSectore::where('territorio_id', $request->input('territorio_id'))->where('sector_id', $request->input('sector_id'))->select('id')->get();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request) {
        $sectorId = $request->input('sector_id');
        $territoriosId = $request->input('territorios_id');      

        $territorioSectores = TerritoriosSectore::where('sector_id', $sectorId)->select('id')->get();        

       
        
        foreach ($territorioSectores as $territorioSector) {
            $toDelete = TerritoriosSectore::find($territorioSector['id']);
            $toDelete->delete();            
        }

        foreach ($territoriosId as $id) {
            $territorioSector = new TerritoriosSectore;                     
            $territorioSector->territorio_id = $id;                    
            $territorioSector->sector_id = $sectorId;        

            $territorioSector->save();        
        }

        return 'true';
    }

    /**
     * Get all territories of one sectore
     *
     * @param  Request  $request
     * @return Response
     */
    public function getBySectorId(Request $request) {
        return TerritoriosSectore::where('sector_id',$request->input('sector_id'))->select('territorio_id')->get();        
    
    }
}
