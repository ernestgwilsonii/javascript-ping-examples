#!/usr/bin/env node
////////////////////////////////////////////////////////////////////////////////
// JavaScript PING
//     - Promise style
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
// Class //
///////////

// This class be be fed a string or an object as the target
// If you supply an object, you get back your original object plus additional fields
// PING takes options (optional), if none are supplied, default values are used

// default option values if none are specified
let _networkProtocol = ping.NetworkProtocol.IPv4;
let _packetSize = 16;
let _retries = 2;
let _timeout = 2000;
let _ttl = 128;

class Pinger {
    constructor(target, options) {

        if (localDebug) { console.log('options: ' + JSON.stringify(options)); };

        // target can be a string or an object
        if (typeof target == 'string') {
            if (localDebug) { console.log('target parameter typeof detected: string') };
            this.target = target;
        } else if (typeof target == 'object') {
            if (localDebug) { console.log('target parameter typeof detected: object') };
            this.target = target.pingIp;
            this.res = target;
        } else {
            if (localDebug) { console.warn('CRITICAL: target parameter typeof detected: must either be a string or an object') }
        }

        // options are optional and have defaults if options are not specified
        if (options) {
            if (options.networkProtocol) {
                this.networkProtocol = options.networkProtocol;
            } else {
                this.networkProtocol = _networkProtocol;
            }
            if (options.packetSize) {
                this.packetSize = options.packetSize;
            } else {
                this.packetSize = _packetSize;
            }
            if (options.retries) {
                this.retries = options.retries;
            } else {
                this.retries = _retries;
            }
            if (options.timeout) {
                this.timeout = options.timeout;
            } else {
                this.timeout = _timeout;
            }
            if (options.ttl) {
                this.ttl = options.ttl;
            } else {
                this.ttl = _ttl;
            }

        } else {
            this.networkProtocol = _networkProtocol;
            this.packetSize = _packetSize;
            this.retries = _retries;
            this.timeout = _timeout;
            this.ttl = _ttl;
        }

        this.options = {
            networkProtocol: this.networkProtocol,
            packetSize: this.packetSize,
            retries: this.retries,
            timeout: this.timeout,
            ttl: this.ttl
        }

    }

    execute() {
        let res = this.res;
        return new Promise((resolve, reject) => {
            if (localDebug) {
                console.log('this.target: ' + this.target);
                console.log('this.options: ' + JSON.stringify(this.options));
            }
            const session = ping.createSession(this.options);
            session.pingHost(this.target, function (error, target, sent, rcvd) {
                let ms = rcvd - sent;
                if (!res) { res = {}; }
                res.pingIp = this.target;
                if (error) {
                    if (error instanceof ping.RequestTimedOutError) {
                        if (localDebug) { console.log(target + " is not responding to PING"); };
                        res.pingResponds = false;
                        res.pingErr = error.toString();
                        return resolve(res);
                    } else {
                        if (localDebug) { console.log(target + " " + error.toString()); };
                        res.pingResponds = false;
                        res.pingErr = error.toString();
                        return resolve(res);
                    }
                } else {
                    if (localDebug) { console.log(target + " is responding to PING in " + ms + "ms"); };
                    res.pingResponds = true;
                    res.pingMs = ms;
                    return resolve(res);
                }
            });
        });
    }
}
module.exports.Pinger = Pinger;
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Promise style - MAIN //
//////////////////////////

// PING specific options
let options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 2,
    timeout: 1000,
    ttl: 128
}

// Can be a single target or an object as shown
// let target = '8.8.8.8';
let target = {};
target.pingIp = '8.8.4.4';

new Pinger(target, options).execute()
    .then((res) => {
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
    })
////////////////////////////////////////////////////////////////////////////////
