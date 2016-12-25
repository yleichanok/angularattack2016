import { Component, DynamicComponentLoader, ElementRef, Injector } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';

function compileToComponent(template) {
  @Component({
    selector: 'fake',
    template: template,
    directives: [RouterLink]
  })
  class FakeComponent {};
  return FakeComponent;
}

@Component({
  styles: [require('./hint.css')],
  selector: 'rmp-hint',
  template: `
    <div class="hint">
      {{ hint.before }}<a [hidden]="!hint.link" [routerLink]="['Stats', {year: hint.year, title: hint.title}]">{{ hint.link }}</a>{{ hint.after }}
    </div>
  `,
  directives: [RouterLink]
})
export class RMPHint {

  hint: Object;

  ngOnInit() {

    const HINTS: Object[] = [
      {
        before: `Don't know what to look for? Try `,
        title: 'The Matrix',
        link: 'The Matrix',
        year: 1999,
        after: '.'
      },
      {
        before: 'Did you know that ',
        title: 'Batman',
        link: `1989' Batman`,
        year: 1989,
        after: ' is still very popular in Italy?'
      },
      {
        before: 'India, Russia and the USA are the biggest BitTorrent users.'
      },
      {
        before: `Don't know what to check? Try `,
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
        link: `HBO's Silicon Valley`,
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
  }
}
