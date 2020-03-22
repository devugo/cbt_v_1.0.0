export const encrypt = (type, value) => {
    var CryptoJS = require("crypto-js");
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(value, 'devugo is the best!');
    if(type == 'IRI'){
        localStorage.setItem("greckallowmeiri", ciphertext);
    } else if (type == 'NAME') {
        localStorage.setItem("greckallowmename", ciphertext);
    }
}