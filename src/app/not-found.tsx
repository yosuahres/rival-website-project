export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/80 mb-8">Page not found!</p>
        <a
          href="/"
          className="inline-block text-xl px-6 py-6 bg-[#398561] text-white rounded-full hover:bg-[#021507] transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
