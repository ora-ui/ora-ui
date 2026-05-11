import { BookmarkIcon, PencilSquareIcon, ShareIcon, TrashIcon } from '@heroicons/react/16/solid';
import { ButtonGroup } from '@/registry/ui/button-group';
import { Button } from '@/registry/ui/button';

export default function ButtonGroupIconButtons() {
  return (
    <ButtonGroup>
      <Button variant="surface" size="icon">
        <PencilSquareIcon className="size-3.5" />
      </Button>
      <Button variant="surface" size="icon">
        <ShareIcon className="size-3.5" />
      </Button>
      <Button variant="surface" size="icon">
        <BookmarkIcon className="size-3.5" />
      </Button>
      <Button variant="surface" size="icon">
        <TrashIcon className="size-3.5" />
      </Button>
    </ButtonGroup>
  );
}
