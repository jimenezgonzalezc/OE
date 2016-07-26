<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SectoresIndicadore extends Model
{
    protected $fillable = array('id', 'sector_id', 'indicador_id');
    protected $hidden = array('created_at', 'updated_at');
}
