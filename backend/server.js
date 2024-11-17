// Import necessary modules
import express from 'express';
import multer from 'multer';
import { db, storage } from './firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getDoc } from "./firebaseConfig.js";
import cors from 'cors';

const app = express();
const PORTA = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', './views');

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
  }));

app.use(session({
    secret: 'gui123',
    resave: false,
    saveUninitialized: true
}));

const upload = multer({ storage: multer.memoryStorage() });

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

// Rota de login
app.get('/login', (req, res) => {
    res.render("login", { error: '' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Busca o nome de usuário no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            req.session.isAuthenticated = true;
            req.session.username = userData.username; // Armazena o nome de usuário na sessão

            res.cookie('loggedIn', 'true', { maxAge: 900000, httpOnly: true });
            res.redirect('/dashboard');
        } else {
            throw new Error('Usuário não encontrado no banco de dados.');
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.render("login", { error: "Credenciais inválidas. Tente novamente." });
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('loggedIn');
        res.redirect('/login');
    });
});

// Rota de registro
app.get('/register', (req, res) => {
    res.render("register", { error: '' });
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Salva os dados do usuário no Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            password: password
        });

        res.redirect('/login');
    } catch (error) {
        console.error("Erro ao registrar o usuário:", error);
        res.render("register", { error: "Erro ao registrar. Tente novamente." });
    }
});

// CRUD de produtos
app.get('/produtos', isAuthenticated, async (req, res) => {
    try {
        const produtosSnapshot = await getDocs(collection(db, 'produtos'));
        const produtos = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.render('produtos', { produtos });
    } catch (error) {
        res.status(500).send('Erro ao buscar produtos.');
    }
});

app.post('/produtos', isAuthenticated, upload.single('imagem'), async (req, res) => {
    try {
        const { nome, descricao, tipo } = req.body;
        const imagemRef = ref(storage, `imagens/${req.file.originalname}`);
        await uploadBytes(imagemRef, req.file.buffer);
        const imagemURL = await getDownloadURL(imagemRef);

        await addDoc(collection(db, 'produtos'), {
            nome,
            descricao,
            tipo,
            imagemURL
        });

        res.redirect('/produtos');
    } catch (error) {
        res.status(500).send('Erro ao adicionar produto.');
    }
});

app.put('/produtos/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, tipo } = req.body;
        const produtoRef = doc(db, 'produtos', id);

        await updateDoc(produtoRef, {
            nome,
            descricao,
            tipo
        });

        res.status(200).send('Produto atualizado com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao atualizar produto.');
    }
});

app.delete('/produtos/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        await deleteDoc(doc(db, 'produtos', id));
        res.status(200).send('Produto deletado com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao deletar produto.');
    }
});

// Rota do dashboard (protegida)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { username: req.session.username });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Erro no servidor.' });
});

// Inicia o servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
