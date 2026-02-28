/**
 * Formate une date en heure (ex: 08h30)
 */
export const formatTime = (dateStr: string | Date | null): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
};

/**
 * Formate une plage horaire (ex: 08h30 - 11h30)
 */
export const formatTimeStartEnd = (start: string | Date | null, end: string | Date | null): string => {
  if (!start || !end) return '-';
  return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * Formate une date en toutes lettres avec majuscule (ex: Vendredi 2 mars)
 */
export const formatDateLetter = (dateStr: string | Date | null): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  // On met la première lettre en majuscule
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Formate une date en chiffres (ex: 02/03/26)
 */
export const formatDateNumber = (dateStr: string | Date | null): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

// --- LES FORMATS SPÉCIFIQUES POUR LA VUE AGENDA (Registrations.tsx) ---

export const formatCalendarDay = (dateStr: string | Date): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '').toUpperCase();
};

export const formatCalendarDate = (dateStr: string | Date): number => {
  return new Date(dateStr).getDate();
};

export const formatCalendarMonth = (dateStr: string | Date): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
};