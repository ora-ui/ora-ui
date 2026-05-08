import { Textarea } from '@/components/ui/textarea';

export function Surface() {
  return <Textarea placeholder="Write something..." />;
}

export function Outline() {
  return <Textarea variant="outline" placeholder="Write something..." />;
}

export function Soft() {
  return <Textarea variant="soft" placeholder="Write something..." />;
}

export default Surface;
