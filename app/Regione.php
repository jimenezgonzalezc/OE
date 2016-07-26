<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Regione extends Model
{
    protected $fillable = array('id', 'nombre', 'descripcion');
    protected $hidden = array('created_at', 'updated_at');
}
