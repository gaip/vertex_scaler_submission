
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Play, Square, Loader2 } from 'lucide-react';

// PCM Helper Functions
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
): Promise<AudioBuffer> {
    return await ctx.decodeAudioData(data.buffer);
}


const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onopen = () => setSocket(ws);
        ws.onmessage = (event) => setLastMessage(JSON.parse(event.data));
        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (message: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    };

    return { sendMessage, lastMessage };
};


const PitchLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { sendMessage, lastMessage } = useWebSocket("ws://localhost:8765");

  useEffect(() => {
      if(lastMessage) {
          if (lastMessage.text) {
            setTranscriptions(prev => [...prev, { role: 'model', text: lastMessage.text }]);
          } else if (lastMessage.audio) {
              if(!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
              }
              const audioData = decode(lastMessage.audio);
              decodeAudioData(audioData, audioContextRef.current).then(audioBuffer => {
                const source = audioContextRef.current!.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current!.destination);
                source.start();
              })
          }
      }
  }, [lastMessage])

  const stopSession = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsActive(false);
    setLoading(false);
  }, []);

  const startSession = async () => {
    setLoading(true);
    setTranscriptions([]);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                sendMessage(event.data)
            }
        };

        sendMessage(JSON.stringify({
            system_instruction: "You are a tough but constructive Venture Capitalist investor from Sequoia. The user is pitching their startup. Challenge their assumptions, ask about CAC/LTV, and give feedback on their presentation style. Be very interactive and conversational."
        }))

        mediaRecorder.start(1000); // Send data every 1 second
        setIsActive(true);
        setLoading(false);

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
