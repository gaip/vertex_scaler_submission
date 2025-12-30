import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  BookOpen,
  Loader2,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Target,
  DollarSign,
  Shield,
} from "lucide-react";

const SYSTEM_INSTRUCTION = `You are a world-class Venture Capitalist and Startup Strategist (Partner level at Sequoia or Y Combinator). 
Your task is to evaluate startup ideas with deep reasoning and generate a comprehensive strategic document.

### CRITICAL INSTRUCTIONS
1. **Analyze First**: Use your thinking budget to simulate market conditions, competitor responses, and user acquisition challenges before writing.
2. **Be Critical**: Do not be a "yes-man". Highlight fatal flaws in the business model.
3. **Structure**: Follow the markdown structure below strictly.

### OUTPUT FORMAT

# 1. Executive Summary
(A high-impact 2-sentence pitch and value proposition. Pitch it like a unicorn.)

# 2. Lean Canvas Analysis
* **Problem**: [Clear definition of pain point - quantify if possible]
* **Solution**: [How this product solves it 10x better]
* **Unfair Advantage**: [The "Moat" - Network effects, proprietary tech, etc.]
* **Customer Segments**: [Specific target avatars, not "everyone"]

# 3. Go-To-Market (GTM) Strategy
* **Phase 1 (0-100 Users)**: [Guerrilla tactics, manual onboarding, "Paul Graham style"]
* **Phase 2 (100-10k Users)**: [Scalable channels, content loops, referrals]
* **Phase 3 (Scale)**: [Market expansion, PLG motions]

# 4. Critical Risk Assessment
* **Market Risk**: [Why might nobody want this?]
* **Execution Risk**: [Why might we fail to build it?]
* **Regulatory/Legal**: [Any blockers?]

# 5. Financial Model Proxy
(Estimate Unit Economics based on industry benchmarks)
* **Target CAC**: $[Amount]
* **Target LTV**: $[Amount]
* **Breakeven Timeline**: [Months]

Tone: Professional, insightful, slightly critical but constructive. Focus on viability and scalability.`;

const StrategyRoom: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [thinkingTime, setThinkingTime] = useState<number>(0);

  const generateStrategy = async () => {
    if (!idea) return;
    setLoading(true);
    setStrategy(null);
    const startTime = Date.now();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Analyze this startup idea and generate a comprehensive strategic document:\n\n${idea}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 4000 },
          maxOutputTokens: 8000,
        },
      });

      setThinkingTime(Math.round((Date.now() - startTime) / 1000));
      setStrategy(response.text || "No strategy generated.");
    } catch (err) {
      console.error(err);
      setStrategy("Error generating strategy. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) {
        return (
          <h1
            key={i}
            className="text-2xl font-bold mt-8 mb-4 text-blue-400 flex items-center gap-2"
          >
            {line.includes("Executive") && <Sparkles className="w-6 h-6" />}
            {line.includes("Lean Canvas") && <Target className="w-6 h-6" />}
            {line.includes("Go-To-Market") && (
              <TrendingUp className="w-6 h-6" />
            )}
            {line.includes("Risk") && <AlertTriangle className="w-6 h-6" />}
            {line.includes("Financial") && <DollarSign className="w-6 h-6" />}
            {line.replace("# ", "")}
          </h1>
        );
      }
      if (line.startsWith("* **")) {
        const parts = line.replace("* **", "").split("**:");
        return (
          <div key={i} className="flex gap-2 my-2 ml-4">
            <span className="font-bold text-purple-400">{parts[0]}:</span>
            <span className="text-gray-300">{parts[1]}</span>
          </div>
        );
      }
      if (line.startsWith("**")) {
        return (
          <p key={i} className="font-bold text-white my-2">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-gray-300 my-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold gradient-text">Strategy Room</h2>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
              Gemini 3 Pro
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Deep strategic analysis powered by Gemini 3 Pro's advanced reasoning
            with extended thinking.
          </p>
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea in detail... (e.g., An AI-powered platform that helps small businesses automate their accounting using natural language commands)"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all h-32 resize-none"
            />
          </div>
        </div>
        <button
          onClick={generateStrategy}
          disabled={loading || !idea}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Deep Thinking...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Run VC Analysis
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="glass rounded-2xl p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-purple-400">
            Gemini 3 Pro is Thinking...
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Running deep strategic analysis with extended reasoning. This uses
            Gemini's thinking budget to simulate market conditions and
            competitor responses.
          </p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-2 h-8 bg-purple-500/30 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {strategy && !loading && (
        <div className="glass rounded-2xl p-8 border border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                Strategic Analysis Complete
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Generated in {thinkingTime}s with extended thinking
            </span>
          </div>
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(strategy)}
          </div>
        </div>
      )}

      {!strategy && !loading && (
        <div className="h-80 glass rounded-2xl flex flex-col items-center justify-center space-y-4 opacity-50 border border-dashed border-purple-500/30">
          <BookOpen className="w-16 h-16 text-purple-500/50" />
          <div className="text-center">
            <p className="text-xl font-medium">Strategy Engine</p>
            <p className="text-sm max-w-md">
              Get comprehensive Lean Canvas, GTM strategy, risk assessment, and
              financial model proxies powered by Gemini 3 Pro's deep reasoning.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyRoom;
