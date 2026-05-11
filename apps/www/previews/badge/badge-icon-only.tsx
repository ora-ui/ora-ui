import { StarIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/registry/ui/badge';

export default function BadgeIconOnly() {
  return (
    <Badge size="icon">
      <StarIcon />
    </Badge>
  );
}
