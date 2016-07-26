<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AplicacionesRespuesta extends Model
{
    protected $fillable = array('id', 'pregunta', 'respuesta','aplicacion_id');
    protected $hidden = array('created_at', 'updated_at');
}