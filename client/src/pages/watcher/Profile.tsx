import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { UserCircle, Mail, Clock } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  contractHours: number;
}

export default function Profile() {
  const { execute, data, isLoading, error } = useFetch('GET', '/users/me');

  useEffect(() => {
    execute();
  }, [execute]);

  const completedHours = 15; // Valeur fictive pour la démo

  const profile: UserProfile | null = data;

  // Calcul du pourcentage pour la barre de progression (bloqué à 100% max)
  const percentage = profile && profile.contractHours > 0 
    ? Math.min((completedHours / profile.contractHours) * 100, 100) 
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight flex items-center gap-3">
        <UserCircle className="h-8 w-8 text-blue-600" />
        Mon Profil
      </h1>

      {isLoading && <LoadingOverlay message="Chargement de votre profil..." />}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          <p className="font-medium">Erreur : {error}</p>
        </div>
      )}

      {!isLoading && !error && profile && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* EN-TÊTE DU PROFIL */}
          <div className="bg-slate-50 p-8 flex flex-col items-center justify-center border-b border-slate-200">
            <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserCircle className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {profile.firstName} {profile.lastName.toUpperCase()}
            </h2>
          </div>

          {/* INFORMATIONS & STATISTIQUES */}
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Ligne Email */}
            <div className="flex items-center gap-4 text-slate-700">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Mail className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Adresse Email</p>
                <p className="text-lg font-medium">{profile.email}</p>
              </div>
            </div>

            <hr className="border-slate-100 border-t-2" />

            {/* Suivi des heures */}
            <div>
              <div className="flex items-center gap-4 text-slate-700 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Suivi du Contrat</p>
                  <p className="text-lg font-medium">
                    <span className="text-blue-600 font-black">{completedHours}h</span> 
                    <span className="text-slate-400 mx-1">/</span> 
                    <span>{profile.contractHours}h prévues</span>
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-blue-600">Avancement</span>
                  <span className="text-slate-600">{Math.round(percentage)}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}