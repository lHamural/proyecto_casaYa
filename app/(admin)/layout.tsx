// app/admin/layout.tsx - Con shadcn/ui
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar con componentes shadcn */}
      <nav className="border-b">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <span className="font-bold text-lg text-primary">Panel Admin</span>
          
          <NavigationMenu className="mx-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/admin/planes">
                  Planes
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/admin/usuarios">
                  Usuarios
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/user.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
}