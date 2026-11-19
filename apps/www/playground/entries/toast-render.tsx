'use client';

import { useToast } from '@/registry/ui/toast';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  type ToastPosition,
  type ToastVariant,
} from '@/registry/ui/toast';
import { Button } from '@/registry/ui/button';
import type { EntryState } from '@/playground/lib/types';

const isOn = (value: string | boolean) => value === true || value === 'true';

function PlaygroundToasts({ showClose, theme }: { showClose: boolean; theme: string }) {
  const { toasts } = useToast();
  return toasts.map((item) => (
    <Toast key={item.id} toast={item} theme={theme}>
      <ToastContent>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastTitle />
          <ToastDescription />
          <ToastAction className="mt-2 self-start" />
        </div>
        {showClose && <ToastClose />}
      </ToastContent>
    </Toast>
  ));
}

export function ToastRender({ variants, behavior, inputs }: EntryState) {
  const theme = variants.theme as string;
  const showAction = isOn(behavior.showAction);
  return (
    <ToastProvider
      variant={variants.variant as ToastVariant}
      limit={Number(behavior.limit)}
      timeout={Number(behavior.timeout)}
    >
      <Button
        variant="outline"
        onClick={() =>
          toast(inputs.title as string, {
            description: inputs.description as string,
            actionProps: showAction ? { children: inputs.actionLabel as string } : undefined,
          })
        }
      >
        Show toast
      </Button>
      <ToastViewport position={behavior.position as ToastPosition}>
        <PlaygroundToasts showClose={isOn(behavior.showClose)} theme={theme} />
      </ToastViewport>
    </ToastProvider>
  );
}
