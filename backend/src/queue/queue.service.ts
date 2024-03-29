import { Injectable } from '@nestjs/common';
import Queue, { QueueWorkerCallback } from 'queue';

export interface ITaskResult {
    err?: Error;
    data?: Object;
}

export type QueueTask = {
    (cb: QueueWorkerCallback): void,
    timeout?: number,
    handleSuccess: (result: Object) => void,
    handleError: (err: Error) => void,
    handleTimeout: () => void
}

@Injectable()
export class QueueService {
    private readonly queue: Queue = new Queue({ autostart: true, concurrency: 1 });

    constructor() {
        // get notified when jobs complete
        this.queue.on('success', function (result, job) {
            job.handleSuccess(result);
        })

        this.queue.on('timeout', function (next, job) {
            job.handleTimeout();
            next()
        })

        this.queue.on('error', function (err, job) {
            job.handleError(err);
        })
    }

    addTask(task: QueueTask): void {
        this.queue.push(task);
    }
}
