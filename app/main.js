"use strict";
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var app_1 = require('./containers/app');
core_1.enableProdMode();
window['google'].charts.load('current', { 'packages': ['geochart'] });
platform_browser_dynamic_1.bootstrap(app_1.AppComponent, [
    router_deprecated_1.ROUTER_PROVIDERS,
    common_1.FORM_PROVIDERS,
    http_1.HTTP_PROVIDERS
]);
//# sourceMappingURL=main.js.map