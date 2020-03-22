import { decrypt } from './helpers/functions/decrypt';

export const HOST = "";
export const APPNAME = "Devugo CBT V 1.0.0";
export const ITEMSPERPAGE = 10;
export const RANGEDISPLAY = 5;
export const ERRORTITLE = "Error!";
export const ERRORDESC = "something went wrong";

export const HEADERS = {
    'content-type': 'application/ld+json',
    'accept': 'application/ld+json'
};

export const IRI = decrypt('greckallowmeiri');