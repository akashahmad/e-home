const http= require('https');
const port=3333;
const hostname= '127.0.0.1';
// http.createServer((req,res)=>{
//     res.writeHead(200,{'content-type':'text/plain'})
//     res.end('hello ladies');
// }).listen(port,hostname,()=>{
//     console.log(`listening on ${port} and ${hostname}`)
// })
// let d="";
// http.get('http://api.open-notify.org/astros.json',res=>{
    
//     res.on('data',data=>{
//         d+=data;
//     })
//     res.on('end',()=>{
//         console.log(JSON.parse(d));
//     })
//     });

// THIS IS FOR POST REQUEST USING SIMPLE HTTP MODULE
    
//http 
const options={
        hostname:"reqres.in",
        path:"/api/users",
        method:"POST",
        header:{
            "Content-Type":'application/json'
        }
    }
    const data =JSON.stringify({
            name:"jhondoe",
            Job:"writer"
    })
    let req=http.request(options,res=>{
        let d='';
        res.on('data',(c)=>{
             d +=c;
        })
        res.on('end',()=>{
            console.log(d,"   "+ res.statusCode);
        })
    })
    req.write(data);
    req.end();
// http.createServer((req,res)=>{
//     res.writeHead(200,{'content-type':'application/json'})
//     res.end(d);
// }).listen(port,hostname,()=>{
//     console.log(`listening on ${port} and ${hostname}`)
// })