const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const googleBtn = document.getElementById("google-btn");
const logoutBtn = document.getElementById("logout-btn");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const welcomeNameInline = document.getElementById("welcome-name-inline");
const loadingScreen = document.getElementById("loading-screen");

function hideLoading() {
  if (!loadingScreen) return;
  loadingScreen.style.opacity = "0";
  setTimeout(() => (loadingScreen.style.display = "none"), 200);
}

function showHome(user) {
  const name =
    user.fullName ||
    user.firstName ||
    user.primaryEmailAddress?.emailAddress ||
    "Player";

  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatar = user.imageUrl;

  userName && (userName.textContent = name);
  userEmail && (userEmail.textContent = email);
  welcomeNameInline && (welcomeNameInline.textContent = `, ${name}`);

  if (userAvatar) {
    userAvatar.src =
      avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2f5cff&color=fff`;
  }

  loginScreen?.classList.remove("screen--active");
  homeScreen?.classList.add("screen--active");
}

function showLogin() {
  homeScreen?.classList.remove("screen--active");
  loginScreen?.classList.add("screen--active");
}

function getClerk() {
  return window.Clerk;
}

async function signInWithGoogle() {
  try {
    const clerk = getClerk();
    if (!clerk) throw new Error("Clerk not loaded");

    // ✅ CORRECT v6 method (safe redirect flow)
    await clerk.redirectToSignIn({
      redirectUrl: window.location.href,
      signInFallbackRedirectUrl: window.location.href
    });

  } catch (err) {
    console.error("LOGIN FAILED:", err);
    alert("Login failed. Check console.");
  }
}

async function logout() {
  try {
    const clerk = getClerk();
    if (!clerk) return;

    await clerk.signOut();
    showLogin();
  } catch (err) {
    console.error(err);
  }
}

async function initClerk() {
  const clerk = getClerk();

  if (!clerk) {
    console.error("Clerk not loaded");
    hideLoading();
    showLogin();
    return;
  }

  await clerk.load();

  // handle redirect return safely
  try {
    await clerk.handleRedirectCallback();
  } catch (e) {}

  hideLoading();

  const user = clerk.user;

  if (user) {
    showHome(user);
  } else {
    showLogin();
  }

  clerk.addListener(({ user }) => {
    if (user) showHome(user);
    else showLogin();
  });
}

googleBtn?.addEventListener("click", signInWithGoogle);
logoutBtn?.addEventListener("click", logout);

window.addEventListener("load", initClerk);