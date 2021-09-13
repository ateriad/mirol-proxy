//
//  Created by Mingliang Chen on 18/3/2.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//
const EventEmitter = require('events');

let sessions = new Map();
let publishers = new Map();
let lives = new Map();
let idlePlayers = new Set();
let nodeEvent = new EventEmitter();
let NodeRelaySessionlist = []; // for connect channel to relay
let stat = {
  inbytes: 0,
  outbytes: 0,
  accepted: 0
};
let orientationType = {
  ORIGINAL: 1,
  LANDSCAPE: 2
};

let proxyStatus = {
  ENABLED: 1,
  DISABLED: 2
};

let StreamPlans =
{
  FREE: 1,
  PREMIUM: 2
};

let ArchiveStatuses =
{
  ENABLED: 1,
  DISABLED: 2
};

let RelayTypes = 
{
  OUTPUT : 1 ,
  INPUT : 2 ,
  PROXY : 3 ,
  LANDSCAPE : 4 
}

module.exports = { sessions, publishers, NodeRelaySessionlist, orientationType, proxyStatus,RelayTypes, idlePlayers, nodeEvent, stat, StreamPlans,lives,ArchiveStatuses };