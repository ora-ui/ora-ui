import { Textarea } from '@/components/ui/textarea';

export default function TextareaManualResize() {
  return <Textarea autoResize={false} placeholder="Drag to resize..." />;
}
