import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ContactForm from '../components/ContactForm';
import { projectsAPI, skillsAPI } from '../lib/api';

/* ── Fallback data shown before API loads ───────── */
const FALLBACK_SKILLS = [
  { id: 1, name: 'React',      category: 'frontend' },
  { id: 2, name: 'TypeScript', category: 'frontend' },
  { id: 3, name: 'TailwindCSS',category: 'frontend' },
  { id: 4, name: 'FastAPI',    category: 'backend'  },
  { id: 5, name: 'Python',     category: 'backend'  },
  { id: 6, name: 'PostgreSQL', category: 'database' },
  { id: 7, name: 'Docker',     category: 'devops'   },
  { id: 8, name: 'Git',        category: 'devops'   },
];

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A full-stack portfolio with React frontend and FastAPI backend, featuring JWT authentication, admin dashboard, and PostgreSQL database.',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'Docker'],
    featured: true,
    github_url: 'https://github.com',
    live_url: null,
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, team workspaces, and advanced filtering.',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    featured: false,
    github_url: 'https://github.com',
    live_url: null,
  },
  {
    id: 3,
    title: 'AI Chat Interface',
    description: 'A modern chat interface integrating multiple AI models, featuring conversation history, streaming responses, and markdown rendering.',
    tags: ['Next.js', 'OpenAI', 'Vercel', 'Prisma'],
    featured: true,
    github_url: 'https://github.com',
    live_url: null,
  },
];

const SKILL_CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'DevOps'];

export default function LandingPage() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [skills,   setSkills]   = useState(FALLBACK_SKILLS);
  const [skillFilter, setSkillFilter] = useState('All');

  useEffect(() => {
    projectsAPI.getAll()
      .then(({ data }) => { if (data?.length) setProjects(data); })
      .catch(() => { /* keep fallback */ });

    skillsAPI.getAll()
      .then(({ data }) => { if (data?.length) setSkills(data); })
      .catch(() => { /* keep fallback */ });
  }, []);

  const filteredSkills = skillFilter === 'All'
    ? skills
    : skills.filter((s) => s.category?.toLowerCase() === skillFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100">
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern"
      >
        {/* Background orbs */}
        <div className="orb orb-purple w-[600px] h-[600px] -top-32 -left-32" />
        <div className="orb orb-pink   w-[400px] h-[400px] top-1/2 right-0 translate-x-1/4" />
        <div className="orb orb-blue   w-[300px] h-[300px] bottom-0 left-1/2" />

        <div className="section-container text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge mb-6 inline-block animate-float">
              👋 Available for opportunities
            </span>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-tight mb-6">
              Hi, I'm{' '}
              <span className="gradient-text">Angel</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 font-light">
              A <span className="text-primary-400 font-medium">Full-Stack Developer</span> crafting
              beautiful, performant web experiences with modern technologies.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-base px-8 py-4"
                id="hero-projects-btn"
              >
                View My Work
              </button>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-base px-8 py-4"
                id="hero-contact-btn"
              >
                Contact Me
              </button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ArrowDownIcon className="w-6 h-6 text-slate-500" />
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────── */}
      <section id="about" className="py-24 relative">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">
              Passionate about building products that make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <p className="text-slate-300 text-lg leading-relaxed">
                I'm a full-stack developer with a passion for creating elegant solutions to
                complex problems. With expertise in modern JavaScript/TypeScript and Python
                ecosystems, I build scalable web applications from concept to deployment.
              </p>
              <p className="text-slate-400 leading-relaxed">
                When I'm not coding, I enjoy exploring new technologies, contributing to
                open source, and sharing knowledge with the developer community.
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPinIcon className="w-4 h-4 text-primary-400" />
                <span>Philippines</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <EnvelopeIcon className="w-4 h-4 text-primary-400" />
                <span>angel@example.com</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '3+',  label: 'Years Experience' },
                { value: '20+', label: 'Projects Completed' },
                { value: '15+', label: 'Technologies' },
                { value: '10+', label: 'Happy Clients' },
              ].map(({ value, label }) => (
                <div key={label} className="glass p-6 text-center rounded-2xl">
                  <p className="font-display text-4xl font-bold gradient-text mb-1">{value}</p>
                  <p className="text-slate-400 text-sm">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────── */}
      <section id="skills" className="py-24 bg-surface-900/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Skills & Technologies</h2>
            <p className="section-subtitle">Tools I use to bring ideas to life</p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSkillFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  skillFilter === cat
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white border border-white/10 hover:border-primary-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skill grid */}
          <motion.div
            layout
            className="flex flex-wrap justify-center gap-3"
          >
            {filteredSkills.map((skill, i) => (
              <motion.span
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="skill-tag text-base px-4 py-2"
              >
                {skill.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────── */}
      <section id="projects" className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">A selection of work I'm proud of</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────── */}
      <section id="contact" className="py-24 bg-surface-900/30 relative overflow-hidden">
        <div className="orb orb-purple w-[400px] h-[400px] bottom-0 right-0 translate-x-1/2" />

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
