
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Play, Square, Loader2, Sparkles } from 'lucide-react';

// PCM Helper Functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const PitchLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
  }, []);

  const startSession = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-live-2.5-flash-native-audio',
        callbacks: {
          onopen: () => {
            setLoading(false);
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const outCtx = outAudioContextRef.current!;
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscriptions(prev => [...prev.slice(0, -1), {role: 'ai', text: (prev[prev.length-1]?.role === 'ai' ? prev[prev.length-1].text : '') + text}]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscriptions(prev => [...prev.slice(0, -1), {role: 'user', text: (prev[prev.length-1]?.role === 'user' ? prev[prev.length-1].text : '') + text}]);
            }
            if (message.serverContent?.turnComplete) {
                // Prepare for next turn if needed
            }
          },
          onerror: (e) => console.error("Live Error", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: "You are a tough but constructive Venture Capitalist investor from Sequoia. The user is pitching their startup. Challenge their assumptions, ask about CAC/LTV, and give feedback on their presentation style. Be very interactive and conversational.",
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Pitch Lab</h2>
          <p className="text-gray-400 text-sm">Real-time voice practice with an AI VC.</p>
        </div>
        {!isActive ? (
          <button 
            onClick={startSession}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Start Pitching Session
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-red-500/20"
          >
            <Square className="w-4 h-4" />
            End Session
          </button>
        )}
      </div>

      <div className="flex-grow glass rounded-2xl p-6 flex flex-col relative overflow-hidden">
        {isActive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live Session</span>
          </div>
        )}

        <div className="flex-grow space-y-4 overflow-y-auto mb-4 p-4">
          {transcriptions.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <Mic className="w-12 h-12 text-blue-400" />
              <p>Your session history will appear here.<br/>Ready to impress the investor?</p>
            </div>
          )}
          {loading && (
             <div className="h-full flex flex-col items-center justify-center space-y-4">
               <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
               <p className="text-blue-400 font-medium animate-pulse">Establishing secure voice link...</p>
             </div>
          )}
          {transcriptions.map((t, i) => (
            <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${t.role === 'user' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'}`}>
                <p className="text-xs font-bold mb-1 opacity-50 uppercase tracking-wider">{t.role === 'user' ? 'You' : 'Investor'}</p>
                <p className="text-sm leading-relaxed">{t.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className={`p-3 rounded-full ${isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-white/10'}`}>
            {isActive ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-gray-500" />}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium">{isActive ? 'Investor is listening...' : 'Microphone is off'}</p>
            <p className="text-xs text-gray-400">{isActive ? 'Speak clearly into your microphone.' : 'Start a session to begin pitching.'}</p>
          </div>
          {isActive && (
            <div className="flex gap-1 items-end h-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-1 bg-blue-400 rounded-full animate-bounce" style={{height: `${Math.random()*100}%`, animationDelay: `${i*0.1}s`}} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchLab;
