import cluster from 'cluster';
import connect from './loaders/mongoose';
import app from './loaders/express';
import setupWorkerProcesses from './loaders/cluster';
import config from './config';

const setupExpress = async () => {
  try {
    await connect(config.databaseURL);
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Setup server either with clustering or without it
 * @param {Boolean} isClusterRequired
 *
 * @returns {void}
 */
const setupServer = isClusterRequired => {
  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses(cluster);
  } else {
    // to setup server configurations and share port address for incoming requests
    setupExpress();
  }
};

setupServer(true);
