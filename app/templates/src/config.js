requirejs.config({
    baseUrl: './src',
    paths: {
        'angular': '../bower_components/angular/angular',
        /*require angular mocks for testing*/
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        /*require angular resource for easily handling sending and receiving request*/
        'angular-resource': '../bower_components/angular-resource/angular-resource',<% if (includeAngularAnimate) { %>
        /*require angular animate for easily handling animation. I recommend to use this with tweenmax (bower install --save greensock)*/
        'angular-animate': '../bower_components/angular-animate/angular-animate',<% } %>
        /*require angular for better handling and binding controller*/
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',<% if (includeBindonce) { %>
        /*require bindonce to optimize watch for angular binding [https://github.com/Pasvaz/bindonce]*/
        'bindonce': '../bower_components/angular-bindonce/bindonce',<% } %><% if (includeUIBootstrap) { %>
        /*require ui-bootstrap with the embeded template [http://angular-ui.github.io/bootstrap/]*/
        'ui-bootstrap-tpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',<% }%>
        /*require jquery*/
        'jquery': '../bower_components/jquery/dist/jquery',<% if (includeLodash) { %>
        /*require lodash library [http://lodash.com/docs]*/
        'lodash': '../bower_components/lodash/dist/lodash',<% } %><% if (cssFramework === 'SASSBootstrap') { %>
        /*require bootstrap.js to make bootstrap components work*/
        'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',<% } %>
        /*require home module*/
        'home': 'home/home',
        /*--insert code tag--do not remove*/
    },
    shim: {
        'angular': { exports: 'angular', deps: ['jquery'] },
        'angular-mocks': ['angular'],<% if (includeLodash) { %>
        'lodash': { exports: '_' },<% } %>
        'angular-resource': ['angular'],<% if (includeAngularAnimate) { %>
        'angular-animate': ['angular'],<% } %>
        'angular-ui-router': ['angular'],<% if (includeBindonce) { %>
        'bindonce': ['angular'],<% } %><% if (includeUIBootstrap) { %>
        'ui-bootstrap-tpls': ['angular'],<% } %><% if (cssFramework === 'SASSBootstrap') { %>
        'bootstrap': ['jquery']<% } %>
    }/*--requirejs config copy tag--do not remove*/
});
