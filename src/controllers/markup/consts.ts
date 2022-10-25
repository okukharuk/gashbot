type MarkupRecord = Record<string, string>;

export const AdminItem: MarkupRecord = {
  "Add item": " AdminAddItem",
  "Delete item": " AdminDeleteItem",
  "Update item": " AdminUpdateItem",
};

export const AdminUpdateItem: MarkupRecord = {
  Name: " ProductUpdateItem Name",
  Amount: " ProductUpdateItem Amount",
  Price: " ProductUpdateItem Price",
};

export const BackMarkup: MarkupRecord = {
  PlaceOpened: "StartOpened",
  AdminPlaceOpened: "AdminOpened",
  ProductDelete: "AdminPlaceOpened",
  ProductUpdate: "AdminPlaceOpened",
  ProductUpdateItem: "AdminPlaceOpened",
  AdminDeleteItem: "AdminPlaceOpened",
  AdminUpdateItem: "AdminPlaceOpened",
};
