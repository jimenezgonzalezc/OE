<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Encuesta extends Model
{
    protected $fillable = array('id', 'descripcion', 'estado','fechaCreacion','fechaModificacion', 'persona_id');
    protected $hidden = array('created_at', 'updated_at');
}
