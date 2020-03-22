export const decrypt = (val) => {
    if(localStorage.getItem("greckallowmeiri") === null) {
        return null;
    }
    let CryptoJS = require("crypto-js");

    let key = localStorage.getItem(val);
    let bytes  = CryptoJS.AES.decrypt(key.toString(), 'devugo is the best!');
    
    return bytes.toString(CryptoJS.enc.Utf8); 
}