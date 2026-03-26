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

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPreviewText(content) {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line);

  if (!firstLine) {
    return "本文はまだありません";
  }

  return firstLine;
}

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
    <main className='page'>
      <section className='card'>
        <h1>NOTE STACKS</h1>

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
      </section>
    </main>
  );
}

function NotesHome({ session, onLogoutSuccess }) {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadNotes = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await getNotes();
      const nextNotes = result.notes ?? [];
      setNotes(nextNotes);
      setSelectedNoteId((prev) => {
        if (nextNotes.length === 0) {
          return null;
        }

        if (prev && nextNotes.some((note) => note.id === prev)) {
          return prev;
        }

        return nextNotes[0].id;
      });
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
      setSelectedNoteId(result.note.id);
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
      setNotes((prev) => {
        const nextNotes = prev.filter((note) => note.id !== id);

        setSelectedNoteId((currentId) => {
          if (currentId !== id) {
            return currentId;
          }

          if (nextNotes.length === 0) {
            return null;
          }

          return nextNotes[0].id;
        });

        return nextNotes;
      });
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

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? notes[0] ?? null;

  return (
    <main className='notes-page'>
      <div className='notes-shell'>
        <article className='notes-column notes-column-left'>
          <section className='panel user-panel'>
            <h1>NOTE STACKS</h1>
            <p className='subtext'>ログイン中: {session.email}</p>

            <button onClick={handleLogout} disabled={loading}>
              ログアウト
            </button>
          </section>

          <section className='panel create-panel'>
            <button
              type='button'
              className='create-toggle'
              onClick={() => setIsCreateOpen((prev) => !prev)}
            >
              <h2>新規作成</h2>
              <span className='create-toggle-mark'>
                {isCreateOpen ? "閉じる" : "開く"}
              </span>
            </button>

            <div
              className={
                isCreateOpen ? "create-form-area open" : "create-form-area"
              }
            >
              <p className='panel-copy'>
                日常のアイデアやメモをさっと記録。シンプルなノートアプリで、思考を整理しましょう。
              </p>

              <input
                placeholder='タイトル'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder='本文'
                rows={8}
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
          </section>
        </article>

        <section className='notes-column notes-column-center'>
          <div className='panel list-panel'>
            <div className='list-header'>
              <div>
                <h2>一覧</h2>
                <p className='panel-copy'>{notes.length}件のノート</p>
              </div>
            </div>

            <div className='list-scroll'>
              {message && <p className='message'>{message}</p>}

              {notes.length === 0 ? (
                <p className='empty-text'>ノートがありません</p>
              ) : (
                <div className='notes-list'>
                  {notes.map((note) => {
                    const isActive = selectedNote?.id === note.id;

                    return (
                      <button
                        key={note.id}
                        type='button'
                        className={isActive ? "note-card active" : "note-card"}
                        onClick={() => setSelectedNoteId(note.id)}
                    >
                      <span className='note-date'>
                        {formatDate(note.updated_at)}
                      </span>
                      <strong className='note-title'>{note.title}</strong>
                      <span className='note-preview'>
                        {getPreviewText(note.content)}
                      </span>
                      <p className='note-content-mobile'>{note.content}</p>
                      <span className='note-action-mobile'>
                        <span
                          className='note-delete-button'
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(note.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              handleDelete(note.id);
                            }
                          }}
                          role='button'
                          tabIndex={0}
                        >
                          削除
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              )}
            </div>
          </div>
        </section>

        <section className='notes-column notes-column-right'>
          <div className='panel detail-panel'>
            <div className='detail-header'>
              <div>
                <p className='eyebrow'>Preview</p>
                <h2>{selectedNote ? selectedNote.title : "ノート詳細"}</h2>
              </div>

              {selectedNote ? (
                <button
                  onClick={() => handleDelete(selectedNote.id)}
                  disabled={loading}
                >
                  削除
                </button>
              ) : null}
            </div>

            {selectedNote ? (
              <div className='detail-body'>
                <p className='detail-date'>
                  最終更新: {formatDate(selectedNote.updated_at)}
                </p>
                <p className='detail-content'>{selectedNote.content}</p>
              </div>
            ) : (
              <p className='empty-text'>
                ノートを選ぶと、ここに内容が表示されます。
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
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
