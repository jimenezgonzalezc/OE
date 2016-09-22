<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['prefix' => 'api'], function () {
    // Login.
    Route::post('login', 'Personas@logIn');

    // Personas.
    Route::post('personas/registro', 'Personas@store');
    Route::post('personas/ifExist', 'Personas@ifExist');
    Route::post('personas/update', 'Personas@update');
    Route::delete('personas/destroy/{id}', 'Personas@destroy');
    Route::get('personas/todas', 'Personas@getAll');
    Route::get('personas/getByType/{type}', 'Personas@getByType');
    Route::get('personas/isPass/{id}/{currentPass}', 'Personas@isPass');
    Route::post('personas/changePass', 'Personas@changePass');
    Route::get('personas/getByTerritory/{territory}', 'Personas@getByTerritory');
    Route::get('personas/getBySector/{sector}', 'Personas@getBySector');
    Route::post('personas/getPersona', 'Personas@getPersona');

    // Preguntas.
    Route::post('preguntas/registro', 'Preguntas@store');
    Route::get('preguntas/todas', 'Preguntas@getAll');
    Route::post('preguntas/editar', 'Preguntas@update');
    Route::delete('preguntas/destroy/{id}', 'Preguntas@destroy');
    Route::post('preguntas/encuesta', 'Preguntas@getpreguntasEncuestas');

    // Encuestas.
    Route::post('encuestas/registro', 'Encuestas@store');
    Route::get('encuestas/todas', 'Encuestas@getAll');
    Route::post('/encuestas/update', 'Encuestas@update');
    Route::delete('/encuestas/destroy/{id}', 'Encuestas@destroy');
    Route::post('/encuestas/changeState', 'Encuestas@changeState');
    Route::get('/encuestas/getQuestions/{id}', 'Encuestas@getQuestions');
    Route::post('/encuestas/getEncuestas', 'Encuestas@getEncuestas');

    // EncuestasPreguntas.
    Route::post('/encuestasPreguntas/store', 'EncuestasPreguntas@store');
    Route::delete('/encuestasPreguntas/destroy/{questions}', 'EncuestasPreguntas@destroy');
    Route::get('/encuestasPreguntas/getNumberOfQuestions/{idEncuesta}', 'EncuestasPreguntas@getNumberOfQuestions');

    // Aplicaciones.
    Route::get('/aplicaciones/todas', 'Aplicaciones@getAll');
    Route::post('/aplicaciones/getForSurvey', 'Aplicaciones@getForSurvey');
    Route::post('/aplicaciones/store', 'Aplicaciones@store');
    Route::delete('/aplicaciones/destroy/{aplications}', 'Aplicaciones@destroy');
    Route::post('/aplicaciones/update', 'Aplicaciones@update');
    Route::post('/aplicaciones/getAplicacionesByPersona', 'Aplicaciones@getAplicacionesByPersona');
    Route::get('/aplicaciones/personasEncuestas', 'Aplicaciones@getAplicacionesPersonasEncuestas');
    Route::get('/aplicaciones/byPeriodo/{anio}', 'Aplicaciones@getAplicacionesByPeriodo');

    // AplicacionesRespuestas.
    Route::get('/aplicaciones-respuestas/todas', 'AplicacionesRespuestas@getAll');
    Route::post('/aplicaciones-respuestas/store', 'AplicacionesRespuestas@store');
    Route::post('/aplicaciones-respuestas/remove', 'AplicacionesRespuestas@remove');
    // AplicacionesRespuestasEE - Evolucion esperada.
    Route::get('/aplicaciones-respuestas-ee/todas', 'AplicacionesRespuestasEE@getAll');
    Route::post('/aplicaciones-respuestas-ee/store', 'AplicacionesRespuestasEE@store');
    Route::post('/aplicaciones-respuestas-ee/remove', 'AplicacionesRespuestasEE@remove');
    // RespaldoAplicacionesRespuestas.
    Route::get('/respaldo-aplicaciones-respuestas/todas', 'RespaldoAplicacionesRespuestas@getAll');
    Route::get('/respaldo-aplicaciones-respuestas/get/{aplicacion_id}', 'RespaldoAplicacionesRespuestas@getByAplicacionId');
    Route::post('/respaldo-aplicaciones-respuestas/store', 'RespaldoAplicacionesRespuestas@store');
    Route::post('/respaldo-aplicaciones-respuestas/update', 'RespaldoAplicacionesRespuestas@update');
    Route::post('/respaldo-aplicaciones-respuestas/remove', 'RespaldoAplicacionesRespuestas@remove');
    Route::delete('/respaldo-aplicaciones-respuestas/remove/{aplicacion_id}', 'RespaldoAplicacionesRespuestas@removeByAplicacionId');
    
    // Indicadores.
    Route::get('/indicadores/todos', 'Indicadores@getAll');
    Route::post('/indicadores/store', 'Indicadores@store');
    Route::delete('/indicadores/destroy/{id}','Indicadores@destroy');
    Route::post('/indicadores/update','Indicadores@update');

    // Sectores.
    Route::get('sectores/todos', 'Sectores@getAll');
    Route::post('sectores/registro', 'Sectores@store');
    Route::delete('sectores/destroy/{id}', 'Sectores@destroy');
    Route::post('sectores/editar/', 'Sectores@update');

    // Regiones.
    Route::get('regiones/todas','Regiones@getAll');
    Route::post('regiones/registro','Regiones@store');
    Route::delete('regiones/destroy/{id}', 'Regiones@destroy');
    Route::post('regiones/editar', 'Regiones@update');
    Route::get('regiones/regionesTerritorios','Regiones@getRegionesTerritorios');

    // Territorios.
    Route::get('territorios/todos','Territorios@getAll');
    Route::post('territorios/registro','Territorios@store');
    Route::delete('territorios/destroy/{id}', 'Territorios@destroy');
    Route::post('territorios/editar', 'Territorios@update');

    // Cantones.
    Route::get('cantones/todos','Cantones@getAll');
    Route::post('cantones/registro','Cantones@store');
    Route::delete('cantones/eliminar/{id}', 'Cantones@destroy');
    Route::post('cantones/editar', 'Cantones@update');

    //TerritoriosSectores
    Route::post('territoriosSectores/registro','TerritoriosSectores@store');
    Route::post('territoriosSectores/editar/', 'TerritoriosSectores@update');
    Route::get('territoriosSectores/ifExist/', 'TerritoriosSectores@ifExist');
    Route::post('territoriosSectores/getBySectorId/', 'TerritoriosSectores@getBySectorId');

    // Periodos.
    Route::get('/periodos/getForAplicacion','Periodos@getForAplicacion');
    Route::get('/periodos/getAll','Periodos@getAll');
    Route::post('/periodos/store','Periodos@store');
    Route::delete('/periodos/destroy/{id}','Periodos@destroy');
    Route::delete('/periodos/deleteByYear/{anio}','Periodos@deleteByYear');

    Route::post('/periodos/update','Periodos@update');
    Route::get('/periodos/validarPeriodicidad/{anio}','Periodos@validarPeriodicidad');

    // PersonasSectores
    Route::post('personasSectores/registro','PersonasSectores@store');
    Route::post('personasSectores/getByPersonId','PersonasSectores@getByPersonId');
    Route::post('personasSectores/update','PersonasSectores@update');

    // SectoresIndicadores
    Route::post('/sectoresIndicadores/store','SectoresIndicadores@store');
    Route::delete('/sectoresIndicadores/destroy/{ids}','SectoresIndicadores@destroy');
    Route::get('/sectoresIndicadores/getForIndicador/{id}','SectoresIndicadores@getForIndicador');

    // Analisis
    //Route::get('/analisis/get/{idPeriodo}/{idTerritorio}','Analisis@get');
    Route::post('/analisis/getAnalisis','Analisis@getICE');
});
