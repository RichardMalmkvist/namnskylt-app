export const CATEGORY_CATALOG_CONFIG = {
  namnbrickor: {
    introText: "Välj produkt för att beställa namnbrickor.",
    emptyStateTitle: "Namnbrickor",
    emptyStateText: "Det finns inga upplagda produkter för namnbrickor ännu.",
  },

  yrkestitelsskyltar: {
    introText: "Fyll i uppgifterna nedan.",
    emptyStateTitle: "Yrkestitelsskyltar",
    emptyStateText:
      "Det finns inga upplagda produkter för yrkestitelsskyltar ännu.",
  },

  "pendlade-vit": {
    introText:
      "Välj produkt och anpassa text och pil efter behov.",
    emptyStateTitle: "Pendlade skyltar - vit bakgrund",
    emptyStateText:
      "Det finns inga upplagda produkter för pendlade skyltar ännu.",
  },
};

export function getCategoryCatalogConfig(category) {
  if (!category?.id) return null;
  return CATEGORY_CATALOG_CONFIG[category.id] || null;
}

export function getCategoryIntroText(category, hasDirectProducts) {
  const config = getCategoryCatalogConfig(category);

  if (config?.introText) {
    return config.introText;
  }

  if (hasDirectProducts) {
    return "Välj produkt och antal direkt här.";
  }

  return "Denna kategori är inte upplagd ännu.";
}

export function getCategoryEmptyState(category) {
  const config = getCategoryCatalogConfig(category);

  if (config?.emptyStateTitle || config?.emptyStateText) {
    return {
      title: config.emptyStateTitle || category?.title || "Produkter",
      text: config.emptyStateText || "Denna produktkategori är inte upplagd ännu.",
    };
  }

  return {
    title: category?.title || "Produkter",
    text: "Denna produktkategori är inte upplagd ännu.",
  };
}