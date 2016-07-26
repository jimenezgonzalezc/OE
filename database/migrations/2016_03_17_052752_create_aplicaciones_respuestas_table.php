<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAplicacionesRespuestasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aplicaciones_respuestas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('pregunta', 200);
            $table->string('respuesta', 50);
            $table->integer('aplicacion_id')->unsigned();
            $table->timestamps();

        });
        Schema::table('aplicaciones_respuestas', function (Blueprint $table) {
            $table->foreign('aplicacion_id')->references('id')->on('aplicaciones')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('aplicaciones_respuestas');
    }
}
