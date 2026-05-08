const newsItems = [
  { id: 1, title: 'Cultura FM lidera audiência na região de Guaíra', category: 'Destaque', date: 'Hoje' },
  { id: 2, title: 'Barretos se prepara para a Festa do Peão 2026', category: 'Evento', date: 'Ontem' },
  { id: 3, title: 'Novas atrações confirmadas para o final de semana', category: 'Música', date: '2 dias atrás' },
  { id: 4, title: 'Entrevista exclusiva com o prefeito de Guaíra', category: 'Política', date: '3 dias atrás' },
];

export function News() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-3xl uppercase italic tracking-tighter">Notícias</h2>
        <p className="text-white/50 text-sm font-bold">Fique por dentro de tudo o que acontece</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {newsItems.map((item) => (
          <div key={item.id} className="glass rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-video bg-white/5 flex items-center justify-center relative">
              <span className="text-white/20 font-display text-2xl uppercase tracking-widest">Cultura FM</span>
              <div className="absolute top-3 left-3 bg-grad-mid px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold leading-snug line-clamp-2">{item.title}</h3>
              <p className="text-[10px] text-white/50 font-bold uppercase">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
