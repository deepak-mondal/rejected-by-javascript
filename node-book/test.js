const a = 100

setTimeout(()=>{
	setTimeout(()=>console.log('2nd timer'),999)
},1000)
setTimeout(()=>{
	console.log('timer expired')
},2000)


//a = 100
// last line of the file
// next tick
// promise
//timer expired
//immediate
//file read


//EOL
//next tick
//promise
// timer expired
// setImmediate
// file read cb
// 2nd next tick
// immediate
// 2nd timer


//EOL
// next tick
// inner next tick
// promise
//timer expired
// setImmediate
// file read cb