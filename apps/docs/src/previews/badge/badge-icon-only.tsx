import { StarIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/components/ui/badge';

export default function BadgeIconOnly() {
  return (
    <Badge size="icon">
      <StarIcon />
    </Badge>
  );
}
