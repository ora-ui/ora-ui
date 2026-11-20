import { listPrimitives, registryImports, type Primitive } from './base-ui-primitives';

export async function gapList(wwwRoot: string): Promise<Primitive[]> {
  const imported = registryImports(wwwRoot);
  const primitives = await listPrimitives();
  return primitives.filter((primitive) => !imported.has(primitive.subpath));
}

export function formatGapList(gap: Primitive[]): string {
  return gap
    .map((p) => `@base-ui/react/${p.subpath}\t${p.exportName}\t${p.parts.join(', ')}`)
    .join('\n');
}
