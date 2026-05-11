import { StarIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/registry/ui/badge';

export function Leading() {
  return (
    <Badge>
      <StarIcon />
      Featured
    </Badge>
  );
}

export function Trailing() {
  return (
    <Badge>
      Featured
      <StarIcon />
    </Badge>
  );
}

export default Leading;
