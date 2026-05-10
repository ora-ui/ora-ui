export function extractExport(source: string, name: string): string {
  const lines = source.split('\n');
  const startIdx = lines.findIndex((l) => l.startsWith(`export function ${name}(`));
  if (startIdx === -1) return '';

  let depth = 0;
  let started = false;
  let endIdx = startIdx;

  for (let i = startIdx; i < lines.length; i++) {
    for (const char of lines[i]) {
      if (char === '{') {
        depth++;
        started = true;
      }
      if (char === '}') depth--;
    }
    if (started && depth === 0) {
      endIdx = i;
      break;
    }
  }

  return lines.slice(startIdx, endIdx + 1).join('\n');
}
