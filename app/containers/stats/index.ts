import { Component } from '@angular/core';
import { RouteParams, RouterLink } from '@angular/router-deprecated';
import { Http } from '@angular/http';
import { RMPAutocomplete } from '../../components/autocomplete/index';

@Component({
  styles: [require('./stats.css')],
  selector: 'rmp-stats',
  template: `
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header class="mdl-layout__header">
        <div class="mdl-layout-icon">
          <a [routerLink]="['Home']" title="Back">
            <i class="material-icons">arrow_back</i>
          </a>
        </div>
        <div class="mdl-layout__header-row">
          <span class="mdl-layout-title autocomplete-container">
            <rmp-autocomplete [movie]="movie"></rmp-autocomplete>
          </span>
        </div>

        <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
          <a href="#scroll-tab-1" class="mdl-layout__tab">Info</a>
          <a href="#scroll-tab-2" class="mdl-layout__tab is-active">Map</a>
          <a href="#scroll-tab-3" class="mdl-layout__tab">Peers <span [hidden]="peers.length == 0">({{ peers.length }})</span></a>
        </div>

        <div class="progress" [hidden]="isProcessing">
          <span>Loaded!</span>
        </div>
        <div class="progress" [hidden]="!isProcessing || !totalLinks">
          <span>Loading {{ currentLinkIndex }} of {{ totalLinks }} links, max 3000 peers</span>
          <div class="mdl-spinner mdl-js-spinner is-active"></div>
        </div>
      </header>
      <main class="mdl-layout__content">
        <section class="mdl-layout__tab-panel" id="scroll-tab-1">
          <div class="page-content info-container">
            <h3 class="movie-title">{{ movieInfo.Title }}</h3>
            <h6 class="movie-year">{{ movieInfo.Year }}</h6>
            <div class="clearfix"></div>
            <hr>
            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--2-col">
                <img [src]="posterUrl" class="movie-poster" />
              </div>
              <div class="mdl-cell mdl-cell--4-col">
                <dl>
                  <dt>Genre</dt>
                  <dd>{{ movieInfo.Genre }}</dd>
                  <dt>Director</dt>
                  <dd>{{ movieInfo.Director }}</dd>
                  <dt>Writer</dt>
                  <dd>{{ movieInfo.Writer }}</dd>
                  <dt>Actors</dt>
                  <dd>{{ movieInfo.Actors }}</dd>
                  <dt>Released</dt>
                  <dd>{{ movieInfo.Released }}</dd>
                  <dt>Runtime</dt>
                  <dd>{{ movieInfo.Runtime }}</dd>
                </dl>
              </div>
              <div class="mdl-cell mdl-cell--6-col">
                <dl>
                  <dt>Plot</dt>
                  <dd>{{ movieInfo.Plot }}</dd>
                  <dt>Awards</dt>
                  <dd>{{ movieInfo.Awards }}</dd>
                  <dt>Metascore</dt>
                  <dd>{{ movieInfo.Metascore }}</dd>
                  <dt>IMDB</dt>
                  <dd>{{ movieInfo.imdbRating }} <span class="hint">({{ movieInfo.imdbVotes }})</span></dd>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section class="mdl-layout__tab-panel is-active" id="scroll-tab-2">
          <div class="page-content map-container">
            <p>The map will update every 10 seconds. The app might appear slow during peer discovery phase.</p>
            <div id="map"></div>
          </div>
        </section>
        <section class="mdl-layout__tab-panel" id="scroll-tab-3">
          <div class="page-content peers-container">
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
              <thead>
                <tr>
                  <th>#</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th class="mdl-data-table__cell--non-numeric">Country</th>
                  <th class="mdl-data-table__cell--non-numeric">Region</th>
                  <th class="mdl-data-table__cell--non-numeric">City</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let peer of peers; let i = index">
                  <td>{{ i + 1 }}</td>
                  <td>{{ peer.ip }}</td>
                  <td>{{ peer.port }}</td>
                  <td class="f16 mdl-data-table__cell--non-numeric">
                    <span class="flag {{ peer.country && peer.country.toLowerCase() || '' }}"></span>
                    {{ peer.countryName }}
                  </td>
                  <td class="mdl-data-table__cell--non-numeric">{{ peer.country == 'US' && peer.region || '' }}</td>
                  <td class="mdl-data-table__cell--non-numeric">{{ peer.city }}</td>
                  <td>
                    <a href="http://maps.google.com/?ie=UTF8&hq=&ll={{ peer.ll }}&z=10" target="_blank">
                      <i class="material-icons">map</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `,
  directives: [RMPAutocomplete, RouterLink]
})
export class RMPStats {

  movie: Object;
  movieInfo: Object = {};
  posterUrl: string = '';
  peers: Object[] = [];

  currentLinkIndex: number = 1;
  totalLinks: number;

  private isProcessing: boolean = true;
  private _interval: any;
  //private _serverUrl: string = 'http://localhost:8081/';
  private _serverUrl: string = 'https://limitless-journey-76225.herokuapp.com/';

  constructor(private _routeParams: RouteParams,
              private _http: Http) {

    setTimeout(() => {
      window['componentHandler'].upgradeAllRegistered();
    }, 50);

    this.movie = {
      Title: decodeURI(this._routeParams.get('title')),
      Year: parseInt(this._routeParams.get('year')) || undefined
    };

    let title: string = this.movie['Title'],
        year: number = this.movie['Year'];

    // get full movie info
    this._http.get(`https://www.omdbapi.com/?t=${title}&y=${year}&plot=full&r=json`)
      .map(res => res.json())
      .subscribe(res => {
        this.movieInfo = res;
        this.posterUrl = this._serverUrl + 'api/image?url=' + this.movieInfo['Poster'];
      });

    this.isProcessing = true;

    let socket = window['io'](this._serverUrl);
    socket.emit('start', this.movie['Title'] + ' ' + this.movie['Year']);
    socket.on('peer', data => {
      if (this.peers.length < 3000) {
        this.peers = this.peers.concat(data);
      } else {
        if (this._interval) {
          clearInterval(this._interval);
          this.isProcessing = false;
        }
      }
    });
    socket.on('total', data => this.totalLinks = data);
    socket.on('count', data => this.currentLinkIndex = data);

    // stop updating when all links were processed
    socket.on('finished', () => {
      this.isProcessing = false;

      if (this._interval) {
        clearInterval(this._interval);
      }
    })
  }

  ngAfterContentInit() {

    // group peers by country
    function groupBy(arr, key) {
      var result = [['Country', 'Peers']];
      arr.forEach(function(item) {

        var c = result.filter(function(val) {
          return val[0] === item[key];
        })[0];
        if (!c) {
          c = [item[key], 0];
          result.push(c);
        }

        c[1] += 1;

      });
      return result;
    }

    var self = this,
        chart;

    setTimeout(function() {
      chart = new window['google'].visualization.GeoChart(document.getElementById('map'));
      var data = window['google'].visualization.arrayToDataTable(groupBy([], 'country'));
      chart.draw(data, {});
    }, 1000);

    // update chart data every 10 seconds
    this._interval = setInterval(function() {
      var data = window['google'].visualization.arrayToDataTable(groupBy(self.peers, 'country'));
      chart.draw(data, {
        colorAxis: {
          colors: ['#C8E6C9', '#388E3C']
        }
      });
    }, 10*1000);
  }

  ngOnDestroy() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }
}
