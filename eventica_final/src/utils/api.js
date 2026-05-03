// كل الاتصالات مع الـ PHP backend
const BASE = 'http://localhost:8000';

async function req(endpoint, opts = {}) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Erreur serveur');
  return data;
}

export const apiLogin       = (username, password) => req('login.php',        { method: 'POST', body: JSON.stringify({ username, password }) });
export const apiRegister    = (username, email, password) => req('register.php', { method: 'POST', body: JSON.stringify({ username, email, password }) });
export const apiLogout      = ()     => req('logout.php',        { method: 'POST' });
export const apiGetEvents   = (p={}) => req('events.php' + (Object.keys(p).length ? '?' + new URLSearchParams(p) : ''));
export const apiCreateEvent = (d)    => req('add_event.php',     { method: 'POST', body: JSON.stringify(d) });
export const apiApprove     = (id)   => req('approve_event.php', { method: 'POST', body: JSON.stringify({ id }) });
export const apiReject      = (id)   => req('regect_event.php',  { method: 'POST', body: JSON.stringify({ id }) });
export const apiDelete      = (id)   => req('delet_event.php',   { method: 'POST', body: JSON.stringify({ id }) });
export const apiGetUsers    = ()     => req('users.php');
export const apiDeleteUser  = (id)   => req('delete_user.php',   { method: 'POST', body: JSON.stringify({ id }) });
