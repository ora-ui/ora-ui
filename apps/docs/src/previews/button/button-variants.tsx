import { Button } from '@/components/ui/button';

export default function ButtonVariants() {
  return (
    <div className="flex gap-2">
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="surface">Surface</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}
