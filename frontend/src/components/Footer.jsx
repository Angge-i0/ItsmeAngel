import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com',   icon: GitHubIcon   },
  { label: 'LinkedIn', href: 'https://linkedin.com',  icon: LinkedInIcon },
  { label: 'Twitter',  href: 'https://twitter.com',   icon: TwitterIcon  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-surface-950">
      <div className="section-container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="text-center md:text-left">
          <Link to="/" className="font-display font-bold text-lg">
            <span className="gradient-text">&lt;Angel</span>
            <span className="text-slate-500">/&gt;</span>
          </Link>
          <p className="text-slate-500 text-sm mt-1">
            Full-Stack Developer · Designer · Builder
          </p>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 text-slate-500 hover:text-primary-400 transition-colors duration-200
                         hover:bg-primary-500/10 rounded-lg"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-slate-600 text-sm">
          © {year} Angel. Built with React & FastAPI.
        </p>
      </div>
    </footer>
  );
}

/* ── Inline SVG icons ───────────────────────────── */
function GitHubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.87 10.95.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.68 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.29-5.24-5.74 0-1.27.45-2.3 1.18-3.12-.12-.29-.51-1.48.11-3.08 0 0 .97-.31 3.17 1.19a10.9 10.9 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.19-1.5 3.16-1.19 3.16-1.19.63 1.6.23 2.79.12 3.08.74.82 1.18 1.85 1.18 3.12 0 4.46-2.7 5.44-5.27 5.73.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/>
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/>
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
