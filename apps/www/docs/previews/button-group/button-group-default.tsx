import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { ButtonGroup } from '@/registry/ui/button-group';
import { Button } from '@/registry/ui/button';

export default function ButtonGroupDefault() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="surface" size="icon">
          <ChevronLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="surface">One</Button>
        <Button variant="surface">Two</Button>
        <Button variant="surface">Three</Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
