import Recorder from "@/components/recorder";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* write some arabic content below: */}
      <h1>مرحبًا بك في باللغة العربية</h1>
      <h1>Iqraeli in arabic </h1>
      <Recorder />
      <button className="btn">Test</button>
      <div tabIndex={0} className="collapse bg-base-200">
        <div className="collapse-title text-xl font-medium">Focus me to see content</div>
        <div className="collapse-content">
          <p>tabindex={0} attribute is necessary to make the div focusable</p>
        </div>
      </div>
    </main>
  );
}
