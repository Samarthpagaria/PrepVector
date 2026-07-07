import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Timer, Bot, AlertCircle, Loader2, Volume2, MicOff } from 'lucide-react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSubmitAnswer, useFinishInterview } from '../hooks/useInterview';

interface Question {
  _id?: string;
  question: string;
  timeLimit?: number;
}

interface InterviewProps {
  interviewData: {
    interviewId: string;
    questions: Question[];
    userName: string;
  };
  onFinish: (report: any) => void;
}

const Interview: React.FC<InterviewProps> = ({ interviewData, onFinish }) => {
  // Data mapping from backend
  const { interviewId, questions, userName } = interviewData;
  const totalQuestions = questions.length;
  
  // Requested States
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const recognitionRef = useRef<any>(null); // Kept for reference but using hook
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAiPlaying, setIsAiPlaying] = useState(false);
  const [answer, setAnswer] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); 
  const [voiceGender, setVoiceGender] = useState('female');
  const [subtitle, setSubtitle] = useState('');
  
  // Local UI State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const submitAnswerMutation = useSubmitAnswer();
  const finishInterviewMutation = useFinishInterview();

  // Derived current question based on currentIndex
  const currentQuestion = questions[currentIndex];

  // Speech Recognition Hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Sync listening state with mic UI
  useEffect(() => {
    setIsMicOn(listening);
    if (listening) {
      setSubtitle("Listening...");
    } else if (isMicOn) {
      setSubtitle("");
    }
  }, [listening]);

  // Sync transcript to answer box
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  // Timer logic
  useEffect(() => {
    setTimeLeft(currentQuestion?.timeLimit || 300);
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    // Don't run timer during intro phase, submission, or while AI is speaking
    if (isIntroPhase || timeLeft <= 0 || isSubmitting || isAiPlaying) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isIntroPhase, isSubmitting, isAiPlaying]);

  // Voice Loading Logic
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices next
      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ------------- SPEAK FUNCTION ------------- */
  const speakText = (text: string) => {
    return new Promise<void>((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      (window as any)._speechSynthesisUtterance = utterance; // Prevent Chrome GC bug
      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92; // slightly slower than normal
      utterance.pitch = 1.05; // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAiPlaying(true);
      };

      utterance.onend = () => {
        setIsAiPlaying(false);
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Intro and Question Speaking Sequence
  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        setSubtitle(`Hi ${userName}, it's great to meet you today...`);
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );
        
        setSubtitle("I'll ask you a few questions...");
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        // If last question
        if (currentIndex === totalQuestions - 1) {
          setSubtitle("Alright, this one might be a bit more challenging...");
          await speakText("Alright, this one might be a bit more challenging.");
        }

        setSubtitle(currentQuestion.question);
        await speakText(currentQuestion.question);
      }
    };

    runIntro();
  }, [isIntroPhase, currentIndex, selectedVoice]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      SpeechRecognition.stopListening();
    };
  }, []);

  const finishInterview = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
    setIsMicOn(false);
    try {
      const result = await finishInterviewMutation.mutateAsync({
        interviewId
      });
      console.log("[DEBUG] Finish Interview Result:", result);
      onFinish(result);
    } catch (error: any) {
      console.error(error);
      alert("Failed to finish interview: " + (error?.response?.data?.message || error.message));
      setIsSubmitting(false); // Make sure to unblock the UI
    }
  };

  const handleNext = async (resumeMic: boolean = false) => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    resetTranscript();
    
    setTimeout(() => {
      if (resumeMic) {
        SpeechRecognition.startListening({ continuous: true });
      }
    }, 500);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const resumeMic = isMicOn; // Capture intent before stopping

    if (listening) {
      SpeechRecognition.stopListening();
    }
    window.speechSynthesis.cancel(); // Stop AI if speaking
    
    setIsSubmitting(true);
    
    const timeLimit = currentQuestion?.timeLimit || 300;
    const timeTaken = timeLimit - timeLeft;
    
    try {
      console.log("[DEBUG] Submitting Answer:", {
        interviewId,
        questionIndex: currentIndex,
        answer: answer.trim() || "No answer provided",
        timeTaken,
        interviewData
      });
      const response = await submitAnswerMutation.mutateAsync({
        interviewId,
        questionIndex: currentIndex,
        answer: answer.trim() || "No answer provided",
        timeTaken
      });

      setFeedback(response.feedback);
      
      // Speak the feedback
      await speakText(response.feedback);
      
      // Once feedback is done speaking, move to the next question
      setIsSubmitting(false);
      handleNext(resumeMic);
      
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const toggleMic = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition. Try Google Chrome.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] text-zinc-200 p-4 md:p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AI Smart Interview</h1>
            <p className="text-xs text-zinc-400">Candidate: {userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Voice:</span>
          <select 
            value={voiceGender} 
            onChange={(e) => setVoiceGender(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-md px-2 py-1 outline-none focus:border-emerald-500"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Avatar & Status (4 columns wide) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Avatar Display */}
          <div className="bg-[#121214]/60 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] overflow-hidden relative shadow-2xl group">
            {/* Sleek placeholder gradient for the avatar background */}
            <div className="aspect-[4/3] bg-gradient-to-br from-[#0a0a0c] via-zinc-900/50 to-zinc-950 relative flex flex-col items-center justify-center p-6">
              
              {/* Animated rings when AI is playing/speaking */}
              {isAiPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 border border-emerald-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
                  <div className="absolute w-28 h-28 border-2 border-emerald-500/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                </div>
              )}
              
              {/* Core Avatar Icon */}
              <div className={`relative z-10 w-24 h-24 bg-zinc-950 border rounded-full flex items-center justify-center shadow-xl transition-all duration-500
                ${isAiPlaying ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-105' : 'border-zinc-800'}`}>
                 <Bot className={`w-12 h-12 transition-colors duration-500 ${isAiPlaying ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'text-zinc-600'}`} />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className={`px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium border flex items-center gap-2 transition-all
                  ${isAiPlaying ? 'text-emerald-400 border-emerald-500/30' : 'text-zinc-500 border-zinc-800'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAiPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                  {isAiPlaying ? 'AI Speaking' : 'AI Waiting'}
                </span>
                {isMicOn && (
                  <span className="px-3 py-1 bg-red-500/10 backdrop-blur-md rounded-full text-xs font-medium text-red-400 border border-red-500/30 flex items-center gap-2">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    Listening
                  </span>
                )}
              </div>
            </div>

            {/* Subtitles Overlay Area */}
            {subtitle && (
              <div className="absolute bottom-16 left-4 right-4 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-zinc-800 text-center">
                <p className="text-sm font-medium text-emerald-300 animate-in fade-in slide-in-from-bottom-2">{subtitle}</p>
              </div>
            )}
          </div>

          {/* Status Card */}
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col items-center relative">
            
            {/* Intro Phase Overlay */}
            {isIntroPhase && (
               <div className="absolute inset-0 bg-[#121214]/80 backdrop-blur-sm z-20 rounded-3xl flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                  <p className="text-sm font-medium text-zinc-300">Setting up interview...</p>
               </div>
            )}

            <h3 className="text-sm font-semibold text-zinc-400 w-full text-left mb-6">Interview Status</h3>
            
            {/* Circular Timer */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  className="fill-none stroke-zinc-800" strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  className={`fill-none ${timeLeft < 60 ? 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'} transition-all duration-1000 ease-linear`} 
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * timeLeft) / (currentQuestion?.timeLimit || 300)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-zinc-500">remaining</span>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="w-full flex justify-between items-center px-4 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-emerald-400">{currentIndex + 1}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mt-1">Current</span>
              </div>
              <div className="h-8 w-px bg-zinc-800"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-zinc-300">{totalQuestions}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mt-1">Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question & Answer (8 columns wide) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Question Box */}
          <div className="bg-[#121214]/80 backdrop-blur-md border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl relative overflow-hidden transition-all duration-500">
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${isIntroPhase ? 'bg-zinc-700' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}></div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${isIntroPhase ? 'bg-zinc-800 text-zinc-500' : 'text-emerald-400 bg-emerald-500/10'}`}>
                {isIntroPhase ? 'Preparing' : `Question ${currentIndex + 1} of ${totalQuestions}`}
              </span>
              {!isIntroPhase && currentQuestion?.timeLimit && (
                 <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                   <Timer className="w-3 h-3" /> {currentQuestion.timeLimit / 60} min limit
                 </span>
              )}
            </div>
            <h2 className={`text-2xl md:text-3xl font-semibold leading-tight transition-colors duration-500 ${isIntroPhase ? 'text-zinc-600' : 'text-white'}`}>
              {isIntroPhase ? "Getting ready..." : (currentQuestion?.question || "Loading question...")}
            </h2>
          </div>

          {/* Answer Input Box */}
          <div className="bg-[#121214]/60 backdrop-blur-md border border-zinc-800/80 rounded-[2rem] p-6 shadow-xl flex-1 flex flex-col min-h-[300px] transition-all hover:border-zinc-700/80">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={isIntroPhase ? "Wait for the interview to start..." : (isMicOn ? "Speak to type..." : "Type your answer here...")}
              disabled={isSubmitting || timeLeft <= 0 || isIntroPhase || isMicOn}
              className={`w-full flex-1 bg-transparent text-zinc-200 resize-none focus:outline-none text-lg leading-relaxed disabled:opacity-50 transition-all
                ${isMicOn ? 'placeholder:text-emerald-700/50 cursor-not-allowed' : 'placeholder:text-zinc-600'}`}
            />
            
            {timeLeft <= 0 && !isIntroPhase && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl mt-4 animate-in fade-in">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Time is up for this question. Please submit your answer.</span>
              </div>
            )}
            
            {feedback && (
              <div className="flex items-start gap-2 text-blue-400 bg-blue-400/10 p-3 rounded-xl mt-4 animate-in fade-in">
                <Bot className="w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{feedback}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 items-center">
            <button
              type="button"
              onClick={toggleMic}
              disabled={isSubmitting || timeLeft <= 0 || isIntroPhase}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0
                ${isMicOn 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' 
                  : 'bg-[#121214] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 disabled:opacity-50'}`}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting || isIntroPhase}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-black tracking-wide text-lg h-16 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Submit Answer
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Interview;



