interface EnvelopeProps {
  adsr: { attack: number; decay: number; sustain: number; release: number }
  onAdsrChange: (adsr: { attack: number; decay: number; sustain: number; release: number }) => void
}

export function Envelope({ adsr, onAdsrChange }: EnvelopeProps) {
  const handleChange = (key: keyof typeof adsr, value: number) => {
    onAdsrChange({ ...adsr, [key]: value })
  }

  return (
    <div className="space-y-4 pb-4 border-b border-stone-200">
      <label className="text-xs uppercase tracking-widest text-stone-600 font-medium">ADSR Envelope</label>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Attack', key: 'attack', max: 1 },
          { label: 'Decay', key: 'decay', max: 2 },
          { label: 'Sustain', key: 'sustain', max: 1 },
          { label: 'Release', key: 'release', max: 3 },
        ].map(param => (
          <div key={param.key} className="space-y-2">
            <label className="text-xs text-stone-600 font-medium">{param.label}</label>
            <input
              type="range"
              min="0"
              max={param.max}
              step="0.01"
              value={adsr[param.key as keyof typeof adsr]}
              onChange={(e) => handleChange(param.key as keyof typeof adsr, Number(e.target.value))}
              className="w-full h-1 bg-stone-300 rounded-full appearance-none cursor-pointer accent-stone-900"
            />
            <div className="text-xs text-stone-500 text-center">
              {(adsr[param.key as keyof typeof adsr] * 1000).toFixed(0)}ms
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
