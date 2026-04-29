import { PROFESSION_CHOICES } from "./professions";

export function getChosenProfession(choiceId) {
  if (!choiceId) {
    return PROFESSION_CHOICES[0] || null;
  }

  return (
    PROFESSION_CHOICES.find((choice) => choice.id === choiceId) ||
    PROFESSION_CHOICES[0] ||
    null
  );
}

/**
 * Valfri helper (bra att ha framåt)
 */
export function getProfessionArticleNumber(choiceId) {
  const profession = getChosenProfession(choiceId);
  return profession?.articleNumber || "";
}