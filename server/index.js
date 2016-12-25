const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const geoip = require('geoip-lite');
const countries = require('country-data').countries;
const http = require('http');

var DHT = require('bittorrent-dht')
var magnet = require('magnet-uri');

const app = express();

var server = http.Server(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 8081;

server.listen(PORT);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/image', function(req, res) {
  var url = req.query.url;

  var callback = function(response) {
    if (response.statusCode === 200) {
      res.writeHead(200, {
        'Content-Type': response.headers['content-type']
      });
      response.pipe(res);
    } else {
      res.writeHead(response.statusCode);
      res.end();
    }
  };

  http.get(url, callback).end();
});

const URL = 'https://kat.cr/usearch/';

io.set('origins', '*:*');
io.on('connection', function(socket) {
  socket.on('start', function(msg) {
    var url = URL + msg,
        totalPeers = 0,
        peers = [],

        // flush new peers every second
        interval = setInterval(function() {
            socket.emit('peer', peers);
            peers = [];
        }, 1000);

    request({
      uri: url,
      gzip: true
    }, function(err, resp, body) {
      var $ = cheerio.load(body);
      var links = $('#mainSearchTable table tr .ka-magnet');
      socket.emit('total', links.length);

      function getHandler(link, number, isLast) {
        return function() {
          var uri = link.parent().attr('href');
          var parsed = magnet(uri);
          var dht = new DHT();
          dht.listen();

          setTimeout(function() {
            dht.destroy(function() {
              socket.emit('count', number);
              if (isLast) {
                socket.emit('finished');
              }
            });
          }, 5 * 1000);

          // find peers for the given torrent info hash
          dht.lookup(parsed.infoHash);

          dht.on('peer', function (peer, infoHash, from) {
            var geo = geoip.lookup(peer.host);
            if (!geo) {
              geo = {};
            } else {
              var country = countries[geo.country];
              geo.countryName = country ? country.name : '';
            }

            geo.ip = peer.host;
            geo.port = peer.port;
            peers.push(geo);

            totalPeers += 1;

            if (totalPeers > 3000) {
              dht.destroy(function() {
                socket.emit('count', number);
                if (isLast) {
                  clearInterval(interval);
                  socket.emit('finished');
                }
              });
            }
          });
        };
      }

      // start processing new magnet link after previous link was finished
      for (var i = 0, l = links.length; i < l; i++) {
        setTimeout(getHandler(links.eq(i), i + 1, i === links.length - 1), 6*1000*i);
      }

    });
  });
});
