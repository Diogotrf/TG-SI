const express = require('express')
//const fetch = require('node-fetch');
const serveStatic = require('serve-static');
const bodyParser=require('body-parser')
const app = express()
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore/lite');
const sha1 = require('sha1');
const { addDoc } = require('firebase/firestore/lite');

app.use(express.static('Main'))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());


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

//Fazer o listen
app.listen(3000)
const users = collection(db, 'User');

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
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                if (user.Password == sha1(pass+user.salt)) {
                    console.log('Login successful!');
                    const login={
                        state:"true"
                    };
                    res.send(login);
                }else{
                    const login={
                        state:"false"
                    };
                    res.send(login);
                }
            });
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

app.get('/Home', async (req, res) => {
    //app.use(serveStatic('./Pages/Login'));
    res.sendFile('Main/Home/home.html', { root: __dirname });
});

app.use((req, res)=>{
    res.status(404).sendFile('./Pages/404/404.html',{root: __dirname})
})
