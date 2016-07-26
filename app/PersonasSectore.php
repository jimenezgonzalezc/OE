<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PersonasSectore extends Model
{
    protected $fillable = array('id', 'persona_id', 'sector_id');
    protected $hidden = array('created_at', 'updated_at');
}
