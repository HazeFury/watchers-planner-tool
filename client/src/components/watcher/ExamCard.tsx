import { Button } from "@/components/ui/button";

// On définit le type de nos données pour que TypeScript nous aide
interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Registration {
  id: number;
  startTime: string; // Les dates arrivent en string depuis l'API JSON
  endTime: string;
  user: User;
}

export interface Exam {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  cycle: string;
  maxWatchers: number;
  registrations: Registration[];
}

interface ExamCardProps {
  exam: Exam;
  currentUserId: number; // Pour savoir si ON est inscrit
  onRegisterClick?: (examId: number) => void; // On préparera l'action d'inscription plus tard
}

export const ExamCard = ({ exam, currentUserId, onRegisterClick }: ExamCardProps) => {
  // --- 1. LOGIQUE D'ÉTAT ---
  const isRegistered = exam.registrations.some((reg) => reg.user.id === currentUserId);
  const isFull = exam.registrations.length >= exam.maxWatchers;

  // --- 2. FORMATAGE DES DATES ---
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const examDate = new Date(exam.startTime);
  const dateFormatted = capitalize(examDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));

  const globalTimeStr = `${formatTime(exam.startTime)} - ${formatTime(exam.endTime)}`;

  // --- 3. PRÉPARATION DE LA LISTE DES PLACES ---
  // On crée un tableau de la taille exacte de maxWatchers
  const slots = Array.from({ length: exam.maxWatchers }, (_, index) => {
    return exam.registrations[index] || null; // S'il y a un inscrit on le met, sinon null
  });

  // --- 4. STYLE DYNAMIQUE ---
  let cardBorder = "border-slate-300";
  let btnColor = "bg-green-600 hover:bg-green-700 text-white";
  let btnText = "S'INSCRIRE";
  let btnDisabled = false;

  if (isRegistered) {
    cardBorder = "border-blue-500 shadow-sm";
    btnColor = "bg-blue-600 hover:bg-blue-700 text-white";
    btnText = "INSCRIT(E)";
    btnDisabled = true; // On désactive pour ne pas cliquer 2 fois
  } else if (isFull) {
    cardBorder = "border-red-500 shadow-sm";
    btnColor = "bg-red-600 text-white opacity-90 cursor-not-allowed";
    btnText = "COMPLET";
    btnDisabled = true;
  }

  return (
    <div className={`bg-white rounded-xl border-2 p-5 flex flex-col ${cardBorder}`}>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{dateFormatted}</h3>
        <span className="text-slate-600 font-medium">{exam.cycle}</span>
      </div>

      {/* SUB-HEADER */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-slate-700 text-lg">{globalTimeStr}</span>
        <span className="text-slate-700 font-medium">
          {exam.registrations.length}/{exam.maxWatchers} pers
        </span>
      </div>

      <hr className="border-slate-300 border-t-2 mb-3" />

      {/* BODY : LISTE DES SURVEILLANTS */}
      <div className="flex-grow flex flex-col space-y-1 mb-4">
        {slots.map((reg, index) => {
          if (!reg) {
            // Place vide
            return <div key={`empty-${index}`} className="text-slate-800 text-lg">-</div>;
          }

          // Place occupée : on formate le nom (ex: "Pierre H")
          const nameStr = `${reg.user.firstName} ${reg.user.lastName.charAt(0)}`;
          const isMe = reg.user.id === currentUserId;
          
          // Calcul du tiers temps
		  // On s'assure que la variable existe ET qu'elle est différente de l'examen
          const hasSpecificStart = reg.startTime && reg.startTime !== exam.startTime;
          const hasSpecificEnd = reg.endTime && reg.endTime !== exam.endTime;
          const isTiersTemps = hasSpecificStart || hasSpecificEnd;

          // On sécurise les dates : si l'inscription n'a pas d'horaire, on prend celui de l'examen
          const actualStartTime = reg.startTime || exam.startTime;
          const actualEndTime = reg.endTime || exam.endTime;

          const specificTimeStr = isTiersTemps 
            ? ` (${formatTime(actualStartTime)} - ${formatTime(actualEndTime)})` 
            : '';

          // Couleurs spécifiques
          let textColor = "text-slate-800";
          if (isMe) textColor = "text-blue-600 font-medium";
          else if (isTiersTemps) textColor = "text-orange-500";

          return (
            <div key={reg.id} className={`${textColor} text-lg`}>
              - {nameStr}{specificTimeStr}
            </div>
          );
        })}
      </div>

      <hr className="border-slate-300 border-t-2 mb-4" />

      {/* FOOTER : BOUTON */}
      <Button 
        className={`w-full text-base font-bold rounded-lg py-6 ${btnColor}`}
        disabled={btnDisabled}
        onClick={() => !btnDisabled && onRegisterClick && onRegisterClick(exam.id)}
      >
        {btnText}
      </Button>
    </div>
  );
};