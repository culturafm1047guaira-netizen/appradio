export function Contact() {
  const socialLinks = [
    { 
      label: 'Instagram', 
      url: 'https://www.instagram.com/culturafm104.7/',
      color: 'hover:text-pink-500',
      icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    },
    { 
      label: 'Facebook', 
      url: 'https://www.facebook.com/radioculturadeguaira',
      color: 'hover:text-blue-500',
      icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    },
    { 
      label: 'YouTube', 
      url: 'https://www.youtube.com/@CulturaFMGuaira-SP',
      color: 'hover:text-red-500',
      icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.4 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="font-display text-3xl uppercase italic tracking-tighter">Contato</h2>
        <p className="text-white/50 text-sm font-bold">Peça sua música e participe ao vivo</p>
      </header>

      <div className="space-y-4">
        {/* Botão Principal - Peça sua Música */}
        <a 
          href="https://wa.me/551733311155" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20bd5c] text-white p-6 rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-95 group"
        >
          <span className="text-[10px] font-black tracking-[0.3em] opacity-80 uppercase">Peça sua Música</span>
          <span className="text-xl font-display italic tracking-tighter">(17) 3331-1155</span>
        </a>

        {/* Links Sociais */}
        <div className="grid grid-cols-3 gap-3">
          {socialLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${link.color} active:scale-90`}
            >
              <link.icon className="w-6 h-6" />
              <span className="text-[9px] font-black uppercase tracking-tighter">{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Informações Administrativas e Localização */}
      <div className="glass p-6 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-grad-mid/10 blur-3xl -z-10" />
        
        <div>
          <h4 className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-grad-mid mb-2">Localização</h4>
          <p className="text-sm text-white/80 leading-relaxed font-bold">
            Av. 15, nº 225 – Centro<br />
            Guaíra - SP
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/5">
          <div>
            <h4 className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-grad-mid mb-1">WhatsApp Administrativo</h4>
            <p className="text-sm font-bold text-white/90">(17) 3331-1177</p>
          </div>
          <div>
            <h4 className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-grad-mid mb-1">E-mail</h4>
            <p className="text-sm font-bold text-white/90 break-all">radioculturadeguaira@gmail.com</p>
          </div>
        </div>
        
        <div className="pt-4 text-center">
          <p className="text-2xl font-display text-white italic tracking-tighter">104.7 FM</p>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Cultura FM Guaíra</p>
        </div>
      </div>
    </div>
  );
}
