import { Badge } from '@/components/ui/badge';

export default function BadgeAsLink() {
  return <Badge render={<a href="/changelog" />}>New feature</Badge>;
}
