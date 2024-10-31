import { TipeDokumen } from "../enums/tipeDokumen";

export type RequiredDocumentsStatus = {
    [key in TipeDokumen]: boolean;
  };