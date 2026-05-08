import { Switch } from '@/components/ui/switch';

export function Gray() {
  return <Switch defaultChecked />;
}

export function Accent() {
  return <Switch theme="accent" defaultChecked />;
}

export default Gray;
