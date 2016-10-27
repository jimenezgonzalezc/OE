<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatosSectoresIndicadoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datos_sectores_indicadores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('datos_graficos_id')->unsigned();
            $table->integer('indicador_id');
            $table->string('nombre_indicador');
            $table->integer('sector_id');
            $table->string('nombre_sector');
            $table->integer('valor');
            $table->integer('tipo'); // indicador, sector
            $table->integer('tipo_evolucion'); // evolucion real, evolucion esperada

            $table->timestamps();
        });
        Schema::table('datos_sectores_indicadores', function (Blueprint $table) {
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
        Schema::drop('datos_sectores_indicadores');
    }
}
