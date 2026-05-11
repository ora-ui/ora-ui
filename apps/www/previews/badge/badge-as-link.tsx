import { ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/registry/ui/badge';

export default function BadgeAsLink() {
  return (
    <Badge render={<a href="#as-a-link" />}>
      New feature
      <ArrowTopRightOnSquareIcon />
    </Badge>
  );
}
