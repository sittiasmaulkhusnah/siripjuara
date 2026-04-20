const authButton = document.getElementById('auth-button');
const profileButton = document.getElementById('profile-button');

let isLoggedIn = false;

function renderAuthState() {
  if (isLoggedIn) {
    authButton.classList.add('hidden');
    profileButton.classList.remove('hidden');
  } else {
    authButton.classList.remove('hidden');
    profileButton.classList.add('hidden');
  }
}

function toggleAuthState() {
  isLoggedIn = !isLoggedIn;
  renderAuthState();
}

authButton.addEventListener('click', () => {
  isLoggedIn = true;
  renderAuthState();
});

profileButton.addEventListener('click', () => {
  isLoggedIn = false;
  renderAuthState();
});

document.addEventListener('DOMContentLoaded', () => {
  renderAuthState();
});
