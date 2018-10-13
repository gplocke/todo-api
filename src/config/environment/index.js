const path = require('path');
const _ = require('lodash');

// Base config
let base = {
  env: process.env.NODE_ENV,
  root: path.normalize(`${ __dirname }/../../..`),
  port: process.env.PORT || 8080,
  name: 'todo',
  jwtSecret: 'secretjwtkey', // this should live in the environment and outside the repo
  services: {
    mongodb: {
      host: process.env.TODO_MONGODB_HOST,
      options: {
        username: process.env.TODO_MONGODB_USERNAME,
        password: process.env.TODO_MONGODB_PASSWORD,
        database: 'todo' 
      }
    }
  }
};

// Overide the base config with the environment specific config if it exists
module.exports = _.merge(base, require(`./${ process.env.NODE_ENV }.js`) || {});