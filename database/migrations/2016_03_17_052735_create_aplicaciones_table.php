<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAplicacionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aplicaciones', function (Blueprint $table) {
            $table->increments('id');
            $table->date('fechaAplicacion');
            $table->integer('encuesta_id')->unsigned();
            $table->integer('persona_id')->unsigned();
            $table->integer('periodo_id')->unsigned();
            $table->string('encuestador', 120);
            $table->timestamps();

        });
        Schema::table('aplicaciones', function (Blueprint $table) {
            $table->foreign('encuesta_id')->references('id')->on('encuestas')->onDelete('cascade');
            $table->foreign('persona_id')->references('id')->on('personas')->onDelete('cascade');
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
        Schema::drop('aplicaciones');
    }
}
