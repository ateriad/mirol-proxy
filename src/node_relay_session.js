//
//  Created by Mingliang Chen on 18/3/16.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//
const Logger = require('./node_core_logger');
const NodeCoreUtils = require('./node_core_utils');
const context = require('./node_core_ctx');
const mng = require('./node_managemnt_utils');

const EventEmitter = require('events');
const { spawn } = require('child_process');

const RTSP_TRANSPORT = ['udp', 'tcp', 'udp_multicast', 'http'];

class NodeRelaySession extends EventEmitter {
  constructor(conf) {
    super();
    this.conf = conf;
    this.id = NodeCoreUtils.generateNewSessionID();
    this.TAG = 'relay';
  }

  run() {

    if (this.conf.inPath[0] === '/' || this.conf.inPath[1] === ':') {
      this.conf.argv.unshift('-1');
      this.conf.argv.unshift('-stream_loop');
    }

    if (this.conf.inPath.startsWith('rtsp://') && this.conf.rtsp_transport) {
      if (RTSP_TRANSPORT.indexOf(this.conf.rtsp_transport) > -1) {
        this.conf.argv.unshift(this.conf.rtsp_transport);
        this.conf.argv.unshift('-rtsp_transport');
      }
    }
    
    Logger.log('[relay task] id='+this.id,'cmd=ffmpeg', this.conf.argv.join(' '));
    this.ffmpeg_exec = spawn(this.conf.ffmpeg, this.conf.argv);
    this.ffmpeg_exec.on('error', (e) => {
      Logger.ffdebug(e);
    });

    this.ffmpeg_exec.stdout.on('data', (data) => {
      Logger.ffdebug(`FF输出：${data}`);
    });

    this.ffmpeg_exec.stderr.on('data', (data) => {
      Logger.ffdebug(`FF输出：${data}`);
    });

    this.ffmpeg_exec.on('close', (code) => {
      //Logger.log('[relay end] id='+this.id,'code='+code);
      let publisherSession = context.sessions.get(context.publishers.get(this.conf.path));
      
      if(publisherSession!=null && this.conf.forceStop==1)
      {
        var management = new mng();
        management.failChannel(publisherSession.config.management.url,this.conf.liveChannelId,code);
      }

      this.emit('end', this.id);
    });
  }

  end() {
    this.ffmpeg_exec.kill();
  }
}

module.exports = NodeRelaySession;
