import React, { useState } from 'react';
import {
  Mic,
  Play,
  Pause,
  Sparkles,
  Volume2,
  Sliders,
  FileAudio,
  Download,
  Languages,
  CheckCircle2,
  RefreshCw,
  Gift,
  Star,
} from 'lucide-react';
import { VOICE_LIBRARY } from '../data/mockData';
import { VoiceConfig } from '../types/mailforge';
import { voiceEngine } from '../utils/audioPlayer';

export const VoiceStudio: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'urdu'>('urdu');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfig>(
    VOICE_LIBRARY.find((v) => v.id === 'voice-m-shehryar-ur') || VOICE_LIBRARY[6]
  );

  const [scriptMode, setScriptMode] = useState<'user' | 'ai'>('ai');
  const [voiceScript, setVoiceScript] = useState(
    'Assalam-o-Alaikum, main Shehryar Alvi baat kar raha hoon. Aap ke enterprise scale ke liye hamara deliverability model 100% verified primary inbox placement provide karta hai. Aayein is par guftagu karein.'
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const filteredVoices = VOICE_LIBRARY.filter((v) => {
    if (v.language !== selectedLanguage) return false;
    if (selectedGender !== 'all' && v.gender !== selectedGender) return false;
    return true;
  });

  const handlePlayVoice = (textToPlay: string, voiceToUse?: VoiceConfig) => {
    const v = voiceToUse || selectedVoice;
    if (isPlaying) {
      voiceEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      voiceEngine.playVoice(
        textToPlay,
        v.gender,
        v.style,
        v.language,
        () => setIsPlaying(false)
      );
    }
  };

  const handleGenerateScriptWithAI = async () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      setIsGeneratingScript(false);
      if (selectedLanguage === 'urdu') {
        if (selectedVoice.gender === 'female') {
          setVoiceScript(
            'Salam! Hamari executive team ne aap ke brand ke liye aik bespoke conversion outreach strategy tayar ki hai. Mukhtasir 10 minute ki call ke liye inbox check kijiye ga.'
          );
        } else {
          setVoiceScript(
            'Assalam-o-Alaikum. Hum ne aap ke business ki jadeed expansion dekhi hai. Hamara automated platform aap ki sales outreach ko 3 guna behtar kar sakta hai. Mukhtasir guftagu ke liye rabta kijiye.'
          );
        }
      } else {
        setVoiceScript(
          `Hi there! This is reaching out from the ApexFlow team. Loved what you built this quarter. We mapped out 3 quick operational benchmarks to save your engineering team 15+ hours weekly. Check your inbox for the breakdown!`
        );
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Free Pro Announcement Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#FF6B6B]/15 to-purple-500/15 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
            <Gift className="w-5 h-5" />
          </span>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>All 15 Voice Models & Pro Outreach Features Are 100% Free!</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Lifetime Free
              </span>
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              No credits deducted, no subscriptions, unlimited AI voice campaigns with zero restrictions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Star className="w-4 h-4 fill-purple-500 text-purple-500" />
          <span>3 New Urdu Voices (1 Man, 2 Women) Added</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              <Mic className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Voice Campaign Studio
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Studio-Grade AI Voice Library (English & Urdu)
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Deliver hyper-personalized audio voice notes embedded directly into outbound emails. 3.4x higher response rates than standard text.
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2 bg-[#FFFDFB] dark:bg-[#1C1214] p-1.5 rounded-2xl border border-[#FFD6D1]">
          <button
            onClick={() => {
              setSelectedLanguage('urdu');
              setSelectedVoice(VOICE_LIBRARY.find((v) => v.id === 'voice-m-shehryar-ur') || VOICE_LIBRARY[6]);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLanguage === 'urdu'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#FFD6D1]/30'
            }`}
          >
            Urdu / اردو (9 Voices • 3 NEW)
          </button>
          <button
            onClick={() => {
              setSelectedLanguage('english');
              setSelectedVoice(VOICE_LIBRARY[0]);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLanguage === 'english'
                ? 'bg-[#FF6B6B] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#FFD6D1]/30'
            }`}
          >
            English (6 Voices)
          </button>
        </div>
      </div>

      {/* 3 New Urdu Voices Spotlight Card (when Urdu is selected) */}
      {selectedLanguage === 'urdu' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-[#FF6B6B]/10 to-amber-500/10 border-2 border-purple-400 dark:border-purple-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Featured: 3 New Urdu Voices (1 Man & 2 Women)
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                Authentic Native Intonations for Regional & Enterprise Outreach
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-200/80 text-purple-900 dark:bg-purple-950 dark:text-purple-200">
              Free Pro Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'voice-m-shehryar-ur',
                name: 'Shehryar Alvi',
                badge: '1 Man (Urdu)',
                role: 'Senior Enterprise Executive & Broadcaster',
                sample: 'Assalam-o-Alaikum, main Shehryar Alvi baat kar raha hoon. Aap ke enterprise scale ke liye hamara deliverability model 100% verified primary inbox placement provide karta hai.',
              },
              {
                id: 'voice-f-hania-ur',
                name: 'Hania Bukhari',
                badge: '1st Woman (Urdu)',
                role: 'High-Energy Conversational Growth Specialist',
                sample: 'Salam! Hania Bukhari here. Hamari team ne high-ticket client acquisition aur B2B partnerships ke liye aik specialized outreach funnel design kiya hai.',
              },
              {
                id: 'voice-f-mahnoor-ur',
                name: 'Mahnoor Kazmi',
                badge: '2nd Woman (Urdu)',
                role: 'Warm Client Advisor & Corporate Consultant',
                sample: 'Aadab, main Mahnoor Kazmi hoon. Aap ki organization ke liye hum ne complimentary deliverability aur growth audit tayar kiya hai.',
              },
            ].map((v) => {
              const fullVoice = VOICE_LIBRARY.find((item) => item.id === v.id)!;
              const isSelected = selectedVoice.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelectedVoice(fullVoice);
                    setVoiceScript(fullVoice.sampleText);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-[#1C1214] ${
                    isSelected
                      ? 'border-2 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                      : 'border-purple-200 dark:border-purple-900 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {v.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {v.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium mb-1">
                    {v.role}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 mb-3 bg-[#FFF8F6] dark:bg-[#140C0E] p-2 rounded-xl">
                    "{v.sample}"
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVoice(fullVoice);
                      setVoiceScript(fullVoice.sampleText);
                      handlePlayVoice(fullVoice.sampleText, fullVoice);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Audition {v.name}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Voice Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter by Gender:</span>
            <div className="flex gap-1">
              {(['all', 'male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    selectedGender === g
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] text-slate-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-slate-400">{filteredVoices.length} voice models available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            return (
              <div
                key={voice.id}
                onClick={() => {
                  setSelectedVoice(voice);
                  setVoiceScript(voice.sampleText);
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFDFB] dark:bg-[#1C1214] border-2 border-[#FF6B6B] shadow-xl ring-2 ring-[#FF6B6B]/20 scale-[1.01]'
                    : 'glass-panel border-[#FFD6D1] dark:border-[#522329] hover:bg-[#FFD6D1]/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FF8A8A] flex items-center justify-center text-white">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {voice.voiceName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {voice.gender} • {voice.style} style
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {voice.badge ? (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {voice.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD6D1] text-[#FF6B6B] uppercase">
                        {voice.language}
                      </span>
                    )}
                  </div>
                </div>

                {voice.description && (
                  <p className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    {voice.description}
                  </p>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-4 line-clamp-3 bg-[#FFF8F6] dark:bg-[#140C0E] p-3 rounded-xl border border-[#FFD6D1]/40">
                  "{voice.sampleText}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#FFD6D1]/40 text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVoice(voice);
                      setVoiceScript(voice.sampleText);
                      handlePlayVoice(voice.sampleText, voice);
                    }}
                    className="font-bold text-[#FF6B6B] hover:underline flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Audition Sample</span>
                  </button>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Free Pro</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Script Generator & Interactive Speech Playback Sandbox */}
      <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FFD6D1]/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Pro Unlocked Free
              </span>
              <span className="text-xs text-slate-400">• Voice Script Engine</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
              Active Voice Model: {selectedVoice.voiceName} ({selectedVoice.gender} • {selectedVoice.style} • {selectedVoice.language})
            </h3>
            <p className="text-xs text-slate-500">
              Type custom voice copy or click "Generate Script With AI" to create customized outreach scripts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScriptMode(scriptMode === 'ai' ? 'user' : 'ai')}
              className="px-3 py-1.5 rounded-xl border border-[#FFD6D1] text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Mode: {scriptMode === 'ai' ? 'AI Script Writer' : 'Manual Script'}
            </button>
            <button
              onClick={handleGenerateScriptWithAI}
              disabled={isGeneratingScript}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingScript ? 'Drafting Script...' : 'Generate Script with AI'}</span>
            </button>
          </div>
        </div>

        {/* Script Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Voice Script Text (Plays with {selectedVoice.voiceName}'s vocal cadence)
          </label>
          <textarea
            rows={4}
            value={voiceScript}
            onChange={(e) => setVoiceScript(e.target.value)}
            className="w-full p-4 rounded-2xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-sans leading-relaxed"
          />
        </div>

        {/* Interactive Audio Player Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFD6D1]/30 via-[#FFC4C4]/20 to-[#FF8A8A]/20 dark:from-[#3A1B1F]/40 dark:to-[#522329]/30 border border-[#FFD6D1] dark:border-[#522329] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePlayVoice(voiceScript)}
              className="w-14 h-14 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF5252] text-white flex items-center justify-center shadow-lg shadow-[#FF6B6B]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {isPlaying ? 'Synthesizing & Playing Audio...' : 'Audio Ready for Playback'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {selectedVoice.voiceName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Estimated Duration: ~{Math.ceil(voiceScript.split(/\s+/).length / 2.5)}s • 44.1kHz High Fidelity • Free Unlimited
              </p>
            </div>
          </div>

          {/* Animated Waveform Visualization */}
          <div className="flex items-center gap-1 h-8">
            {[14, 28, 18, 36, 22, 10, 32, 26, 16, 30, 20, 12, 34, 24].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-[#FF6B6B] animate-pulse' : 'bg-[#FFD6D1] dark:bg-[#522329]'
                }`}
                style={{ height: isPlaying ? `${Math.max(12, h * (i % 2 === 0 ? 1.2 : 0.8))}px` : '8px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
