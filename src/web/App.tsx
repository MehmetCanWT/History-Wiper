import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  ShieldAlert, 
  Lock, 
  Settings, 
  ChevronDown, 
  Play, 
  Check, 
  Github, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Live Ticker State
  const [globalCounter, setGlobalCounter] = useState(1842910);
  const [isCounterPulsing, setIsCounterPulsing] = useState(false);

  // Simulator State
  const [isWiping, setIsWiping] = useState(false);
  const [itemsWiped, setItemsWiped] = useState(0);
  const [simulatorCounter, setSimulatorCounter] = useState(12482);
  const [showStatus, setShowStatus] = useState(false);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Ticker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const randomInc = Math.floor(Math.random() * 4) + 1;
      setGlobalCounter(prev => prev + randomInc);
      setIsCounterPulsing(true);
      setTimeout(() => setIsCounterPulsing(false), 200);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Simulator Logic
  const handleWipeSimulation = () => {
    if (isWiping) return;
    setIsWiping(true);
    setShowStatus(false);

    setTimeout(() => {
      const count = Math.floor(Math.random() * 50) + 12; // 12-62 items
      setItemsWiped(count);
      setSimulatorCounter(prev => prev + count);
      setShowStatus(true);
      setIsWiping(false);
    }, 1200);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index));
  };

  // Mock Active Watchlist Items
  const watchlist = [
    { name: 'pornhub.com', type: 'URL' },
    { name: 'erome.com', type: 'URL' },
    { name: 'aşk', type: 'Keyword' },
  ];

  const faqs = [
    {
      q: "Does the extension send my browsing history to any servers?",
      a: "Absolutely not. History Wiper operates with a strict privacy-first approach. All matching logic, URL lists, settings, and deletion processes take place 100% locally inside your browser container. Your raw URLs are never transmitted."
    },
    {
      q: "How does the Title & Keyword matching work?",
      a: "When our background loop runs, it scans your browsing history using Chrome's secure query API. It checks both the webpage's URL and its page title case-insensitively. If your watchlist has a keyword like 'love', it matches and purges a page titled 'Say Yes to Love' even if the URL is just 'http://hello.com'."
    },
    {
      q: "What is the Global Deletion Counter?",
      a: "It is a voluntary, anonymous ticker that aggregates the collective cleanups performed by our global community. When active, it sends only a simple numerical sum (e.g. +5) along with a tamper-proof cryptographic signature and timestamp to prevent spam. No private data is ever leaked, and it can be disabled in settings at any time."
    },
    {
      q: "How does the Accident Protection prevent accidental clearings?",
      a: "If you accidentally add a very short term, such as a space (' ') or a single letter like 'e', it could match and delete almost all of your browser history. To prevent this, our loop strictly ignores and filters out any pattern under 2 characters, keeping your primary history fully protected."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-outfit font-bold text-xl tracking-tight text-white">History Wiper</span>
              <span className="block text-[9px] text-blue-500 font-bold uppercase tracking-widest leading-none">Privacy Guard</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
            <a href="#demo" className="hover:text-blue-500 transition-colors">Interactive Demo</a>
            <a href="#stats" className="hover:text-blue-500 transition-colors">Global Impact</a>
            <a href="#faq" className="hover:text-blue-500 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#download" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
              Add to Chrome
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-36 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-500">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Version 1.0.0 Now Available
              </div>
              <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
                Take Control of Your <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 drop-shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                  Browser History
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Automatically search, match, and wipe targeted URLs and page titles from your history. Fully local execution with absolute safety guarantees.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a href="#download" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-95 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                  Add History Wiper Free
                </a>
                <a href="#demo" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  Try Interactive Demo
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  100% Local Execution
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Accident Safety Guard
                </span>
              </div>
            </div>

            {/* Hero Mockup Widget */}
            <div id="demo" className="lg:col-span-6 flex justify-center items-center">
              <div className="relative w-[340px] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-blue-500/5 transition-all">
                {/* Neon ambient highlights */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl opacity-10 blur-xl"></div>
                
                {/* Popup Screen Content */}
                <div className="relative bg-slate-950/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/80">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-blue-600 p-2 rounded-xl text-white">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">History Wiper</h2>
                        <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">Privacy Guard</p>
                      </div>
                    </div>
                    <div className="p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer transition-colors" title="Settings">
                      <Settings className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stats Block */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-center">
                      <div className="text-2xl font-black text-blue-500 leading-none mb-1">
                        {simulatorCounter.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Deleted</div>
                    </div>
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-center flex flex-col justify-center">
                      <div className="text-xs font-bold text-slate-200 leading-tight">3 Keywords</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">On Watchlist</div>
                    </div>
                  </div>

                  {/* Alert Banner */}
                  {showStatus && (
                    <div className="mb-3 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold border bg-emerald-950/20 text-emerald-400 border-emerald-900/30 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate font-semibold">Wiped {itemsWiped} items successfully!</span>
                    </div>
                  )}

                  {/* Watchlist items list mock */}
                  <div className="mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Active Keywords</div>
                    <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1 text-xs">
                      {watchlist.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-slate-900/80 rounded-lg border border-slate-800/50">
                          <span className="text-slate-300 truncate max-w-[70%] font-medium">{item.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                            item.type === 'Keyword' 
                              ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-2">
                    <button 
                      onClick={handleWipeSimulation}
                      disabled={isWiping}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/10 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isWiping ? 'Wiping History...' : 'Clean Instantly'}</span>
                    </button>
                    <button className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold text-xs transition-all">
                      Open Options Dashboard
                    </button>
                  </div>
                </div>
                {/* Label helper */}
                <div className="absolute -bottom-10 left-0 right-0 text-center text-xs text-slate-500 font-medium italic">
                  * Click the blue button above to test the wiping simulator!
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Impact Stats Counter */}
      <section id="stats" className="py-16 bg-slate-950/40 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Global Community Protection
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Real-time collective cleanups reported anonymously by our global user base.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-slate-800/80 text-center shadow-xl">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Deleted Worldwide</div>
            {/* Rolling numbers */}
            <div className={`flex items-center justify-center gap-1.5 font-outfit font-black text-4xl sm:text-5xl text-blue-500 tracking-tight transition-transform duration-100 ${isCounterPulsing ? 'scale-105' : ''}`}>
              <ShieldCheck className="w-8 h-8 text-blue-500 mr-1 shrink-0" />
              <span>{globalCounter.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase mt-3 tracking-wider flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Counter Ticker Enabled
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Sophisticated Features. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Zero Privacy Leakage.</span>
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              History Wiper runs entirely locally in your browser, maintaining full performance and providing cryptographic verification checks for security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-blue-500/10 p-3.5 rounded-xl text-blue-500 w-fit mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-white mb-2">Automated Cleanup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set custom cleaning intervals (30 minutes up to 24 hours). History matches are cleared dynamically in the background without opening the extension.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-indigo-500/10 p-3.5 rounded-xl text-indigo-400 w-fit mb-5 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-white mb-2">Keyword Title Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike other cleaners, we check both **Page URLs** and **Page Titles**. Cleans up history entries even if a keyword only appears in the website name.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400 w-fit mb-5 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-white mb-2">Accident Safety Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Double match verifications and a strict 2-character validation rule prevent shorthand inputs (like spaces or single letters) from wiping broad history by accident.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-blue-500/10 p-3.5 rounded-xl text-blue-400 w-fit mb-5 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-white mb-2">Cryptographic Anti-Spam</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in HMAC SHA-256 dynamic payload signatures verify stats counts. Allows server-side deduplication and silent rate-limiting to prevent database spams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section className="py-20 bg-slate-950/40 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-outfit font-extrabold text-3xl text-white tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-400 mt-2">Get set up in less than 60 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-slate-900/30 p-8 rounded-2xl border border-slate-850 text-center">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 border-4 border-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-outfit font-bold text-white shadow-lg">1</div>
              <h3 className="font-outfit font-bold text-lg text-white mt-2 mb-2">Add Watchlist URLs</h3>
              <p className="text-xs text-slate-400">
                Open the Options dashboard, type any URL or specific search keyword you want to target, and hit Add.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-slate-900/30 p-8 rounded-2xl border border-slate-850 text-center">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 border-4 border-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-outfit font-bold text-white shadow-lg">2</div>
              <h3 className="font-outfit font-bold text-lg text-white mt-2 mb-2">Define Clear Interval</h3>
              <p className="text-xs text-slate-400">
                Choose how frequently you want background sweeps to trigger. Options range from 30 minutes up to 24 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-slate-900/30 p-8 rounded-2xl border border-slate-850 text-center">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 border-4 border-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-outfit font-bold text-white shadow-lg">3</div>
              <h3 className="font-outfit font-bold text-lg text-white mt-2 mb-2">Rest & Relax</h3>
              <p className="text-xs text-slate-400">
                The background worker keeps sweeps active automatically. Matches are cleanly purged. Your privacy is fully secured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-outfit font-extrabold text-3xl text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 mt-2">Everything you need to know about History Wiper.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden transition-all duration-350">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-6 text-left font-semibold text-white focus:outline-none select-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              <div 
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{ maxHeight: activeFaq === index ? '160px' : '0' }}
              >
                <div className="p-6 pt-0 text-slate-400 text-xs leading-relaxed border-t border-slate-800/40">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download CTA section */}
      <section id="download" className="py-24 bg-slate-950/60 border-t border-slate-900 relative text-center">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="font-outfit font-extrabold text-4xl text-white tracking-tight">Protect Your Privacy Today</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Add History Wiper to Google Chrome and get absolute safety, automatic targeted cleaning, and 100% local operation.
          </p>
          <div className="pt-4">
            <a 
              href="https://chrome.google.com/webstore" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-95 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Add to Chrome (Always Free)
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Compatible with Chrome, Edge, Brave, and Opera</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900/60 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shrink-0 animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-outfit font-bold text-sm tracking-tight text-white">History Wiper</span>
          </div>
          <div>
            <p>&copy; 2026 History Wiper. Built with premium local privacy security guidelines.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">GitHub</a>
            <a href="https://github.com/MehmetCanWT/History-Wiper/blob/main/PRIVACY.md" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
