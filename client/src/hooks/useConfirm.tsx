import { useState, useCallback, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmConfig {
  isOpen: boolean;
  message: ReactNode;
  onValidate: () => void;
}

export const useConfirm = () => {
  // L'état initial : fermé, pas de message, pas d'action
  const [config, setConfig] = useState<ConfirmConfig>({
    isOpen: false,
    message: null,
    onValidate: () => {},
  });

  // La fonction pour fermer la modale (on garde l'action en mémoire le temps de l'animation, mais on met isOpen à false)
  const close = useCallback(() => {
    setConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // La fonction qu'on va appeler dans nos boutons
  const confirm = useCallback((message: ReactNode, onValidate: () => void) => {
    setConfig({
      isOpen: true,
      message,
      onValidate,
    });
  }, []);

  // Le composant visuel de la modale, intégré directement pour être exporté
  const ConfirmModal = useCallback(() => {
    if (!config.isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        {/* La boite blanche */}
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Confirmation
            </h3>
            <p className="text-slate-600 font-medium whitespace-pre-line leading-relaxed">
              {config.message}
            </p>
          </div>

          <div className="bg-slate-50 p-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100">
            {/* Bouton Annuler */}
            <Button
              variant="outline"
              onClick={close}
              className="w-full sm:w-auto text-slate-600 border-slate-300"
            >
              Annuler
            </Button>

            {/* Bouton Confirmer */}
            <Button
              onClick={() => {
                config.onValidate();
                close();
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirmer
            </Button>
          </div>
        </div>
      </div>
    );
  }, [config, close]); // useCallback garantit que React ne recrée pas ce composant inutilement

  // Le hook renvoie la fonction de déclenchement ET le composant
  return { confirm, ConfirmModal };
};
