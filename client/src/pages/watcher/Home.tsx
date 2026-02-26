import { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../context/AuthContext';
import { ExamCard, type Exam } from '../../components/watcher/ExamCard';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';
import { toast } from 'sonner';

export default function Home() {
  const { user } = useAuth(); 
  
  const { execute: fetchExams, data, isLoading, error } = useFetch('GET', '/exams/upcoming');
  const { execute: registerToExam } = useFetch('POST', '/registrations');

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleRegisterClick = async (examId: number) => {
    const res = await registerToExam({ body: { examId } });
    
    if (res.success) {
      toast.success("Inscription validée avec succès !");
      fetchExams(); 
    } else {
      toast.error(res.error || "Impossible de s'inscrire à cet examen.");
      fetchExams();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">
        Prochaines surveillances
      </h1>
      
      {isLoading && <LoadingOverlay message="Récupération des examens..." />}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          <p className="font-medium">Une erreur est survenue :</p>
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && data && data.length === 0 && (
        <div className="bg-slate-50 text-slate-600 p-8 rounded-xl border border-slate-200 text-center">
          <p className="text-lg">Aucun examen n'est prévu prochainement. Reposez-vous bien !</p>
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
    </div>
  );
}