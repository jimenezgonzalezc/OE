<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatosGraficosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datos_graficos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('periodo_id')->unsigned();
            $table->string('descripcion', 500);
            $table->timestamps();
        });
        Schema::table('datos_graficos', function (Blueprint $table) {
            $table->foreign('periodo_id')->references('id')->on('periodos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('datos_graficos');
    }

    /*
     * Estructura anterior
     * `id`
     * `periodo_id`
     * `nombre_sector`
     * `descripcion`
     * `sector_id`
     * `valor`
     * `total_columna_indicador`
     * `tipo_evolucion`
     * */
}
