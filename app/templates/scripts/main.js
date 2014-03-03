define('main', [], function() {
    requirejs.config({
        paths: {
            'angular': '../bower_components/angular/angular',
            'angular-resource': '../bower_components/angular-resource/angular-resource',<% if (includeAngularAnimate) { %>
            'angular-animate': '../bower_components/angular-animate/angular-animate', <% } %>
            'angular-ui-route': '../bower_components/angular-ui-router/release/angular-ui-router',<% if (includeUIBootstrap) { %>
            'ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap',<% }%><% if (includeModernizr) { %>
            'modernizr': '../bower_components/modernizr/modernizr',<% } %>
            'jquery': '../bower_components/jquery/dist/jquery',<% if (includeUnderscore) { %>
            'underscore': '../bower_components/underscore/underscore',<% } %><% if (cssFramework === 'SASSBootstrap') { %>
            'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',<% } %>
            'controllers': 'controllers/controllers',
            'directives': 'directives/directives',
            'filters': 'filters/filters',
            'services': 'services/services'
        },
        shim: {
            'angular': {
                exports: 'angular'
            },<% if (includeUnderscore) { %>
            'underscore': {
                exports: '_'
            }, <% } %>
            'angular-resource': ['angular'],<% if (includeAngularAnimate) { %>
            'angular-animate': ['angular'],<% } %>
            'angular-ui-route': ['angular'],<% if (includeUIBootstrap) { %>
            'ui-bootstrap': ['angular'],<% } %><% if (cssFramework === 'SASSBootstrap') { %>
            'bootstrap': ['jquery'],<% } %>
            'controllers': ['angular', 'services'],
            'filters': ['angular'],
            'services': ['angular'],
            'directives': ['angular']
        }
    });

    Window.name = 'NG_DEFER_BOOTSTRAP!';

    requirejs([
        'angular',
        'jquery',
        'angular-resource',<% if (includeAngularAnimate) { %>
        'angular-animate', <% } %>
        'angular-ui-route',<% if (includeUIBootstrap) { %>
        'ui-bootstrap',<% } %><% if (includeUnderscore) { %>
        'underscore',<% } %><% if (cssFramework === 'SASSBootstrap') { %>
        'bootstrap',<% } %><% if (includeModernizr) { %>
        'modernizr',<% } %>
        'services',
        'filters',
        'directives',
        'controllers'
    ], function(angular) {
        'use strict';

        /* App Module */
        angular.element(document).ready(function () {
            // smart works go here
            var $html = angular.element('html');
            angular.module('webApp', [
                'ui.router',
                'ngResource',<% if (includeUIBootstrap) { %>
                'ui.bootstrap',<% } %><% if (includeAngularAnimate) { %>
                'ngAnimate', <% } %>
                'webControllers',
                'webFilters',
                'webServices',
                'webDirectives'
            ]).config(['$stateProvider', '$urlRouterProvider', '$interpolateProvider',
                function($stateProvider, $urlRouterProvider, $interpolateProvider) {
                    $stateProvider
                        .state('home', {
                            url: '/',
                            templateUrl: 'partials/home-page.html',
                            controller: 'HomePageController'
                        });

                    $urlRouterProvider.otherwise('/');
                    /* change configure to use [[ to be the interpolation */
                    $interpolateProvider.startSymbol('[[');
                    $interpolateProvider.endSymbol(']]');
                }
            ]);
            // bootstrap model
            angular.bootstrap($html, ['webApp']);
        });
    });
});
