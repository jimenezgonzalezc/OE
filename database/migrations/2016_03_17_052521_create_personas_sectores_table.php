<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePersonasSectoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personas_sectores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('persona_id')->unsigned();
            $table->integer('sector_id')->unsigned();
            $table->timestamps();

        });
        Schema::table('personas_sectores', function (Blueprint $table) {
            $table->foreign('persona_id')->references('id')->on('personas')->onDelete('cascade');
            $table->foreign('sector_id')->references('id')->on('sectores')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('personas_sectores');
    }
}
