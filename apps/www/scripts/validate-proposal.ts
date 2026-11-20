import fs from 'fs';
import path from 'path';
import { listPrimitives, registryComponents, type Primitive } from './base-ui-primitives';

export interface SourcedField {
  value: string;
  sources: string[];
}

export interface Proposal {
  name: string;
  primitive: string;
  archetype: string;
  noArchetypeReason: string;
  parts: SourcedField;
  theme: SourcedField;
  variants: SourcedField;
  sizes: SourcedField;
}

export type DefectCode =
  | 'missing-field'
  | 'unknown-primitive'
  | 'unknown-part'
  | 'unknown-archetype'
  | 'missing-archetype-reason'
  | 'duplicate-name'
  | 'duplicate-issue'
  | 'missing-source'
  | 'unknown-source';

export interface Defect {
  code: DefectCode;
  message: string;
}

export interface Facts {
  primitives: Primitive[];
  archetypes: string[];
  registry: string[];
  openIssueTitles: string[];
}

export interface Verdict {
  ok: boolean;
  defects: Defect[];
  labels: string[];
}

const NO_ARCHETYPE = 'none';
const DOCS_URL = /^https:\/\/base-ui\.com\/\S+$/;
const REFERENCE = /^reference\s+([\w-]+)$/i;
const SOURCED_FIELDS = ['parts', 'theme', 'variants', 'sizes'] as const;

const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function sections(body: string): Map<string, string> {
  const found = new Map<string, string>();
  const pieces = body.split(/^### +(.+?) *$/m);
  for (let i = 1; i < pieces.length; i += 2) found.set(pieces[i].trim(), pieces[i + 1].trim());
  return found;
}

function sourced(text: string): SourcedField {
  const sources: string[] = [];
  const lines: string[] = [];
  for (const line of text.split('\n')) {
    const match = line.match(/^Source:\s*(.*)$/i);
    if (match) sources.push(match[1].trim());
    else lines.push(line);
  }
  return { value: lines.join('\n').trim(), sources: sources.filter(Boolean) };
}

export function parseProposal(body: string): Proposal {
  const found = sections(body);
  const get = (label: string) => found.get(label) ?? '';
  return {
    name: get('Name'),
    primitive: get('Base UI primitive'),
    archetype: get('Archetype'),
    noArchetypeReason: get('No archetype fit'),
    parts: sourced(get('Parts')),
    theme: sourced(get('Theme')),
    variants: sourced(get('Variants')),
    sizes: sourced(get('Sizes')),
  };
}

export function readArchetypes(wwwRoot: string): string[] {
  const doc = fs.readFileSync(path.join(wwwRoot, '../../docs/patterns/archetypes.md'), 'utf-8');
  const table = doc.split(/^## At a glance$/m)[1]?.split(/^#{2,3} /m)[0] ?? '';
  return table
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .slice(2)
    .map((row) => slugify(row.split('|')[1]));
}

export async function gatherFacts(wwwRoot: string, openIssueTitles: string[]): Promise<Facts> {
  return {
    primitives: await listPrimitives(),
    archetypes: readArchetypes(wwwRoot),
    registry: registryComponents(wwwRoot),
    openIssueTitles,
  };
}

function partNames(parts: string): { named: string[]; malformed: string[] } {
  const named: string[] = [];
  const malformed: string[] = [];
  for (const line of parts.split('\n').filter((l) => l.trim())) {
    const base = line.match(/\(([^)]+)\)\s*$/)?.[1].trim();
    if (!base) malformed.push(line.trim());
    else if (!/^ora-only$/i.test(base)) named.push(base);
  }
  return { named, malformed };
}

export function validateProposal(proposal: Proposal, facts: Facts): Verdict {
  const defects: Defect[] = [];
  const add = (code: DefectCode, message: string) => defects.push({ code, message });

  for (const [label, value] of [
    ['Name', proposal.name],
    ['Base UI primitive', proposal.primitive],
    ['Archetype', proposal.archetype],
  ]) {
    if (!value) add('missing-field', `Missing field: "${label}" has no section or no value.`);
  }

  const subpath = proposal.primitive.replace(/^@base-ui\/react\//, '');
  const primitive = facts.primitives.find(
    (p) => p.subpath === subpath && proposal.primitive.startsWith('@base-ui/react/')
  );
  if (proposal.primitive && !primitive) {
    add(
      'unknown-primitive',
      `Unknown primitive: "${proposal.primitive}" is not a component export of the installed @base-ui/react.`
    );
  }

  if (primitive) {
    const { named, malformed } = partNames(proposal.parts.value);
    for (const part of named) {
      if (!primitive.parts.includes(part)) {
        add(
          'unknown-part',
          `Invented part: "${part}" is not an export of ${proposal.primitive} (exports: ${primitive.parts.join(', ')}).`
        );
      }
    }
    for (const line of malformed) {
      add(
        'unknown-part',
        `Invented part: "${line}" names no Base UI part. Write "OraName (BasePart)", or "(Ora-only)".`
      );
    }
  }

  const archetype = proposal.archetype;
  const noFit = archetype === NO_ARCHETYPE;
  if (archetype && !noFit && !facts.archetypes.includes(archetype)) {
    add(
      'unknown-archetype',
      `Unknown archetype: "${archetype}" is not a row in docs/patterns/archetypes.md (rows: ${facts.archetypes.join(', ')}), and is not "${NO_ARCHETYPE}".`
    );
  }
  if (noFit && !proposal.noArchetypeReason) {
    add(
      'missing-archetype-reason',
      'Missing archetype reason: archetype is "none" but the "No archetype fit" section does not say why.'
    );
  }

  if (proposal.name && facts.registry.includes(proposal.name)) {
    add('duplicate-name', `Duplicate name: "${proposal.name}" is already a registry component.`);
  }
  const title = `new component: ${proposal.name}`.toLowerCase();
  if (proposal.name && facts.openIssueTitles.some((t) => t.trim().toLowerCase() === title)) {
    add(
      'duplicate-issue',
      `Duplicate issue: an open issue titled "New component: ${proposal.name}" already exists.`
    );
  }

  for (const field of SOURCED_FIELDS) {
    const { sources } = proposal[field];
    const label = field[0].toUpperCase() + field.slice(1);
    if (sources.length === 0) {
      add(
        'missing-source',
        `Missing source: "${label}" cites no source. Add "Source: <https://base-ui.com/... URL>" or "Source: reference <component>".`
      );
      continue;
    }
    for (const source of sources) {
      const reference = source.match(REFERENCE)?.[1];
      if (reference && !facts.registry.includes(reference)) {
        add(
          'unknown-source',
          `Unknown source: "${label}" follows reference component "${reference}", which is not in the registry.`
        );
      } else if (!reference && !DOCS_URL.test(source)) {
        add(
          'unknown-source',
          `Unknown source: "${label}" cites "${source}", which is neither a base-ui.com URL nor "reference <component>".`
        );
      }
    }
  }

  const labels = ['enhancement', 'needs-triage'];
  if (noFit) labels.push('needs-human');
  return { ok: defects.length === 0, defects, labels };
}
