const API_BASE_URL = "http://localhost:8000/api";

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`JSONでないレスポンスです: ${rawText}`);
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.message ?? "APIエラー");
  }

  return data;
}

// =======================
// Auth
// =======================
export async function signup(email, password) {
  return apiFetch("/signup.php", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email, password) {
  return apiFetch("/login.php", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch("/logout.php", {
    method: "POST",
  });
}

export async function getMe() {
  return apiFetch("/me.php", {
    method: "GET",
  });
}

// =======================
// Notes
// =======================
export async function getNotes() {
  return apiFetch("/notes/list.php", {
    method: "GET",
  });
}

export async function createNote(title, content) {
  return apiFetch("/notes/create.php", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
}

export async function updateNote(id, title, content) {
  return apiFetch("/notes/update.php", {
    method: "POST",
    body: JSON.stringify({ id, title, content }),
  });
}

export async function deleteNote(id) {
  return apiFetch("/notes/delete.php", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
