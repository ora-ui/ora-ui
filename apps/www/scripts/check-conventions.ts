import fs from 'fs';
import path from 'path';
import ts from 'typescript';

type RuleId =
  | 'data-slot'
  | 'theme-formula'
  | 'theme-open'
  | 'docs-page'
  | 'playground-entry'
  | 'install-file';

interface Violation {
  component: string;
  rule: RuleId;
  part?: string;
}

interface Component {
  slug: string;
  source: ts.SourceFile;
}

interface Rule {
  section: string;
  find: (component: Component, wwwRoot: string) => Violation[];
  problem: (v: Violation) => string;
  fix: (v: Violation) => string;
}

const ARCHETYPES = 'docs/patterns/archetypes.md';
const BASELINE_FILE = 'scripts/conventions-baseline.json';

export const violationKey = (v: Violation) =>
  [v.component, v.rule, v.part].filter(Boolean).join(':');

function walk(node: ts.Node, visit: (n: ts.Node) => void) {
  visit(node);
  node.forEachChild((child) => walk(child, visit));
}

function nameText(name: ts.Node): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
  if (ts.isJsxNamespacedName(name)) return `${name.namespace.text}:${name.name.text}`;
}

function topLevelName(node: ts.Node): string | undefined {
  let n = node;
  while (n.parent && !ts.isSourceFile(n.parent)) n = n.parent;
  if (ts.isFunctionDeclaration(n) && n.name) return n.name.text;
  if (ts.isVariableStatement(n)) {
    const [d] = n.declarationList.declarations;
    if (ts.isIdentifier(d.name)) return d.name.text;
  }
}

function countKeys(keys: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}

/* An attribute set either as JSX (`data-theme={x}`) or as a props object key (`'data-theme': x`). */
function attributeValues(source: ts.SourceFile, attr: string): ts.Node[] {
  const values: ts.Node[] = [];
  walk(source, (n) => {
    if (ts.isJsxAttribute(n) && nameText(n.name) === attr && n.initializer) {
      values.push(ts.isJsxExpression(n.initializer) ? n.initializer.expression! : n.initializer);
    } else if (ts.isPropertyAssignment(n) && nameText(n.name) === attr) {
      values.push(n.initializer);
    }
  });
  return values;
}

function exportedComponents(source: ts.SourceFile): Map<string, ts.Node> {
  const local = new Map<string, ts.Node>();
  const exported = new Set<string>();
  for (const stmt of source.statements) {
    const isExported = ts
      .getModifiers(stmt as ts.HasModifiers)
      ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      local.set(stmt.name.text, stmt);
      if (isExported) exported.add(stmt.name.text);
    } else if (ts.isVariableStatement(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(d.name) || !d.initializer) continue;
        if (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer)) {
          local.set(d.name.text, d.initializer);
          if (isExported) exported.add(d.name.text);
        }
      }
    } else if (
      ts.isExportDeclaration(stmt) &&
      stmt.exportClause &&
      ts.isNamedExports(stmt.exportClause)
    ) {
      for (const el of stmt.exportClause.elements) exported.add((el.propertyName ?? el.name).text);
    }
  }
  const components = new Map<string, ts.Node>();
  for (const name of exported) {
    const fn = local.get(name);
    if (fn && /^[A-Z]/.test(name)) components.set(name, fn);
  }
  return components;
}

function isNotGray(node: ts.Expression, theme: string): boolean {
  return (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken &&
    ts.isIdentifier(node.left) &&
    node.left.text === theme &&
    ts.isStringLiteral(node.right) &&
    node.right.text === 'gray'
  );
}

/* `theme !== 'gray' ? theme : undefined`, or the active-state form `theme !== 'gray' && active ? theme : undefined`. */
function isThemeFormula(node: ts.Node): boolean {
  while (ts.isParenthesizedExpression(node)) node = node.expression;
  if (!ts.isConditionalExpression(node)) return false;
  const { condition, whenTrue, whenFalse } = node;
  if (!ts.isIdentifier(whenTrue) || !ts.isIdentifier(whenFalse) || whenFalse.text !== 'undefined')
    return false;
  const theme = whenTrue.text;
  if (isNotGray(condition, theme)) return true;
  return (
    ts.isBinaryExpression(condition) &&
    condition.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
    isNotGray(condition.left, theme)
  );
}

function isOpenStringType(
  type: ts.TypeNode,
  aliases: Map<string, ts.TypeNode>,
  seen = new Set<string>()
): boolean {
  if (ts.isParenthesizedTypeNode(type)) return isOpenStringType(type.type, aliases, seen);
  if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
    const name = type.typeName.text;
    const alias = aliases.get(name);
    if (!alias || seen.has(name)) return false;
    return isOpenStringType(alias, aliases, new Set(seen).add(name));
  }
  if (ts.isUnionTypeNode(type)) return type.types.some((t) => isOpenStringType(t, aliases, seen));
  return (
    ts.isIntersectionTypeNode(type) &&
    type.types.some((t) => t.kind === ts.SyntaxKind.StringKeyword) &&
    type.types.some((t) => ts.isTypeLiteralNode(t) && t.members.length === 0)
  );
}

function themeIsClosed(source: ts.SourceFile): boolean {
  const aliases = new Map<string, ts.TypeNode>();
  const themeProps: ts.PropertySignature[] = [];
  let cvaTheme = false;
  walk(source, (n) => {
    if (ts.isTypeAliasDeclaration(n)) aliases.set(n.name.text, n.type);
    if (ts.isPropertySignature(n) && nameText(n.name) === 'theme') themeProps.push(n);
    if (
      ts.isPropertyAssignment(n) &&
      nameText(n.name) === 'variants' &&
      ts.isObjectLiteralExpression(n.initializer) &&
      n.initializer.properties.some((p) => p.name && nameText(p.name) === 'theme')
    ) {
      cvaTheme = true;
    }
  });
  if (themeProps.length === 0) return cvaTheme;
  return themeProps.some((p) => !p.type || !isOpenStringType(p.type, aliases));
}

function fileRule(
  relPath: (slug: string) => string,
  what: string,
  fix: (slug: string) => string,
  rule: RuleId
): Rule {
  return {
    section: 'docs-page-playground-entry-and-install-file',
    find: ({ slug }, wwwRoot) =>
      fs.existsSync(path.join(wwwRoot, relPath(slug))) ? [] : [{ component: slug, rule }],
    problem: () => `no ${what}`,
    fix: (v) => `add apps/www/${relPath(v.component)}. ${fix(v.component)}`,
  };
}

const RULES: Record<RuleId, Rule> = {
  'data-slot': {
    section: 'data-attributes',
    find: ({ slug, source }) =>
      [...exportedComponents(source)]
        .filter(([, fn]) => {
          let hasSlot = false;
          let rendersElement = false;
          walk(fn, (n) => {
            if (
              (ts.isJsxAttribute(n) || ts.isPropertyAssignment(n)) &&
              nameText(n.name) === 'data-slot'
            )
              hasSlot = true;
            if (
              ((ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) &&
                !n.tagName.getText().endsWith('.Provider')) ||
              (ts.isCallExpression(n) && n.expression.getText() === 'useRender')
            )
              rendersElement = true;
          });
          return rendersElement && !hasSlot;
        })
        .map(([part]) => ({ component: slug, rule: 'data-slot', part })),
    problem: (v) => `${v.part} renders without a data-slot`,
    fix: (v) =>
      `set data-slot="${v.component}" (root) or "${v.component}-<part>" on the element ${v.part} renders`,
  },
  'theme-formula': {
    section: 'theme',
    find: ({ slug, source }) =>
      attributeValues(source, 'data-theme')
        .filter((value) => !isThemeFormula(value))
        .map((value) => ({
          component: slug,
          rule: 'theme-formula',
          part: topLevelName(value),
        })),
    problem: (v) => `${v.part} sets data-theme without the documented formula`,
    fix: () =>
      "use data-theme={theme !== 'gray' ? theme : undefined}, or {theme !== 'gray' && <active> ? theme : undefined} for the active-state variant",
  },
  'theme-open': {
    section: 'theme',
    find: ({ slug, source }) =>
      themeIsClosed(source) ? [{ component: slug, rule: 'theme-open' }] : [],
    problem: () => 'the theme prop rejects custom strings',
    fix: () =>
      "type it as a local alias such as `type Theme = 'gray' | 'accent' | (string & {})` and use it for every theme prop and context field",
  },
  'docs-page': fileRule(
    (slug) => `docs/content/components/${slug}.mdx`,
    'docs page',
    (slug) =>
      `\`pnpm --filter www scaffold component ${slug} ...\` writes it for a new component, or \`pnpm --filter www scaffold docs ${slug} ...\` for an existing one`,
    'docs-page'
  ),
  'playground-entry': fileRule(
    (slug) => `playground/entries/${slug}.tsx`,
    'playground entry',
    (slug) =>
      `\`pnpm --filter www scaffold component ${slug} ...\` writes it, or copy the shape of playground/entries/button.tsx`,
    'playground-entry'
  ),
  'install-file': fileRule(
    (slug) => `public/r/${slug}.json`,
    'published install file',
    () => '`pnpm --filter www build:registry` writes it',
    'install-file'
  ),
};

function findViolations(wwwRoot: string): Violation[] {
  const uiDir = path.join(wwwRoot, 'registry/ui');
  const components: Component[] = fs
    .readdirSync(uiDir)
    .filter((f) => f.endsWith('.tsx'))
    .sort()
    .map((f) => ({
      slug: path.basename(f, '.tsx'),
      source: ts.createSourceFile(
        f,
        fs.readFileSync(path.join(uiDir, f), 'utf-8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      ),
    }));
  return components.flatMap((c) =>
    (Object.values(RULES) as Rule[]).flatMap((rule) => rule.find(c, wwwRoot))
  );
}

function readBaseline(wwwRoot: string): string[] {
  const file = path.join(wwwRoot, BASELINE_FILE);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : [];
}

export function checkConventions(wwwRoot: string, baseline = readBaseline(wwwRoot)) {
  const violations = findViolations(wwwRoot);
  /* Compared as counts, so a second break under an already-baselined key still fails. */
  const allowed = countKeys(baseline);
  const added = violations.filter((v) => {
    const key = violationKey(v);
    const left = allowed.get(key) ?? 0;
    allowed.set(key, left - 1);
    return left <= 0;
  });
  const current = countKeys(violations.map(violationKey));
  const fixed = baseline.filter((key) => {
    const left = current.get(key) ?? 0;
    current.set(key, left - 1);
    return left <= 0;
  });
  return { violations, added, fixed };
}

export function formatViolation(v: Violation): string {
  const rule = RULES[v.rule];
  return [
    `${v.component}: ${rule.problem(v)} [${violationKey(v)}]`,
    `  fix: ${rule.fix(v)}`,
    `  see: ${ARCHETYPES}#${rule.section}`,
  ].join('\n');
}

export function formatFixed(key: string): string {
  return `${key}: fixed, but still listed in apps/www/${BASELINE_FILE}. Delete that entry so the baseline only shrinks.`;
}
