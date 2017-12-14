#!/usr/bin/env node
////////////////////////////////////////////////////////////////////////////////
// JavaScript PING
//     - async/await style
//     - Promise all - used to PING multiple hosts in parallel
////////////////////////////////////////////////////////////////////////////////
// REF: https://github.com/stephenwvickers/node-net-ping
// Builds a faster native binary PING (instead of shelling out via child process)
// Windows: Admin PowerShell - https://stackoverflow.com/questions/15126050/running-python-on-windows-for-node-js-dependencies
// Windows: npm install --global --production windows-build-tools
// npm install --global node-gyp
// npm install net-ping --save
const ping = require("net-ping");
const { Pinger } = require('./lib/Pinger.js');
const localDebug = false;
////////////////////////////////////////////////////////////////////////////////
// MAIN //
//////////

// PING specific options
let options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 2,
    timeout: 1000,
    ttl: 128
}

let target1 = {};
target1.pingIp = '8.8.8.8';

let target2 = {};
target2.pingIp = '8.8.4.4';

// targets array can be a single host or many or even an array of objects
//targets = ["8.8.8.8", "8.8.4.4"];
targets = [target1, target2];

// Create the array of SSH session objects needed to feed Promise all
let pingPromiseArr = [];
for (let target of targets) {
    pingPromiseArr.push(new Pinger(target, options).execute());
}

// async-await promise all style!
async function pingTaskRunner(arr) {
    try {
        const respones = await Promise.all(arr);
        if (localDebug) { console.log('respones: ' + JSON.stringify(respones, null, 2)); };
        for (let res of respones) {
            if (localDebug) { console.log('res: ' + JSON.stringify(res)); };
            if (res.pingErr) {
                console.log('res.pingIp: ' + res.pingIp);
                console.log('res.pingResponds: ' + res.pingResponds);
                console.log('res.pingErr: ' + res.pingErr);
            } else {
                console.log('res.pingIp: ' + res.pingIp);
                console.log('res.pingResponds: ' + res.pingResponds);
                console.log('res.pingMs: ' + res.pingMs);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

pingTaskRunner(pingPromiseArr);
////////////////////////////////////////////////////////////////////////////////
