import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { Button } from '@/registry/ui/button';

export function ButtonLeading() {
  return (
    <Button>
      <PlusCircleIcon />
      Create New
    </Button>
  );
}

export function ButtonTrailing() {
  return (
    <Button>
      Create New
      <PlusCircleIcon />
    </Button>
  );
}

export default ButtonLeading;
