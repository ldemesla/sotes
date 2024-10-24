import { qdrant } from "~/server/providers/vectorDb";

const createCollections = async () => {
  await qdrant.createCollection("documents", {
    vectors: { size: 1536, distance: "Cosine" },
  });
};

createCollections();
