<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aplicacione extends Model
{
    protected $fillable = array('id', 'fechaAplicacion', 'encuesta_id','persona_id','periodo_id');
    protected $hidden = array('created_at', 'updated_at');
}
