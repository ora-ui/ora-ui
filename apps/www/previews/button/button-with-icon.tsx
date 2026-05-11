import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { Button } from '@/registry/ui/button';

export function Leading() {
  return (
    <Button>
      <PlusCircleIcon />
      Create New
    </Button>
  );
}

export function Trailing() {
  return (
    <Button>
      Create New
      <PlusCircleIcon />
    </Button>
  );
}

export default Leading;
