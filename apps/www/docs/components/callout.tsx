import * as React from 'react';
import { cn } from '@/registry/lib/utils';

type CalloutVariant = 'default' | 'info' | 'warning';

const themeMap: Record<CalloutVariant, string | undefined> = {
  default: undefined,
  info: 'accent',
  warning: 'warning',
};

interface CalloutProps extends React.ComponentProps<'div'> {
  variant?: CalloutVariant;
  title?: string;
  icon?: React.ReactNode;
}

function Callout({
  className,
  variant = 'default',
  title,
  icon,
  children,
  ...props
}: CalloutProps) {
  const theme = themeMap[variant];

  return (
    <div
      data-theme={theme}
      className={cn('my-6 rounded-lg border border-line-ui bg-ui px-4 py-3.5', className)}
      {...props}
    >
      {(icon || title) && (
        <div className="mb-2 flex items-center gap-2 font-medium text-primary">
          {icon}
          {title && <span>{title}</span>}
        </div>
      )}
      <div className="text-sm leading-relaxed text-secondary">{children}</div>
    </div>
  );
}

export { Callout };
export type { CalloutVariant };
