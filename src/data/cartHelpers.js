import {
  getBadgeFieldLabel,
  hasBadgeField,
  isProfessionProductType,
} from "./productHelpers";
import { getChosenProfession } from "./professionHelpers";
import { getProductFlowType, isProfessionFlowProduct } from "./products";
import { buildDirectCartExtraFields } from "./directProductFieldHelpers";

function createItemId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString();
}

function toSafeString(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function toTrimmedString(value) {
  return toSafeString(value).trim();
}

function toSafeQuantity(value) {
  return Math.max(1, Number(value) || 1);
}

function toSafeNonNegativeNumber(value) {
  return Math.max(0, Number(value) || 0);
}

function getProductTypeLabelFromProduct(product) {
  if (product?.productTypeLabel) return product.productTypeLabel;
  if (product?.subTypeLabel) return product.subTypeLabel;
  if (product?.categoryTitle) return product.categoryTitle;
  if (product?.productType) return product.productType;
  return "Produkt";
}

function createBaseCartItem(product, quantity) {
  return {
    id: createItemId(),
    badgeId: product?.id || null,
    categoryId: product?.categoryId || "",
    productType: product?.productType || "",
    productTypeLabel: getProductTypeLabelFromProduct(product),
    previewType: product?.previewType || "image",
    badgeName: product?.name || "",
    articleNumber: product?.articleNumber || "",
    quantity: toSafeQuantity(quantity),
    image: product?.image || "",
    desc: product?.desc || "",
    extraLine: product?.extraLine || "",
    format: product?.format || "",
  };
}

function getFormFlowKey(selectedBadge, selectedProductType) {
  if (isProfessionFlowProduct(selectedBadge)) {
    return "profession";
  }

  if (isProfessionProductType(selectedProductType)) {
    return "profession";
  }

  const flowType = getProductFlowType(selectedBadge);

  if (flowType === "profession") return "profession";
  return "badge";
}

function validateQuantity(productForm) {
  if (
    !Number.isFinite(Number(productForm.quantity)) ||
    Number(productForm.quantity) < 1
  ) {
    return "Antal måste vara minst 1.";
  }

  return null;
}

function validateExtraMagnets(productForm) {
  if (
    !Number.isFinite(Number(productForm.extraMagnets)) ||
    Number(productForm.extraMagnets) < 0
  ) {
    return "Extra magnetfästen kan inte vara mindre än 0.";
  }

  return null;
}

function validateRequiredText(value, message) {
  if (!toTrimmedString(value)) {
    return message;
  }

  return null;
}

function isHangingSignProduct(product) {
  return product?.productType === "pendlad_skylt";
}

function isDoorSignProduct(product) {
  return product?.productType === "dorrskylt";
}

function buildHangingSignExtraFields(selectedBadge, productForm) {
  const extraFields = [];

  const fieldConfigs = selectedBadge?.fields || {};

  Object.keys(fieldConfigs).forEach((fieldKey) => {
    if (fieldKey === "quantity") return;

    const rawValue = productForm?.[fieldKey];

    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return;
    }

    const label = getBadgeFieldLabel(selectedBadge, fieldKey, fieldKey);

    extraFields.push({
      key: fieldKey,
      label,
      value: toSafeString(rawValue),
    });
  });

  return extraFields;
}

const validators = {
  profession: ({ productForm }) => {
    if (!toTrimmedString(productForm.professionChoiceId)) {
      return "Du måste välja yrkesroll.";
    }

    return validateQuantity(productForm);
  },

  badge: ({ selectedBadge, productForm }) => {
    if (!selectedBadge) {
      return "Ingen skylt är vald.";
    }

    if (isDoorSignProduct(selectedBadge)) {
      const line1Error = validateRequiredText(
        productForm.customText,
        "Du måste fylla i textrad 1."
      );
      if (line1Error) return line1Error;

      return validateQuantity(productForm);
    }

    if (isHangingSignProduct(selectedBadge)) {
      const textMode = selectedBadge?.hangingSignTextMode || "single";

      if (textMode === "double") {
        const line1Error = validateRequiredText(
          productForm.customTextLine1,
          "Du måste fylla i textrad 1."
        );
        if (line1Error) return line1Error;

        const line2Error = validateRequiredText(
          productForm.customTextLine2,
          "Du måste fylla i textrad 2."
        );
        if (line2Error) return line2Error;
      } else {
        const textError = validateRequiredText(
          productForm.customText,
          "Du måste fylla i text."
        );
        if (textError) return textError;
      }

      if (
        toTrimmedString(productForm.arrowPlacement) &&
        productForm.arrowPlacement !== "none" &&
        !toTrimmedString(productForm.arrowDirection)
      ) {
        return "Du måste välja pilriktning.";
      }

      return validateQuantity(productForm);
    }

    if (hasBadgeField(selectedBadge, "name")) {
      const error = validateRequiredText(
        productForm.name,
        "Du måste fylla i namn."
      );
      if (error) return error;
    }

    if (hasBadgeField(selectedBadge, "titleLine2")) {
      if (
        !toTrimmedString(productForm.title) &&
        !toTrimmedString(productForm.titleLine2)
      ) {
        return "Du måste fylla i minst en titelrad.";
      }
    } else if (hasBadgeField(selectedBadge, "title")) {
      const error = validateRequiredText(
        productForm.title,
        "Du måste fylla i titel."
      );
      if (error) return error;
    }

    if (hasBadgeField(selectedBadge, "orgLine1")) {
      const label = getBadgeFieldLabel(
        selectedBadge,
        "orgLine1",
        "verksamhetsnamn"
      ).toLowerCase();

      const error = validateRequiredText(
        productForm.orgLine1,
        `Du måste fylla i ${label}.`
      );
      if (error) return error;
    }

    if (hasBadgeField(selectedBadge, "fastening")) {
      const error = validateRequiredText(
        productForm.fastening,
        "Du måste välja fäste."
      );
      if (error) return error;
    }

    if (hasBadgeField(selectedBadge, "quantity")) {
      const quantityError = validateQuantity(productForm);
      if (quantityError) return quantityError;
    }

    if (hasBadgeField(selectedBadge, "extraMagnets")) {
      const magnetsError = validateExtraMagnets(productForm);
      if (magnetsError) return magnetsError;
    }

    return null;
  },
};

const cartItemBuilders = {
  direct: ({ product, quantity, directFieldValues = {} }) => {
    const base = createBaseCartItem(product, quantity);

    const isProfession =
      isProfessionFlowProduct(product) ||
      product?.previewType === "profession" ||
      product?.productType === "yrkestitelsskylt" ||
      product?.categoryId === "yrkestitelsskyltar";

    return {
      ...base,
      extraFields: buildDirectCartExtraFields(product, directFieldValues),
      ...(isProfession
        ? {
            previewType: "profession",
            productType: product?.productType || "yrkestitelsskylt",
            productTypeLabel: "Yrkestitelsskylt",
            title:
              product?.fixedProfessionTitle ||
              product?.fixedTitle ||
              product?.name ||
              "",
            color: product?.fixedColor || "",
            textColor: product?.fixedTextColor || "",
            articleNumber: product?.articleNumber || "",
          }
        : {}),
    };
  },

  profession: ({ selectedBadge, productForm }) => {
    const chosenProfession = getChosenProfession(productForm.professionChoiceId);

    const finalTitle =
      selectedBadge?.fixedProfessionTitle ||
      selectedBadge?.fixedTitle ||
      selectedBadge?.name ||
      chosenProfession?.label ||
      "";

    const finalColor =
      selectedBadge?.fixedColor ||
      productForm?.color ||
      chosenProfession?.color ||
      "";

    const finalTextColor =
      selectedBadge?.fixedTextColor ||
      productForm?.textColor ||
      chosenProfession?.textColor ||
      "";

    const finalArticleNumber =
      selectedBadge?.articleNumber ||
      chosenProfession?.articleNumber ||
      "";

    const base = createBaseCartItem(selectedBadge, productForm.quantity);

    return {
      ...base,
      categoryId: selectedBadge?.categoryId || base.categoryId || "",
      productType: selectedBadge?.productType || "yrkestitelsskylt",
      productTypeLabel: "Yrkestitelsskylt",
      previewType: "profession",
      badgeId: selectedBadge?.id || base.badgeId || null,
      badgeName: selectedBadge?.name || "Yrkestitelsskylt",
      articleNumber: finalArticleNumber,
      title: finalTitle,
      professionChoiceId:
        chosenProfession?.id || toTrimmedString(productForm.professionChoiceId),
      color: finalColor,
      textColor: finalTextColor,
    };
  },

  badge: ({ selectedBadge, productForm }) => {
    const base = createBaseCartItem(selectedBadge, productForm.quantity);

    if (isDoorSignProduct(selectedBadge)) {
      return {
        ...base,
        productType: selectedBadge?.productType || "",
        productTypeLabel:
          selectedBadge?.productTypeLabel ||
          base.productTypeLabel ||
          "Produkt",
        previewType: selectedBadge?.previewType || "door_sign",
        customText: toTrimmedString(productForm.customText),
        customTextLine2: toTrimmedString(productForm.customTextLine2),
      };
    }

    if (isHangingSignProduct(selectedBadge)) {
      return {
        ...base,
        productType: selectedBadge?.productType || "",
        productTypeLabel:
          selectedBadge?.productTypeLabel ||
          base.productTypeLabel ||
          "Produkt",
        previewType: selectedBadge?.previewType || "hanging_sign",
        customText: toTrimmedString(productForm.customText),
        customTextLine1: toTrimmedString(productForm.customTextLine1),
        customTextLine2: toTrimmedString(productForm.customTextLine2),
        arrowPlacement: toSafeString(productForm.arrowPlacement || "none"),
        arrowDirection: toSafeString(productForm.arrowDirection),
        hangingSignTextMode:
          selectedBadge?.hangingSignTextMode ||
          productForm?.hangingSignTextMode ||
          "single",
        extraFields: buildHangingSignExtraFields(selectedBadge, productForm),
      };
    }

    return {
      ...base,
      productType: selectedBadge?.productType || "",
      productTypeLabel:
        selectedBadge?.productTypeLabel ||
        base.productTypeLabel ||
        "Produkt",
      previewType: selectedBadge?.previewType || base.previewType || "badge",
      name: toTrimmedString(productForm.name),
      title: toTrimmedString(productForm.title),
      titleLine2: toTrimmedString(productForm.titleLine2),
      orgLine1: toTrimmedString(productForm.orgLine1),
      orgLine2: toTrimmedString(productForm.orgLine2),
      fastening: toSafeString(productForm.fastening),
      extraMagnets: toSafeNonNegativeNumber(productForm.extraMagnets),
    };
  },
};

export function createDirectCartItem(product, quantity, directFieldValues = {}) {
  return cartItemBuilders.direct({
    product,
    quantity,
    directFieldValues,
  });
}

export function validateCurrentItem(
  selectedBadge,
  selectedProductType,
  productForm
) {
  const flowKey = getFormFlowKey(selectedBadge, selectedProductType);
  const validator = validators[flowKey];

  if (!validator) {
    return "Produkten kunde inte valideras.";
  }

  return (
    validator({
      selectedBadge,
      selectedProductType,
      productForm,
    }) || null
  );
}

export function createFormCartItem(
  selectedBadge,
  selectedProductType,
  productForm
) {
  const flowKey = getFormFlowKey(selectedBadge, selectedProductType);
  const builder = cartItemBuilders[flowKey];

  if (!builder) {
    throw new Error(`Ingen cart builder finns för flow: ${flowKey}`);
  }

  return builder({
    selectedBadge,
    selectedProductType,
    productForm,
  });
}

export function createCartItem(
  selectedBadge,
  selectedProductType,
  productForm
) {
  return createFormCartItem(selectedBadge, selectedProductType, productForm);
}