import { Input } from '@/registry/ui/input';

export function Surface() {
  return <Input placeholder="Email address" />;
}

export function Outline() {
  return <Input variant="outline" placeholder="Email address" />;
}

export function Soft() {
  return <Input variant="soft" placeholder="Email address" />;
}

export default Surface;
