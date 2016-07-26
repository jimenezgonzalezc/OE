<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEncuestasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('encuestas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descripcion', 500);
            $table->boolean('estado');
            $table->date('fechaCreacion');
            $table->date('fechaModificacion');
            $table->integer('persona_id')->unsigned();
            $table->timestamps();

        });
        Schema::table('encuestas', function (Blueprint $table) {
            $table->foreign('persona_id')->references('id')->on('personas')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('encuestas');
    }
}
