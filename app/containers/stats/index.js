"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var index_1 = require('../../components/autocomplete/index');
var RMPStats = (function () {
    function RMPStats(_routeParams, _http) {
        var _this = this;
        this._routeParams = _routeParams;
        this._http = _http;
        this.movieInfo = {};
        this.posterUrl = '';
        this.peers = [];
        this.currentLinkIndex = 1;
        this.isProcessing = true;
        //private _serverUrl: string = 'http://localhost:8081/';
        this._serverUrl = 'https://limitless-journey-76225.herokuapp.com/';
        setTimeout(function () {
            window['componentHandler'].upgradeAllRegistered();
        }, 50);
        this.movie = {
            Title: decodeURI(this._routeParams.get('title')),
            Year: parseInt(this._routeParams.get('year')) || undefined
        };
        var title = this.movie['Title'], year = this.movie['Year'];
        // get full movie info
        this._http.get("https://www.omdbapi.com/?t=" + title + "&y=" + year + "&plot=full&r=json")
            .map(function (res) { return res.json(); })
            .subscribe(function (res) {
            _this.movieInfo = res;
            _this.posterUrl = _this._serverUrl + 'api/image?url=' + _this.movieInfo['Poster'];
        });
        this.isProcessing = true;
        var socket = window['io'](this._serverUrl);
        socket.emit('start', this.movie['Title'] + ' ' + this.movie['Year']);
        socket.on('peer', function (data) {
            if (_this.peers.length < 3000) {
                _this.peers = _this.peers.concat(data);
            }
            else {
                if (_this._interval) {
                    clearInterval(_this._interval);
                    _this.isProcessing = false;
                }
            }
        });
        socket.on('total', function (data) { return _this.totalLinks = data; });
        socket.on('count', function (data) { return _this.currentLinkIndex = data; });
        // stop updating when all links were processed
        socket.on('finished', function () {
            _this.isProcessing = false;
            if (_this._interval) {
                clearInterval(_this._interval);
            }
        });
    }
    RMPStats.prototype.ngAfterContentInit = function () {
        // group peers by country
        function groupBy(arr, key) {
            var result = [['Country', 'Peers']];
            arr.forEach(function (item) {
                var c = result.filter(function (val) {
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
        var self = this, chart;
        setTimeout(function () {
            chart = new window['google'].visualization.GeoChart(document.getElementById('map'));
            var data = window['google'].visualization.arrayToDataTable(groupBy([], 'country'));
            chart.draw(data, {});
        }, 1000);
        // update chart data every 10 seconds
        this._interval = setInterval(function () {
            var data = window['google'].visualization.arrayToDataTable(groupBy(self.peers, 'country'));
            chart.draw(data, {
                colorAxis: {
                    colors: ['#C8E6C9', '#388E3C']
                }
            });
        }, 10 * 1000);
    };
    RMPStats.prototype.ngOnDestroy = function () {
        if (this._interval) {
            clearInterval(this._interval);
        }
    };
    RMPStats = __decorate([
        core_1.Component({
            styles: [require('./stats.css')],
            selector: 'rmp-stats',
            template: "\n    <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n      <header class=\"mdl-layout__header\">\n        <div class=\"mdl-layout-icon\">\n          <a [routerLink]=\"['Home']\" title=\"Back\">\n            <i class=\"material-icons\">arrow_back</i>\n          </a>\n        </div>\n        <div class=\"mdl-layout__header-row\">\n          <span class=\"mdl-layout-title autocomplete-container\">\n            <rmp-autocomplete [movie]=\"movie\"></rmp-autocomplete>\n          </span>\n        </div>\n\n        <div class=\"mdl-layout__tab-bar mdl-js-ripple-effect\">\n          <a href=\"#scroll-tab-1\" class=\"mdl-layout__tab\">Info</a>\n          <a href=\"#scroll-tab-2\" class=\"mdl-layout__tab is-active\">Map</a>\n          <a href=\"#scroll-tab-3\" class=\"mdl-layout__tab\">Peers <span [hidden]=\"peers.length == 0\">({{ peers.length }})</span></a>\n        </div>\n\n        <div class=\"progress\" [hidden]=\"isProcessing\">\n          <span>Loaded!</span>\n        </div>\n        <div class=\"progress\" [hidden]=\"!isProcessing || !totalLinks\">\n          <span>Loading {{ currentLinkIndex }} of {{ totalLinks }} links, max 3000 peers</span>\n          <div class=\"mdl-spinner mdl-js-spinner is-active\"></div>\n        </div>\n      </header>\n      <main class=\"mdl-layout__content\">\n        <section class=\"mdl-layout__tab-panel\" id=\"scroll-tab-1\">\n          <div class=\"page-content info-container\">\n            <h3 class=\"movie-title\">{{ movieInfo.Title }}</h3>\n            <h6 class=\"movie-year\">{{ movieInfo.Year }}</h6>\n            <div class=\"clearfix\"></div>\n            <hr>\n            <div class=\"mdl-grid\">\n              <div class=\"mdl-cell mdl-cell--2-col\">\n                <img [src]=\"posterUrl\" class=\"movie-poster\" />\n              </div>\n              <div class=\"mdl-cell mdl-cell--4-col\">\n                <dl>\n                  <dt>Genre</dt>\n                  <dd>{{ movieInfo.Genre }}</dd>\n                  <dt>Director</dt>\n                  <dd>{{ movieInfo.Director }}</dd>\n                  <dt>Writer</dt>\n                  <dd>{{ movieInfo.Writer }}</dd>\n                  <dt>Actors</dt>\n                  <dd>{{ movieInfo.Actors }}</dd>\n                  <dt>Released</dt>\n                  <dd>{{ movieInfo.Released }}</dd>\n                  <dt>Runtime</dt>\n                  <dd>{{ movieInfo.Runtime }}</dd>\n                </dl>\n              </div>\n              <div class=\"mdl-cell mdl-cell--6-col\">\n                <dl>\n                  <dt>Plot</dt>\n                  <dd>{{ movieInfo.Plot }}</dd>\n                  <dt>Awards</dt>\n                  <dd>{{ movieInfo.Awards }}</dd>\n                  <dt>Metascore</dt>\n                  <dd>{{ movieInfo.Metascore }}</dd>\n                  <dt>IMDB</dt>\n                  <dd>{{ movieInfo.imdbRating }} <span class=\"hint\">({{ movieInfo.imdbVotes }})</span></dd>\n                </dl>\n              </div>\n            </div>\n          </div>\n        </section>\n        <section class=\"mdl-layout__tab-panel is-active\" id=\"scroll-tab-2\">\n          <div class=\"page-content map-container\">\n            <p>The map will update every 10 seconds. The app might appear slow during peer discovery phase.</p>\n            <div id=\"map\"></div>\n          </div>\n        </section>\n        <section class=\"mdl-layout__tab-panel\" id=\"scroll-tab-3\">\n          <div class=\"page-content peers-container\">\n            <table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\">\n              <thead>\n                <tr>\n                  <th>#</th>\n                  <th>IP</th>\n                  <th>Port</th>\n                  <th class=\"mdl-data-table__cell--non-numeric\">Country</th>\n                  <th class=\"mdl-data-table__cell--non-numeric\">Region</th>\n                  <th class=\"mdl-data-table__cell--non-numeric\">City</th>\n                  <th></th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngFor=\"let peer of peers; let i = index\">\n                  <td>{{ i + 1 }}</td>\n                  <td>{{ peer.ip }}</td>\n                  <td>{{ peer.port }}</td>\n                  <td class=\"f16 mdl-data-table__cell--non-numeric\">\n                    <span class=\"flag {{ peer.country && peer.country.toLowerCase() || '' }}\"></span>\n                    {{ peer.countryName }}\n                  </td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">{{ peer.country == 'US' && peer.region || '' }}</td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">{{ peer.city }}</td>\n                  <td>\n                    <a href=\"http://maps.google.com/?ie=UTF8&hq=&ll={{ peer.ll }}&z=10\" target=\"_blank\">\n                      <i class=\"material-icons\">map</i>\n                    </a>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </section>\n      </main>\n    </div>\n  ",
            directives: [index_1.RMPAutocomplete, router_deprecated_1.RouterLink]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, http_1.Http])
    ], RMPStats);
    return RMPStats;
}());
exports.RMPStats = RMPStats;
//# sourceMappingURL=index.js.map