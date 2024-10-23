import { Queue } from "bullmq";
import { Job, MAIN_QUEUE } from "shared";
import { redis } from "../providers/redis";

export const mainQueue = new Queue<Job>(MAIN_QUEUE, {
  connection: redis,
});
