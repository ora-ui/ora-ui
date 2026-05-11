import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';
import { ButtonGroup } from '@/registry/ui/button-group';
import { Button } from '@/registry/ui/button';

export default function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="surface" size="icon">
        <PlusIcon />
      </Button>
      <Button variant="surface" size="icon">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  );
}
