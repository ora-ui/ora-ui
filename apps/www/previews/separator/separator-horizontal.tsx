import { Separator } from '@/registry/ui/separator';

export default function SeparatorHorizontal() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Ora UI</h4>
        <p className="text-sm text-muted-foreground">An open-source component library.</p>
      </div>
      <Separator />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Features</h4>
        <p className="text-sm text-muted-foreground">
          Styled primitives and composable patterns for building accessible products.
        </p>
      </div>
    </div>
  );
}
