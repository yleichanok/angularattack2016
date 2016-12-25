# Real Movie Popularity

This is a demo project built in scope of Angular Attack hackathon.

## How it works

The app shows real movie statistics based on downloads using BitTorrent protocol.
It scrambles the data from one of the most popular torrent trackers, finds magnet links and uses
peer discovery to find users who downloads particular movies. After that, it applies GeoIP to
found address to show them on map.

It does not download any content, only metadata.

## Build and deploy

1. Run `npm run build` to build
2. Run `surge ./dist realmoviepopularity.2016.angularattack.io` to deploy

Note: the back-end code is in this repository, but deployed on Heroku. Credentials will be provided.

## Libraries

Front-end:

* Angular 2, Rx.js, Typescript, Webpack
* Material Design Lite
* Socket.io
* Google Charts
* world-flags-sprite

Back-end:

* node.js, express.js, socket.io
* bittorrent-dht, magnet-uri
* geoip-lite, country-data
