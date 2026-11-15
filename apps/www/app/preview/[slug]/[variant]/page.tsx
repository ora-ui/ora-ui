import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { registry } from '@/docs/previews/registry.generated';

type PageProps = {
  params: Promise<{ slug: string; variant: string }>;
};

export const metadata: Metadata = {
  robots: { index: false },
};

/* This route exists for tests/previews.spec.ts, which runs against `next dev`. */
export default async function Page(props: PageProps) {
  if (process.env.NODE_ENV === 'production') notFound();
  const { slug, variant } = await props.params;
  const preview = Object.hasOwn(registry, slug)
    ? registry[slug].exports.find((e) => e.value === variant)
    : undefined;
  if (!preview) notFound();

  const Preview = preview.component;

  return (
    <div data-preview-root className="flex w-full justify-center p-10">
      <Preview />
    </div>
  );
}
