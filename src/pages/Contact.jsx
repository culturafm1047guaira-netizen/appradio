const svg = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const WhatsAppIcon = () => (
  <svg {...svg} width="28" height="28">
    <path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8 19.4z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.9.7a3.5 3.5 0 0 1-1.6-1.6l.7-.9-1-2z" />
  </svg>
);

const socialLinks = [
  {
    label: 'Instagram',
    handle: '@culturafm104.7',
    url: 'https://www.instagram.com/culturafm104.7/',
    icon: (
      <svg {...svg}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    handle: 'radioculturadeguaira',
    url: 'https://www.facebook.com/radioculturadeguaira',
    icon: (
      <svg {...svg}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    handle: '@CulturaFMGuaira-SP',
    url: 'https://www.youtube.com/@CulturaFMGuaira-SP',
    icon: (
      <svg {...svg}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.4 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

const ChevronIcon = () => (
  <svg {...svg} width="20" height="20" className="text-mute">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export function Contact({ metadata }) {
  const nowPlaying = metadata?.title
    ? [metadata.artist, metadata.title].filter(Boolean).join(' - ')
    : '';
  const whatsappText = `Olá, Cultura FM! Gostaria de pedir uma música.${
    nowPlaying ? ` (Estou ouvindo: ${nowPlaying})` : ''
  }`;
  const whatsappUrl = `https://wa.me/551733311155?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-5xl font-extrabold leading-none text-dial">Fale com a gente</h1>
        <p className="mt-2 text-mute">Peça sua música e participe da programação ao vivo.</p>
      </header>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-2xl bg-[#128c4a] px-5 py-4 text-white transition-transform active:scale-[0.98]"
      >
        <WhatsAppIcon />
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-bold">Pedir uma música</span>
          <span className="text-sm opacity-90">WhatsApp (17) 3331-1155</span>
        </span>
      </a>

      <section aria-labelledby="redes">
        <h2 id="redes" className="font-display text-2xl font-bold">Redes sociais</h2>
        <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 py-4 transition-colors hover:text-dial"
              >
                {link.icon}
                <span className="flex-1 leading-tight">
                  <span className="block font-semibold">{link.label}</span>
                  <span className="block text-sm text-mute">{link.handle}</span>
                </span>
                <ChevronIcon />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="onde">
        <h2 id="onde" className="font-display text-2xl font-bold">Onde estamos</h2>
        <address className="mt-2 not-italic text-ink/90 leading-relaxed">
          Av. 15, nº 225, Centro
          <br />
          Guaíra, SP
        </address>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm text-mute">Administrativo (WhatsApp)</dt>
            <dd>
              <a className="font-semibold underline-offset-4 hover:underline" href="tel:+551733311177">
                (17) 3331-1177
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-mute">E-mail</dt>
            <dd>
              <a
                className="font-semibold break-all underline-offset-4 hover:underline"
                href="mailto:radioculturadeguaira@gmail.com"
              >
                radioculturadeguaira@gmail.com
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
