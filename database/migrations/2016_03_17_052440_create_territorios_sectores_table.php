<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerritoriosSectoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('territorios_sectores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('territorio_id')->unsigned();
            $table->integer('sector_id')->unsigned();
            $table->timestamps();
            
        });
        Schema::table('territorios_sectores', function (Blueprint $table) {
            $table->foreign('territorio_id')->references('id')->on('territorios')->onDelete('cascade');
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
        Schema::drop('territorios_sectores');
    }
}
