/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: 'no-orphans',
      severity: 'error',
      comment: 'Orphaned modules are almost always dead code.',
      from: {
        orphan: true,
        pathNot: ['(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', '\\.d\\.ts$', '^next-env\\.d\\.ts$'],
      },
      to: {},
    },
    {
      name: 'verticals-must-not-import-app',
      severity: 'error',
      comment:
        'Routes (app/) compose verticals; verticals must remain route-agnostic. ' +
        'If you need shared state across routes, lift it into app/ or a lib/.',
      from: { path: '^(header|docs|playground|registry|templates)/' },
      to: { path: '^app/' },
    },
    {
      name: 'registry-is-leaf',
      severity: 'error',
      comment:
        'registry/ ships to consumers as the design-system vertical. ' +
        'It must not depend on app infrastructure (header, docs, playground, app, lib).',
      from: { path: '^registry/' },
      to: { path: '^(header|docs|playground|app|lib)/' },
    },
    {
      name: 'cross-vertical-imports-must-use-barrels',
      severity: 'error',
      comment:
        "Cross-vertical imports must go through the target vertical's index.ts barrel. " +
        'Deep imports couple private internals.',
      from: { path: '^(header|docs|playground)/' },
      to: {
        path: '^(header|docs|playground)/',
        pathNot: ['^$1/', '^(header|docs|playground)/index\\.[jt]sx?$'],
      },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
    },
    exclude: {
      path: ['node_modules', '\\.next/', '\\.source/', '\\.test\\.', '\\.spec\\.'],
    },
  },
};
