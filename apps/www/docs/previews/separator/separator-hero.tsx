import { Separator } from '@/registry/ui/separator';

export default function SeparatorHero() {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium leading-none">Ora UI</h4>
      <p className="text-sm text-muted-foreground">An open-source component library.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Primitives</span>
        <Separator orientation="vertical" />
        <span>Tokens</span>
      </div>
    </div>
  );
}
