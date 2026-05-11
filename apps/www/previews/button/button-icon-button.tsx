import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { Button } from '@/registry/ui/button';

export default function ButtonIconButton() {
  return (
    <Button size="icon" aria-label="Add">
      <PlusCircleIcon />
    </Button>
  );
}
