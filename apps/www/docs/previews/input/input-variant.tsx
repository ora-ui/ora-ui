import { Input } from '@/registry/ui/input';

export function InputSurface() {
  return <Input placeholder="Email address" />;
}

export function InputOutline() {
  return <Input variant="outline" placeholder="Email address" />;
}

export function InputSoft() {
  return <Input variant="soft" placeholder="Email address" />;
}

export default InputSurface;
