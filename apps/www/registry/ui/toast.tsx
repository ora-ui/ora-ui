'use client';

import * as React from 'react';
import {
  Toast as ToastPrimitive,
  type ToastManagerAddOptions,
  type ToastManagerUpdateOptions,
  type ToastObject,
} from '@base-ui/react/toast';
import { cva } from 'class-variance-authority';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid';

import { cn } from '@/registry/lib/utils';
import { Button } from '@/registry/ui/button';

type Theme = 'gray' | 'accent' | 'destructive' | 'warning' | 'success' | (string & {});
type ToastVariant = 'surface' | 'soft' | 'solid';
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
type ToastPosition = 'bottom-right' | 'bottom-center' | 'top-right' | 'top-center';
type SwipeDirection = 'up' | 'down' | 'left' | 'right';

interface ToastData {
  theme?: Theme;
  variant?: ToastVariant;
}

const typeThemes: Record<ToastType, Theme> = {
  success: 'success',
  error: 'destructive',
  warning: 'warning',
  info: 'accent',
  loading: 'gray',
};

const typeIcons: Record<ToastType, React.ComponentType<React.ComponentProps<'svg'>>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  loading: ArrowPathIcon,
};

const toastManager = ToastPrimitive.createToastManager<ToastData>();

const toastVariants = cva(
  'group/toast absolute h-(--toast-calc-height) w-full rounded-md border text-sm shadow-md select-none',
  {
    variants: {
      variant: {
        surface: 'border-border bg-overlay text-primary',
        soft: 'border-transparent bg-overlay bg-[image:linear-gradient(var(--ui),var(--ui))] text-primary',
        solid: 'border-transparent bg-solid text-on-solid',
      },
    },
    defaultVariants: {
      variant: 'surface',
    },
  }
);

const ToastContext = React.createContext<{
  theme: Theme;
  type: string | undefined;
  variant: ToastVariant;
}>({ theme: 'gray', type: undefined, variant: 'surface' });

const ToastDefaultsContext = React.createContext<{ variant: ToastVariant }>({
  variant: 'surface',
});

const ToastPositionContext = React.createContext<ToastPosition>('bottom-right');

function resolveTheme(toast: ToastObject<ToastData>): Theme {
  const type = toast.type as ToastType | undefined;
  return toast.data?.theme ?? (type ? typeThemes[type] : undefined) ?? 'gray';
}

/*
 * Base UI increments `updateKey` whenever a toast with an existing id is added
 * again or updated. The odd and even animations are identical keyframes under
 * two names, so swapping the class restarts the animation on every re-fire.
 */
function replayClassName(toast: ToastObject<ToastData>, theme: Theme) {
  const key = toast.updateKey ?? 0;
  if (key <= 0) return undefined;
  const even = key % 2 === 0;
  if (toast.type === 'error' || theme === 'destructive') {
    return even ? 'animate-toast-error-even' : 'animate-toast-error-odd';
  }
  return even ? 'animate-toast-pulse-even' : 'animate-toast-pulse-odd';
}

function swipeDirectionFor(position: ToastPosition): SwipeDirection[] {
  const vertical: SwipeDirection = position.startsWith('top') ? 'up' : 'down';
  return position.endsWith('center') ? [vertical] : ['right', vertical];
}

function ToastProvider({
  variant = 'surface',
  toastManager: manager = toastManager,
  ...props
}: ToastPrimitive.Provider.Props & { variant?: ToastVariant }) {
  const defaults = React.useMemo(() => ({ variant }), [variant]);
  return (
    <ToastDefaultsContext.Provider value={defaults}>
      <ToastPrimitive.Provider toastManager={manager} {...props} />
    </ToastDefaultsContext.Provider>
  );
}

function ToastViewport({
  className,
  position = 'bottom-right',
  ...props
}: ToastPrimitive.Viewport.Props & { position?: ToastPosition }) {
  return (
    <ToastPositionContext.Provider value={position}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          data-position={position}
          className={cn(
            'fixed z-50 w-(--toast-width,22.5rem) max-w-[calc(100vw-var(--toast-inset)*2)] [--toast-inset:1rem]',
            'data-[position^=top]:top-(--toast-inset) data-[position^=bottom]:bottom-(--toast-inset)',
            'data-[position$=right]:right-(--toast-inset)',
            'data-[position$=center]:left-1/2 data-[position$=center]:-translate-x-1/2',
            className
          )}
          {...props}
        />
      </ToastPrimitive.Portal>
    </ToastPositionContext.Provider>
  );
}

function Toast({
  className,
  toast,
  variant: variantProp,
  theme: themeProp,
  swipeDirection,
  ...props
}: ToastPrimitive.Root.Props & {
  variant?: ToastVariant;
  theme?: Theme;
}) {
  const position = React.useContext(ToastPositionContext);
  const defaults = React.useContext(ToastDefaultsContext);
  const theme = themeProp ?? resolveTheme(toast);
  const variant = variantProp ?? toast.data?.variant ?? defaults.variant;
  const context = React.useMemo(
    () => ({ theme, type: toast.type, variant }),
    [theme, toast.type, variant]
  );

  return (
    <ToastContext.Provider value={context}>
      <ToastPrimitive.Root
        data-slot="toast"
        data-variant={variant}
        data-theme={theme !== 'gray' ? theme : undefined}
        data-position={position}
        toast={toast}
        swipeDirection={swipeDirection ?? swipeDirectionFor(position)}
        className={cn(
          toastVariants({ variant }),
          'z-[calc(9999-var(--toast-index))] bg-clip-padding',
          '[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap-size:var(--toast-gap,0.75rem)] [--toast-peek:0.75rem] [--toast-scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--toast-shrink:calc(1-var(--toast-scale))]',
          'right-0 left-0',
          'data-[position^=top]:top-0 data-[position^=top]:origin-[50%_calc(50%-50%*min(var(--toast-index,0),1))]',
          'data-[position^=bottom]:bottom-0 data-[position^=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index,0),1))]',
          'after:absolute after:left-0 after:h-[calc(var(--toast-gap-size)+1px)] after:w-full',
          'data-[position^=top]:after:top-full data-[position^=bottom]:after:bottom-full',
          'data-[position^=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap-size)+var(--toast-swipe-movement-y))]',
          'data-[position^=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap-size)*-1+var(--toast-swipe-movement-y))]',
          'data-[position^=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]',
          'data-[position^=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]',
          'transition-[transform,opacity,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-[opacity,height]',
          'data-limited:opacity-0',
          'data-expanded:h-(--toast-height) data-position:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]',
          'data-starting-style:opacity-0 data-ending-style:opacity-0',
          'motion-safe:data-[position^=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]',
          'motion-safe:data-[position^=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]',
          'motion-safe:data-[position^=top]:data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(-100%-var(--toast-inset)))]',
          'motion-safe:data-[position^=bottom]:data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]',
          'data-[swipe-direction=left]:data-ending-style:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
          'data-[swipe-direction=right]:data-ending-style:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
          'data-[swipe-direction=up]:data-ending-style:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]',
          'data-[swipe-direction=down]:data-ending-style:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]',
          replayClassName(toast, theme),
          'motion-reduce:animate-none',
          className
        )}
        {...props}
      />
    </ToastContext.Provider>
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        'pointer-events-auto flex items-start gap-3 overflow-hidden p-3 transition-opacity duration-250 data-behind:not-data-expanded:pointer-events-none data-behind:opacity-0 data-expanded:opacity-100',
        className
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn('leading-5 font-medium', className)}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        'leading-5 text-secondary group-data-[variant=solid]/toast:text-on-solid/80',
        className
      )}
      {...props}
    />
  );
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={<Button variant="soft" size="sm" />}
      className={cn(
        'group-data-[variant=solid]/toast:bg-on-solid/15 group-data-[variant=solid]/toast:text-on-solid group-data-[variant=solid]/toast:hover:bg-on-solid/25',
        className
      )}
      {...props}
    />
  );
}

function ToastClose({ className, children, ...props }: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close"
      render={<Button variant="ghost" size="icon-sm" />}
      className={cn(
        '-mt-1 -mr-1 shrink-0 group-data-[variant=solid]/toast:text-on-solid group-data-[variant=solid]/toast:hover:bg-on-solid/15',
        className
      )}
      {...props}
    >
      {children ?? <XMarkIcon />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ className }: { className?: string }) {
  const { type } = React.useContext(ToastContext);
  const Icon = type ? typeIcons[type as ToastType] : undefined;
  if (!Icon) return null;
  return (
    <span
      data-slot="toast-icon"
      className={cn(
        'flex h-5 shrink-0 items-center text-ring group-data-[variant=solid]/toast:text-on-solid',
        className
      )}
    >
      <Icon
        aria-hidden
        className={cn('size-4', type === 'loading' && 'animate-spin motion-reduce:animate-none')}
      />
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>();
  return toasts.map((toast) => (
    <Toast key={toast.id} toast={toast}>
      <ToastContent>
        <ToastIcon />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastTitle />
          <ToastDescription />
          <ToastAction className="mt-2 self-start" />
        </div>
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({
  variant,
  position,
  limit,
  timeout,
  toastManager: manager,
  ...props
}: Omit<ToastPrimitive.Viewport.Props, 'children'> &
  Pick<ToastPrimitive.Provider.Props, 'limit' | 'timeout' | 'toastManager'> & {
    variant?: ToastVariant;
    position?: ToastPosition;
  }) {
  return (
    <ToastProvider variant={variant} limit={limit} timeout={timeout} toastManager={manager}>
      <ToastViewport data-slot="toaster" position={position} {...props}>
        <ToastList />
      </ToastViewport>
    </ToastProvider>
  );
}

type ToastOptions = Omit<ToastManagerAddOptions<ToastData>, 'type'> & {
  theme?: Theme;
  variant?: ToastVariant;
};

type ToastUpdateOptions = Omit<ToastManagerUpdateOptions<ToastData>, 'type'> & {
  theme?: Theme;
  variant?: ToastVariant;
  type?: ToastType;
};

type PromiseOption<Arg> = string | ToastUpdateOptions | ((arg: Arg) => string | ToastUpdateOptions);

function toBaseOptions<T extends { theme?: Theme; variant?: ToastVariant; data?: ToastData }>(
  options: T
): Omit<T, 'theme' | 'variant'> {
  const { theme, variant, data, ...rest } = options;
  const merged = theme || variant ? { ...data, theme, variant } : data;
  return (merged ? { ...rest, data: merged } : rest) as Omit<T, 'theme' | 'variant'>;
}

function isOptions(value: unknown): value is ToastOptions {
  return (
    typeof value === 'object' &&
    value !== null &&
    !React.isValidElement(value) &&
    !Array.isArray(value)
  );
}

function addToast(
  type: ToastType | undefined,
  titleOrOptions: React.ReactNode | ToastOptions,
  options?: ToastOptions
) {
  const resolved: ToastOptions = isOptions(titleOrOptions)
    ? titleOrOptions
    : { ...options, title: titleOrOptions };
  return toastManager.add({
    priority: type === 'error' || type === 'warning' ? 'high' : 'low',
    ...toBaseOptions(resolved),
    type,
  });
}

function resolvePromiseOption<Arg>(
  option: PromiseOption<Arg>,
  priority?: 'high'
):
  | string
  | ToastManagerUpdateOptions<ToastData>
  | ((arg: Arg) => ToastManagerUpdateOptions<ToastData>) {
  const normalize = (value: string | ToastUpdateOptions): ToastManagerUpdateOptions<ToastData> => ({
    ...(priority ? { priority } : null),
    ...toBaseOptions(typeof value === 'string' ? { title: value } : value),
  });
  if (typeof option === 'function') return (arg: Arg) => normalize(option(arg));
  return typeof option === 'string' && !priority ? option : normalize(option);
}

type ToastArgs = [titleOrOptions: React.ReactNode | ToastOptions, options?: ToastOptions];

const toast = Object.assign((...args: ToastArgs) => addToast(undefined, ...args), {
  success: (...args: ToastArgs) => addToast('success', ...args),
  error: (...args: ToastArgs) => addToast('error', ...args),
  warning: (...args: ToastArgs) => addToast('warning', ...args),
  info: (...args: ToastArgs) => addToast('info', ...args),
  loading: (...args: ToastArgs) => addToast('loading', ...args),
  promise: <Value,>(
    promise: Promise<Value>,
    options: {
      loading: string | ToastUpdateOptions;
      success: PromiseOption<Value>;
      /* a rejection can be any value, as in Promise.catch */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: PromiseOption<any>;
    }
  ) =>
    toastManager.promise(promise, {
      loading: resolvePromiseOption(options.loading) as
        | ToastManagerUpdateOptions<ToastData>
        | string,
      success: resolvePromiseOption(options.success),
      error: resolvePromiseOption(options.error, 'high'),
    }),
  update: (id: string, options: ToastUpdateOptions) =>
    toastManager.update(id, (previous) => {
      const { theme, variant, data, ...rest } = options;
      const merged =
        theme || variant || data
          ? {
              ...previous.data,
              ...data,
              ...(theme && { theme }),
              ...(variant && { variant }),
            }
          : undefined;
      return merged ? { ...rest, data: merged } : rest;
    }),
  dismiss: (id?: string) => toastManager.close(id),
});

const useToast = ToastPrimitive.useToastManager;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  toastVariants,
  useToast,
};
export type { ToastOptions, ToastPosition, ToastType, ToastUpdateOptions, ToastVariant };
