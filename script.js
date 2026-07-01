import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
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

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const logoutBtn = document.getElementById("logout-btn");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const welcomeNameInline = document.getElementById("welcome-name-inline");
const loadingScreen = document.getElementById("loading-screen");

function hideLoading() {
  if (!loadingScreen) return;
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 300);
}

function showHome(user) {
  const name = user.displayName || user.email || "Player";
  const email = user.email || "";
  const avatar = user.photoURL || "";

  if (userName) userName.textContent = name;
  if (welcomeNameInline) welcomeNameInline.textContent = `, ${name}`;
  if (userEmail) userEmail.textContent = email;

  if (userAvatar) {
    if (avatar) {
      userAvatar.src = avatar;
    } else {
      userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3462ff&color=ffffff`;
    }
  }

  if (loginScreen) loginScreen.classList.remove("screen--active");
  if (homeScreen) homeScreen.classList.add("screen--active");
}

function showLogin() {
  if (homeScreen) homeScreen.classList.remove("screen--active");
  if (loginScreen) loginScreen.classList.add("screen--active");

  initializeGoogleSignIn();
}

function initializeGoogleSignIn() {
  if (typeof google === "undefined" || !google.accounts) {
    setTimeout(initializeGoogleSignIn, 100);
    return;
  }

  google.accounts.id.initialize({
    client_id: "236039497167-o8ptvml7q8pkhb8m0b9lqb3rc7u66on2.apps.googleusercontent.com",
    callback: window.handleCredentialResponse,
    context: "signin",
    ux_mode: "popup",
    auto_select: false
  });

  const btnContainer = document.getElementById("google-btn");
  if (btnContainer) {
    google.accounts.id.renderButton(btnContainer, {
      theme: "filled_blue",
      size: "large",
      text: "continue_with",
      width: btnContainer.offsetWidth || 320,
      shape: "rectangular"
    });
  }
}

window.handleCredentialResponse = async function(response) {
  try {
    if (loadingScreen) {
      loadingScreen.style.display = "flex";
      loadingScreen.style.opacity = "1";
    }
    const credential = GoogleAuthProvider.credential(response.credential);
    await signInWithCredential(auth, credential);
  } catch (error) {
    console.error(error);
    hideLoading();
    alert("Authentication failed.");
  }
};

async function logout() {
  try {
    if (homeScreen) homeScreen.classList.remove("screen--active");
    if (loadingScreen) {
      loadingScreen.style.display = "flex";
      loadingScreen.style.opacity = "1";
    }
    await signOut(auth);
  } catch (error) {
    console.error(error);
    hideLoading();
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

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

window.addEventListener("resize", () => {
  if (loginScreen && loginScreen.classList.contains("screen--active")) {
    initializeGoogleSignIn();
  }
});
