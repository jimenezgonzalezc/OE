<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Persona;
use App\Indicadore;
use App\Regione;
use App\Territorio;
use App\Sectore;
use App\Periodo;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Comando para resetear los id auto_increment.
        // ALTER TABLE tablename AUTO_INCREMENT = 1;
        Model::unguard();

        DB::table('personas')->delete();

        $users = array(
                ['cedula' => '207230152', 'nombre' => 'Fauricio', 'apellido1' => 'Rojas', 'apellido2' => 'Hernandez', 'tipo' => 'A', 'email' => 'fauri@gmail.com', 'contrasena' => md5('12345')],
                ['cedula' => '207350236', 'nombre' => 'Manfred', 'apellido1' => 'Artavia', 'apellido2' => 'Gomez', 'tipo' => 'A', 'email' => 'manfred@gmail.com', 'contrasena' => md5('12345')],
                ['cedula' => '114150859', 'nombre' => 'Carlos', 'apellido1' => 'Jimenez', 'apellido2' => 'Gonzalez', 'tipo' => 'A', 'email' => 'carlos@gmail.com', 'contrasena' => md5('12345')],
                ['cedula' => '888888888', 'nombre' => 'Cristian', 'apellido1' => 'Salas', 'apellido2' => 'Salazar', 'tipo' => 'B', 'email' => 'cristian@gmail.com', 'contrasena' => md5('12345')],
                ['cedula' => '999999999', 'nombre' => 'Kenneth', 'apellido1' => 'Perez', 'apellido2' => 'Alfaro', 'tipo' => 'B', 'email' => 'kenneth@gmail.com', 'contrasena' => md5('12345')],
                ['cedula' => '777777777', 'nombre' => 'Mainor', 'apellido1' => 'Gamboa', 'apellido2' => 'Rodríguez', 'tipo' => 'E', 'email' => 'mainy@gmail.com', 'contrasena' => md5('12345')],
                ['cedula' => '666666666', 'nombre' => 'Juan Miguel', 'apellido1' => 'Arce', 'apellido2' => 'Rodríguez', 'tipo' => 'E', 'email' => 'migue@gmail.com', 'contrasena' => md5('12345')]
        );
        
        DB::table('indicadores') -> delete();
        $indicadores = array(
            ['nombre' => 'Resultado de negocio','descripcion' => 'Monto de negocio'],
            ['nombre' => 'Empleo','descripcion' => 'Empleo'],
            ['nombre' => 'Inversiones','descripcion' => 'Inversion'],            
            ['nombre' => 'Precios','descripcion' => 'Precio'],
            ['nombre' => 'Costes totales','descripcion' => 'Coste total']
        );
        
        DB::table('regiones') -> delete();
        $regiones = array(
            ['nombre' => 'Región Huetar Norte','descripcion' => 'espacio para descripcion']
        );

   /*     DB::table('territorios') -> delete();
        $territorios = array(
            ['nombre' => 'Ciudad Quesada','descripcion' => 'N/A', "region_id" => '1'],
            ['nombre' => 'Aguas Zarcas','descripcion' => 'N/A', "region_id" => '1'],
            ['nombre' => 'Pital','descripcion' => 'N/A', "region_id" => '1'],
            ['nombre' => 'Florencia','descripcion' => 'N/A', "region_id" => '1']
        );
*/
        DB::table('sectores') -> delete();
        $sectores = array(
            ['nombre' => 'Agricultura y pesca','descripcion' => 'N/A'],
            ['nombre' => 'Industria manufacturera','descripcion' => 'N/A'],
            ['nombre' => 'Comercio y reparación','descripcion' => 'N/A'],
            ['nombre' => 'Turismo','descripcion' => 'N/A'],
            ['nombre' => 'Otros servicios','descripcion' => 'N/A']
        );

        DB::table('periodos') -> delete();
        $periodos = array(
            ['anio' => date ("Y")-1,'cuatrimestre' => 3],
            ['anio' => date ("Y"),'cuatrimestre' => 1],
            ['anio' => date ("Y"),'cuatrimestre' => 2],
        );



        // Loop through each user above and create the record for them in the database
        foreach ($users as $user) {
            Persona::create($user);        
        }
        
        foreach ($indicadores as $indicador) {
            Indicadore::create($indicador);        
        }
       
        foreach ($regiones as $region) {
            Regione::create($region);        
        }

        /*foreach ($territorios as $territorio) {
            Territorio::create($territorio);        
        }*/

        foreach ($sectores as $sector) {
            Sectore::create($sector);        
        }

        foreach ($periodos as $periodo) {
            Periodo::create($periodo);        
        }

        Model::reguard();
    }
}
