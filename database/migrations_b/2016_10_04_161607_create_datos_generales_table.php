<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatosGeneralesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datos_generales', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('datos_graficos_id')->unsigned();
            $table->string('nombre');
            $table->integer('valor');
            $table->integer('tipo'); // indicador, sector
            $table->integer('tipo_evolucion'); // evolucion real, evolucion esperada

            $table->timestamps();
        });
        Schema::table('datos_generales', function (Blueprint $table) {
            $table->foreign('datos_graficos_id')->references('id')->on('datos_graficos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('datos_generales');
    }
}
