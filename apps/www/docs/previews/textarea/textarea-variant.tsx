import { Textarea } from '@/registry/ui/textarea';

export function TextareaSurface() {
  return <Textarea placeholder="Write something..." />;
}

export function TextareaOutline() {
  return <Textarea variant="outline" placeholder="Write something..." />;
}

export function TextareaSoft() {
  return <Textarea variant="soft" placeholder="Write something..." />;
}

export default TextareaSurface;
