import { Link } from "react-router-dom"
import { 
  Menu, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarDays,
  ExternalLink 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';

export function NavbarAdmin() {
	const navigate = useNavigate();
  const { logout } = useAuth();
  
  const { execute: logoutApi, isLoading } = useFetch('POST', '/auth/logout');

  const handleLogout = async () => {
    await logoutApi();
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-4 flex items-center justify-between bg-slate-800 text-white shadow-md">
      
      <div className="flex items-center gap-4">
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Ouvrir le menu admin</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent side="left" className="w-[280px] flex flex-col border-r-slate-200">
            <SheetHeader className="border-b pb-4 mb-4">
              <SheetTitle className="text-left flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-slate-900" />
                Administration
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Gestion
              </p>
              
              <SheetClose asChild>
                <Link to="/admin">
                  <Button variant="ghost" className="w-full justify-start h-10">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Vue d'ensemble
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/admin/exams">
                  <Button variant="ghost" className="w-full justify-start h-10">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Examens
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/admin/surveillants">
                  <Button variant="ghost" className="w-full justify-start h-10">
                    <Users className="mr-2 h-4 w-4" />
                    Surveillants
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/admin/promos">
                  <Button variant="ghost" className="w-full justify-start h-10">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Promotions / Étudiants
                  </Button>
                </Link>
              </SheetClose>
            </div>

            <div className="mt-auto border-t pt-4">
               <SheetClose asChild>
                <Link to="/">
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir le site Surveillant
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex flex-col">
          <span className="font-bold text-lg leading-none tracking-tight">
            EpiSur Lyon
          </span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            Dashboard
          </span>
        </div>
      </div>

      <Button
	  	onClick={handleLogout} 
        disabled={isLoading}
        variant="ghost" 
        className="text-slate-300 hover:text-white hover:bg-red-900/50 hover:text-red-200 transition-colors"
      >
        <span className="hidden sm:inline mr-2">{isLoading ? "Déconnexion..." : "Se déconnecter"}</span>
        <LogOut className="h-5 w-5" />
      </Button>

    </header>
  )
}