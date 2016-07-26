<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TerritoriosSectore extends Model
{
    protected $fillable = array('sector_id', 'territori_id');
    protected $hidden = array('created_at', 'updated_at');
}
