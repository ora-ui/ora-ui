import { registry } from '@/previews/registry';

interface ComponentPreviewProps {
  name: string;
  children?: React.ReactNode;
}

export function ComponentPreview({ name, children }: ComponentPreviewProps) {
  const Preview = registry[name];

  return (
    <div className="mt-3 mb-7 overflow-hidden rounded-lg border border-line">
      <div className="flex min-h-50 items-center justify-center p-6">
        {Preview ? (
          <Preview />
        ) : (
          <p className="text-sm text-secondary">Preview not found: {name}</p>
        )}
      </div>
      {children && (
        <div className="border-t border-line [&>div]:my-0 [&>div>pre]:rounded-none [&>div>pre]:border-0">
          {children}
        </div>
      )}
    </div>
  );
}
