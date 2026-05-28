'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@/registry/lib/utils';

function ScrollArea({ className, children, ...props }: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full overscroll-contain focus-visible:outline-2 focus-visible:outline-focus"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaScrollbar />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollAreaScrollbar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none select-none p-0.5 opacity-0 transition-opacity duration-150 data-hovering:opacity-100 data-scrolling:opacity-100',
        orientation === 'vertical' && 'h-full w-2',
        orientation === 'horizontal' && 'w-full flex-col h-2',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="flex-1 rounded-full bg-focus"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea };
