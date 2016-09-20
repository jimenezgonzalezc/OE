<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRespaldoAplicacionesRespuestasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('respaldo_aplicaciones_respuestas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pregunta_id');
            $table->string('pregunta', 200);
            $table->string('respuesta', 50);
            $table->integer('aplicacion_id')->unsigned();
            $table->integer('valor_respuesta');
            $table->integer('indicador_id')->unsigned();
            $table->string('comentarios', 250);
            $table->integer('tipo_evolucion');//evolucion real: 1 o evolucion esperada: 2
            $table->timestamps();

        });
        Schema::table('respaldo_aplicaciones_respuestas', function (Blueprint $table) {
            $table->foreign('aplicacion_id')->references('id')->on('aplicaciones')->onDelete('cascade');
            $table->foreign('indicador_id')->references('id')->on('indicadores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('respaldo_aplicaciones_respuestas');

    }
}
