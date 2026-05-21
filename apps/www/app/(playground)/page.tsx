export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-foreground">Introduction</h1>
        <p className="mt-2 text-sm text-foreground-subtle">
          Select a component from the sidebar to start exploring.
        </p>
      </div>
    </div>
  );
}
