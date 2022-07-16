const express = require('express');
const managementController = require('../controllers/management');

module.exports = (context) => {
    let router = express.Router();
    router.post('/live-channels', managementController.startChannel.bind(context));
    router.delete('/live-channels', managementController.stopChannel.bind(context));
    router.delete('/lives/:id', managementController.stopStream.bind(context));
    router.post('/lives/check', managementController.checkLive.bind(context));
    router.get('/health-check', managementController.healthCheck.bind(context));

    return router;
};
