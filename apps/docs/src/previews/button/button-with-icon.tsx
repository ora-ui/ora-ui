import { CloudArrowUpIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/ui/button';

export default function ButtonWithIcon() {
  return (
    <div className="flex gap-2">
      <Button>
        <PlusCircleIcon />
        Create New
      </Button>
      <Button variant="soft">
        <CloudArrowUpIcon />
        Upload
      </Button>
    </div>
  );
}
