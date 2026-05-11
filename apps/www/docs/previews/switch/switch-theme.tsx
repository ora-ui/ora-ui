import { Switch } from '@/registry/ui/switch';

export function SwitchGray() {
  return <Switch defaultChecked />;
}

export function SwitchAccent() {
  return <Switch theme="accent" defaultChecked />;
}

export default SwitchGray;
