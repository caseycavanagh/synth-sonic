'use client'

import { useEffect, useState, useRef } from 'react'
import * as Tone from 'tone'
import { Keyboard } from '@/components/keyboard'
import { Oscillator } from '@/components/oscillator'
import { Envelope } from '@/components/envelope'
import { Effects } from '@/components/effects'

export default function Home() {
  const synthRef = useRef<Tone.Synth | null>(null)
  const activeSynthsRef = useRef<Map<string, Tone.Synth>>(new Map())
  const reverbRef = useRef<Tone.Reverb | null>(null)
  const delayRef = useRef<Tone.Delay | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [oscType, setOscType] = useState<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine')
  const [volume, setVolume] = useState(-12)
  const [adsr, setAdsr] = useState({ attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 })
  const [reverbWet, setReverbWet] = useState(0.3)
  const [delayWet, setDelayWet] = useState(0)

  useEffect(() => {
    const initSynth = async () => {
      await Tone.start()

      const reverb = new Tone.Reverb(2)
      const delay = new Tone.Delay(0.5)

      // Set initial wet/dry mix values
      reverb.wet.value = reverbWet
      delay.wet.value = delayWet

      reverb.toDestination()
      delay.connect(reverb)

      const synth = new Tone.Synth({
        oscillator: { type: oscType },
        envelope: adsr,
      }).connect(delay)

      synth.volume.value = volume

      synthRef.current = synth
      reverbRef.current = reverb
      delayRef.current = delay
      setInitialized(true)
    }

    initSynth()

    return () => {
      activeSynthsRef.current.forEach(synth => synth.dispose())
      activeSynthsRef.current.clear()
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      if (reverbRef.current) {
        reverbRef.current.dispose()
      }
      if (delayRef.current) {
        delayRef.current.dispose()
      }
    }
  }, [])

  const updateSynth = (key: string, value: any) => {
    if (!synthRef.current) return

    switch (key) {
      case 'oscType':
        synthRef.current.set({ oscillator: { type: value } })
        setOscType(value)
        break
      case 'volume':
        synthRef.current.volume.value = value
        setVolume(value)
        break
      case 'adsr':
        synthRef.current.set({ envelope: value })
        setAdsr(value)
        break
      case 'reverbWet':
        if (reverbRef.current) {
          reverbRef.current.wet.value = value
        }
        setReverbWet(value)
        break
      case 'delayWet':
        if (delayRef.current) {
          delayRef.current.wet.value = value
        }
        setDelayWet(value)
        break
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-slate-50 to-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-stone-200 px-8 py-6 bg-gradient-to-r from-stone-50 to-transparent">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight text-stone-900">SONIC</h1>
              <p className="text-xs uppercase tracking-widest text-stone-500">Digital Synthesizer</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* Master Controls */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-stone-600 font-medium">Master Volume</label>
              <input
                type="range"
                min="-60"
                max="0"
                value={volume}
                onChange={(e) => updateSynth('volume', Number(e.target.value))}
                className="w-full h-1 bg-stone-300 rounded-full appearance-none cursor-pointer accent-stone-900"
              />
              <div className="text-xs text-stone-500">{volume} dB</div>
            </div>

            {/* Oscillator Section */}
            <Oscillator 
              oscType={oscType} 
              onOscTypeChange={(type) => updateSynth('oscType', type)}
            />

            {/* Envelope Section */}
            <Envelope 
              adsr={adsr}
              onAdsrChange={(newAdsr) => updateSynth('adsr', newAdsr)}
            />

            {/* Effects Section */}
            <Effects
              reverbWet={reverbWet}
              delayWet={delayWet}
              onReverbChange={(wet) => updateSynth('reverbWet', wet)}
              onDelayChange={(wet) => updateSynth('delayWet', wet)}
            />

            {/* Keyboard */}
            {initialized && synthRef.current && (
              <Keyboard 
                synth={synthRef.current}
                activeSynths={activeSynthsRef.current}
                delay={delayRef.current}
              />
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-stone-200 px-8 py-4 bg-stone-50 text-xs text-stone-500 text-center">
            Click keys to play • Use computer keyboard for notes
          </div>
        </div>
      </div>
    </main>
  )
}
