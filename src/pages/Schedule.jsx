const programs = [
  { time: '08:00', name: 'Manhã Cultura', host: 'João Silva', current: true },
  { time: '10:00', name: 'Hits do Momento', host: 'Ana Costa', current: false },
  { time: '12:00', name: 'Jornal 104', host: 'Equipe de Jornalismo', current: false },
  { time: '14:00', name: 'Tarde Show', host: 'Beto Oliveira', current: false },
  { time: '18:00', name: 'A Hora do Rock', host: 'Carla Dias', current: false },
];

export function Schedule() {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date().getDay();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-3xl uppercase italic tracking-tighter">Programação</h2>
        <p className="text-white/50 text-sm font-bold">Confira os horários da sua rádio favorita</p>
      </header>

      {/* Tabs de dias simplificadas */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {days.map((day, i) => (
          <button 
            key={i} 
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
              i === today ? 'bg-grad-mid text-white' : 'glass text-white/40'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {programs.map((prog, i) => (
          <div 
            key={i}
            className={`glass p-4 rounded-2xl flex items-center gap-4 transition-all ${
              prog.current ? 'border-grad-mid bg-white/10 ring-1 ring-grad-mid/50' : ''
            }`}
          >
            <div className={`text-xl font-display ${prog.current ? 'text-grad-mid' : 'text-white/50'}`}>
              {prog.time}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight">{prog.name}</h3>
              <p className="text-xs text-white/50 font-bold uppercase tracking-widest">{prog.host}</p>
            </div>
            {prog.current && (
              <span className="bg-grad-mid px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter">
                No Ar
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
