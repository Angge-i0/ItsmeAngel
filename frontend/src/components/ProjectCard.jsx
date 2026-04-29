import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single project card with image, tags, and links.
 * @param {Object} project - Project data from API
 */
export default function ProjectCard({ project, index = 0 }) {
  const {
    id,
    title,
    description,
    tags = [],
    image_url,
    github_url,
    live_url,
    featured,
  } = project;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-hover group flex flex-col overflow-hidden"
    >
      {/* Project image / placeholder */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-900/50 to-surface-800">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CodeBracketIcon className="w-16 h-16 text-primary-600/40" />
          </div>
        )}
        {featured && (
          <span className="absolute top-3 right-3 badge-success text-xs">⭐ Featured</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-display font-semibold text-lg text-white group-hover:text-primary-300
                       transition-colors duration-200 line-clamp-1">
          {title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 5).map((tag) => (
            <span key={tag} className="skill-tag text-xs px-2 py-0.5">{tag}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Link
            to={`/projects/${id}`}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium
                       transition-colors duration-200"
          >
            View Details →
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            )}
            {live_url && (
              <a
                href={live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="p-1.5 text-slate-500 hover:text-primary-400 hover:bg-primary-500/5 rounded-lg transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.87 10.95.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.68 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.29-5.24-5.74 0-1.27.45-2.3 1.18-3.12-.12-.29-.51-1.48.11-3.08 0 0 .97-.31 3.17 1.19a10.9 10.9 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.19-1.5 3.16-1.19 3.16-1.19.63 1.6.23 2.79.12 3.08.74.82 1.18 1.85 1.18 3.12 0 4.46-2.7 5.44-5.27 5.73.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/>
    </svg>
  );
}
