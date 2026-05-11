import * as React from 'react';
import {
  CloudArrowUpIcon,
  PlusCircleIcon,
  PlusIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
  ShareIcon,
  BookmarkIcon,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/16/solid';
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from '@radix-ui/react-icons';
import type { MDXComponents } from 'mdx/types';
import NextImage from 'next/image';
import { cn } from '@/registry/lib/utils';
import { CodeBlock, CodeBlockRoot } from '@/docs/components/code-block';
import { CodeBlockCopyButton } from '@/docs/components/code-block-command-bar';
import { Steps, Step } from '@/docs/components/steps';
import { CodeBlockTabs } from '@/docs/components/code-block-tabs';
import { Callout } from '@/docs/components/callout';
import { ComponentPreview } from '@/docs/components/component-preview';
import { ComponentSource } from '@/docs/components/component-source';
import { Tabs, TabsList, TabsTab, TabsPanel, TabsSurface } from '@/registry/ui/tabs';
import { Badge } from '@/registry/ui/badge';
import { Button } from '@/registry/ui/button';
import { Kbd, KbdGroup } from '@/registry/ui/kbd';
import { Separator } from '@/registry/ui/separator';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/registry/ui/button-group';
import { Input } from '@/registry/ui/input';
import { Label } from '@/registry/ui/label';
import { Textarea } from '@/registry/ui/textarea';
import { Toggle } from '@/registry/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/registry/ui/dropdown-menu';

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextContent).join('');
  if (React.isValidElement(node))
    return extractTextContent((node.props as { children?: React.ReactNode }).children);
  return '';
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    // HTML element overrides
    h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
      <h1
        className={cn('text-3xl font-semibold tracking-tight text-primary', className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
      <h2
        className={cn(
          'mt-10 mb-2 scroll-m-20 text-2xl font-semibold tracking-tight text-primary',
          '[&+h3]:mt-4 [&+p]:mt-3',
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
      <h3
        className={cn(
          'mt-8 scroll-m-20 text-xl font-medium tracking-tight text-primary',
          '[&+p]:mt-2',
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
      <h4
        className={cn('mt-6 scroll-m-20 text-lg font-medium text-primary', className)}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
      <h5
        className={cn('mt-4 scroll-m-20 text-base font-medium text-primary', className)}
        {...props}
      />
    ),
    h6: ({ className, ...props }: React.ComponentProps<'h6'>) => (
      <h6
        className={cn('mt-4 scroll-m-20 text-base font-medium text-primary', className)}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.ComponentProps<'p'>) => (
      <p
        className={cn(
          'leading-relaxed not-first:mt-3',
          '[&>code]:rounded-xs [&>code]:border [&>code]:border-dotted [&>code]:border-line [&>code]:bg-ui [&>code]:px-1 [&>code]:py-0.5',
          className
        )}
        {...props}
      />
    ),
    strong: ({ className, ...props }: React.ComponentProps<'strong'>) => (
      <strong className={cn('font-semibold', className)} {...props} />
    ),
    a: ({ className, ...props }: React.ComponentProps<'a'>) => (
      <a
        className={cn('font-medium underline underline-offset-4 hover:text-secondary', className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
      <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
    ),
    ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
      <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
    ),
    li: ({ className, ...props }: React.ComponentProps<'li'>) => (
      <li className={cn('mt-2', className)} {...props} />
    ),
    img: ({ className, alt, src, width, height, ...props }: React.ComponentProps<'img'>) => (
      <span className="my-6 block overflow-hidden rounded-md">
        <NextImage
          className={cn('w-full', className)}
          alt={alt ?? ''}
          src={src as string}
          width={typeof width === 'number' ? width : 1200}
          height={typeof height === 'number' ? height : 630}
          {...props}
        />
      </span>
    ),
    pre: (props) => {
      const code = extractTextContent(props.children);
      return (
        <CodeBlockRoot>
          <CodeBlockCopyButton code={code} floating />
          <CodeBlock {...props} />
        </CodeBlockRoot>
      );
    },
    code: ({ className, ...props }: React.ComponentProps<'code'>) => {
      if (className?.includes('language-')) {
        return <code className={cn('font-mono', className)} {...props} />;
      }
      return (
        <code className={cn('font-mono text-[0.8rem] wrap-break-word', className)} {...props} />
      );
    },
    blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
      <blockquote
        className={cn('mt-6 border-l-2 border-line pl-6 italic text-secondary', className)}
        {...props}
      />
    ),
    hr: ({ className, ...props }: React.ComponentProps<'hr'>) => (
      <hr className={cn('my-8 border-line', className)} {...props} />
    ),
    table: ({ className, ...props }: React.ComponentProps<'table'>) => (
      <div className="my-6 w-full overflow-y-auto rounded-xl border border-line">
        <table className={cn('relative w-full overflow-hidden text-sm', className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
      <tr className={cn('m-0 border-b border-line p-0', className)} {...props} />
    ),
    th: ({ className, ...props }: React.ComponentProps<'th'>) => (
      <th
        className={cn(
          'px-4 py-2 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right',
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.ComponentProps<'td'>) => (
      <td
        className={cn(
          'px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
          className
        )}
        {...props}
      />
    ),
    // Docs components
    CodeBlockTabs,
    Steps,
    Step,
    Callout,
    ComponentPreview,
    ComponentSource,
    // Ora UI components
    Badge,
    Button,
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    Kbd,
    KbdGroup,
    Input,
    Label,
    Textarea,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
    Separator,
    Tabs,
    TabsList,
    TabsTab,
    TabsPanel,
    TabsSurface,
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    PlusCircleIcon,
    PlusIcon,
    MinusIcon,
    CloudArrowUpIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    PencilSquareIcon,
    ShareIcon,
    BookmarkIcon,
    CheckIcon,
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    TextAlignLeftIcon,
    TextAlignCenterIcon,
    TextAlignRightIcon,
    TextAlignJustifyIcon,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
