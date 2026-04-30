import { source } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{page.data.title}</h1>
        {page.data.description && (
          <p className="text-base text-secondary">{page.data.description}</p>
        )}
      </div>
      <div className="w-full flex-1">
        <MDX components={getMDXComponents()} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
