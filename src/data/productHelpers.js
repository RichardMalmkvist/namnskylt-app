const PRODUCT_TYPE_LABELS = {
  namnbricka: "Namnbricka",
  namnbrickor: "Namnbricka",
  yrkestitelsskyltar: "Yrkestitelsskylt",
  dorropnare: "Dörröppnare",
  dorrskylt: "Dörrskylt",
  dorrskyltar: "Dörrskyltar",
  "taktila piktogram": "Taktila piktogram",
  "taktila-piktogram": "Taktila piktogram",
  taktila_piktogram: "Taktila piktogram",
  verksamhetsskylt: "Verksamhetsskylt",
  verksamhetsskyltar: "Verksamhetsskyltar",
  inomhusskylt: "Inomhusskylt",
  inomhusskyltar: "Inomhusskyltar",
  orienteringstavla: "Orienteringstavla",
  orienteringstavlor: "Orienteringstavlor",
  vaningsplanstavla: "Våningsplanstavla",
  vaningsplanstavlor: "Våningsplanstavlor",
  hisstavla: "Hisstavla",
  hisstavlor: "Hisstavlor",
  kamerabevakning: "Kamerabevakning",
  stoldskyddsmarkning: "Stöldskyddsmärkning",
  pendlad_skylt: "Pendlad skylt",
  pendlade_skyltar: "Pendlade skyltar",
  hansvisningsskylt: "Hänvisningsskylt",
  hansvisningsskyltar: "Hänvisnings-/infoskyltar",
  infoskylt: "Infoskylt",
  infoskyltar: "Infoskyltar",
};

const FIELD_LABEL_DEFAULTS = {
  name: "Namn",
  title: "Titel",
  titleLine2: "Titel rad 2",
  orgLine1: "Verksamhetsnamn",
  orgLine2: "Verksamhetsnamn rad 2",
  fastening: "Fäste",
  quantity: "Antal",
  extraMagnets: "Extra magnetfästen",
  professionChoiceId: "Yrkesroll",
};

function startCaseFromKey(value) {
  if (!value) return "";

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function hasBadgeField(product, fieldKey) {
  return Boolean(product?.fields?.[fieldKey]);
}

export function getBadgeFieldConfig(product, fieldKey) {
  return product?.fields?.[fieldKey] || null;
}

export function getBadgeFieldLabel(product, fieldKey, fallbackLabel = "") {
  const fieldConfig = getBadgeFieldConfig(product, fieldKey);

  if (
    fieldConfig &&
    typeof fieldConfig === "object" &&
    typeof fieldConfig.label === "string" &&
    fieldConfig.label.trim()
  ) {
    return fieldConfig.label.trim();
  }

  if (fallbackLabel) {
    return fallbackLabel;
  }

  return FIELD_LABEL_DEFAULTS[fieldKey] || startCaseFromKey(fieldKey);
}

export function getAllConfiguredFieldKeys(product) {
  if (!product?.fields || typeof product.fields !== "object") {
    return [];
  }

  return Object.keys(product.fields);
}

export function getVisibleFieldKeys(product, orderedKeys = []) {
  const configuredKeys = getAllConfiguredFieldKeys(product);

  if (!orderedKeys.length) {
    return configuredKeys.filter((fieldKey) => hasBadgeField(product, fieldKey));
  }

  const orderedVisibleKeys = orderedKeys.filter((fieldKey) =>
    hasBadgeField(product, fieldKey)
  );

  const remainingVisibleKeys = configuredKeys.filter(
    (fieldKey) =>
      hasBadgeField(product, fieldKey) && !orderedVisibleKeys.includes(fieldKey)
  );

  return [...orderedVisibleKeys, ...remainingVisibleKeys];
}

export function isProfessionProductType(productType) {
  return productType === "yrkestitelsskyltar";
}

export function isDirectProductType(productType) {
  return productType === "dorropnare";
}

export function getProductTypeLabel(productType) {
  if (!productType) return "Produkt";

  return PRODUCT_TYPE_LABELS[productType] || startCaseFromKey(productType);
}

export function getProductDisplayName(product) {
  if (!product) return "Produkt";

  return product.name || getProductTypeLabel(product.productType);
}

export function getProductDescription(product) {
  return product?.desc || "";
}