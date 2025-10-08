export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/80 mb-8">Page non trouvée</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
