module.exports = {
    firstUpper: username => {
        const name = username.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    lowerCase: str => {
        return str.toLowerCase();
    },
    randomValue: num =>{
        var string = "0123456789";
        var str = '';
        var i = 0;
        while(i < num){
            str += string.charAt(Math.floor(Math.random() * string.length));
            i++;
        }
        return str;
    }
};
