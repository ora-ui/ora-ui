import path from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  gatherFacts,
  parseProposal,
  readArchetypes,
  validateProposal,
  type Facts,
} from './validate-proposal';

const realRoot = path.resolve(__dirname, '..');

const PROPOSAL = `### Name
progress

### Description
Displays the status of a task that takes a long time.

### Base UI primitive
@base-ui/react/progress

### Archetype
status-display

### Parts
Progress (Root)
ProgressTrack (Track)
ProgressIndicator (Indicator)
ProgressLabel (Label)
ProgressValue (Value)
Source: https://base-ui.com/react/components/progress

### Theme
gray, accent, destructive, warning, success
Source: reference badge

### Variants
solid, soft
Source: reference badge

### Sizes
md, sm, lg
Source: https://base-ui.com/react/components/progress
`;

let facts: Facts;

beforeAll(async () => {
  facts = await gatherFacts(realRoot, ['New component: slider']);
});

const verdictFor = (body: string, f: Facts = facts) => validateProposal(parseProposal(body), f);
const messages = (body: string) => verdictFor(body).defects.map((d) => d.message);

describe('validateProposal', () => {
  it('passes a correct proposal and files it with the default labels', () => {
    const verdict = verdictFor(PROPOSAL);
    expect(verdict.defects).toEqual([]);
    expect(verdict.ok).toBe(true);
    expect(verdict.labels).toEqual(['enhancement', 'needs-triage']);
  });

  it('fails an unknown primitive and names it', () => {
    const body = PROPOSAL.replace('@base-ui/react/progress', '@base-ui/react/sparkle');
    const verdict = verdictFor(body);
    expect(verdict.ok).toBe(false);
    expect(verdict.defects.map((d) => d.code)).toContain('unknown-primitive');
    expect(messages(body).join('\n')).toMatch(/Unknown primitive: "@base-ui\/react\/sparkle"/);
  });

  it('fails a provider export, which is not a component primitive', () => {
    const body = PROPOSAL.replace('@base-ui/react/progress', '@base-ui/react/csp-provider');
    expect(verdictFor(body).defects.map((d) => d.code)).toContain('unknown-primitive');
  });

  it('fails an invented part and names it', () => {
    const body = PROPOSAL.replace('ProgressValue (Value)', 'ProgressGlow (Glow)');
    const verdict = verdictFor(body);
    expect(verdict.defects.map((d) => d.code)).toEqual(['unknown-part']);
    expect(verdict.defects[0].message).toMatch(/Invented part: "Glow"/);
  });

  it('accepts an Ora-only part', () => {
    const body = PROPOSAL.replace('ProgressValue (Value)', 'ProgressCaption (Ora-only)');
    expect(verdictFor(body).ok).toBe(true);
  });

  it('fails an unknown archetype and names it', () => {
    const body = PROPOSAL.replace('status-display', 'gauge');
    const verdict = verdictFor(body);
    expect(verdict.defects.map((d) => d.code)).toEqual(['unknown-archetype']);
    expect(verdict.defects[0].message).toMatch(/Unknown archetype: "gauge"/);
  });

  it('fails a name that is already a registry component', () => {
    const body = PROPOSAL.replace('progress\n\n### Description', 'badge\n\n### Description');
    const verdict = verdictFor(body);
    expect(verdict.defects.map((d) => d.code)).toEqual(['duplicate-name']);
    expect(verdict.defects[0].message).toMatch(/Duplicate name: "badge"/);
  });

  it('fails a name with an open new-component issue', () => {
    const body = PROPOSAL.replace('progress\n\n### Description', 'slider\n\n### Description');
    const verdict = verdictFor(body);
    expect(verdict.defects.map((d) => d.code)).toEqual(['duplicate-issue']);
    expect(verdict.defects[0].message).toMatch(/Duplicate issue: .*"New component: slider"/);
  });

  it('fails a requirement field with no source and names the field', () => {
    const body = PROPOSAL.replace('Source: reference badge\n\n### Variants', '\n### Variants');
    const verdict = verdictFor(body);
    expect(verdict.defects.map((d) => d.code)).toEqual(['missing-source']);
    expect(verdict.defects[0].message).toMatch(/Missing source: "Theme"/);
  });

  it('fails a source that is neither a Base UI docs URL nor a registry reference', () => {
    const wrongUrl = PROPOSAL.replace(
      'https://base-ui.com/react/components/progress\n\n### Theme',
      'https://example.com/progress\n\n### Theme'
    );
    expect(verdictFor(wrongUrl).defects.map((d) => d.code)).toEqual(['unknown-source']);
    const wrongReference = PROPOSAL.replace(
      'reference badge\n\n### Variants',
      'reference gizmo\n\n### Variants'
    );
    expect(messages(wrongReference)[0]).toMatch(/reference component "gizmo"/);
  });

  it('files a proposal with no fitting archetype for a human decision', () => {
    const body =
      PROPOSAL.replace('status-display', 'none') +
      '\n### No archetype fit\nIt is interactive and shows a value, so neither Status nor Selection control fits.\n';
    const verdict = verdictFor(body);
    expect(verdict.ok).toBe(true);
    expect(verdict.labels).toEqual(['enhancement', 'needs-triage', 'needs-human']);
  });

  it('fails a no-archetype proposal that does not say why', () => {
    const body = PROPOSAL.replace('status-display', 'none');
    expect(verdictFor(body).defects.map((d) => d.code)).toEqual(['missing-archetype-reason']);
  });

  it('reports every defect of a proposal with several', () => {
    const body = PROPOSAL.replace('status-display', 'gauge').replace(
      'ProgressValue (Value)',
      'X (Nope)'
    );
    expect(
      verdictFor(body)
        .defects.map((d) => d.code)
        .sort()
    ).toEqual(['unknown-archetype', 'unknown-part']);
  });
});

describe('field completeness', () => {
  it('fails an empty requirement field', () => {
    const body = PROPOSAL.replace(
      'gray, accent, destructive, warning, success\nSource: reference badge',
      'Source: reference badge'
    );
    expect(messages(body).join('\n')).toMatch(/Missing field: "Theme"/);
  });

  it('accepts none for Variants and Sizes without a source', () => {
    const body = PROPOSAL.replace('solid, soft\nSource: reference badge', 'none').replace(
      'md, sm, lg\nSource: https://base-ui.com/react/components/progress',
      'none'
    );
    expect(verdictFor(body).ok).toBe(true);
  });

  it('fails a name that is not kebab-case', () => {
    const body = PROPOSAL.replace('progress\n\n### Description', 'Progress Bar\n\n### Description');
    expect(verdictFor(body).defects.map((d) => d.code)).toEqual(['invalid-name']);
  });

  it('does not offer hooks or factories as parts', async () => {
    const toast = facts.primitives.find((p) => p.subpath === 'toast');
    expect(toast?.parts).not.toContain('useToastManager');
    expect(toast?.parts).toContain('Root');
  });
});

describe('facts read from disk and the package', () => {
  it('reads archetype slugs from the At a glance table', () => {
    expect(readArchetypes(realRoot)).toEqual([
      'action',
      'selection-control',
      'text-field',
      'list-popup',
      'plain-overlay',
      'group',
      'disclosure',
      'status-display',
      'layout',
    ]);
  });

  it('reads registry components from registry/ui', () => {
    expect(facts.registry).toContain('button');
    expect(facts.registry).not.toContain('progress');
  });
});
