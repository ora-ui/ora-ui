export interface ExportMeta {
  name: string;
  value: string;
  label: string;
  snippet: string;
}

export interface PreviewEntry {
  slug: string;
  defaultExport: ExportMeta;
  exports: ExportMeta[];
  source: string;
}

export function parsePreviewFile(filePath: string): PreviewEntry {
  throw new Error(`not implemented: ${filePath}`);
}
