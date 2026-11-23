import { bootstrap, JobQueueService } from '@vendure/core';
import { config } from './vendure-config';

// Single-process deployment: the server also processes the job queue (emails, search index)
// and runs the scheduled tasks (see schedulerOptions.runTasksInWorkerOnly). At larger scale,
// move both into a separate worker container that calls bootstrapWorker().
bootstrap(config)
    .then(app => app.get(JobQueueService).start())
    .then(() => {
        console.log('Vendure server started successfully (job queue + scheduler in-process)');
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
