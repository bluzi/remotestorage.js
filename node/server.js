var https = require('https')
  , http = require('http')
  , url = require('url')
  , fs = require('fs')
  , redis = require('redis').createClient()
  , querystring = require('querystring')

var webapp = require('./lib/webapp.js')
  , session = require('./lib/session.js')
  , identity = require('./lib/identity.js')
  , storage = require('./lib/storage.js')
  , config = require('./config.js')

https.createServer({ ca:fs.readFileSync(config.sslDir +'sub.class1.server.ca.pem')
                   , key:fs.readFileSync(config.sslDir +'ssl.key')
                   , cert:fs.readFileSync(config.sslDir +'ssl.crt')
                   }
                 , function(req, res) {
  var path = url.parse(req.url).pathname
  if(path == '/oauth2/auth') {
    storage.handleOAuth(req, res)
  } else if(path.substring(0,8) == '/webdav') {
    storage.handleWebdav(req, res)
  } else if(path == '/session/init') {
    session.init(req, res)
  } else if(path == '/session/update') {
    session.update(req, res)
  } else if(path == '/session/requestHosting') {
    session.requestHosting(req, res)
  } else if(path == '/.well-known/host-meta') {
    //identity.handleHostmeta(req, res)
    identity.handle(req, res)
  } else if (path == '/webfinger') {
    //identity.handleWebfinger(req, res)
    identity.handle(req, res)
  } else {
    webapp.handle(req, res)
  }
}).listen(443)

http.createServer(function(req, res) {
  res.writeHead(301, {'Location': config.appUrl})
  res.end()
}).listen(80)
