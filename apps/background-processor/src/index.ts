import "dotenv/config";
import { Worker } from "bullmq";
import { Job, MAIN_QUEUE } from "shared";
import { redis } from "./providers/redis.js";
import { jobHandlerController } from "./domains/jobHandler/index.js";

const worker = new Worker<Job>(
  MAIN_QUEUE,
  async (args) => jobHandlerController.handleProcessDocument(args.data),
  {
    connection: redis,
  }
);

worker.on("completed", (jobId, result) => {
  console.log(`Job ${jobId} completed with result ${result}`);
});
