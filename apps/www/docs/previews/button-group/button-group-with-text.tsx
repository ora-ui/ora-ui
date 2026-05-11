import { ButtonGroup, ButtonGroupText } from '@/registry/ui/button-group';
import { Button } from '@/registry/ui/button';

export default function ButtonGroupWithText() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Sort by</ButtonGroupText>
      <Button variant="surface">Name</Button>
      <Button variant="surface">Date</Button>
      <Button variant="surface">Size</Button>
    </ButtonGroup>
  );
}
