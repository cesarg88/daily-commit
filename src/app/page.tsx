import { placeholderMessage, placeholderTitle } from "./placeholder";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-semibold">{placeholderTitle}</h1>
      <p className="mt-3 max-w-prose text-base text-neutral-700">
        {placeholderMessage}
      </p>
    </main>
  );
}
