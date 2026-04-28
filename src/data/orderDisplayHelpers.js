import { getChosenProfession } from "./professionHelpers";
import { isProfessionProductType } from "./productHelpers";

function getSafeTypeLabel(item) {
  if (item?.productTypeLabel) return item.productTypeLabel;
  if (item?.productType) return item.productType;
  return "Produkt";
}

function appendExtraFields(rows, item, options = {}) {
  const { compact = false } = options;

  if (!Array.isArray(item?.extraFields)) {
    return rows;
  }

  item.extraFields.forEach((field) => {
    if (!field?.label) return;
    if (field.value === null || field.value === undefined || field.value === "") {
      return;
    }

    rows.push({
      label: compact ? "" : field.label,
      value: compact ? `${field.label}: ${field.value}` : field.value,
    });
  });

  return rows;
}

function getExtraFieldValue(item, label) {
  if (!Array.isArray(item?.extraFields)) return "";

  const match = item.extraFields.find((field) => field?.label === label);
  return match?.value || "";
}

function isHangingSignItem(item) {
  return item?.productType === "pendlad_skylt";
}

function isDoorSignItem(item) {
  return item?.productType === "dorrskylt";
}

export function getCartItemDisplayRows(item) {
  if (!item) return [];

  if (item.productType === "dorropnare") {
    const rows = [{ label: "Typ", value: getSafeTypeLabel(item) }];

    if (item.articleNumber) {
      rows.push({ label: "Art.nr", value: item.articleNumber });
    }

    if (item.desc) {
      rows.push({ label: "Beskrivning", value: item.desc });
    }

    appendExtraFields(rows, item);
    rows.push({ label: "Antal", value: item.quantity ?? 0 });

    return rows;
  }

  if (isProfessionProductType(item.productType)) {
    const chosenProfession = item.professionChoiceId
      ? getChosenProfession(item.professionChoiceId)
      : null;

    const rows = [{ label: "Typ", value: getSafeTypeLabel(item) }];

    if (item.articleNumber) {
      rows.push({ label: "Art.nr", value: item.articleNumber });
    }

    rows.push(
      { label: "Text", value: item.title || "-" },
      {
        label: "Val",
        value: chosenProfession?.label || item.professionChoiceId || "-",
      },
      { label: "Antal", value: item.quantity ?? 0 }
    );

    return rows;
  }

  if (isHangingSignItem(item)) {
    const rows = [{ label: "Typ", value: getSafeTypeLabel(item) }];

    if (item.articleNumber) {
      rows.push({ label: "Art.nr", value: item.articleNumber });
    }

    const text = getExtraFieldValue(item, "Text");
    const textLine1 = getExtraFieldValue(item, "Textrad 1");
    const textLine2 = getExtraFieldValue(item, "Textrad 2");
    const arrowPlacement = getExtraFieldValue(item, "Pilplacering");
    const arrowDirection = getExtraFieldValue(item, "Pilriktning");

    if (text) {
      rows.push({ label: "Text", value: text });
    }

    if (textLine1) {
      rows.push({ label: "Textrad 1", value: textLine1 });
    }

    if (textLine2) {
      rows.push({ label: "Textrad 2", value: textLine2 });
    }

    if (arrowPlacement) {
      rows.push({ label: "Pilplacering", value: arrowPlacement });
    }

    if (arrowDirection) {
      rows.push({ label: "Pilriktning", value: arrowDirection });
    }

    rows.push({ label: "Antal", value: item.quantity ?? 0 });

    return rows;
  }

  if (isDoorSignItem(item)) {
    const rows = [{ label: "Typ", value: getSafeTypeLabel(item) }];

    if (item.articleNumber) {
      rows.push({ label: "Art.nr", value: item.articleNumber });
    }

    if (item.customText) {
      rows.push({ label: "Textrad 1", value: item.customText });
    }

    if (item.customTextLine2) {
      rows.push({ label: "Textrad 2", value: item.customTextLine2 });
    }

    if (item.desc) {
      rows.push({ label: "Beskrivning", value: item.desc });
    }

    if (item.extraLine) {
      rows.push({ label: "Text", value: item.extraLine.replace(/^Text:\s*/i, "") });
    }

    if (item.format) {
      rows.push({ label: "Format", value: item.format });
    }

    rows.push({ label: "Antal", value: item.quantity ?? 0 });

    return rows;
  }

  const rows = [{ label: "Typ", value: getSafeTypeLabel(item) }];

  if (item.articleNumber) {
    rows.push({ label: "Art.nr", value: item.articleNumber });
  }

  if ("name" in item) {
    rows.push({ label: "Namn", value: item.name || "-" });
  }

  if ("title" in item) {
    rows.push({ label: "Titel", value: item.title || "-" });
  }

  if (item.titleLine2) {
    rows.push({ label: "Titel rad 2", value: item.titleLine2 });
  }

  if (item.orgLine1) {
    rows.push({ label: "Verksamhetsnamn rad 1", value: item.orgLine1 });
  }

  if (item.orgLine2) {
    rows.push({ label: "Verksamhetsnamn rad 2", value: item.orgLine2 });
  }

  if ("fastening" in item) {
    rows.push({ label: "Fäste", value: item.fastening || "-" });
  }

  if ("extraMagnets" in item) {
    rows.push({
      label: "Extra magnetfästen",
      value: item.extraMagnets ?? 0,
    });
  }

  if (item.desc && !item.name && !item.title) {
    rows.push({ label: "Beskrivning", value: item.desc });
  }

  appendExtraFields(rows, item);
  rows.push({ label: "Antal", value: item.quantity ?? 0 });

  return rows;
}

export function getPackingSlipDescriptionRows(item) {
  if (!item) return [];

  if (isProfessionProductType(item.productType)) {
    const rows = [];

    if (item.title) {
      rows.push({ label: "", value: item.title });
    }

    rows.push({
      label: "",
      value: getSafeTypeLabel(item),
    });

    return rows;
  }

  if (item.productType === "dorropnare") {
    const rows = [];

    if (item.desc) {
      rows.push({ label: "", value: item.desc });
    }

    appendExtraFields(rows, item, { compact: true });
    return rows;
  }

  if (isHangingSignItem(item)) {
    const rows = [];

    if (item.desc) {
      rows.push({ label: "", value: item.desc });
    }

    const text = getExtraFieldValue(item, "Text");
    const textLine1 = getExtraFieldValue(item, "Textrad 1");
    const textLine2 = getExtraFieldValue(item, "Textrad 2");
    const arrowPlacement = getExtraFieldValue(item, "Pilplacering");
    const arrowDirection = getExtraFieldValue(item, "Pilriktning");

    if (text) {
      rows.push({ label: "", value: text });
    }

    if (textLine1) {
      rows.push({ label: "", value: textLine1 });
    }

    if (textLine2) {
      rows.push({ label: "", value: textLine2 });
    }

    if (arrowPlacement) {
      rows.push({ label: "", value: `Pilplacering: ${arrowPlacement}` });
    }

    if (arrowDirection) {
      rows.push({ label: "", value: `Pilriktning: ${arrowDirection}` });
    }

    return rows;
  }

  if (isDoorSignItem(item)) {
    const rows = [];

    if (item.desc) {
      rows.push({ label: "", value: item.desc });
    }

    if (item.customText) {
      rows.push({ label: "", value: item.customText });
    }

    if (item.customTextLine2) {
      rows.push({ label: "", value: item.customTextLine2 });
    }

    if (item.extraLine) {
      rows.push({ label: "", value: item.extraLine });
    }

    if (item.format) {
      rows.push({ label: "", value: `Format ${item.format}` });
    }

    return rows;
  }

  const rows = [];

  if (item.desc) {
    rows.push({ label: "", value: item.desc });
  }

  if ("name" in item && item.name) {
    rows.push({ label: "", value: item.name });
  }

  if ("title" in item && item.title) {
    rows.push({ label: "", value: item.title });
  }

  if (item.titleLine2) {
    rows.push({ label: "", value: item.titleLine2 });
  }

  if (item.orgLine1) {
    rows.push({ label: "", value: item.orgLine1 });
  }

  if (item.orgLine2) {
    rows.push({ label: "", value: item.orgLine2 });
  }

  if ("fastening" in item && item.fastening) {
    rows.push({ label: "", value: item.fastening });
  }

  if ("extraMagnets" in item && Number(item.extraMagnets ?? 0) > 0) {
    rows.push({
      label: "",
      value: `Extra magnetfästen: ${item.extraMagnets}`,
    });
  }

  appendExtraFields(rows, item, { compact: true });

  return rows;
}