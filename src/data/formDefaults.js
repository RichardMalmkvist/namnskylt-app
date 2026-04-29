import { getChosenProfession } from "./professionHelpers";

export const EMPTY_PRODUCT_FORM = {
  orgLine1: "",
  orgLine2: "",
  name: "",
  title: "",
  titleLine2: "",
  professionChoiceId: "",
  fastening: "",
  quantity: 1,
  extraMagnets: 0,
  color: "",
  textColor: "",
  customText: "",
  customTextLine1: "",
  customTextLine2: "",
  arrowPlacement: "none",
  arrowDirection: "",
  hangingSignTextMode: "single",
};

export const EMPTY_ORDERER = {
  ordererName: "",
  ordererEmail: "",
  ordererPhone: "",
  messageToSupplier: "",
  accountNumber: "",
};

export const EMPTY_DELIVERY = {
  company: "",
  recipient: "",
  address: "",
  postalCode: "",
  city: "",
  country: "Sverige",
};

export function getProfessionInitialForm(product = null) {
  const fallbackProfession = getChosenProfession("lakare");

  const fixedTitle = product?.fixedProfessionTitle || fallbackProfession.label;
  const fixedColor = product?.fixedColor || fallbackProfession.color;
  const fixedTextColor =
    product?.fixedTextColor || fallbackProfession.textColor;

  return {
    ...EMPTY_PRODUCT_FORM,
    title: fixedTitle,
    professionChoiceId: "",
    color: fixedColor,
    textColor: fixedTextColor,
    quantity: 1,
  };
}

export function getHangingSignInitialForm(product = null) {
  const isDoubleText = product?.hangingSignTextMode === "double";

  return {
    ...EMPTY_PRODUCT_FORM,
    customText: "",
    customTextLine1: "",
    customTextLine2: "",
    arrowPlacement: "none",
    arrowDirection: "",
    hangingSignTextMode: isDoubleText ? "double" : "single",
    quantity: 1,
  };
}

export function getEmptyProductForm() {
  return {
    ...EMPTY_PRODUCT_FORM,
  };
}