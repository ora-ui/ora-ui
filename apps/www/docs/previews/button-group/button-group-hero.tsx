import { ButtonGroup } from '@/registry/ui/button-group';
import { Button } from '@/registry/ui/button';

export default function ButtonGroupHero() {
  return (
    <ButtonGroup>
      <Button variant="surface">Day</Button>
      <Button variant="surface">Week</Button>
      <Button variant="surface">Month</Button>
    </ButtonGroup>
  );
}
