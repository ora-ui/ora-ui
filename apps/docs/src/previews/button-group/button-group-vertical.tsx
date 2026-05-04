import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

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
