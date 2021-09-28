const NodeRelaySession = require('../../node_relay_session');
const context = require('../../node_core_ctx');
const NodeCoreUtils = require('../../node_core_utils');
var request = require('request');

function startChannel(req, res, next) {
  // console.log(req.body);

  if (req.body) {
    if(req.body.liveChannel.channel.orientation == context.orientationType.ORIGINAL)
    {
      let publishStreamPath = `/live/${req.body.key}`;
      let publisherSession = this.sessions.get(
        this.publishers.get(publishStreamPath)
      );
  
      if (publisherSession) {
        this.nodeEvent.emit('relayPush', req.body , publisherSession , 'live');
        res.status(200).json({});
      }else{
        res.status(404).json({ message: "stream not found" });
      } 

    }else{
      let publishStreamPath = `/landscape/${req.body.key}`;
      let publisherSession = this.sessions.get(
        this.publishers.get(publishStreamPath)
      );
  
      if (publisherSession) {
        this.nodeEvent.emit('relayPush', req.body , publisherSession , 'landscape');
        res.status(200).json({});
      }else{
        res.status(404).json({ message: "stream not found" });
      }

    }
  }
  else {
    res.status(404).json({ message: 'field required dont set' });
  }
}

function checkLive(req, res, next) {
  let publishStreamPath = `/${req.body.app}/${req.body.key}`;
  console.log(publishStreamPath);
  let publisherSession = this.sessions.get(
    this.publishers.get(publishStreamPath)
  );
  
  if (publisherSession) {
    res.status(200).json({ message: "ok" });
  }
  else {
    res.status(404).json({ message: "stream not found" });
  }
  
}

function stopChannel(req, res, next) {
  
  this.sessions.forEach(function (session, id) {
    if (session.constructor.name == 'NodeRelaySession') {
        if (session.id == req.body.channel_id) {
            session.conf.forceStop = 2;
            session.end();
        }
      }
    });

  res.json({ message: 'ok' });
}

function stopStream(req, res, next) {

  context.sessions.forEach(element => {
    if (element.live_id == req.params.id) {
      element.stop();
    }
  });

  res.json({ message: 'ok' });
}

exports.startChannel = startChannel;
exports.stopChannel = stopChannel;
exports.stopStream = stopStream;
exports.checkLive = checkLive;
