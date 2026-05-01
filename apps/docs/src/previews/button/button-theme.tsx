import { Button } from '@/components/ui/button';

export default function ButtonTheme() {
  return (
    <div className="flex gap-2">
      <Button variant="solid" theme="gray">
        Gray
      </Button>
      <Button variant="solid" theme="accent">
        Accent
      </Button>
      <Button variant="solid" theme="destructive">
        Destructive
      </Button>
    </div>
  );
}
