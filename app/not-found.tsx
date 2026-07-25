import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-[#3b82f6] text-sm tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl text-[#f1f5f9] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#94a3b8] mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#3b82f6] text-white rounded font-medium text-sm hover:bg-[#2563eb] transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
