import "dotenv/config";
import { Worker } from "bullmq";
import { MAIN_QUEUE } from "shared";
import { redis } from "./providers/redis.js";

const worker = new Worker(
  MAIN_QUEUE,
  async (job) => {
    console.log(job.data);
  },
  {
    connection: redis,
  }
);

worker.on("completed", (jobId, result) => {
  console.log(`Job ${jobId} completed with result ${result}`);
});
