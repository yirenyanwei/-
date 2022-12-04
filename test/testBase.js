/*
* @Author: haoyanwei
* @Date:   2022-12-01 09:18:35
* @Last Modified by:   haoyanwei
* @Last Modified time: 2022-12-03 12:06:29
*/
console.log("this is test Base")
var str = 'a'+'b'
var arr = [1,2,3]
console.log(typeof arr)
function fun(){

}
var [a,b,c] = arr
console.log(typeof fun, c)

//bind实现
Function.prototype.$bind = function(context, ...arg){
	let fn = this
	return function(){
		return fn.apply(context, [...arg])
	}
}
let testLet = 100
{
	var testVar = 200
	let testLet = 200
}
console.log(testVar, testLet)

function testFunc(){
	console.log(arguments)
}
testFunc(1,2)