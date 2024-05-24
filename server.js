const express = require('express')
//const fetch = require('node-fetch');
const serveStatic = require('serve-static');
const bodyParser=require('body-parser')
const app = express()
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore/lite');
const sha1 = require('sha1');
const { addDoc } = require('firebase/firestore/lite');
const sha256 = require('js-sha256');
const openSSL = require('openssl');
const Timestamp = require('firebase/firestore');
app.use(express.static('Main'))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());

const notThatSecretWinkWink = "335151ef644c6e346362645024cef959dfe69ef236e8a6e195023f34daaa4731a689c2ace8f0cc17ea01ea9f3e2fc15861c5e4b40171ddeaf89a7876bd115fc885d054d020477255c35a1687b1c3484c4a03caac79eb0d688d9321b4434c066cde6a5da8db2203a54c2f3d2e9c362a535dbd446c9f24190fdadc3c644af25a8d50ddabab233873101a15099788892ac09e6d0d7e5a27c43ad98a6f3dcf698d9d2d09caf5eab8ab46e23dbe403e35282fb1b9b292945aaae343081849760acc73b2d9543d7ba3159a8223fd1757a4b9baf10b98d3e4cced2160d2c6fab3c0c3636deb4319b2030ac3be7924dde993970f8143973b5857fe9d79b869d936488b2c"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSuwC06qmN2evJBTCtfEnGzBLXgji3LUI",
    authDomain: "tg-si-teams.firebaseapp.com",
    projectId: "tg-si-teams",
    storageBucket: "tg-si-teams.appspot.com",
    messagingSenderId: "524661988757",
    appId: "1:524661988757:web:1a02c1a2c2b57819da2a9c"
};
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
let loginState = false;
let userInfo={
    ID:"",
    Name:"",
    Email:""
};

//Fazer o listen
app.listen(3000)
const users = collection(db, 'User');
const chypers = collection(db, 'Cyphers');
const loginedChypers = collection(db, 'UsersCyphers');

app.get('/', async (req, res) => {
    //app.use(serveStatic('./Pages/Login'));
    res.sendFile('Main/Login_Register/login.html', { root: __dirname });
});


app.post('/',async (req, res, next) => {
    const login = {
        state: "false"
    };
    const register = {
        state: "false"
    }
    if (req.body.action == "login") {
        console.log(req.body);
        let email = req.body.emailVar;
        const pass = req.body.passwordVar;
        try {

            // Query the 'User' collection for docu ments with a specific email
            const querySnapshot = await getDocs(query(users, where('Email', '==', email)));
            if (querySnapshot.docs.length == 0) {
                console.log('Email not found. Please register.');
                const login={
                    state:"false"
                };
                loginState = false;
                res.send(login);
            }else{
                console.log(querySnapshot.docs.length);
                querySnapshot.forEach((doc) => {
                    const user = doc.data();
                    if (user.Password == sha1(pass+user.salt)) {
                        console.log('Login successful!');
                        const login={
                            state:"true"
                        };
                        loginState = true;
                        res.send(login);
                        userInfo.ID=doc.id;
                        userInfo.Name=user.UserName;
                        userInfo.Email=user.Email;
                    }else{
                        const login={
                            state:"false"
                        };
                        res.send(login);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }

    } else {
        let email = req.body.emailVar;
        const pass = req.body.passwordVar;
        //Salt criado aleatoriamente com 20 caracteres alfanuméricos exatos
        const salt = Math.random().toString(36).substring(3, 31);
        console.log(salt);
        const nome= req.body.nameVar;
        //Confirmar se o user existe na DB
        try {
            const querySnapshot = await getDocs(query(users, where('Email', '==', email)));
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                if (user.Email == email) {
                    console.log('Email already registered. Please use a different email.');
                    res.send(register);
                }
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
        //Se não existir, adicionar
        const newUser = {
            UserName: nome,
            Email: email,
            Password: sha1(pass+salt),
            salt: salt
        };
        // Add the new user to the database
        try {
            const docRef = await addDoc(users, newUser);
            console.log('User added with ID: ', docRef.id);
            console.log('Registration successful! You can now login.');
            const register={
                state:"true"
            };
            res.send(register);
        } catch (error) {
            console.error('Error adding user: ', error);
            res.status(500).send('Internal Server Error');
        }
    }
})
app.get('/Home/MyCyphers', async (req, res) => {
    res.sendFile('Main/Home/myCyphers.html', { root: __dirname });
});
app.get('/Home', async (req, res) => {
    res.sendFile('Main/Home/home.html', { root: __dirname });
});

app.get('/Home/Post', async (req, res) => {
    res.sendFile('Main/Home/postWindow.html', { root: __dirname });
});
app.get('/Home/Info', async (req, res) => {
    res.json(userInfo);
});

app.get('/AtualCyphers', async (req, res) => {
    const querySnapshot = await getDocs(query(chypers));
    const chypersList = [];
    const diaAtual=new Date();

    querySnapshot.forEach((doc) => {
        const dia=new Date(parseInt(doc.data().Time));

        let sameDayAndTime = (
            dia.getUTCDate() === diaAtual.getUTCDate() &&
            dia.getUTCMonth() === diaAtual.getUTCMonth() &&
            dia.getUTCFullYear() === diaAtual.getUTCFullYear() &&
            dia.getUTCHours() === diaAtual.getUTCHours() &&
            dia.getUTCMinutes() === diaAtual.getUTCMinutes()
        );
        if (dia.getDate() === diaAtual.getDate() && dia.getMonth() === diaAtual.getMonth() && dia.getFullYear() === diaAtual.getFullYear() && dia.getHours() === diaAtual.getHours()){
            chypersList.push([doc.data().UserName,sha256.sha256(doc.data().Email + Date.parse(dia.toString()) + notThatSecretWinkWink),doc.data().CypherType,doc.data().HMACType]);
        }
    });
    res.send(chypersList);
});

app.post('/Home/Cypher', async (req, res,next) => {
    const email = req.body.Email;
    const time = req.body.Time;
    const nome= req.body.UserName;
    const cifra = req.body.CypherType;
    const hmac = req.body.HMACType;
    console.log(req.body);
    const cypher = {
        UserName: nome,
        Email: email,
        Time: time,
        CypherType: cifra,
        HMACType:hmac
    }
    if (!loginState){
        try {



            res.send([sha256.sha256(email+time+notThatSecretWinkWink)]);
            const docRef = await addDoc(chypers, cypher);
            console.log('Cypher added with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding cypher: ', error);
            res.status(500);
        }

    }else{
        try {
            const userCypher={
                KEY:sha256.sha256(email+time+notThatSecretWinkWink),
                UserID:userInfo.ID,
                Time: time
            }
            var private_Key = "-----BEGIN RSA PRIVATE KEY-----" +
                "MIIEowIBAAKCAQEAyH9GdTsMIJoDNz4olC+6sDf71y+6qUYvvc9nJMGKx+Ys/2r9" +
                "bGa/3pimHgK88eoMEHv1io/CNQCyjJ5Vhe5CZmwdGT6gmjYnQzmbYwtM8kYKUckJ" +
                "BpSFoOTNdsEaS6TY+hhV1q2LLhpIF2m7M3SbmWdRemlawUM62u8m5G1Uxz9645tM" +
                "qXeEfuoTbUW45+/Tif5tktn/DunzvI8ay18glHDx+nI+7z9BWzOxqhst3gXhE78x" +
                "NImw2LXRZtv3LzTcV18Q966BdqT6OdvSPvTyY/gLVzzB4nlLZYPnEcIlgAMs3+Sq" +
                "txIYJc4o0cLLb43kueEnOQ8nSFTF9Q9OtErkoQIDAQABAoIBAQCDMq3jZokwCDgU" +
                "fStGlNkAGRJGJKhrvk7dUQu4hKGQ33EQjm1Y8v+Y5KDHQJltX+8XFlZ9nkbCMjuk" +
                "QrPKGTgAF70O2Ol1H/yfQ+IHdMycOPLlw7yRPr0WpMJCdGgFmdCWDziUaymJOI92" +
                "KqziJerv/ijWBnzpvFmWDCqSDW0Nl7TamCo2oB7R9OY3oUjGBNaFGKZH03UDypl5" +
                "H6oNA+aUlfM6ywUB5+3/XtixqCu47mpjfvrPCmYXaxegT7J35UHRf8jxOxe9AZ/h" +
                "vaa4jSTJZMBX6ZaxGMF06Dx2vLNF4+W9JSKSuOL5jYb/6CxWSFSId2SOXhxBhIkW" +
                "IvJ6YeXBAoGBAP/bfBellWlz5ynca9JRaiIkSE7eJs+PxhdsR7CggtChN3IAvM+c" +
                "yOu0xRuAwTlMpLm0qMcwt52ci4IHFhFvfBxuFpnae7PcqVFNY/J7RFV/4rD7RjGM" +
                "rwNWv1+S/e0F4eFxTOD0Zay94/NS5h8asjNjhvqsEWHDslZPjCzxvD0ZAoGBAMib" +
                "478bl4bPIKOi8QxA3/W2TdHEyggVt0NCKpZRxRBOjdfpuJaBjLbxx4NcV+AufRzg" +
                "rqOq87336+ASPWa4rGN82CdCtdUzNG4WKuzRgo53LfFVrX59A0S/JJr8UKblgGh9" +
                "tVUnbFbbP2hdWTTZo4JjhvsJGqwDSiZ4Df1YJ8zJAoGAM6tshQ4AfXpVnaOQ9rlQ" +
                "WLLBE4RTjCk51PMeCzJvGJjmLJSvjLHZ9ZfdEm/PFbY/se0lBIz3F9JMbibmMwEz" +
                "rD4jPFDeGHWgj/W0EH0KUMXxztH/2/PQSDlVjoSN2TcN5cxOvUM94UO77CC6rl9i" +
                "y3P3B1qGbBrsQffwlAcBf8kCgYAdeKlwvgD40R0ebSW0gyNj2bB9DMgRf/84ZlQT" +
                "WVf2GVRFUBTKJ6YgikyhQ8O1L585ythdOxQr6GxCsutKV/8bbo/i1K4Z8DfXpHIR" +
                "8IWZoHCjb87ZMkx0oRAjpMXEfxrqPu2Q4QXNjNA36N7eIMsgsLZ30tKUSrduB10m" +
                "xvix4QKBgBI8BK/V4mBiQALZHVJz/7ZYF++u7x0H0rEp3O0aeQTdeLehYySg64d+" +
                "r3gre53ll0JMMa04/1/zsEpdXQrlonZcf53dLduFZw8BmLz37JetcymLCqU4WDlH" +
                "1BoBAncq2Q7Dcnz+uNQK2D1IaMcIGoSxqO6XT2lHF+Aqyy6N0Cf7" +
                "-----END RSA PRIVATE KEY-----";
            res.send([sha256.sha256(email+time+notThatSecretWinkWink),private_Key]);
            const docRef = await addDoc(chypers, cypher);
            const docRef2 = await addDoc(loginedChypers, userCypher);
            console.log('Cypher added with ID: ', docRef2.id);
            console.log('Cypher added with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding cypher: ', error);
            res.status(500);
        }
    }
});

app.get('/MyCyphers', async (req, res) => {
    const diaAtual=new Date();
    let out=[];
    const cifraLogined = await getDocs(query(loginedChypers));
    cifraLogined.forEach((doc) => {
        const dia=parseInt(doc.data().Time);
        if(doc.data().UserID===userInfo.ID) {
            if (dia < parseInt(Date.parse(diaAtual))) {
                out.push( doc.data().KEY);
            }
        }
    });
    res.json(out);
});

app.get('/teste', async (req, res) => {
    console.log('teste');
});
app.get('/logout', async (req, res) => {
    //app.use(serveStatic('./Pages/Login'));
    loginState = false;
    userInfo={
        ID:"",
        Name:"",
        Email:""
    };
    res.redirect('/');

});
app.use((req, res)=>{
    res.status(404).sendFile('Main/404/404.html',{root: __dirname})
})