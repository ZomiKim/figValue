export function keywordToDocId(keyword: string): string {
  return keyword.trim().replace(/ /g, "_");
}

export function docIdToDisplay(docId: string): string {
  return docId.replace(/_/g, " ");
}
