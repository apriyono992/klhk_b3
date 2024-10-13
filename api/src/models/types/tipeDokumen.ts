import { TipeDokumen } from "../enums/TipeDokumen";

export type RequiredDocumentsStatus = {
    [key in TipeDokumen]: boolean;
  };