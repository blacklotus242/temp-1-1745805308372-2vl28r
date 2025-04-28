export async function login(email, password) {
  // Fake admin if email is admin@example.com
  const isAdmin = email === 'admin@example.com';
  const response = { success: true, user: { email, role: isAdmin ? 'admin' : 'user' } };
  if (email && password) {
    return response;
  } else {
    return { success: false };
  }
}

export async function register(email, password) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data.success;
}

export async function requestPasswordReset(email) {
  const response = await fetch('/api/password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  return data.success;
}