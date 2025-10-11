export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1e5f4e] mb-4">404</h1>
        <p className="text-xl text-[#1e5f4e]/80 mb-8">Page not found!</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#0b0b0b] text-white rounded-full hover:bg-[#0b0b0b] transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
