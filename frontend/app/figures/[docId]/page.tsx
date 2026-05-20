import { FigureDetail } from "@/components/FigureDetail";

type PageProps = {
  params: Promise<{ docId: string }>;
};

export default async function FigurePage({ params }: PageProps) {
  const { docId } = await params;
  return <FigureDetail docId={decodeURIComponent(docId)} />;
}
