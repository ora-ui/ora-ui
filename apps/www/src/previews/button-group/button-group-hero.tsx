import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

export default function ButtonGroupHero() {
  return (
    <ButtonGroup>
      <Button variant="surface">Day</Button>
      <Button variant="surface">Week</Button>
      <Button variant="surface">Month</Button>
    </ButtonGroup>
  );
}
