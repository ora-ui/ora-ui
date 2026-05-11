import { Textarea } from '@/registry/ui/textarea';

export default function TextareaManualResize() {
  return <Textarea autoResize={false} placeholder="Drag to resize..." />;
}
