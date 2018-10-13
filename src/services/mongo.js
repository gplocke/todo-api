const config = require('../config/environment').services.mongodb;
const mongoose = require('mongoose');

// this method is deprecated and is the underlying method called by 
// methods like findByIdAndUpdate(). So to avoid deprecation warnings until
// they fix it, we'll just disable that method
mongoose.set('useFindAndModify', false);

// ensureIndex is deprecated, so set the adapter to use createIndex instead
mongoose.set('useCreateIndex', true);

module.exports = async function () {

    let uri = `mongodb://${config.options.username}:${config.options.password}@${config.host}/${config.options.database}`;

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, { useNewUrlParser: true });
    }
};