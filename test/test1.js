/*
class A {
public int i;
public getI(){
	return i;
}
};

A a = new a;
a.i = 3;

String[] arr = new String[3];
arr[0] = "aaa";
*/

var i = 100;
var f = 1.0;
var a = 'aa';

var sum = i*f;

//class 없다.
//object 있다.


var arr = [];

arr[0] = 3;

var i =100;


var a = {};
a  ['i'] = '3';
a['getI'] = function() {	
	return this.i;
}


var a = {
		i : '3',
		getI: function() {
			
			return this.i;
			
		}
};

var arr = [];
var o = {
		code: "PRD",
		name: "고정관",
		pcsTemplate: "TPL",
		process_price: 0
};

arr[0] = o;
arr[1] = o1;

var o = {};
a  ['code'] = 'PRD';
//...

/*

store 에서 사용되는 object는 extjs 상속.

a.get('code');


store 는 ajax의 상속. ajax 일종
ajax를 편하게 쓴다.

반드시 store 써야되는 경우 : grid 쓸때.

javascript 는 함수를 변수에 어사인.

var getI = function(i) {
	
	return i*20;
	
};

*/
