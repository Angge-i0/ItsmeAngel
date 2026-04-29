import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { projectsAPI } from '../lib/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    projectsAPI.getOne(id)
      .then(({ data }) => setProject(data))
      .catch((err) => {
        setError(err.response?.status === 404 ? 'Project not found.' : 'Failed to load project.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-950 gap-4">
        <p className="text-slate-400 text-lg">{error || 'Project not found.'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">← Back Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="section-container">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero image */}
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-72 object-cover rounded-2xl mb-8 border border-white/5"
              />
            ) : (
              <div className="w-full h-72 rounded-2xl mb-8 flex items-center justify-center
                              bg-gradient-to-br from-primary-900/40 to-surface-800 border border-white/5">
                <CodeBracketIcon className="w-24 h-24 text-primary-600/40" />
              </div>
            )}

            {/* Title & meta */}
            <div className="flex flex-wrap items-start gap-4 mb-6">
              <div className="flex-1">
                <h1 className="font-display text-4xl font-bold text-white mb-2">{project.title}</h1>
                {project.featured && <span className="badge-success">⭐ Featured Project</span>}
              </div>

              {/* Action links */}
              <div className="flex gap-3">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                     className="btn-secondary text-sm py-2">
                    <GitHubIcon className="w-4 h-4" /> GitHub
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                     className="btn-primary text-sm py-2">
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(project.tags || []).map((tag) => (
                <span key={tag} className="skill-tag">{tag}</span>
              ))}
            </div>

            {/* Description */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="font-display text-xl font-semibold text-white mb-4">About this project</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {project.long_description || project.description}
              </p>
            </div>
          </motion.article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.87 10.95.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.68 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.29-5.24-5.74 0-1.27.45-2.3 1.18-3.12-.12-.29-.51-1.48.11-3.08 0 0 .97-.31 3.17 1.19a10.9 10.9 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.19-1.5 3.16-1.19 3.16-1.19.63 1.6.23 2.79.12 3.08.74.82 1.18 1.85 1.18 3.12 0 4.46-2.7 5.44-5.27 5.73.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/>
    </svg>
  );
}
