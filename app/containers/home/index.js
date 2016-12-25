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
var index_1 = require('../../components/autocomplete/index');
var index_2 = require('../../components/hint/index');
var RMPHome = (function () {
    function RMPHome() {
        setTimeout(function () {
            window['componentHandler'].upgradeAllRegistered();
        }, 50);
    }
    RMPHome = __decorate([
        core_1.Component({
            styles: [require('./home.css')],
            selector: 'rmp-home',
            template: "\n    <div class=\"page-container\">\n      <h1>Real Movie Popularity</h1>\n      <i class=\"material-icons logo\">theaters</i>\n      <div class=\"autocomplete-container\">\n        <rmp-autocomplete></rmp-autocomplete>\n        <rmp-hint></rmp-hint>\n      </div>\n    </div>\n    <div class=\"info-container\">\n      <p>The app shows real movie statistics based on downloads using BitTorrent protocol.\n      It scrambles the data from one of the most popular torrent trackers, finds magnet links and uses\n      peer discovery to find users who downloads particular movies. After that, it applies GeoIP to\n      found address to show them on map.</p>\n      <p>It does not download any content, only metadata.</p>\n    </div>\n  ",
            directives: [index_1.RMPAutocomplete, index_2.RMPHint]
        }), 
        __metadata('design:paramtypes', [])
    ], RMPHome);
    return RMPHome;
}());
exports.RMPHome = RMPHome;
//# sourceMappingURL=index.js.map