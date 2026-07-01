import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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

const googleProvider = new GoogleAuthProvider();
const discordProvider = new OAuthProvider("discord.com");

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");

const googleBtn = document.getElementById("google-btn");
const discordBtn = document.getElementById("discord-btn");
const logoutBtn = document.getElementById("logout-btn");

const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const welcomeNameInline = document.getElementById("welcome-name-inline");

const loadingScreen = document.getElementById("loading-screen");

function setButtonsDisabled(state) {
  googleBtn.disabled = state;
  discordBtn.disabled = state;
}

function hideLoading() {
  if (!loadingScreen) return;

  loadingScreen.style.opacity = "0";

  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 300);
}

function showHome(user) {
  const name =
    user.displayName ||
    user.email ||
    "Player";

  const email =
    user.email ||
    "";

  const avatar =
    user.photoURL ||
    "";

  userName.textContent = name;
  welcomeNameInline.textContent = `, ${name}`;

  if (userEmail) {
    userEmail.textContent = email;
  }

  if (avatar) {
    userAvatar.src = avatar;
  } else {
    userAvatar.src =
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }

  loginScreen.classList.remove("screen--active");
  homeScreen.classList.add("screen--active");
}

function showLogin() {
  homeScreen.classList.remove("screen--active");
  loginScreen.classList.add("screen--active");

  setButtonsDisabled(false);
}

async function signInWithGoogle() {
  try {
    setButtonsDisabled(true);

    await signInWithPopup(
      auth,
      googleProvider
    );

  } catch (error) {
    console.error(error);

    setButtonsDisabled(false);

    alert("Google login failed.");
  }
}

async function signInWithDiscord() {
  try {
    setButtonsDisabled(true);

    await signInWithPopup(
      auth,
      discordProvider
    );

  } catch (error) {
    console.error(error);

    setButtonsDisabled(false);

    alert("Discord login is not configured.");
  }
}

async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

onAuthStateChanged(auth, (user) => {
  hideLoading();

  if (user) {
    showHome(user);
  } else {
    showLogin();
  }
});

googleBtn.addEventListener(
  "click",
  signInWithGoogle
);

discordBtn.addEventListener(
  "click",
  signInWithDiscord
);

logoutBtn.addEventListener(
  "click",
  logout
);