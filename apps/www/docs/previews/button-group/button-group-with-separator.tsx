import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import { ButtonGroup, ButtonGroupSeparator } from '@/registry/ui/button-group';
import { Button } from '@/registry/ui/button';

export default function ButtonGroupWithSeparator() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button>
          <MagnifyingGlassIcon />
          Search
        </Button>
        <ButtonGroupSeparator />
        <Button>
          <PlusCircleIcon />
          New
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="soft">
          <MagnifyingGlassIcon />
          Search
        </Button>
        <ButtonGroupSeparator />
        <Button variant="soft">
          <PlusCircleIcon />
          New
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
