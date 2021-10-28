const request = require("request");
const Logger = require('./node_core_logger');
const context = require('./node_core_ctx');

class Management {

    startStream(key, url, rtmp, server) {
        var options = {
            method: 'POST',
            json: true,
            url: url + 'relay/lives/start',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { program_key: `${key}`, server: `${server}` }
        };
        request(options, function (err, res, body) {
            if (res.statusCode === 200 || res.statusCode === 201) {
               // console.log(body);
                rtmp.ManagementInfo = body;
                Logger.log(`[rtmp publish] New stream. id=${rtmp.id} streamPath=${rtmp.publishStreamPath} streamId=${rtmp.publishStreamId}`);
                context.publishers.set(rtmp.publishStreamPath, rtmp.id);
                rtmp.live_id = body['id'];
                context.lives.set(body['id'], rtmp);

                rtmp.isPublishing = true;
                rtmp.sendStatusMessage(rtmp.publishStreamId, 'status', 'NetStream.Publish.Start', `${rtmp.publishStreamPath} is now published.`);
                for (let idlePlayerId of context.idlePlayers) {
                    let idlePlayer = context.sessions.get(idlePlayerId);
                    if (idlePlayer && idlePlayer.playStreamPath === rtmp.publishStreamPath) {
                        idlePlayer.onStartPlay();
                        context.idlePlayers.delete(idlePlayerId);
                    }
                }
                context.nodeEvent.emit('postPublish', rtmp.id, rtmp.publishStreamPath, rtmp.publishArgs);
            }
            else {
                rtmp.reject();
                rtmp.sendStatusMessage(rtmp.publishStreamId, 'error', 'NetStream.Publish.BadName', 'Invalid Stream Key');
            }

        });
    }

    stopStream(url, rtmp) {
        var options = {
            method: 'POST',
            json: true,
            url: url + 'relay/lives/stop',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { live: rtmp.live_id }
        };
        request(options, function (err, res, body) {
        });
    }


    failChannel(url ,id , error) {
        var options = {
            method: 'POST',
            json: true,
            url: url + 'relay/lives/channels/fail',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { liveChannel: id , error : error }
        };
        request(options, function (err, res, body) {
        });
    }
 
}
module.exports = Management;
