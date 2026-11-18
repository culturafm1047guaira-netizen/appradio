import { useState } from 'react';
import { track } from '@vercel/analytics';
import { buildWhatsAppUrl } from '../lib/songRequest';

const STORAGE_KEY = 'cultura-fm-pedido';

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      name: saved.name || '',
      city: saved.city || '',
      neighborhood: saved.neighborhood || '',
    };
  } catch {
    return { name: '', city: '', neighborhood: '' };
  }
}

function save({ name, city, neighborhood }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, city, neighborhood }));
  } catch {
    // armazenamento indisponível: segue sem lembrar os dados
  }
}

const inputClass =
  'mt-1.5 w-full h-12 rounded-xl border border-white/20 bg-night-2 px-4 text-base text-ink placeholder:text-mute/70';

function Field({ label, optional, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-mute"> (opcional)</span>}
      </span>
      {children}
    </label>
  );
}

export function SongRequestForm({ nowPlaying, onCancel }) {
  const [fields, setFields] = useState(() => ({
    ...loadSaved(),
    song: '',
    dedication: '',
  }));

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    save(fields);
    track('pedido_musica');
    window.open(buildWhatsAppUrl(fields, nowPlaying), '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/15 bg-night-2/60 p-5">
      <Field label="Seu nome">
        <input className={inputClass} value={fields.name} onChange={set('name')} required autoComplete="name" />
      </Field>
      <Field label="Música e cantor">
        <input
          className={inputClass}
          value={fields.song}
          onChange={set('song')}
          required
          placeholder="Ex.: Evidências - Chitãozinho"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cidade">
          <input className={inputClass} value={fields.city} onChange={set('city')} required autoComplete="address-level2" />
        </Field>
        <Field label="Bairro" optional>
          <input className={inputClass} value={fields.neighborhood} onChange={set('neighborhood')} />
        </Field>
      </div>
      <Field label="Dedicatória" optional>
        <textarea
          className={`${inputClass} h-24 py-3 resize-none`}
          value={fields.dedication}
          onChange={set('dedication')}
          maxLength={200}
          placeholder="Para quem é e o que quer dizer"
        />
      </Field>

      <button
        type="submit"
        className="w-full h-12 rounded-xl bg-[#128c4a] text-white text-base font-bold transition-transform active:scale-[0.98]"
      >
        Enviar pelo WhatsApp
      </button>
      <button type="button" onClick={onCancel} className="w-full h-11 text-sm font-semibold text-mute">
        Cancelar
      </button>
    </form>
  );
}
