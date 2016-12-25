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
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var router_deprecated_1 = require('@angular/router-deprecated');
require('rxjs/Rx');
var RMPAutocomplete = (function () {
    function RMPAutocomplete(_formBuilder, _http, _element, _router) {
        var _this = this;
        this._formBuilder = _formBuilder;
        this._http = _http;
        this._element = _element;
        this._router = _router;
        this.isFocused = false;
        this.isProcessing = false;
        this.isInversed = false;
        this.autocompleteForm = this._formBuilder.group({
            'autocomplete': ['', common_1.Validators.required]
        });
        this.autocompleteForm.controls.autocomplete.valueChanges
            .debounceTime(200)
            .do(function () { return _this.isProcessing = true; })
            .switchMap(function (query) { return _this._http.get("https://www.omdbapi.com/?s=" + query); })
            .map(function (res) { return res.json(); })
            .map(function (res) { return res.Search; })
            .do(function () { return _this.isProcessing = false; })
            .subscribe(function (res) {
            _this.results = res;
            if (_this.results && _this.results.length > 0) {
                _this.markAsActive(_this.results[0]);
            }
        });
    }
    RMPAutocomplete.prototype.ngAfterViewInit = function () {
        if (this.movie && this.movie['Title']) {
            this.query = this.movie['Title'];
            this.isInversed = true;
        }
        else {
            this.query = '';
            this._inputView.nativeElement.focus();
        }
    };
    RMPAutocomplete.prototype.handleClick = function (event) {
        var clickedEl = event.target, inside = false;
        do {
            if (clickedEl == this._element.nativeElement) {
                inside = true;
                break;
            }
            clickedEl = clickedEl.parentNode;
        } while (clickedEl);
        this.isFocused = inside;
    };
    RMPAutocomplete.prototype.handleKeyboard = function (event) {
        var _this = this;
        var ARROW_UP = 38;
        var ARROW_DOWN = 40;
        var ENTER = 13;
        var RESULT_HEIGHT = 48;
        var RESULTS_HEIGHT = 300;
        var MIN_QUERY = 3;
        if (this.results && this.results.length > 0) {
            if (event.keyCode === ARROW_UP || event.keyCode === ARROW_DOWN) {
                event.stopPropagation();
                event.preventDefault();
                var active_1 = this.results.filter(function (res) { return res['active']; })[0];
                this.results.forEach(function (res, index) {
                    if (res === active_1) {
                        var newIndex = void 0;
                        if (event.keyCode === ARROW_UP) {
                            newIndex = index ? index - 1 : _this.results.length - 1;
                        }
                        else if (event.keyCode === ARROW_DOWN) {
                            newIndex = (index + 1) % _this.results.length;
                        }
                        _this.markAsActive(_this.results[newIndex]);
                        var newScrollTop = RESULT_HEIGHT * newIndex;
                        if (newScrollTop > (_this._resultsView.nativeElement.scrollTop + RESULTS_HEIGHT - RESULT_HEIGHT) ||
                            newScrollTop < (_this._resultsView.nativeElement.scrollTop)) {
                            _this._resultsView.nativeElement.scrollTop = RESULT_HEIGHT * newIndex;
                        }
                    }
                });
            }
            else if (event.keyCode === ENTER) {
                var active = this.results.filter(function (res) { return res['active']; })[0];
                if (active) {
                    this.select(active);
                }
                else if (this.query.length > MIN_QUERY) {
                    this.select({
                        Title: this.query
                    });
                }
            }
        }
    };
    RMPAutocomplete.prototype.markAsActive = function (result) {
        this.results.forEach(function (res) { return res['active'] = false; });
        if (result) {
            result['active'] = true;
        }
    };
    RMPAutocomplete.prototype.select = function (result) {
        this._router.navigate(['Stats', {
                year: result['Year'],
                title: result['Title']
            }]);
    };
    __decorate([
        core_1.ViewChild('inputView'), 
        __metadata('design:type', core_1.ElementRef)
    ], RMPAutocomplete.prototype, "_inputView", void 0);
    __decorate([
        core_1.ViewChild('resultsView'), 
        __metadata('design:type', core_1.ElementRef)
    ], RMPAutocomplete.prototype, "_resultsView", void 0);
    __decorate([
        core_1.Input('movie'), 
        __metadata('design:type', Object)
    ], RMPAutocomplete.prototype, "movie", void 0);
    RMPAutocomplete = __decorate([
        core_1.Component({
            styles: [require('./autocomplete.css')],
            selector: 'rmp-autocomplete',
            host: {
                '(document:click)': 'handleClick($event)',
            },
            template: "\n    <div class=\"autocomplete\" [class.inverse]=\"isInversed\">\n\n      <form [ngFormModel]=\"autocompleteForm\" class=\"mdl-textfield mdl-js-textfield mdl-textfield--full-width\">\n        <input #inputView [(ngModel)]=\"query\" ngControl=\"autocomplete\" (focus)=\"isFocused = true\" (keyup)=\"handleKeyboard($event)\" class=\"mdl-textfield__input\" type=\"text\" id=\"autocomplete\" autocomplete=\"off\">\n        <label class=\"mdl-textfield__label\" for=\"autocomplete\">Search...</label>\n        <div [hidden]=\"!isProcessing\" class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate search-progress\"></div>\n        <i class=\"material-icons search-icon\">search</i>\n      </form>\n\n      <ul #resultsView class=\"autocomplete-results\" [hidden]=\"!isFocused\">\n        <li (click)=\"select(res)\" (mouseover)=\"markAsActive(res)\" [class.active]=\"res.active\" *ngFor=\"let res of results\" class=\"autocomplete-result\">\n          {{ res.Title }} ({{res.Year}})\n        </li>\n\n      </ul>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http, core_1.ElementRef, router_deprecated_1.Router])
    ], RMPAutocomplete);
    return RMPAutocomplete;
}());
exports.RMPAutocomplete = RMPAutocomplete;
