import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/ui/button';

export default function ButtonIconButton() {
  return (
    <Button size="icon" aria-label="Add">
      <PlusCircleIcon />
    </Button>
  );
}
