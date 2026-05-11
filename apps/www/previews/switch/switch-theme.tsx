import { Switch } from '@/registry/ui/switch';

export function Gray() {
  return <Switch defaultChecked />;
}

export function Accent() {
  return <Switch theme="accent" defaultChecked />;
}

export default Gray;
