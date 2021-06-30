"use strict";
var PORT = '3003';
var http = require('http');
var pingInterval = 25 * 1000;
var path = require('path');
var fs = require('fs');
var pkey = fs.readFileSync('./ssl/key.pem');
var pcert = fs.readFileSync('./ssl/cert.pem');
var options = {key: pkey, cert: pcert, passphrase: '123456789'};
var cluster = require( 'cluster' );
let workers = [];

const setupWorkerProcesses = () => {
    // to read number of cores on system
    let numCores = require('os').cpus().length;
    console.log('Master cluster setting up ' + numCores + ' workers');
    // iterate on number of cores need to be utilized by an application
    // current example will utilize all of them
    for(let i = 0; i < numCores; i++) {
        // creating workers and pushing reference in an array
        // these references can be used to receive messages from workers
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[i].on('message', function(message) {
            console.log('Receive Messages From Worker Process', message);
        });
    }
    // process is clustered on a core and process id is assigned
    cluster.on('online', function(worker) {
        console.log('Worker cluster online ' + worker.process.pid + ' is listening');
    });
    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker exit ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length-1].on('message', function(message) {
            console.log('Receive Messages From Starting New Worker Process', message);
        });
    });
};

const setUpExpress = () => {
    var app = require('./app');
    app.set('port', PORT);
    var server = http.createServer(app);
    server.setTimeout(3600000);
    // start server
    server.listen(PORT, () => {
        console.log(`Started Hakbah server on ${process.env.NODE_ENV} => http://localhost:${PORT} for Process Id ${process.pid}`);
    });
    // in case of an error
    app.on('error', (appErr, appCtx) => {
        console.error('app error', appErr.stack);
        console.error('on url', appCtx.req.url);
        console.error('with headers', appCtx.req.headers);
    });
};


const setupServer = (isClusterRequired) => {
    if(isClusterRequired && cluster.isMaster) {
        setupWorkerProcesses();
    } else {
        setUpExpress();
    }
};
setupServer(true);
