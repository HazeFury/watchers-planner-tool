import { Link } from "react-router-dom"
import { Menu, ShieldCheck, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export function NavbarWatcher() {
  return (
    <nav className="h-16 px-4 flex items-center justify-between bg-sky-100 border-b border-sky-200 shadow-sm">
      
      <Link to="/" className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-sky-700" />
        <span className="font-bold text-lg text-sky-900 tracking-tight">
          Epi<span className="text-sky-600">Sur</span> Lyon
        </span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-sky-900 hover:bg-sky-200 hover:text-sky-950">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col bg-white">
          <SheetHeader>
            <SheetTitle className="text-left flex items-center gap-2 border-b pb-4">
              <ShieldCheck className="h-5 w-5 text-sky-700" />
              Menu Navigation
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-2 mt-4">
            <SheetClose asChild>
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start text-lg h-12">
                  🏠 Accueil
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link to="/mes-inscriptions">
                <Button variant="ghost" className="w-full justify-start text-lg h-12">
                  📅 Mes Inscriptions
                </Button>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link to="/profil">
                <Button variant="ghost" className="w-full justify-start text-lg h-12">
                  👤 Mon Profil
                </Button>
              </Link>
            </SheetClose>

            <div className="h-px bg-slate-100 my-2" />

            <Button variant="ghost" className="w-full justify-start text-lg h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2 h-5 w-5" />
              Déconnexion
            </Button>
          </div>

          <div className="mt-auto border-t pt-4">
            <SheetClose asChild>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Accès Dashboard Admin
                </Button>
              </Link>
            </SheetClose>
            <p className="text-xs text-center text-slate-400 mt-4">
              Version 0.1.0 - Epita Lyon
            </p>
          </div>

        </SheetContent>
      </Sheet>

    </nav>
  )
}