//Validate
if (!process.env.WATCH_PORT) throw new Error('Please specify the env variable WATCH_PORT');
if (!process.env.WATCH_BRANCH) throw new Error('Please specify the env variable WATCH_BRANCH');

// Import execFile, to run our bash script
var execFile = require('child_process').execFile;

var Hapi = require('hapi');

var publicAddress = require('public-address');

var server = new Hapi.Server(process.env.WATCH_PORT);

server.route({
    method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    path: '/',
    handler: function (request, reply) {
        var ref = 'refs/heads/' + (process.env.WATCH_BRANCH);
        if (request.payload.ref === ref) {
            console.log('Executing script');
            execFile(require('path').join(__dirname, 'redeploy.sh'), {env: process.env}, function (error, stdout, stderr) {
                console.log(error, stdout, stderr);
            });
        }
        reply('OK!');
    }
});

console.log(process.env.WATCH_PORT, process.env.WATCH_BRANCH);

server.start(function () {
    console.log('Server running at:', server.info.uri);
    publicAddress(function (err, data) {
        //Send Online event
        if (process.send) {
            process.send({
                type: 'server-running',
                pid: process.pid,
                env: process.env.NODE_ENV || 'n/a',
                port: process.env.WATCH_PORT,
                url: ['http://', data && data.address || 'localhost', ':', process.env.WATCH_PORT].join(''),
                file: process.argv[1],
                node: process.argv[0],
                workerId: 'worker_' + process.pid
            });
        }
    });
});

