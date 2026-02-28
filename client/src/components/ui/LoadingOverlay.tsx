interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({
  message = "Chargement en cours...",
}: LoadingOverlayProps) => {
  return (
    /* 1. Le fond semi-transparent qui prend tout l'écran */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* 2. Le spinner (le fameux rond stylisé) */}
        <div className="relative w-16 h-16">
          {/* L'anneau de fond (bleu très clair, statique) */}
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          {/* L'anneau qui tourne (bleu foncé, animé) */}
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* 3. Le petit texte rassurant */}
        <p className="text-slate-800 font-medium bg-white/90 px-4 py-1 rounded-full shadow-sm">
          {message}
        </p>
      </div>
    </div>
  );
};
