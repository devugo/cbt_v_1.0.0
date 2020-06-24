export const getBase64 = (file) => {
    let base64_img;
    var reader = new FileReader();
    reader.onloadend = function() {
        base64_img = reader.result;
        
    }
    reader.readAsDataURL(file);
    return base64_img;
}