var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");

var ipReports = [];

// Allows retrieval of raw body from request
app.use(bodyParser.json({verify:function(req,res,buf){req.rawBody=buf;}}));

app.get('/api/ipReports', function (req, res) {
  res.end(JSON.stringify(ipReports, null, 2));
});

function getIpAddress(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress;
}

app.post('/api/', function (req, res) {
  var incoming = req.body;

  var result = ipReports.filter(function (report) {
    return report.host.HostName === incoming.host.HostName; 
  })[0];

  if (result) {
    result.host.InternalIps = incoming.host.InternalIps;
    result.host.ExternalIps = getIpAddress(req);
    result.host.ReportDate = new Date();
  } else {
    incoming.host.ExternalIps = getIpAddress(req);
    incoming.host.ReportDate = new Date();
    ipReports.push(incoming);
  }

  res.json(200);
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("ipReporter listening at http://%s:%s", host, port);
});
