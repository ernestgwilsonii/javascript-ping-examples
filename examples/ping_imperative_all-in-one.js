#!/usr/bin/env node
////////////////////////////////////////////////////////////////////////////////
// JavaScript PING
//     - Imperative style
////////////////////////////////////////////////////////////////////////////////
// REF: https://github.com/stephenwvickers/node-net-ping
// Builds a faster native binary PING (instead of shelling out via child process)
// Windows: Admin PowerShell - https://stackoverflow.com/questions/15126050/running-python-on-windows-for-node-js-dependencies
// Windows: npm install --global --production windows-build-tools
// npm install --global node-gyp
// npm install raw-socket --save
// npm install net-ping --save
const ping = require("net-ping");
const localDebug = true;
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Imperative (top down) style //
/////////////////////////////////

let options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 2,
    timeout: 1000,
    ttl: 128
}

const session = ping.createSession(options);

let target = '8.8.8.8';

session.pingHost(target, function (error, target, sent, rcvd) {
    let ms = rcvd - sent;
    if (error) {
        if (error instanceof ping.RequestTimedOutError) {
            if (localDebug) { console.log(target + " is not responding to PING"); };
        } else {
            if (localDebug) { console.log(target + " " + error.toString()); };
        }
    } else {
        if (localDebug) { console.log(target + " is responding to PING in " + ms + "ms"); };
    }
});
////////////////////////////////////////////////////////////////////////////////
