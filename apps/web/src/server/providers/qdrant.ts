import { QdrantClient } from "@qdrant/js-client-rest";

// There is also a gRPC client available, but it's not as easy to use as the REST client
// https://github.com/qdrant/js-client-grpc

export const qdrant =
  process.env.QDRANT_HOST === "localhost"
    ? new QdrantClient({
        host: process.env.QDRANT_HOST,
        port: 6333,
      })
    : new QdrantClient({
        host: process.env.QDRANT_HOST,
        apiKey: process.env.QDRANT_API_KEY,
      });
