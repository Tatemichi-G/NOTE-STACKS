import { useEffect, useState } from "react";
import "./App.css";
import {
  signup,
  login,
  logout,
  getMe,
  getNotes,
  createNote,
  deleteNote,
} from "./lib/phpApi";

function AuthForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const result = await signup(email, password);
        setMessage(result.message);
      } else {
        const result = await login(email, password);
        setMessage(result.message);
        onLoginSuccess(result.user);
      }
    } catch (error) {
      setMessage(error.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page'>
      <div className='card'>
        <h1>PHP Notes</h1>

        <div className='mode-row'>
          <button
            type='button'
            disabled={loading || mode === "signin"}
            onClick={() => setMode("signin")}
          >
            ログイン
          </button>

          <button
            type='button'
            disabled={loading || mode === "signup"}
            onClick={() => setMode("signup")}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className='form'>
          <input
            type='email'
            placeholder='email'
            value={email}
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type='password'
            placeholder='password'
            value={password}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit' disabled={loading || !email || !password}>
            {loading
              ? "処理中..."
              : mode === "signup"
                ? "登録する"
                : "ログイン"}
          </button>
        </form>

        {message && <p className='message'>{message}</p>}
      </div>
    </div>
  );
}

function NotesHome({ session, onLogoutSuccess }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadNotes = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await getNotes();
      setNotes(result.notes ?? []);
    } catch (error) {
      setMessage(error.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      setMessage("タイトルを入力してください");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await createNote(title.trim(), content);
      setNotes((prev) => [result.note, ...prev]);
      setTitle("");
      setContent("");
    } catch (error) {
      setMessage(error.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("削除しますか？")) return;

    setLoading(true);
    setMessage("");

    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      setMessage(error.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage("");

    try {
      await logout();
      onLogoutSuccess();
    } catch (error) {
      setMessage(error.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page'>
      <div className='card wide'>
        <div className='topbar'>
          <div>
            <h1>Notes</h1>
            <p className='subtext'>ログイン中: {session.email}</p>
          </div>

          <button onClick={handleLogout} disabled={loading}>
            ログアウト
          </button>
        </div>

        <div className='create-box'>
          <h2>新規作成</h2>

          <input
            placeholder='タイトル'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder='本文'
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className='button-row'>
            <button onClick={handleCreate} disabled={loading}>
              {loading ? "..." : "追加"}
            </button>

            <button onClick={loadNotes} disabled={loading}>
              {loading ? "..." : "再読み込み"}
            </button>
          </div>
        </div>

        {message && <p className='message'>{message}</p>}

        <div className='notes-list'>
          <h2>一覧</h2>

          {notes.length === 0 ? (
            <p>ノートがありません</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className='note-card'>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <small>
                  id: {note.id} / updated: {note.updated_at}
                </small>

                <div className='button-row'>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={loading}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await getMe();
        setSession(result.user ?? null);
      } catch (error) {
        console.error(error);
        setSession(null);
      } finally {
        setLoadingSession(false);
      }
    };

    checkSession();
  }, []);

  if (loadingSession) {
    return (
      <div className='page'>
        <div className='card'>
          <p>セッション確認中...</p>
        </div>
      </div>
    );
  }

  return session ? (
    <NotesHome session={session} onLogoutSuccess={() => setSession(null)} />
  ) : (
    <AuthForm onLoginSuccess={(user) => setSession(user)} />
  );
}
