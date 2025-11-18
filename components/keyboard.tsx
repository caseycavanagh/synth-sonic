'use client'

import { useEffect, useState } from 'react'
import * as Tone from 'tone'

interface KeyboardProps {
  synth: Tone.Synth
  activeSynths: Map<string, Tone.Synth>
  delay: Tone.Delay | null
}

const WHITE_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5']
const BLACK_NOTES: { [key: string]: string } = {
  'C#4': 'between-C4-D4',
  'D#4': 'between-D4-E4',
  'F#4': 'between-F4-G4',
  'G#4': 'between-G4-A4',
  'A#4': 'between-A4-B4',
  'C#5': 'between-C5-D5',
  'D#5': 'between-D5-E5',
}

const KEY_MAP: { [key: string]: string } = {
  'z': 'C4', 'x': 'D4', 'c': 'E4', 'v': 'F4',
  'b': 'G4', 'n': 'A4', 'm': 'B4', ',': 'C5', '.': 'D5', '/': 'E5',
  's': 'C#4', 'd': 'D#4', 'g': 'F#4', 'h': 'G#4', 'j': 'A#4', 'l': 'C#5', ';': 'D#5'
}

export function Keyboard({ synth, activeSynths, delay }: KeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (KEY_MAP[key] && !activeKeys.has(key)) {
        const note = KEY_MAP[key]
        playNote(note)
        setActiveKeys(prev => new Set(prev).add(key))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (KEY_MAP[key]) {
        const note = KEY_MAP[key]
        stopNote(note)
        setActiveKeys(prev => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [activeKeys])

  const playNote = (note: string) => {
    if (activeSynths.has(note)) return

    // Create a new Synth instance for this note
    const noteSynth = new Tone.Synth({
      oscillator: { type: synth.oscillator.type as any },
      envelope: synth.envelope as any,
    }).connect(delay || Tone.Destination)

    noteSynth.volume.value = synth.volume.value
    noteSynth.triggerAttack(note)
    
    activeSynths.set(note, noteSynth)
    setActiveNotes(prev => new Set(prev).add(note))
  }

  const stopNote = (note: string) => {
    const noteSynth = activeSynths.get(note)
    if (noteSynth) {
      noteSynth.triggerRelease()
      activeSynths.delete(note)
    }
    setActiveNotes(prev => {
      const newSet = new Set(prev)
      newSet.delete(note)
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      <label className="text-xs uppercase tracking-widest text-stone-600 font-medium">Piano Keyboard</label>
      <div className="flex justify-center">
        <div className="relative inline-block" style={{ perspective: '1000px' }}>
          {/* White keys container */}
          <div className="flex gap-0 bg-stone-900 p-2 rounded-b-2xl">
            {WHITE_NOTES.map((note) => {
              const key = Object.keys(KEY_MAP).find(k => KEY_MAP[k] === note && !k.match(/[sdghjl;]/))
              const isActive = activeNotes.has(note)
              
              return (
                <button
                  key={note}
                  onMouseDown={() => playNote(note)}
                  onMouseUp={() => stopNote(note)}
                  onMouseLeave={() => stopNote(note)}
                  className={`w-12 h-40 rounded-b-lg font-mono text-xs font-semibold transition-all duration-75 border border-stone-300 flex flex-col items-center justify-between p-2 ${
                    isActive
                      ? 'bg-stone-100 text-stone-900 shadow-md scale-y-95'
                      : 'bg-white text-stone-900 hover:bg-stone-50 active:scale-y-95'
                  }`}
                >
                  <span className="text-[10px] opacity-60">{key?.toUpperCase() || ''}</span>
                  <span className="font-mono text-sm font-bold">{note}</span>
                </button>
              )
            })}
          </div>

          {/* Black keys overlay */}
          <div className="absolute top-0 left-0 right-0 h-24 flex pointer-events-none" style={{ paddingLeft: '32px' }}>
            {Object.entries(BLACK_NOTES).map(([note, position], idx) => {
              const isActive = activeNotes.has(note)
              const keyPressed = Object.keys(KEY_MAP).find(k => KEY_MAP[k] === note)
              
              return (
                <div key={note} className="relative flex-1" style={{ marginRight: idx === 2 || idx === 5 ? '52px' : '0px' }}>
                  <button
                    onMouseDown={() => playNote(note)}
                    onMouseUp={() => stopNote(note)}
                    onMouseLeave={() => stopNote(note)}
                    className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-28 rounded-b-md font-mono text-xs font-bold transition-all duration-75 flex flex-col items-center justify-between p-1 pointer-events-auto z-10 ${
                      isActive
                        ? 'bg-stone-700 text-stone-100 shadow-lg scale-95'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    <span className="text-[8px] opacity-60">{keyPressed?.toUpperCase() || ''}</span>
                    <span className="text-xs">{note}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Keyboard guide */}
      <div className="text-center text-xs text-stone-500 mt-6">
        <p className="font-mono mb-2">Computer keyboard: Z-M for white keys • S, D, G, H, J, L, ; for black keys</p>
        <p className="text-[11px] opacity-60">Click keys or press keys to play</p>
      </div>
    </div>
  )
}
