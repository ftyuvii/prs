const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const googleBtn = document.getElementById("google-btn");
const logoutBtn = document.getElementById("logout-btn");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const welcomeNameInline = document.getElementById("welcome-name-inline");
const loadingScreen = document.getElementById("loading-screen");

function setButtonsDisabled(state) {
  if (googleBtn) googleBtn.disabled = state;
}

function hideLoading() {
  if (!loadingScreen) return;
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 300);
}

function showHome(user) {
  const name = user.fullName || user.primaryEmailAddress?.emailAddress || "Player";
  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatar = user.imageUrl || "";

  if (userName) userName.textContent = name;
  if (welcomeNameInline) welcomeNameInline.textContent = `, ${name}`;
  if (userEmail) userEmail.textContent = email;

  if (userAvatar) {
    if (avatar) {
      userAvatar.src = avatar;
    } else {
      userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2f5cff&color=ffffff`;
    }
  }

  if (loginScreen) loginScreen.classList.remove("screen--active");
  if (homeScreen) homeScreen.classList.add("screen--active");
}

function showLogin() {
  if (homeScreen) homeScreen.classList.remove("screen--active");
  if (loginScreen) loginScreen.classList.add("screen--active");
  setButtonsDisabled(false);
}

function getRedirectUrl() {
  return window.location.origin + window.location.pathname;
}

async function signInWithGoogle() {
  try {
    setButtonsDisabled(true);
    document.body.classList.add("auth-loading");

    const redirectUrl = getRedirectUrl();

    await window.Clerk.client.signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: redirectUrl,
      redirectUrlComplete: redirectUrl
    });
  } catch (error) {
    console.error(error);
    alert("Google login failed.");
    document.body.classList.remove("auth-loading");
    setButtonsDisabled(false);
  }
}

async function logout() {
  try {
    if (homeScreen) homeScreen.classList.remove("screen--active");
    await window.Clerk.signOut();
    showLogin();
  } catch (error) {
    console.error(error);
  }
}

async function completePendingRedirect(clerk) {
  const hasCallbackParams = /__clerk_/.test(window.location.search);
  if (!hasCallbackParams) return;

  try {
    await clerk.handleRedirectCallback({
      redirectUrl: getRedirectUrl(),
      redirectUrlComplete: getRedirectUrl()
    });
  } catch (error) {
    console.error(error);
  } finally {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function initClerk() {
  const clerk = window.Clerk;

  if (!clerk) {
    console.error("Clerk failed to load.");
    hideLoading();
    showLogin();
    return;
  }

  await clerk.load();
  await completePendingRedirect(clerk);

  document.body.classList.remove("auth-loading");
  hideLoading();

  if (clerk.user) {
    showHome(clerk.user);
  } else {
    showLogin();
  }

  clerk.addListener(({ user }) => {
    if (user) {
      showHome(user);
    } else {
      showLogin();
    }
  });
}

if (googleBtn) {
  googleBtn.addEventListener("click", signInWithGoogle);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

window.addEventListener("load", initClerk);
