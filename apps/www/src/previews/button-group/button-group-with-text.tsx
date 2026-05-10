import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

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
