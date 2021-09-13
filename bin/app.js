#!/usr/bin/env node
require('dotenv').config();
const NodeMediaServer = require('..');
let argv = require('minimist')(process.argv.slice(2),
  {
    string: ['rtmp_port', 'http_port', 'https_port'],
    alias: {
      'rtmp_port': 'r',
      'http_port': 'h',
      'https_port': 's',
    },
    default: {
      'rtmp_port': `${process.env.RTMP_EXPOSED_PORT}`,
      'http_port': `${process.env.HTTP_EXPOSED_PORT}`,
      'https_port': `${process.env.HTTPS_EXPOSED_PORT}`,
    }
  });

if (argv.help) {
  console.log('Usage:');
  console.log('  node-media-server --help // print help information');
  console.log('  node-media-server --rtmp_port 1935 or -r 1935');
  console.log('  node-media-server --http_port 8000 or -h 8000');
  console.log('  node-media-server --https_port 8443 or -s 8443');
  process.exit(0);
}

const config = {
  rtmp: {
    port: argv.rtmp_port,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
    // ssl: {
    //   port: 443,
    //   key: __dirname+'/privatekey.pem',
    //   cert: __dirname+'/certificate.pem',
    // }
  },
  http: {
    port: argv.http_port,
    mediaroot: __dirname + '/media',
    webroot: __dirname + '/www',
    allow_origin: '*',
    api: true
  },
  https: {
    port: argv.https_port,
    key: __dirname + '/privatekey.pem',
    cert: __dirname + '/certificate.pem',
  },
  auth: {
    api: true,
    api_user: 'admin',
    api_pass: 'admin',
    play: false,
    publish: false,
    secret: 'nodemedia2017privatekey'
  },
  management: {
    url: `${process.env.MANAGEMENT_URL}`,
    ips: ['127.0.0.1' , '192.198.0.2'],
  },
  landscape_server: {
    ip: '127.0.0.1',
    rtmp_port: '1936',
    http_port: '8001',
  },
  proxy_server: {
    ip: '127.0.0.1',
    rtmp_port: '1936',
    http_port: '8001',
  },
  server : `${process.env.SERVER}` ,
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        mode: 'push',
        edge: '',
        appendName: false
      }
    ]
  },
};


let nms = new NodeMediaServer(config);
nms.run();
nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

