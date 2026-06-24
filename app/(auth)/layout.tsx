// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Lado derecho - Hero/Banner */}
      <div 
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: '#001c40' }}
      >
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-4">Gestiona tu negocio</h2>
          <p className="text-white/80 mb-6">
            La plataforma todo en uno para administrar tus planes, usuarios y más.
          </p>
          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Fácil de usar</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}