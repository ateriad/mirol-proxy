const NodeRelaySession = require('../../node_relay_session');
const context = require('../../node_core_ctx');
const NodeCoreUtils = require('../../node_core_utils');
var request = require('request');

function startChannel(req, res, next) {
  console.log(req.body);

  if (req.body) {
    let publishStreamPath = `/live/${req.body.key}`;
    let publisherSession = this.sessions.get(
      this.publishers.get(publishStreamPath)
    );

    if (publisherSession) {
      var conf = Object.assign({}, publisherSession.config.relay.tasks[0]);
      conf.ffmpeg = publisherSession.config.relay.ffmpeg;
      var inPath = 'rtmp://127.0.0.1:' + publisherSession.config.rtmp.port + publisherSession.publishStreamPath;
      conf.inPath = inPath;
      conf.forceStop = 1;
      conf.liveChannelId = req.body.liveChannel.id;
      var ouPath = req.body.liveChannel.channel.information['stream_url'] + req.body.liveChannel.channel.information['stream_key'];
      conf.ouPath = ouPath;
      conf.path = publisherSession.publishStreamPath;
      let format = ouPath.startsWith('rtsp://') ? 'rtsp' : 'flv';
      conf.argv = ['-fflags', 'nobuffer', '-i', inPath, '-c', 'copy', '-f', format, ouPath];
      let session = new NodeRelaySession(conf);
      session.id = req.body.liveChannel.channel.id;
      context.NodeRelaySessionlist.push(session);

      session.on('end', (id) => {
        for (var i = 0; i < context.NodeRelaySessionlist.length; i++) {
          if (context.NodeRelaySessionlist[i].id === id) {
            context.NodeRelaySessionlist.splice(i, 1);
          }
        }
        var options = {
          method: 'POST',
          json: true,
          url:  req.body.masterServer+'api/v2/lives/proxy/stop' ,
          headers: {
            'Content-Type': 'application/json'
          },
          body: { liveChannel: req.body.liveChannel.id  , channel : id }
        };
        request(options, function (err, res, body) {
        });

      });

      session.run();

      res.status(200).json({});
    } else {
      res.status(404).json({ message: "stream not found" });
    }
  }
  else {
    res.status(404).json({ message: 'field required dont set' });
  }
}

function checkLive(req, res, next) {
  console.log(req.body);
  let publishStreamPath = `/live/${req.body.key}`;
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

  context.NodeRelaySessionlist.forEach(element => {
    if (element.id == req.body.channel_id) {
      element.conf.forceStop = 2;
      element.end();
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
