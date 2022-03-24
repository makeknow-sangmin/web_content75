

var b = {};

b['a1'] = 3;
b['f1'] = 3;
b['name'] = '홍길동';
b['fc'] = function(a,b) {
    return a+b;
}

{
    var c=5;
}


{
    var sum = function(a1, a2) {
        return c+ a1+a2;
    }

    var  a = {
        a1: 3,
        f1: 3.0,
        name: '홍길동',
        fc: sum
    };
}


var sum = function(a1, a2, callback) {
    return fc(a1+a2);
}



sum(5,7, function(a3){
    console.log(a3);
})

sum(5,7, function(a3){
    console.log(a3*10);
})

