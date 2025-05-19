const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@app': path.resolve(__dirname, 'src/'),
            '@modules': path.resolve(__dirname, 'src/modules/'),
            '@layouts': path.resolve(__dirname, 'src/layouts/'),
            '@routes': path.resolve(__dirname, 'src/routes/'),
        },
    },
};
