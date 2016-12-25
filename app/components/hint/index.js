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
function compileToComponent(template) {
    var FakeComponent = (function () {
        function FakeComponent() {
        }
        FakeComponent = __decorate([
            core_1.Component({
                selector: 'fake',
                template: template,
                directives: [router_deprecated_1.RouterLink]
            }), 
            __metadata('design:paramtypes', [])
        ], FakeComponent);
        return FakeComponent;
    }());
    ;
    return FakeComponent;
}
var RMPHint = (function () {
    function RMPHint() {
    }
    RMPHint.prototype.ngOnInit = function () {
        var HINTS = [
            {
                before: "Don't know what to look for? Try ",
                title: 'The Matrix',
                link: 'The Matrix',
                year: 1999,
                after: '.'
            },
            {
                before: 'Did you know that ',
                title: 'Batman',
                link: "1989' Batman",
                year: 1989,
                after: ' is still very popular in Italy?'
            },
            {
                before: 'India, Russia and the USA are the biggest BitTorrent users.'
            },
            {
                before: "Don't know what to check? Try ",
                title: 'The Shawshank Redemption',
                link: 'The Shawshank Redemption',
                year: 1994,
                after: '.'
            },
            {
                before: 'Russia, Brazil and France love ',
                title: 'The Revenant',
                link: 'The Revenant',
                year: 2015,
                after: '!'
            },
            {
                before: 'Canada is fascinated by ',
                title: 'Silicon Valley',
                link: "HBO's Silicon Valley",
                year: '2014-',
                after: '.'
            },
            {
                before: 'Can you guess what country likes ',
                title: 'Citizen Kane',
                link: 'Citizen Kane',
                year: 1941,
                after: ' the most?'
            }
        ];
        this.hint = HINTS[Math.floor(Math.random() * HINTS.length)];
    };
    RMPHint = __decorate([
        core_1.Component({
            styles: [require('./hint.css')],
            selector: 'rmp-hint',
            template: "\n    <div class=\"hint\">\n      {{ hint.before }}<a [hidden]=\"!hint.link\" [routerLink]=\"['Stats', {year: hint.year, title: hint.title}]\">{{ hint.link }}</a>{{ hint.after }}\n    </div>\n  ",
            directives: [router_deprecated_1.RouterLink]
        }), 
        __metadata('design:paramtypes', [])
    ], RMPHint);
    return RMPHint;
}());
exports.RMPHint = RMPHint;
//# sourceMappingURL=index.js.map