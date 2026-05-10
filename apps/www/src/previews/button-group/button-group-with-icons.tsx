import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

export default function ButtonGroupWithIcons() {
  return (
    <ButtonGroup>
      <Button variant="surface">
        <ChevronLeftIcon />
        Previous
      </Button>
      <Button variant="surface">
        Next
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}
