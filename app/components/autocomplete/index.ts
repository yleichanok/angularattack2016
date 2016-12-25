import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/common';
import { Http } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

@Component({
  styles: [require('./autocomplete.css')],
  selector: 'rmp-autocomplete',
  host: {
    '(document:click)': 'handleClick($event)',
  },
  template: `
    <div class="autocomplete" [class.inverse]="isInversed">

      <form [ngFormModel]="autocompleteForm" class="mdl-textfield mdl-js-textfield mdl-textfield--full-width">
        <input #inputView [(ngModel)]="query" ngControl="autocomplete" (focus)="isFocused = true" (keyup)="handleKeyboard($event)" class="mdl-textfield__input" type="text" id="autocomplete" autocomplete="off">
        <label class="mdl-textfield__label" for="autocomplete">Search...</label>
        <div [hidden]="!isProcessing" class="mdl-progress mdl-js-progress mdl-progress__indeterminate search-progress"></div>
        <i class="material-icons search-icon">search</i>
      </form>

      <ul #resultsView class="autocomplete-results" [hidden]="!isFocused">
        <li (click)="select(res)" (mouseover)="markAsActive(res)" [class.active]="res.active" *ngFor="let res of results" class="autocomplete-result">
          {{ res.Title }} ({{res.Year}})
        </li>

      </ul>
    </div>
  `
})
export class RMPAutocomplete {

  @ViewChild('inputView') private _inputView: ElementRef;
  @ViewChild('resultsView') private _resultsView: ElementRef;
  @Input('movie') movie: Object;

  private autocompleteForm: any;

  protected isFocused: boolean = false;
  protected isProcessing: boolean = false;
  protected isInversed: boolean = false;

  public results: Object[];
  public query: string;

  constructor(private _formBuilder: FormBuilder,
              private _http: Http,
              private _element: ElementRef,
              private _router: Router) {

    this.autocompleteForm = this._formBuilder.group({
      'autocomplete': ['', Validators.required]
    });

    this.autocompleteForm.controls.autocomplete.valueChanges

      // wait 200ms before fetching the results
      .debounceTime(200)

      // show progress indicator
      .do(() => this.isProcessing = true)

      // load the results
      .switchMap(query => this._http.get(`https://www.omdbapi.com/?s=${query}`))

      // process the data
      .map(res => res.json())
      .map(res => res.Search)

      // hide progress indicator
      .do(() => this.isProcessing = false)

      // show results
      .subscribe(res => {
        this.results = res;

        if (this.results && this.results.length > 0) {
          this.markAsActive(this.results[0]);
        }
      });
  }

  ngAfterViewInit() {
    if (this.movie && this.movie['Title']) {
      this.query = this.movie['Title'];
      this.isInversed = true;
    } else {
      this.query = '';

      // focus input when the component is loaded
      this._inputView.nativeElement.focus();
    }
  }

  /**
   * Handles click outside, hides the results view if necessary.
   */
  handleClick(event: MouseEvent) {
    var clickedEl = <Node>event.target, inside = false;
    do {
      if (clickedEl == this._element.nativeElement) {
        inside = true;
        break;
      }
      clickedEl = clickedEl.parentNode;
    } while (clickedEl);

    this.isFocused = inside;
  }

  /**
   * Handles keyboard events, navigates through the results view when pressing up and down buttons.
   */
  handleKeyboard(event: KeyboardEvent) {

    const ARROW_UP: number = 38;
    const ARROW_DOWN: number = 40;
    const ENTER: number = 13;

    const RESULT_HEIGHT: number = 48;
    const RESULTS_HEIGHT: number = 300;

    const MIN_QUERY: number = 3;

    if (this.results && this.results.length > 0) {

      if (event.keyCode === ARROW_UP || event.keyCode === ARROW_DOWN) {
        event.stopPropagation();
        event.preventDefault();

        let active = this.results.filter(res => res['active'])[0];
        this.results.forEach((res, index) => {
          if (res === active) {
            let newIndex;

            // calculate new active index based on the key pressed
            if (event.keyCode === ARROW_UP) {
              newIndex = index ? index - 1 : this.results.length - 1;
            } else if (event.keyCode === ARROW_DOWN) {
              newIndex = (index + 1) % this.results.length;
            }

            // mark new result as active
            this.markAsActive(this.results[newIndex]);

            // scroll the results list to keep the active item visible
            let newScrollTop = RESULT_HEIGHT * newIndex;
            if (newScrollTop > (this._resultsView.nativeElement.scrollTop + RESULTS_HEIGHT - RESULT_HEIGHT) ||
                newScrollTop < (this._resultsView.nativeElement.scrollTop)) {
              this._resultsView.nativeElement.scrollTop = RESULT_HEIGHT * newIndex;
            }
          }
        });
      } else if (event.keyCode === ENTER) {
        let active = this.results.filter(res => res['active'])[0];

        if (active) {
          this.select(active);
        } else if (this.query.length > MIN_QUERY) {
          this.select({
            Title: this.query
          });
        }
      }
    }
  }

  /**
   * Marks the movie as acitve.
   */
  markAsActive(result: Object) {
    this.results.forEach(res => res['active'] = false);

    if (result) {
      result['active'] = true;
    }
  }

  /**
   * Navigates to movie stats page.
   */
  select(result: Object) {
    this._router.navigate(['Stats', {
      year: result['Year'],
      title: result['Title']
    }]);
  }

}
