interface OscillatorProps {
  oscType: 'sine' | 'square' | 'triangle' | 'sawtooth'
  onOscTypeChange: (type: 'sine' | 'square' | 'triangle' | 'sawtooth') => void
}

const OSC_TYPES = [
  { id: 'sine', label: 'Sine', description: 'Smooth, pure tone' },
  { id: 'square', label: 'Square', description: 'Hollow, retro sound' },
  { id: 'triangle', label: 'Triangle', description: 'Warm, soft tone' },
  { id: 'sawtooth', label: 'Saw', description: 'Bright, harsh tone' },
] as const

export function Oscillator({ oscType, onOscTypeChange }: OscillatorProps) {
  return (
    <div className="space-y-4 pb-4 border-b border-stone-200">
      <label className="text-xs uppercase tracking-widest text-stone-600 font-medium">Oscillator</label>
      <div className="grid grid-cols-2 gap-3">
        {OSC_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => onOscTypeChange(type.id as any)}
            className={`p-4 rounded-lg text-left transition-all ${
              oscType === type.id
                ? 'bg-stone-900 text-white border border-stone-800'
                : 'bg-stone-100 text-stone-900 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            <div className="font-medium text-sm">{type.label}</div>
            <div className="text-xs opacity-75 mt-1">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
