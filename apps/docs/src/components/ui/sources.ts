import fs from 'fs';
import path from 'path';

const uiDir = path.join(process.cwd(), 'src/components/ui');

function readSource(filename: string): string {
  return fs.readFileSync(path.join(uiDir, filename), 'utf-8');
}

// @scaffold:component-imports
export default {
  button: readSource('button.tsx'),
  badge: readSource('badge.tsx'),
  'button-group': readSource('button-group.tsx'),
  'dropdown-menu': readSource('dropdown-menu.tsx'),
  accordion: readSource('accordion.tsx'),
  'alert-dialog': readSource('alert-dialog.tsx'),
  avatar: readSource('avatar.tsx'),
  checkbox: readSource('checkbox.tsx'),
  'checkbox-group': readSource('checkbox-group.tsx'),
  dialog: readSource('dialog.tsx'),
  form: readSource('form.tsx'),
  input: readSource('input.tsx'),
  kbd: readSource('kbd.tsx'),
  'radio-group': readSource('radio-group.tsx'),
  separator: readSource('separator.tsx'),
  textarea: readSource('textarea.tsx'),
  toggle: readSource('toggle.tsx'),
  // @scaffold:component-entries
} as Record<string, string>;
