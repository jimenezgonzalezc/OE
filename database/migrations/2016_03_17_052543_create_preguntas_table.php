<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePreguntasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preguntas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('enunciado', 200);
            $table->char('tipo', 1);
            $table->integer('indicador_id')->unsigned();
            $table->timestamps();

        });
        Schema::table('preguntas', function (Blueprint $table) {
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
        Schema::drop('preguntas');
    }
}
