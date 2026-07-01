import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_tBLuDe9dQnz7HRTmYgl7kn33Ywfsv6w",
    authDomain: "persian-65b9a.firebaseapp.com",
    projectId: "persian-65b9a",
    storageBucket: "persian-65b9a.firebasestorage.app",
    messagingSenderId: "236039497167",
    appId: "1:236039497167:web:ce270a122a13bf9d4d9eba",
    measurementId: "G-71XSB7SYKT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loadingScreen = document.getElementById("loading-screen");
const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");

const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const welcomeName = document.getElementById("welcome-name-inline");

const loginBtn = document.getElementById("google-login-btn");
const logoutBtn = document.getElementById("logout-btn");

function showHome(user) {
    loginScreen.classList.remove("screen--active");
    homeScreen.classList.add("screen--active");

    userAvatar.src = user.photoURL || "";
    userName.textContent = user.displayName || "Player";
    userEmail.textContent = user.email || "";
    welcomeName.textContent = `, ${user.displayName || "Player"}`;
}

function showLogin() {
    homeScreen.classList.remove("screen--active");
    loginScreen.classList.add("screen--active");
}

loginBtn?.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error(error);
        alert("Google login failed.");
    }
});

logoutBtn?.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
});

onAuthStateChanged(auth, user => {
    loadingScreen.style.display = "none";

    if (user) {
        showHome(user);
    } else {
        showLogin();
    }
});