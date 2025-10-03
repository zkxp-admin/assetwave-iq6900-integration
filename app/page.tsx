export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Logo Header */}
      <header className="flex items-center justify-center p-8 border-b border-primary/20">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-semibold text-white/95 tracking-wider orbitron">
            Z K X P
          </h1>
          <div className="w-px h-12 bg-gray-500"></div>
          <img 
            src="/iq6900_logo.png" 
            alt="IQ6900 Logo" 
            className="h-12 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <h2 className="text-6xl font-semibold text-text orbitron">
            AssetWave
          </h2>
          <p className="text-xl text-text-muted max-w-lg mx-auto">
            Welcome to the future of intelligent asset management
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/chat"
              className="px-6 py-3 bg-primary text-background rounded-lg font-medium transition-colors hover:bg-secondary"
            >
              Try Chat Demo
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
