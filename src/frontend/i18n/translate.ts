import french from "./fr.json";
import type { Locale } from "@/shared/types";

const dictionary: Record<string, string> = {
  ...french,
  "No pass yet": "Aucun pass pour le moment",
  "Build a pass to plan your next visit.": "Créez un pass pour planifier votre prochaine visite.",
  "Please enter a valid email address.": "Veuillez saisir une adresse courriel valide.",
  "Please enter an age from 0 to 17 for each child.": "Indiquez un âge de 0 à 17 ans pour chaque enfant.",
  "Please add at least one adult or child.": "Ajoutez au moins un adulte ou un enfant.",
  "Demo data resets when you refresh this page.": "Les données de démonstration sont effacées au rechargement.",
  "Demo admissions": "Entrées fictives",
  "Venue catalog connected; checkout and bookings remain simulated.": "Catalogue connecté; achats et réservations toujours simulés.",
  "Please choose a visit date.": "Choisissez une date de visite.",
  "Decrease admissions for": "Réduire les entrées pour",
  "Increase admissions for": "Ajouter des entrées pour",
  "Skip to content": "Aller au contenu",
  "No confirmed visit": "Aucune visite confirmée",
  "Plan a demo visit before viewing its confirmation.": "Planifiez une visite fictive avant de consulter sa confirmation.",
};

export function translate(value: string, locale: Locale): string {
  if (locale === "en") return value;
  if (dictionary[value]) return dictionary[value];
  return value
    .replace(/^Child (\d+) age$/, "Âge de l’enfant $1")
    .replace(/^Child (\d+): (\d+) years$/, "Enfant $1 : $2 ans")
    .replace(/^(\d+)–(\d+) years$/, "$1–$2 ans")
    .replace(/^(\d+) admissions$/, "$1 entrées")
    .replace(/^(\d+) admission$/, "$1 entrée")
    .replace(/^(\d+) adults?$/, "$1 adultes")
    .replace(/^(\d+) children$/, "$1 enfants")
    .replace(/^(\d+) child$/, "$1 enfant")
    .replace(/^Discount \((\d+)%\)$/, "Rabais ($1 %)")
    .replace(/^Pick (\d+) or more admissions across venues\.$/, "Choisissez au moins $1 entrées parmi les lieux.")
    .replace(/^Choose at least (\d+) admissions\.$/, "Choisissez au moins $1 entrées.")
    .replace(/^Choose at least (\d+) admissions\. Adjust quantities for each playground\.$/,
      "Choisissez au moins $1 entrées. Ajustez la quantité pour chaque lieu.")
    .replace(/^Sample pricing: (\d+)% off selected admissions\. Booking and time-window policies vary by venue\.$/,
      "Tarif de démonstration : $1 % de rabais sur les entrées choisies. Les conditions varient selon le lieu.")
    .replace(/^Please enter an age from (\d+) to (\d+) for each child\.$/,
      "Indiquez un âge de $1 à $2 ans pour chaque enfant.")
    .replace(/^Add (\d+) more admissions\.$/, "Ajoutez encore $1 entrées.");
}
