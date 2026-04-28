function toStartCase(value) {
  if (!value) return "";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getDirectFieldConfig(product, fieldKey) {
  const fieldConfig = product?.fields?.[fieldKey];

  if (!fieldConfig) return null;

  if (fieldConfig === true) {
    return {
      key: fieldKey,
      type: fieldKey === "quantity" ? "number" : "text",
      label: fieldKey === "quantity" ? "Antal" : toStartCase(fieldKey),
      placeholder: "",
      min: fieldKey === "quantity" ? 1 : undefined,
      defaultValue: fieldKey === "quantity" ? 1 : "",
      cartLabel: fieldKey === "quantity" ? "Antal" : toStartCase(fieldKey),
    };
  }

  return {
    key: fieldKey,
    type: fieldConfig.type || (fieldKey === "quantity" ? "number" : "text"),
    label:
      fieldConfig.label ||
      (fieldKey === "quantity" ? "Antal" : toStartCase(fieldKey)),
    placeholder: fieldConfig.placeholder || "",
    min: fieldConfig.min,
    defaultValue:
      fieldConfig.defaultValue !== undefined
        ? fieldConfig.defaultValue
        : fieldKey === "quantity"
        ? 1
        : "",
    options: fieldConfig.options || [],
    cartLabel:
      fieldConfig.cartLabel ||
      fieldConfig.label ||
      (fieldKey === "quantity" ? "Antal" : toStartCase(fieldKey)),
  };
}

export function getDirectProductVisibleFields(product) {
  if (!product?.fields || typeof product.fields !== "object") {
    return [];
  }

  return Object.keys(product.fields)
    .filter((fieldKey) => fieldKey !== "quantity")
    .map((fieldKey) => getDirectFieldConfig(product, fieldKey))
    .filter(Boolean);
}

export function getDirectProductQuantityConfig(product) {
  const config = getDirectFieldConfig(product, "quantity");

  return (
    config || {
      key: "quantity",
      type: "number",
      label: "Antal",
      min: 1,
      defaultValue: 1,
      cartLabel: "Antal",
    }
  );
}

export function getInitialDirectFieldValues(product) {
  const visibleFields = getDirectProductVisibleFields(product);

  return visibleFields.reduce((acc, field) => {
    acc[field.key] = field.defaultValue ?? "";
    return acc;
  }, {});
}

export function normalizeDirectFieldValue(fieldConfig, value) {
  if (!fieldConfig) return value;

  if (fieldConfig.type === "number") {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fieldConfig.defaultValue ?? 0;
    }
    return parsed;
  }

  return value ?? "";
}

export function buildDirectCartExtraFields(product, directFieldValues = {}) {
  const visibleFields = getDirectProductVisibleFields(product);

  return visibleFields
    .map((field) => {
      const rawValue = directFieldValues[field.key];
      const value =
        field.type === "number"
          ? Number.isFinite(Number(rawValue))
            ? Number(rawValue)
            : field.defaultValue ?? 0
          : String(rawValue ?? "").trim();

      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return {
        key: field.key,
        label: field.cartLabel || field.label,
        value,
      };
    })
    .filter(Boolean);
}