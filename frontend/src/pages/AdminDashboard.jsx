import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HomeIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, skillsAPI, messagesAPI } from '../lib/api';

/* ── Sidebar navigation ──────────────────────────── */
const NAV_ITEMS = [
  { path: '/admin',          label: 'Overview',  icon: HomeIcon              },
  { path: '/admin/projects', label: 'Projects',  icon: FolderIcon             },
  { path: '/admin/skills',   label: 'Skills',    icon: WrenchScrewdriverIcon  },
  { path: '/admin/messages', label: 'Messages',  icon: EnvelopeIcon           },
];

/* ═══════════════════════════════════════════════════
   ROOT DASHBOARD LAYOUT
═══════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* ── Mobile overlay ─────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 z-30 bg-surface-900/80 backdrop-blur-xl
                    border-r border-white/5 flex flex-col transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
          <Link to="/" className="font-display font-bold text-lg">
            <span className="gradient-text">&lt;Angel</span>
            <span className="text-slate-500">/&gt;</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User chip */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-600/30 flex items-center justify-center
                            text-primary-300 font-semibold text-sm">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.username || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-200 ${
                              active
                                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center px-6 border-b border-white/5 bg-surface-950/50 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-1.5 text-slate-400 hover:text-white"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-white text-lg">Admin Dashboard</h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index     element={<Overview />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills"   element={<SkillsManager />} />
            <Route path="messages" element={<MessagesManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════ */
function Overview() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([projectsAPI.getAll(), skillsAPI.getAll(), messagesAPI.getAll()])
      .then(([p, s, m]) => {
        const msgs = m.data || [];
        setStats({
          projects: p.data?.length || 0,
          skills:   s.data?.length || 0,
          messages: msgs.length,
          unread:   msgs.filter((msg) => !msg.is_read).length,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Projects',  value: stats.projects, color: 'primary',  path: '/admin/projects' },
    { label: 'Skills Listed',   value: stats.skills,   color: 'blue',     path: '/admin/skills'   },
    { label: 'Total Messages',  value: stats.messages, color: 'emerald',  path: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unread,   color: 'amber',    path: '/admin/messages' },
  ];

  const colorMap = {
    primary: 'from-primary-900/40  border-primary-500/20  text-primary-400',
    blue:    'from-blue-900/40     border-blue-500/20     text-blue-400',
    emerald: 'from-emerald-900/40  border-emerald-500/20  text-emerald-400',
    amber:   'from-amber-900/40    border-amber-500/20    text-amber-400',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-1">Overview</h2>
        <p className="text-slate-400">Welcome to your portfolio admin panel.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, color, path }) => (
          <Link
            key={label}
            to={path}
            className={`glass p-6 rounded-2xl border bg-gradient-to-br to-transparent
                        hover:scale-[1.02] transition-all duration-200 ${colorMap[color]}`}
          >
            <p className={`text-4xl font-display font-bold mb-1`}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="glass p-6 rounded-2xl">
        <h3 className="font-display font-semibold text-white mb-3">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/" target="_blank" className="btn-secondary text-sm py-2">
            View Portfolio ↗
          </Link>
          <Link to="/admin/projects" className="btn-ghost text-sm">Manage Projects</Link>
          <Link to="/admin/skills"   className="btn-ghost text-sm">Manage Skills</Link>
          <Link to="/admin/messages" className="btn-ghost text-sm">View Messages</Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS MANAGER
═══════════════════════════════════════════════════ */
function ProjectsManager() {
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null); // null = create, object = edit

  const fetchProjects = () => {
    setLoading(true);
    projectsAPI.getAll()
      .then(({ data }) => setProjects(data || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit   = (p) => { setEditing(p);   setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsAPI.remove(id);
      toast.success('Project deleted');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleSaved = (project) => {
    setProjects((prev) =>
      editing
        ? prev.map((p) => (p.id === project.id ? project : p))
        : [...prev, project],
    );
    setModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Projects</h2>
        <button onClick={openCreate} className="btn-primary text-sm">
          <PlusIcon className="w-4 h-4" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center text-slate-500">
          No projects yet. Click <strong className="text-primary-400">New Project</strong> to add one.
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass p-5 rounded-2xl flex flex-wrap gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{p.title}</h3>
                  {p.featured && <span className="badge-success text-xs">Featured</span>}
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(p.tags || []).slice(0, 5).map((t) => (
                    <span key={t} className="skill-tag text-xs px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="btn-ghost text-sm py-1.5">
                  <PencilIcon className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn-danger text-sm py-1.5">
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        open={modalOpen}
        project={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </motion.div>
  );
}

function ProjectModal({ open, project, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '', description: '', long_description: '',
      tags: '', github_url: '', live_url: '', image_url: '', featured: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(project
        ? { ...project, tags: (project.tags || []).join(', ') }
        : { title: '', description: '', long_description: '', tags: '', github_url: '', live_url: '', image_url: '', featured: false },
      );
    }
  }, [open, project, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    const payload = {
      ...data,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: Boolean(data.featured),
    };
    try {
      const res = project
        ? await projectsAPI.update(project.id, payload)
        : await projectsAPI.create(payload);
      toast.success(project ? 'Project updated' : 'Project created');
      onSaved(res.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project' : 'Create Project'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Title" id="proj-title" error={errors.title?.message}>
          <input id="proj-title" className="input-field" placeholder="My Awesome Project"
            {...register('title', { required: 'Title is required', maxLength: { value: 200, message: 'Max 200 chars' } })} />
        </Field>

        <Field label="Short Description" id="proj-desc" error={errors.description?.message}>
          <textarea id="proj-desc" rows={3} className="input-field resize-none"
            placeholder="Brief description shown on cards…"
            {...register('description', { required: 'Description is required' })} />
        </Field>

        <Field label="Full Description" id="proj-ldesc">
          <textarea id="proj-ldesc" rows={5} className="input-field resize-none"
            placeholder="Detailed description shown on project page…"
            {...register('long_description')} />
        </Field>

        <Field label="Tags (comma-separated)" id="proj-tags">
          <input id="proj-tags" className="input-field" placeholder="React, FastAPI, Docker"
            {...register('tags')} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="GitHub URL" id="proj-gh">
            <input id="proj-gh" type="url" className="input-field" placeholder="https://github.com/..."
              {...register('github_url')} />
          </Field>
          <Field label="Live URL" id="proj-live">
            <input id="proj-live" type="url" className="input-field" placeholder="https://..."
              {...register('live_url')} />
          </Field>
        </div>

        <Field label="Image URL" id="proj-img">
          <input id="proj-img" type="url" className="input-field" placeholder="https://..."
            {...register('image_url')} />
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-primary-500" {...register('featured')} />
          <span className="text-sm text-slate-300">Featured project</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><CheckIcon className="w-4 h-4" /> Save</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════
   SKILLS MANAGER
═══════════════════════════════════════════════════ */
const CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'other'];

function SkillsManager() {
  const [skills,    setSkills]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);

  const fetchSkills = () => {
    setLoading(true);
    skillsAPI.getAll()
      .then(({ data }) => setSkills(data || []))
      .catch(() => toast.error('Failed to load skills'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await skillsAPI.remove(id);
      toast.success('Skill deleted');
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  const handleSaved = (skill) => {
    setSkills((prev) =>
      editing
        ? prev.map((s) => (s.id === skill.id ? skill : s))
        : [...prev, skill],
    );
    setModalOpen(false);
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Skills</h2>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary text-sm">
          <PlusIcon className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => (
            grouped[cat].length > 0 && (
              <div key={cat}>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                  {cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {grouped[cat].map((skill) => (
                    <div key={skill.id}
                         className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg group">
                      <span className="text-slate-300 text-sm">{skill.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditing(skill); setModalOpen(true); }}
                                className="text-slate-500 hover:text-primary-400 transition-colors">
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(skill.id)}
                                className="text-slate-500 hover:text-red-400 transition-colors">
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          {skills.length === 0 && (
            <div className="glass p-12 rounded-2xl text-center text-slate-500">
              No skills added yet.
            </div>
          )}
        </div>
      )}

      <SkillModal
        open={modalOpen}
        skill={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </motion.div>
  );
}

function SkillModal({ open, skill, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset(skill || { name: '', category: 'frontend', level: 80 });
  }, [open, skill, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = skill
        ? await skillsAPI.update(skill.id, data)
        : await skillsAPI.create(data);
      toast.success(skill ? 'Skill updated' : 'Skill added');
      onSaved(res.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={skill ? 'Edit Skill' : 'Add Skill'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Skill Name" id="skill-name" error={errors.name?.message}>
          <input id="skill-name" className="input-field" placeholder="e.g. React"
            {...register('name', { required: 'Name is required', maxLength: { value: 100, message: 'Max 100 chars' } })} />
        </Field>

        <Field label="Category" id="skill-cat" error={errors.category?.message}>
          <select id="skill-cat" className="input-field"
            {...register('category', { required: 'Category is required' })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </Field>

        <Field label="Proficiency Level (0–100)" id="skill-level">
          <input id="skill-level" type="number" min={0} max={100} className="input-field"
            {...register('level', { min: 0, max: 100 })} />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><CheckIcon className="w-4 h-4" /> Save</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════
   MESSAGES MANAGER
═══════════════════════════════════════════════════ */
function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    messagesAPI.getAll()
      .then(({ data }) => setMessages(data || []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (msg) => {
    if (msg.is_read) return;
    try {
      await messagesAPI.markRead(msg.id);
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
      if (selected?.id === msg.id) setSelected({ ...msg, is_read: true });
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await messagesAPI.remove(id);
      toast.success('Message deleted');
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-white">
        Messages
        {messages.filter((m) => !m.is_read).length > 0 && (
          <span className="ml-2 badge text-xs">
            {messages.filter((m) => !m.is_read).length} unread
          </span>
        )}
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center text-slate-500">No messages yet.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* List */}
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); handleMarkRead(msg); }}
                className={`glass p-4 rounded-xl cursor-pointer transition-all duration-200 border
                            ${selected?.id === msg.id
                              ? 'border-primary-500/50 bg-primary-500/5'
                              : 'border-white/5 hover:border-white/10'}
                            ${!msg.is_read ? 'border-l-2 border-l-primary-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${!msg.is_read ? 'text-white' : 'text-slate-300'}`}>
                      {msg.name}
                    </p>
                    <p className="text-slate-500 text-xs truncate">{msg.email}</p>
                    <p className="text-slate-400 text-xs mt-1 truncate">{msg.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-slate-600 text-xs">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-white">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`}
                     className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    {selected.email}
                  </a>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="btn-danger text-xs py-1.5">
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              </div>
              <p className="text-sm font-medium text-slate-300 mb-3">{selected.subject}</p>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
              <p className="text-slate-600 text-xs mt-4">
                Received: {new Date(selected.created_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="glass p-6 rounded-2xl flex items-center justify-center text-slate-600 text-sm">
              Select a message to read
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED: Modal + Field
═══════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-lg
                     max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-display font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="input-label">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
