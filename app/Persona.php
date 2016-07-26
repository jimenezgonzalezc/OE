<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $fillable = array('id', 'cedula', 'nombre','apellido1','apellido2', 'email', 'contrasena','territorio_id','tipo');
    protected $hidden = array('created_at', 'updated_at');
}
