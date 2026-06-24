// components/dashboard/DashboardFooter.tsx
import Link from 'next/link'

export function DashboardFooter() {
  return (
    <footer className="dashboard-footer text-right py-4 px-6 border-t text-sm">
      <div className="container mx-auto">
        <p>
          © 2026 casaYa - 
          <Link href="/terminos" className="dashboard-footer-link transition-all ml-1">
            Términos y condiciones
          </Link>
        </p>
      </div>
    </footer>
  )
}