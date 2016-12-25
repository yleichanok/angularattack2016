import { Component } from '@angular/core';
import { RMPAutocomplete } from '../../components/autocomplete/index';
import { RMPHint } from '../../components/hint/index';

@Component({
  styles: [require('./home.css')],
  selector: 'rmp-home',
  template: `
    <div class="page-container">
      <h1>Real Movie Popularity</h1>
      <i class="material-icons logo">theaters</i>
      <div class="autocomplete-container">
        <rmp-autocomplete></rmp-autocomplete>
        <rmp-hint></rmp-hint>
      </div>
    </div>
    <div class="info-container">
      <p>The app shows real movie statistics based on downloads using BitTorrent protocol.
      It scrambles the data from one of the most popular torrent trackers, finds magnet links and uses
      peer discovery to find users who downloads particular movies. After that, it applies GeoIP to
      found address to show them on map.</p>
      <p>It does not download any content, only metadata.</p>
    </div>
  `,
  directives: [RMPAutocomplete, RMPHint]
})
export class RMPHome {

  constructor() {
    setTimeout(() => {
      window['componentHandler'].upgradeAllRegistered();
    }, 50);
  }

}
