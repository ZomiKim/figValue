import { FigureDetail } from "@/components/FigureDetail";

export default async function FigurePage({
  params,
}: PageProps<"/figures/[docId]">) {
  const { docId } = await params;
  return (
    <main className="mx-auto w-[90%] max-w-5xl py-10">
      <FigureDetail docId={decodeURIComponent(docId)} />
    </main>
  );
}
