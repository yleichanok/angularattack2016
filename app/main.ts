import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
import { FORM_PROVIDERS } from '@angular/common';

import { AppComponent } from './containers/app';

enableProdMode();

window['google'].charts.load('current', {'packages':['geochart']});

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  FORM_PROVIDERS,
  HTTP_PROVIDERS
]);
