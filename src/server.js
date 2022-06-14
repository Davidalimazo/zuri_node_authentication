const http=require('http');
const fs = require('fs');
const path = require('path');

const server =http.createServer((req, res)=>{

    let obj ={
        the_path:'',
        the_page:''
    }


    switch (req.url) {
        case "/":
            obj.the_page='index.html'; obj.the_path=req.url;
            break;
        case "/about":
            obj.the_page='about.html'; obj.the_path=req.url;
            break;
        case "/contact":
            obj.the_page='contact.html'; obj.the_path=req.url;
            break;
    
        default:
            obj.the_page='index.html'; obj.the_path=req.url;
    }

    let filepath = path.join(__dirname, '../public', obj.the_path ? obj.the_page : req.url);
    let getFileType=(filepath)=>{
        let extname = path.extname(filepath);
        if(extname =='.js'){
            return 'text/javascript'
        }
        if(extname =='.css'){
            return 'text/css'
        }
        if(extname =='.png'){
            return 'text/png'
        }
        if(extname =='.jpg'){
            return 'text/jpg'
        }
    }

    let contentType = getFileType(filepath) || 'text/html';
    let emptyFilePath = path.join(__dirname, 'public')

        fs.readFile(filepath, 'utf-8', (err, data)=>{
            if(err){
            if(err.code =='EN0ENT'){
                fs.readFile(emptyFilePath, 'utf-8', (err, content)=>{
                    res.writeHead(200, {'Content-Type':contentType})
                    res.end(content)
                })
            }else{
                res.writeHead(500)
                res.end('error occurred')
            }
        }else{
            res.writeHead(200, {'Content-Type':contentType})
            res.end(data)
        }
        })
})

let port = 4000;
server.listen(port, (err)=>{
    if(err) console.log('error starting the server: '+err);
    else console.log('server is listening on port: '+port);
})