import { PRODUCTS } from "./products";

export const ORDER_EMAIL = "richard.malmkvist@jonkopingsskyltfabrik.se";

export const PRODUCT_TYPES = [
  {
    id: "namnbrickor",
    title: "Namnbrickor",
    text: "Beställ namnbrickor med namn, titel och olika utföranden.",
    image: "/art.-0201.jpg",
  },
  {
    id: "yrkestitelsskyltar",
    title: "Yrkestitelsskyltar",
    text: "Beställ yrkestitelsskyltar med tydlig färgmarkering och rolltext.",
    image: "/yrkestitelsskylt.jpg",
  },
];

export const NAME_BADGES = PRODUCTS.filter(
  (product) =>
    product.categoryId === "namnbrickor" &&
    product.isImplemented
);

export const PROFESSION_BADGES = [
  {
    id: 101,
    name: "Yrkestitelsskylt",
    desc: "Välj färg / yrkesroll",
    image: "/yrkestitelsskylt.jpg",
    categoryId: "namn-och-yrkestitelsskyltar",
    productType: "yrkestitelsskylt",
    subType: "yrkestitelsskyltar",
    isImplemented: true,
  },
];

export function getProductsBySubType(subType) {
  return PRODUCTS.filter(
    (product) => product.subType === subType && product.isImplemented
  );
}

export function getProductsByCategory(categoryId) {
  return PRODUCTS.filter(
    (product) => product.categoryId === categoryId && product.isImplemented
  );
}
