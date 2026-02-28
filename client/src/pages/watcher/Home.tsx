import { useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { ExamCard, type Exam } from "../../components/watcher/ExamCard";
import { LoadingOverlay } from "../../components/ui/LoadingOverlay";
import { useConfirm } from "@/hooks/useConfirm";
import { RefreshCw } from "lucide-react";
import { formatTimeStartEnd, formatDateLetter } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();

  const {
    execute: fetchExams,
    data,
    isLoading,
    error,
  } = useFetch("GET", "/exams/upcoming");
  const { execute: registerToExam } = useFetch("POST", "/registrations");

  const { confirm, ConfirmModal } = useConfirm();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleRegisterClick = (examId: number) => {
    const selectedExam = data.find((e: Exam) => e.id === examId);

    if (!selectedExam) return;

    const dateStr = formatDateLetter(selectedExam.startTime);
    const globalTimeStr = formatTimeStartEnd(
      selectedExam.startTime,
      selectedExam.endTime,
    );

    const message = (
      <span>
        Êtes-vous sûr de vouloir vous inscrire à la session du{" "}
        <strong className="text-slate-900 font-black">
          {dateStr} / {globalTimeStr}
        </strong>{" "}
        ?
        <br />
        <br />
        Une fois inscrit(e), seul un administrateur pourra annuler votre
        participation.
      </span>
    );

    // On appelle confirm() avec notre texte, et on lui donne une fonction "callback"
    confirm(
      message, // Texte de la modal
      async () => {
        // Ce bloc de code ne s'exécutera QUE si l'utilisateur clique sur "Confirmer"
        const res = await registerToExam({ body: { examId } });

        if (res.success) {
          toast.success("Inscription validée avec succès !");
          fetchExams();
        } else {
          toast.error(res.error || "Impossible de s'inscrire à cet examen.");
          fetchExams();
        }
      },
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Prochaines surveillances
        </h1>

        <Button
          onClick={() => fetchExams()}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </div>

      {isLoading && <LoadingOverlay message="Récupération des examens..." />}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          <p className="font-medium">Une erreur est survenue :</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && data && data.length === 0 && (
        <div className="bg-slate-50 text-slate-600 p-8 rounded-xl border border-slate-200 text-center">
          <p className="text-lg">
            Aucun examen n'est prévu prochainement. Reposez-vous bien !
          </p>
        </div>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((exam: Exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              currentUserId={user?.userId || 0}
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>
      )}
      <ConfirmModal />
    </div>
  );
}
