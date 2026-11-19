export default function TypographyHero() {
  return (
    <article className="max-w-prose text-primary">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        Shipping the field guide
      </h1>
      <p className="mt-6 text-xl text-secondary">
        How a four-person team rebuilt its onboarding docs in a single sprint.
      </p>
      <h2 className="mt-10 scroll-m-20 border-b border-separator pb-2 text-3xl font-semibold tracking-tight">
        Where we started
      </h2>
      <p className="leading-7 not-first:mt-6">
        New hires spent their first week asking the same questions in chat. The answers existed, but
        they were spread across{' '}
        <a
          href="#where-we-started"
          className="font-medium underline underline-offset-4 hover:text-secondary"
        >
          three wikis
        </a>{' '}
        and a folder of slide decks nobody could find.
      </p>
      <blockquote className="mt-6 border-l-2 border-separator pl-6 italic text-secondary">
        &ldquo;If a question gets asked twice, the answer belongs in the guide.&rdquo;
      </blockquote>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">What we kept</h3>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>One page per task, written as steps.</li>
        <li>
          Commands in code blocks, such as{' '}
          <code className="relative rounded-xs bg-ui px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            pnpm dev
          </code>
          .
        </li>
        <li>A named owner at the top of every page.</li>
      </ul>
      <p className="leading-7 not-first:mt-6">
        By the end of the sprint, questions in the onboarding channel had dropped by half.
      </p>
    </article>
  );
}
