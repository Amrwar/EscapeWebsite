export default function SocialIcons({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`social-icons${large ? ' large' : ''}`}
      style={large ? undefined : { marginBottom: '1.7rem' }}
    >
      <a href="#" aria-label="Instagram">
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" />
        </svg>
      </a>
      <a href="#" aria-label="TikTok">
        <svg viewBox="0 0 24 24">
          <path d="M13.5 3v10.8a3.2 3.2 0 1 1-2.6-3.15" />
          <path d="M13.5 3c.3 2.4 2.1 4.3 4.5 4.6" />
        </svg>
      </a>
      <a href="#" aria-label="Facebook">
        <svg viewBox="0 0 24 24">
          <path d="M14.5 8.5h-2A1.5 1.5 0 0 0 11 10v2H9v3h2v6h3v-6h2l.4-3H14v-1.5c0-.6.4-1 1-1h1.5V6H15a3.5 3.5 0 0 0-3.5 3.5V10" />
        </svg>
      </a>
    </div>
  );
}
