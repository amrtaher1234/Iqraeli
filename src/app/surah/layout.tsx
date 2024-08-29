import Recorder from "@/components/recorder";

import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <main className="prose prose-lg sm:prose-xl md:prose-2xl lg:prose-3xl xl:prose-4xl flex min-h-screen flex-col items-center gap-2 p-16">
      <Recorder />
      {children}
    </main>
  );
}
