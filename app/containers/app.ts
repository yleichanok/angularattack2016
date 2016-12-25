import { Component } from '@angular/core';
import { RouteConfig, RouterOutlet } from '@angular/router-deprecated';
import { RMPHome } from './home/index';
import { RMPStats } from './stats/index';

@Component({
    selector: 'rmp-app',
    template: `<router-outlet></router-outlet>`,
    directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/', name: 'Home', component: RMPHome, useAsDefault: true},
  {path: '/:year/:title', name: 'Stats', component: RMPStats}
])
export class AppComponent {

}
