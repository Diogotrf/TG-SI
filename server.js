const express = require('express')
//const fetch = require('node-fetch');
const serveStatic = require('serve-static');
const bodyParser=require('body-parser')
const app = express()

app.use(express.static('Main'))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());

//Fazer o listen
app.listen(3000)

app.get('/',(req,res)=>{
    //app.use(serveStatic('./Pages/Login'));
    res.sendFile('./Main/Login & Register/login.html',{root: __dirname})
})

//app.post('/',(req, res,next)=>{
//    console.log(req.body)
//    const login={
//        state:"false"
//    };
//    const logOn={
//        state: "false"
//    }
//    if(req.body.action=="login"){
//        console.log(req.body);
//        const email= req.body.emailVar;
//        const pass= req.body.passwordVar;
//        sql.query(`SELECT ID FROM Apicultors WHERE Email='${email}' AND Password='${pass}'`, (err, result) => {
//            try{
//                if(result && result.recordset && result.recordset.length > 0){
//                    id = result.recordset[0].ID;
//                    console.log("Post Request Finished")
//                    res.redirect('/Lobby')
//                } else {
//                    throw new Error("No results found.");
//                }
//            }catch (err){
//                console.log("ERRO: "+err);
//                res.send(login)
//            }
//        })
//    }else{
//        const emailLog= req.body.logMail
//        const nome= req.body.LogNome
//        const pass= req.body.LogPass
//        const numeroApicultor=req.body.apisNumber
//        const query = `INSERT INTO Apicultors (Name,NumApic,Email,Password,Status) Values ('${nome}',${numeroApicultor},'${emailLog}','${pass}',1)`;
//        sql.query(query, (err, result) => {
//            if (err) {
//                console.log(err);
//                console.log("ERROU")
//            }
//            logOn.state = "true";
//            res.send(logOn);
//        });
//    }
//})

app.use((req, res)=>{
    res.status(404).sendFile('./Pages/404/404.html',{root: __dirname})
})
