export const positionFormatter = (key) => {
    let position = '';
    let strLen = key.length;
    // this takes care of 1 to 10
    if(strLen == 1){
        if(key == 1){
            position = key+'st';
        }else if(key == 2){
            position = key+'nd';
        }else if(key == 3){
            position = key+'rd';
        }else{
            position = key+'th';
        }
    }else{
        //this takes care of 10 to infinity
        if(key[strLen-1] == 1){
            position = key+'st';
        }else if(key[strLen-1] == 2){
            position = key+'nd';
        }else if(key[strLen-1] == 3){
            position = key+'rd';
        }else{
            position = key+'th';
        }

        if(key == 11){
            position = '11th';
        }else if(key == 12){
            position = '12th';
        }else if(key == 13){
            position = '13th';
        }
    }

    return position;
}