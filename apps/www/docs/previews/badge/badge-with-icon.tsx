import { StarIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/registry/ui/badge';

export function BadgeLeading() {
  return (
    <Badge>
      <StarIcon />
      Featured
    </Badge>
  );
}

export function BadgeTrailing() {
  return (
    <Badge>
      Featured
      <StarIcon />
    </Badge>
  );
}

export default BadgeLeading;
