/**
* Entrepreneurship Observatory
*
* @authors Fauricio Rojas Hernández, Manfred Artavia Gómez y Carlos Jiménez González.
* @version 1.0
*/
(function() {
	'use strict';

	angular
		.module('observatoryApp', ['ngCookies', 'ngMaterial', 'ui.router', 'dndLists', 'angular.filter'])
        .constant('API_URL', '/OE/public')
		.factory('Auth', Auth)
        .filter('user', user)
        .filter('estado', estado)
		.filter('type', type)
		.config(config)
        .run(run);

    /**
    * Factory de auth.
    * @param {Object} Proporciona acceso de lectura/escritura a las cookies de navegador.
    * @param {Object} Servicio utilizado para la renderización de vistas.
    * @param {Object} Servicio que permite la unión entre el HTML y el controlador a un nivel superior.
    * @returns {Object} Objeto con los metodos del factory.
    */
    function Auth($cookies, $location, $rootScope, $mdDialog) {
        var cont = 0,
	        factory = {
    	        logIn: logIn,
    	        logOut: logOut,
    	        checkStatus: checkStatus,
    	        inArray: inArray
	        };

        return factory;

        /**
        * Guarda la url a la que un usuario intentó acceder.
        */
        function savePreviousUrl() {
            if (cont === 0) {
                $rootScope.url = $location.path();
                cont++;
            }
        }

        /**
        * Guarda los la información del usuario en las cookies y realiza la renderización a la vista respectiva.
        * @param {Object} Objeto con la información del usuario.
        */
	    function logIn(user) {
            $cookies.putObject('session', user);

            if ($rootScope.url !== undefined) {
                $location.path($rootScope.url);
                cont = 0;
            }
            else {
                if (user.tipo === 'A') {
                    $location.path('admin');
                }
                else if (user.tipo === 'B') {
                    $location.path('empresario');
                }
                else if (user.tipo === 'E') {
                    $location.path('encuestador');
                }
            }
        }

        /**
        * Remueve las cookies del usuario y renderiza a la vista de log in.
        */
        function logOut(ev) {
            var confirm = $mdDialog.confirm('?')
                .title('Cerrar sesion')
                .textContent('¿Desea cerrar sesion?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sí')
                .cancel('No');
            $mdDialog.show(confirm)
                .then(function() {
                    $cookies.remove('session');
                    $location.path('login');
                }, function() {});
        }

        /**
        * Chequea los permisos con los que cuenta el usuario, si está logueado y renderiza a la vista respectiva.
        */
        function checkStatus() {
            var rutasPrivadas = ['/','/admin', '/admin/encuestas', '/admin/personas', '/admin/preguntas', '/encuestador', '/encuestador/contestar', '/empresario'];

            if ($location.path() !== '/' && typeof($cookies.get('session')) === "undefined") {
                savePreviousUrl();
                $location.path('autenticacion');
            }
            else if (this.inArray($location.path(), rutasPrivadas) && typeof($cookies.get('session')) === "undefined") {
                $location.path('login');
            }
            else if (this.inArray($location.path(), rutasPrivadas) && typeof($cookies.get('session')) !== "undefined") {
                if($cookies.getObject('session').tipo === 'A') {
                    if ($location.path() === '/admin' || $location.path() === '/') {
                        $location.path('admin');
                    }
                }
                else if($cookies.getObject('session').tipo === 'B') {
                    if ($location.path() === '/empresario' || $location.path() === '/') {
                        $location.path('empresario');
                    }
                }
                else if($cookies.getObject('session').tipo === 'E') {
                    if ($location.path() === '/encuestador' || $location.path() === '/') {
                        $location.path('encuestador');
                    }
                }
            }
        }

        /**
        * Busca una ruta en la lista de rutas del sistema.
        * @param {string} Ruta a buscar.
        * @param {Array} Lista con las rutas.
        * @returns {bool} True si la encuentra, false si no la encuentra.
        */
        function inArray(needle, haystack) {
            var key = '';
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
            return false;
        }
	}

    /**
    * Convierte una sigla a un string.
    * @returns {Object} Objeto con el filtro.
    */
    function user() {
        var filter = function(usuario) {
            if (usuario === 'A') {
                return 'Administrador';
            }
            else if (usuario === 'E') {
                return 'Encuestador';
            }
            else if (usuario === 'B') {
                return 'Empresario';
            }
        };

        return filter;
    }

    /**
    * Convierte un numero a un string.
    * @returns {Object} Objeto con el filtro.
    */
    function estado() {
        var filter = function(estado) {
            if (estado === 0) {
                return 'inactiva';
            }
            else {
                return 'activa';
            }
        };

        return filter;
    }

	function type() {
        var filter = function(estado) {
            if (estado === 't') {
                return 'Abierta';
            }
            else {
                return 'Cerrada';
            }
        };

        return filter;
    }

    /**
    * Configuración de los estados de la aplicación.
    * @param {Object} Servicio utilizado para definir los estados o rutas (diferentes vistas) de la aplicación.
    * @param {Object} Servicio utilizado para definir el estado por defecto.
    */
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: './app/Login/login.html',
                controller: 'LoginController'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: './app/Admin/admin.html',
                controller: 'AdminController'
            })
            .state('admin.perfil', {
                url: '/perfil',
                templateUrl: './app/Perfil/perfil.html',
                controller: 'PerfilController'
            })
            .state('admin.encuestas', {
                url: '/encuestas',
                templateUrl: './app/Encuestas/encuestas.html',
                controller: 'EncuestasController'
            })
            .state('admin.personas', {
                url: '/personas',
                templateUrl: './app/Personas/personas.html',
                controller: 'PersonasController'
            })
            .state('admin.preguntas', {
                url: '/preguntas',
                templateUrl: './app/Preguntas/preguntas.html',
                controller: 'PreguntasController'
            })
            .state('empresario', {
                url: '/empresario',
                templateUrl: './app/Empresario/empresario.html',
                controller: 'EmpresarioController'
            })
            .state('empresario.perfil', {
                url: '/perfil',
                templateUrl: './app/Perfil/perfil.html',
                controller: 'PerfilController'
            })
            .state('empresario.encuestas', {
                url: '/encuestas',
                templateUrl: './app/Empresario/panel-encuestas.html',
                controller: 'EmpresarioController'
            })
            .state('autenticacion', {
                url: '/autenticacion',
                templateUrl: './app/Autenticacion/autenticacion.html',
                controller: 'LoginController'
            })
            .state('admin.sectores',{
                url: '/sectores',
                templateUrl: './app/Sectores/sectores.html',
                controller: 'SectoresController'
            })
            .state('admin.regiones',{
                url: '/regiones',
                templateUrl: './app/Regiones/regiones.html',
                controller: 'RegionesController'
            })
            .state('admin.territorios',{
                url: '/territorios',
                templateUrl: './app/Territorios/territorios.html',
                controller: 'TerritoriosController'
            })
            .state('admin.analisis',{
                url: '/analisis',
                templateUrl: './app/Analisis/analisisCompleto.html',
                controller: 'AnalisisCompletoController'
            })
            .state('admin.cantones',{
                url: '/cantones',
                templateUrl: './app/Cantones/cantones.html',
                controller: 'CantonesController'
            })
            .state('admin.graficos',{
                url: '/graficos',
                templateUrl: './app/Graficos/datosGraficos.html',
                controller: 'DatosGraficosController'
            })
            .state('empresario.analisis',{
                url: '/analisis',
                templateUrl: './app/Analisis/analisis.html',
                controller: 'AnalisisController'
            })
            .state('admin.periodos',{
                url: '/periodos',
                templateUrl: './app/Periodos/periodos.html',
                controller: 'PeriodosController'
            })
            .state('admin.indicadores',{
                url: '/indicadores',
                templateUrl: './app/Indicadores/indicadores.html',
                controller: 'IndicadoresController'
            })
            .state('encuestador', {
                url: '/encuestador',
                templateUrl: './app/Encuestador/encuestador.html',
                controller: 'EncuestadorController'
            })
            .state('encuestador.perfil', {
                url: '/perfil',
                templateUrl: './app/Perfil/perfil.html',
                controller: 'PerfilController'
            })
            .state('encuestador.encuestas', {
                url: '/encuestas',
                templateUrl: './app/Encuestador/panel-encuestas.html',
                controller: 'EncuestadorController'
            })
            .state('encuestador.contestar', {
                url: '/contestar',
                templateUrl: './app/Encuestador/contestar-encuestas.html',
                controller: 'ContestarEncuestasController'
            });
        }
    /**
    * Se ejecuta cada vez que se refrezca la página.
    * @param {Object} Servicio que permite la unión entre el HTML y el controlador a un nivel superior.
    * @param {Object} Servicio que proporciona autenticación y renderización de vistas.
    */
    function run($rootScope, Auth) {
        $rootScope.$on('$stateChangeSuccess', function() {
            Auth.checkStatus();
        });
    }

}());
