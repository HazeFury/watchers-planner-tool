import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { CalendarDays, Clock, MapPin, GraduationCap } from 'lucide-react';

// Interfaces pour typer notre retour d'API
interface Room {
  id: number;
  name: string;
}

interface ExamContext {
  id: number;
  title: string;
  cycle: string;
  startTime: string;
  endTime: string;
}

interface MyRegistration {
  id: number;
  startTime: string | null; 
  endTime: string | null;
  exam: ExamContext;
  room: Room | null;
}

export default function Registrations() {
  const { execute, data, isLoading, error } = useFetch('GET', '/registrations/mine');

  useEffect(() => {
    execute();
  }, [execute]);

  // --- Fonctions utilitaires de formatage ---
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
  };

  const formatDay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '').toUpperCase();
  };

  const formatNumber = (dateStr: string) => {
    return new Date(dateStr).getDate();
  };

  const formatMonth = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight flex items-center gap-3">
        <CalendarDays className="h-8 w-8 text-blue-600" />
        Mes Inscriptions
      </h1>

      {isLoading && <LoadingOverlay message="Récupération de votre planning..." />}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          <p className="font-medium">Une erreur est survenue :</p>
          <p>{error}</p>
        </div>
      )}

      {/* CAS OÙ LE SURVEILLANT N'A RIEN DE PRÉVU */}
      {!isLoading && !error && data && data.length === 0 && (
        <div className="bg-slate-50 flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 text-center">
          <CalendarDays className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-xl text-slate-600 font-medium">Votre planning est vide.</p>
          <p className="text-slate-500 mt-2">Inscrivez-vous à des examens depuis la page d'accueil.</p>
        </div>
      )}

      {/* LA VUE AGENDA (Liste de cartes) */}
      {!isLoading && !error && data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((reg: MyRegistration) => {
            // Gestion intelligente du tiers-temps :
            const actualStart = reg.startTime || reg.exam.startTime;
            const actualEnd = reg.endTime || reg.exam.endTime;
            
            // On vérifie si c'est un horaire décalé pour le mettre en évidence
            const isTiersTemps = reg.startTime !== null || reg.endTime !== null;

            return (
              <div 
                key={reg.id} 
                className="flex bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-300 transition-colors"
              >
                {/* BLOC GAUCHE : La Date (style calendrier iOS) */}
                <div className="bg-slate-50 border-r border-slate-200 p-4 flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px]">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                    {formatDay(reg.exam.startTime)}
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-slate-800 my-1">
                    {formatNumber(reg.exam.startTime)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {formatMonth(reg.exam.startTime)}
                  </span>
                </div>

                {/* BLOC DROIT : Les Infos */}
                <div className="p-4 flex-grow flex flex-col justify-center">
                  
                  {/* Conteneur Flex pour aligner les petites infos (Heure, Salle, Cycle) */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-sm md:text-base font-medium">
                    
                    {/* L'heure */}
                    <div className={`flex items-center gap-2 ${isTiersTemps ? 'text-orange-600 font-bold' : 'text-slate-600'}`}>
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(actualStart)} - {formatTime(actualEnd)}</span>
                    </div>
                    
                    {/* La Salle */}
                    <div className={`flex items-center gap-2 ${reg.room ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                      <MapPin className="h-4 w-4" />
                      <span>{reg.room ? reg.room.name : 'En attente'}</span>
                    </div>

                    {/* Le Cycle */}
                    <div className="flex items-center gap-2 text-slate-500">
                      <GraduationCap className="h-4 w-4" />
                      <span>{reg.exam.cycle}</span>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}