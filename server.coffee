nodestatic = require('node-static')

options =
  gzip: true

server = new nodestatic.Server('./public', options)
port = process.env.PORT || 8000

require('http').createServer( (request, response) ->
  request.addListener('end', ->
        server.serve(request, response);
    ).resume()
).listen(port)