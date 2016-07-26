<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    protected $fillable = array('id', 'enunciado', 'tipo', 'indicador_id');
    protected $hidden = array('created_at', 'updated_at');
}
