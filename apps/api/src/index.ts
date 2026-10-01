import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
    .then(() => {
        console.log('Vendure server started successfully');
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
