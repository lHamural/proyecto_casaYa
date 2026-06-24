// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Bienvenido al panel de control</p>
      
      {/* Aquí puedes agregar tus componentes, tablas, gráficos, etc */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Total Ventas</h3>
          <p className="text-2xl text-[#001c40]">$12,345</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Usuarios</h3>
          <p className="text-2xl text-[#0e723b]">1,234</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Órdenes</h3>
          <p className="text-2xl text-[#0f517c]">567</p>
        </div>
      </div>
    </div>
  )
}