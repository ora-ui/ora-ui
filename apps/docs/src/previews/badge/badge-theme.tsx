import { Badge } from '@/components/ui/badge';

export default function BadgeTheme() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="solid" theme="gray">
        Gray
      </Badge>
      <Badge variant="solid" theme="accent">
        Accent
      </Badge>
      <Badge variant="solid" theme="destructive">
        Destructive
      </Badge>
    </div>
  );
}
