import defaultMdxComponents from 'fumadocs-ui/mdx';
import { CloudArrowUpIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import type { MDXComponents } from 'mdx/types';
import { Button } from '@/components/ui/button';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Button,
    PlusCircleIcon,
    CloudArrowUpIcon,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
