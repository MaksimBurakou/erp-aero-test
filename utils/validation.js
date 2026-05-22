const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export function isValidLogin(login) {
  return emailRegex.test(login) || phoneRegex.test(login);
}
