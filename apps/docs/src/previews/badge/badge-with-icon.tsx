import { CheckCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/components/ui/badge';

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="soft" theme="warning">
        <ClockIcon />
        In Progress
      </Badge>
      <Badge variant="soft" theme="accent">
        <EyeIcon />
        In Review
      </Badge>
      <Badge variant="soft" theme="success">
        <CheckCircleIcon />
        Completed
      </Badge>
    </div>
  );
}
