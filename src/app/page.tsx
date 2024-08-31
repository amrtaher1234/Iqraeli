import Recorder from "@/components/recorder";

export default function Home() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/hero.png)",
      }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">اقرألي</h1>
          <p className="mb-5">
            يتيح لك التطبيق تسجيل أو إدخال آية أو نص متعلق بالقرآن الكريم، ويقوم بتحليل
            التسجيل وإظهار النتائج الأقرب إلى ما ترغب في البحث عنه. كما يمكنك من الاطلاع
            على التفسير، والاستماع إلى الآيات، والمزيد من الخصائص المفيدة.
          </p>
          <Recorder />
        </div>
      </div>
    </div>
  );
}
