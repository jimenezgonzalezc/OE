<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Periodo extends Model
{
    protected $fillable = array('id', 'anio', 'cuatrimestre');
    protected $hidden = array('created_at', 'updated_at');
}
