import { ContextBar } from "~/components/context-bar";
import { ContextProvider } from "~/context/ContextProvider";
import { documentController } from "~/server/domains/document";
import GeneratedNote from "~/components/GeneratedNote/GeneratedNote";

export default async function GenPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = await params;
  const query = (await searchParams).query as string | undefined;

  let document: any;

  if (id === "new") {
    const splitQuery = (query ?? "").split("\n");
    const queryWithNewlines = splitQuery.map(line => `\n${line}`).join("");
    const response = await documentController.queryDocuments({
      query: queryWithNewlines,
    });
    document = await documentController.createGeneratedNote({
      title: response?.title ?? "Untitled",
      content: {},
      markdown: response?.response ?? "",
      sources: response?.sources ?? [],
    });
  } else {
    document = await documentController.getGeneratedNote(id);
  }

  if (!document) return null;

  return (
    <ContextProvider>
      <GeneratedNote document={document} />
      <ContextBar />
    </ContextProvider>
  );
}
