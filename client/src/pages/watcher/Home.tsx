import { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';

export default function Home() {
  const { execute, data, isLoading, error } = useFetch('GET', '/exams/upcoming');

  // Au montage du composant, on lance la requête
  useEffect(() => {
    execute();
  }, [execute]);

  // Juste pour le débug, on logue la data quand elle arrive
  useEffect(() => {
    if (data) {
      console.log('📅 Examens récupérés depuis la BDD :', data);
    }
  }, [data]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Prochaines surveillances
      </h1>
      
      {isLoading && <p className="text-slate-500">Chargement des examens en cours...</p>}
      
      {error && <p className="text-red-500 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
      
      {!isLoading && !error && data && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-md border border-emerald-200">
          <p>✅ Les données sont là ! Ouvre la console (F12) pour voir les examens.</p>
        </div>
      )}
    </div>
  );
}