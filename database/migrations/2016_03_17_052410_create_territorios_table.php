<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerritoriosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('territorios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 50);
            $table->string('descripcion', 50);
            $table->integer('region_id')->unsigned();
            $table->integer('canton_id')->unsigned();
            $table->timestamps();

        });
        Schema::table('territorios', function (Blueprint $table) {
            $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade');
            $table->foreign('canton_id')->references('id')->on('cantones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('territorios');
    }
}
