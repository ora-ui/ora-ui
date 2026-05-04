import { Badge } from '@/components/ui/badge';

export default function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="surface">Surface</Badge>
      <Badge variant="soft">Soft</Badge>
    </div>
  );
}
