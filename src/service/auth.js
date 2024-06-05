function saveAuthorizationToken(authToken) {
  localStorage.setItem("auth", authToken);
}

function saveUserId(UserID) {
  localStorage.setItem("userId", UserID);
}

function removeAuthorizationToken() {
  localStorage.removeItem("auth");
}
function removeUserId() {
  localStorage.removeItem("userId");
}

const Auth = {
  removeUserId,
  saveUserId,
  saveAuthorizationToken,
  removeAuthorizationToken,
};

export default Auth;
