import { SignalIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/registry/ui/badge';

export default function BadgeHero() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="solid" theme="accent">
        New
      </Badge>
      <Badge variant="soft" theme="destructive">
        <SignalIcon />
        Live
      </Badge>
      <Badge variant="outline" theme="success">
        POST
      </Badge>
    </div>
  );
}
