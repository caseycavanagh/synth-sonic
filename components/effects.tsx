interface EffectsProps {
  reverbWet: number
  delayWet: number
  onReverbChange: (wet: number) => void
  onDelayChange: (wet: number) => void
}

export function Effects({ reverbWet, delayWet, onReverbChange, onDelayChange }: EffectsProps) {
  return (
    <div className="space-y-4">
      <label className="text-xs uppercase tracking-widest text-stone-600 font-medium">Effects</label>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-stone-700">Reverb</span>
            <span className="text-xs text-stone-500">{(reverbWet * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbWet}
            onChange={(e) => onReverbChange(Number(e.target.value))}
            className="w-full h-1 bg-stone-300 rounded-full appearance-none cursor-pointer accent-stone-900"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-stone-700">Delay</span>
            <span className="text-xs text-stone-500">{(delayWet * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={delayWet}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="w-full h-1 bg-stone-300 rounded-full appearance-none cursor-pointer accent-stone-900"
          />
        </div>
      </div>
    </div>
  )
}
