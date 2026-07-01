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
  setTimeout(() => (loadingScreen.style.display = "none"), 250);
}

function setScreen(isLoggedIn) {
  if (isLoggedIn) {
    loginScreen?.classList.remove("screen--active");
    homeScreen?.classList.add("screen--active");
  } else {
    homeScreen?.classList.remove("screen--active");
    loginScreen?.classList.add("screen--active");
  }
}

function setUser(user) {
  const name =
    user.fullName ||
    user.firstName ||
    user.primaryEmailAddress?.emailAddress ||
    "Player";

  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatar = user.imageUrl;

  if (userName) userName.textContent = name;
  if (userEmail) userEmail.textContent = email;
  if (welcomeNameInline) welcomeNameInline.textContent = `, ${name}`;

  if (userAvatar) {
    userAvatar.src =
      avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2f5cff&color=fff`;
  }
}

async function signInGoogle() {
  try {
    const clerk = window.Clerk;

    if (!clerk) throw new Error("Clerk not loaded");

    await clerk.signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: window.location.href,
      redirectUrlComplete: window.location.href
    });

  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Try again.");
  }
}

async function logout() {
  try {
    await window.Clerk.signOut();
    setScreen(false);
  } catch (err) {
    console.error(err);
  }
}

async function init() {
  const clerk = window.Clerk;

  if (!clerk) {
    console.error("Clerk not loaded");
    hideLoading();
    setScreen(false);
    return;
  }

  await clerk.load();

  // IMPORTANT: completes OAuth redirect flow
  try {
    await clerk.handleRedirectCallback();
  } catch (e) {}

  const user = clerk.user;

  hideLoading();

  if (user) {
    setUser(user);
    setScreen(true);
  } else {
    setScreen(false);
  }

  clerk.addListener(({ user }) => {
    if (user) {
      setUser(user);
      setScreen(true);
    } else {
      setScreen(false);
    }
  });
}

googleBtn?.addEventListener("click", signInGoogle);
logoutBtn?.addEventListener("click", logout);

window.addEventListener("load", init);