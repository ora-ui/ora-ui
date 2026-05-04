import { CheckCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/components/ui/badge';

export default function BadgeIconOnly() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge size="icon" variant="soft" theme="warning">
        <ClockIcon />
      </Badge>
      <Badge size="icon" variant="soft" theme="accent">
        <EyeIcon />
      </Badge>
      <Badge size="icon" variant="soft" theme="success">
        <CheckCircleIcon />
      </Badge>
    </div>
  );
}
