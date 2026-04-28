import { getBadgeFieldLabel } from "./productHelpers";

function toNumberOrFallback(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getDefaultPlaceholder(fieldKey, label) {
  if (fieldKey === "name") return "Anna Svensson";
  if (fieldKey === "customText") return "Skriv text här";
  if (fieldKey === "customTextLine1") return "Skriv första raden här";
  if (fieldKey === "customTextLine2") return "Skriv andra raden här";
  return label;
}

function getArrowDirectionOptions(productForm) {
  const placement = productForm?.arrowPlacement || "none";

  if (placement === "left") {
    return [
      { value: "up", label: "Upp" },
      { value: "left", label: "Vänster" },
      { value: "down", label: "Ner" },
    ];
  }

  if (placement === "right") {
    return [
      { value: "up", label: "Upp" },
      { value: "right", label: "Höger" },
      { value: "down", label: "Ner" },
    ];
  }

  return [];
}

function createTextFieldRenderer(fieldKey) {
  return function renderTextField({
    Field,
    selectedBadge,
    productForm,
    updateFormValue,
    inputStyle,
  }) {
    const fallbackLabelMap = {
      name: "Namn",
      title: "Titel",
      titleLine2: "Titel rad 2",
      orgLine1: "Verksamhetsnamn",
      orgLine2: "Verksamhetsnamn rad 2",
      customText: "Text",
      customTextLine1: "Textrad 1",
      customTextLine2: "Textrad 2",
    };

    const fallbackLabel = fallbackLabelMap[fieldKey] || fieldKey;
    const label = getBadgeFieldLabel(selectedBadge, fieldKey, fallbackLabel);

    return (
      <Field key={fieldKey} label={label} htmlFor={fieldKey}>
        <input
          id={fieldKey}
          type="text"
          placeholder={getDefaultPlaceholder(fieldKey, label)}
          style={inputStyle}
          value={productForm[fieldKey] || ""}
          onChange={(e) => updateFormValue(fieldKey, e.target.value)}
        />
      </Field>
    );
  };
}

function renderArrowPlacementField({
  Field,
  selectedBadge,
  productForm,
  updateFormValue,
  inputStyle,
}) {
  const fieldKey = "arrowPlacement";
  const label = getBadgeFieldLabel(selectedBadge, fieldKey, "Pilplacering");
  const fieldConfig = selectedBadge?.fields?.[fieldKey];

  const options =
    fieldConfig &&
    typeof fieldConfig === "object" &&
    Array.isArray(fieldConfig.options)
      ? fieldConfig.options
      : [
          { value: "none", label: "Ingen pil" },
          { value: "left", label: "Vänster sida" },
          { value: "right", label: "Höger sida" },
        ];

  return (
    <Field key={fieldKey} label={label} htmlFor={fieldKey}>
      <select
        id={fieldKey}
        style={inputStyle}
        value={productForm.arrowPlacement || "none"}
        onChange={(e) => {
          const nextPlacement = e.target.value;
          const validDirections = getArrowDirectionOptions({
            ...productForm,
            arrowPlacement: nextPlacement,
          }).map((option) => option.value);

          const currentDirection = productForm.arrowDirection || "";
          const nextDirection = validDirections.includes(currentDirection)
            ? currentDirection
            : "";

          updateFormValue(fieldKey, nextPlacement);
          updateFormValue("arrowDirection", nextDirection);
        }}
      >
        {options.map((option) => {
          const optionValue = typeof option === "object" ? option.value : option;
          const optionLabel = typeof option === "object" ? option.label : option;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

function renderArrowDirectionField({
  Field,
  selectedBadge,
  productForm,
  updateFormValue,
  inputStyle,
}) {
  const placement = productForm?.arrowPlacement || "none";

  if (placement === "none") {
    return null;
  }

  const fieldKey = "arrowDirection";
  const label = getBadgeFieldLabel(selectedBadge, fieldKey, "Pilriktning");
  const options = getArrowDirectionOptions(productForm);

  return (
    <Field key={fieldKey} label={label} htmlFor={fieldKey}>
      <select
        id={fieldKey}
        style={inputStyle}
        value={productForm.arrowDirection || ""}
        onChange={(e) => updateFormValue(fieldKey, e.target.value)}
      >
        <option value="">Välj...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function renderFasteningField({
  Field,
  selectedBadge,
  productForm,
  updateFormValue,
  inputStyle,
}) {
  const fieldKey = "fastening";
  const label = getBadgeFieldLabel(selectedBadge, fieldKey, "Fäste");

  return (
    <Field key={fieldKey} label={label} htmlFor={fieldKey}>
      <select
        id={fieldKey}
        style={inputStyle}
        value={productForm.fastening || ""}
        onChange={(e) => updateFormValue(fieldKey, e.target.value)}
      >
        <option value="">Välj...</option>
        {(selectedBadge?.fasteningOptions || []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function createNumberFieldRenderer(fieldKey, config = {}) {
  const {
    fallbackLabel = fieldKey,
    min = 0,
    fallbackValue = 0,
  } = config;

  return function renderNumberField({
    Field,
    selectedBadge,
    productForm,
    updateFormValue,
    inputStyle,
  }) {
    const label = getBadgeFieldLabel(selectedBadge, fieldKey, fallbackLabel);

    return (
      <Field key={fieldKey} label={label} htmlFor={fieldKey}>
        <input
          id={fieldKey}
          type="number"
          min={String(min)}
          value={productForm[fieldKey]}
          onChange={(e) =>
            updateFormValue(
              fieldKey,
              toNumberOrFallback(e.target.value, fallbackValue)
            )
          }
          style={inputStyle}
        />
      </Field>
    );
  };
}

export const FIELD_RENDERERS = {
  name: createTextFieldRenderer("name"),
  title: createTextFieldRenderer("title"),
  titleLine2: createTextFieldRenderer("titleLine2"),
  orgLine1: createTextFieldRenderer("orgLine1"),
  orgLine2: createTextFieldRenderer("orgLine2"),
  customText: createTextFieldRenderer("customText"),
  customTextLine1: createTextFieldRenderer("customTextLine1"),
  customTextLine2: createTextFieldRenderer("customTextLine2"),
  arrowPlacement: renderArrowPlacementField,
  arrowDirection: renderArrowDirectionField,
  fastening: renderFasteningField,
  quantity: createNumberFieldRenderer("quantity", {
    fallbackLabel: "Antal",
    min: 1,
    fallbackValue: 1,
  }),
  extraMagnets: createNumberFieldRenderer("extraMagnets", {
    fallbackLabel: "Extra magnetfästen",
    min: 0,
    fallbackValue: 0,
  }),
};

export const DEFAULT_FIELD_ORDER = [
  "name",
  "title",
  "titleLine2",
  "orgLine1",
  "orgLine2",
  "customText",
  "customTextLine1",
  "customTextLine2",
  "arrowPlacement",
  "arrowDirection",
  "fastening",
  "quantity",
  "extraMagnets",
];

export function renderConfiguredField(fieldKey, context) {
  const renderer = FIELD_RENDERERS[fieldKey];

  if (!renderer) {
    return null;
  }

  return renderer(context);
}