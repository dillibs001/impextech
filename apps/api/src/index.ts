import { bootstrap, bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
    .then(() => bootstrapWorker(config))
    .then(() => {
        console.log('Vendure server and worker started successfully');
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
