#!/usr/bin/env node
////////////////////////////////////////////////////////////////////////////////
// JavaScript PING
//     - Callback style
////////////////////////////////////////////////////////////////////////////////
// REF: https://github.com/stephenwvickers/node-net-ping
// Builds a faster native binary PING (instead of shelling out via child process)
// Windows: Admin PowerShell - https://stackoverflow.com/questions/15126050/running-python-on-windows-for-node-js-dependencies
// Windows: npm install --global --production windows-build-tools
// npm install --global node-gyp
// npm install raw-socket --save
// npm install net-ping --save
const ping = require("net-ping");
const localDebug = false;
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Callback //
//////////////
function pinger(target, options, callback) {
    const session = ping.createSession(options);
    session.pingHost(target, function (error, target, sent, rcvd) {
        let res = {};
        res.pingIp = target;
        let ms = rcvd - sent;
        if (error) {
            if (error instanceof ping.RequestTimedOutError) {
                if (localDebug) { console.log(target + " is not responding to PING"); };
                res.pingResponds = false;
                res.pingErr = error.toString();
                callback(res);
            } else {
                if (localDebug) { console.log(target + " " + error.toString()); };
                res.pingResponds = false;
                res.pingErr = error.toString();
                callback(res);
            }
        } else {
            if (localDebug) { console.log(target + " is responding to PING in " + ms + "ms"); };
            res.pingResponds = true;
            res.pingMs = ms;
            callback(null, res);
        }
    });
}
module.exports.pinger = pinger;
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Callback style - MAIN //
///////////////////////////

let options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 2,
    timeout: 1000,
    ttl: 128
}

let target = '8.8.8.8';

// Callback style!
pinger(target, options, (err, res) => {
    if (err) {
        // PING errors
        if (localDebug) { console.log(JSON.stringify(err)); }
        console.log('err.pingIp: ' + err.pingIp);
        console.log('err.pingResponds: ' + err.pingResponds);
        console.log('err.pingErr: ' + err.pingErr);
    } else {
        // PING results
        if (localDebug) { console.log(JSON.stringify(res)); }
        console.log('res.pingIp: ' + res.pingIp);
        console.log('res.pingResponds: ' + res.pingResponds);
        console.log('res.pingMs: ' + res.pingMs);
    }
});
////////////////////////////////////////////////////////////////////////////////
