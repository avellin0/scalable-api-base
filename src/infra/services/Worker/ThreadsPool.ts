import { Worker } from "worker_threads";
import os from "os";

interface WorkerWithState{
    worker: Worker,
    currentJob?: string
}

export class Pool {
    size;
    workersFree = <WorkerWithState[]> [];
    queueList = <any[]>[];
    QUEUE_LIMIT = 50;
    WORKER_LIMIT = Math.floor(os.cpus().length * 0.7);

    constructor(size: number) {
        this.size = size;
        this.initWorker();
    }

    initWorker() {
        if (this.size > this.WORKER_LIMIT) return;

        for (let i = 0; i < this.WORKER_LIMIT; i++) {

            const worker = new Worker("./src/infra/services/Worker/worker.ts");
            this.workersFree.push({worker: worker});

            if (!worker) return;

            worker.on("message", (result) => {

                return result;
            });

            worker.on("error", (err) => {
                return err;
            });

            this.workersFree.push({worker: worker});
        }
    }

    CreateWorker() {
        // criar um novo worker e adicioná-lo à pool
    }


    execute(task: string) {
        new Promise((resolve, reject) => {
            const job = { task, resolve, reject };

            this.queueList.push(job);
            this._next();
        });
    }

    _next() {
        if (this.queueList.length === 0 || this.workersFree.length === 0) {
            return;
        }

        const ultimoWorker = this.workersFree.pop() as WorkerWithState;
        const primeiraTask: string = this.queueList.shift();

        ultimoWorker.currentJob = primeiraTask
        ultimoWorker?.worker.postMessage(primeiraTask)
    }
}
