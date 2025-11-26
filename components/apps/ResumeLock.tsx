import React, { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, Download, AlertTriangle, Fingerprint, Grid3x3, FileText, Binary } from 'lucide-react';
import { RESUME_TEXT } from '../../constants';
import { jsPDF } from 'jspdf';

export const ResumeLock: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<'biometric' | 'passcode'>('biometric');
  
  // Biometric State
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const scanIntervalRef = useRef<number | undefined>(undefined);
  
  // Passcode State
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  
  // Decryption Text Effect
  const [decryptText, setDecryptText] = useState('');
  const [typedResume, setTypedResume] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  const CORRECT_PIN = '1337';

  // Resume Typing Effect when unlocked
  useEffect(() => {
    if (isUnlocked) {
      setTypedResume('');
      let index = 0;
      
      const typeInterval = setInterval(() => {
        if (index <= RESUME_TEXT.length) {
          setTypedResume(RESUME_TEXT.slice(0, index));
          index++;
          
          // Auto-scroll to bottom
          if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }
        } else {
          clearInterval(typeInterval);
        }
      }, 5); // Faster typing speed for better UX on unlock

      return () => clearInterval(typeInterval);
    }
  }, [isUnlocked]);

  // Biometric Logic
  const startScan = () => {
    if (isUnlocked) return;
    setIsScanning(true);
    scanIntervalRef.current = window.setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current);
          setIsUnlocked(true);
          return 100;
        }
        return prev + 1.5; // Scan speed
      });
      
      // Random hex generation for effect
      setDecryptText(
        Array(8).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
      );
    }, 30);
  };

  const stopScan = () => {
    if (scanProgress < 100) {
      setIsScanning(false);
      setScanProgress(0);
      clearInterval(scanIntervalRef.current);
      setDecryptText('');
    }
  };

  // Passcode Logic
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsUnlocked(true);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 800);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - (margin * 2);
    let cursorY = 20;

    // Split text into lines
    const lines = RESUME_TEXT.split('\n');
    
    // Header Info (Name, Contact) - First 3 lines usually
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SARTHAK MAYANI", pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    // Combine line 2 and 3 for contact info if they exist
    if (lines[1]) {
        doc.text(lines[1], pageWidth / 2, cursorY, { align: 'center' });
        cursorY += 5;
    }
    if (lines[2]) {
        doc.text(lines[2], pageWidth / 2, cursorY, { align: 'center' });
        cursorY += 10;
        
        // Add a horizontal line
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 10;
    }

    // Process remaining lines
    for (let i = 3; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
            cursorY += 5; // Extra space for empty lines
            continue;
        }

        // Check if it's a Section Header (All Caps and short)
        const isHeader = line === line.toUpperCase() && line.length > 2 && !line.includes(':') && !line.startsWith('-');
        
        if (isHeader) {
            cursorY += 5;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(line, margin, cursorY);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            cursorY += 6;
        } 
        // Bullet points
        else if (line.startsWith('-')) {
             const bulletText = line.substring(1).trim();
             const splitText = doc.splitTextToSize(bulletText, maxLineWidth - 5);
             
             doc.text("•", margin, cursorY);
             doc.text(splitText, margin + 5, cursorY);
             cursorY += (splitText.length * 5);
        }
        // Normal text
        else {
            const splitText = doc.splitTextToSize(line, maxLineWidth);
            doc.text(splitText, margin, cursorY);
            cursorY += (splitText.length * 5);
        }

        // Page Break
        if (cursorY > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            cursorY = 20;
        }
    }
    
    doc.save("Sarthak_Mayani_Resume.pdf");
  };

  // Cleanup
  useEffect(() => {
    return () => clearInterval(scanIntervalRef.current);
  }, []);

  if (isUnlocked) {
    return (
      <div className="flex flex-col h-full bg-black/90 text-green-400 animate-in fade-in duration-500 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-green-500/30 bg-green-900/10">
           <div className="flex items-center gap-2">
             <Unlock size={14} className="text-green-500" />
             <span className="text-xs font-bold tracking-widest">FILE DECRYPTED</span>
           </div>
           <div className="flex gap-2">
             <button 
               onClick={handleDownload}
               className="flex items-center gap-1 bg-green-600 text-black text-[10px] font-bold px-2 py-1 hover:bg-green-400 transition-colors"
             >
               <Download size={10} /> DOWNLOAD PDF
             </button>
           </div>
        </div>

        {/* Content Viewer (Terminal Style) */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-auto p-4 custom-scrollbar font-mono text-xs leading-relaxed relative scroll-smooth"
        >
           <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[length:100%_3px] z-10"></div>
           
           <div className="whitespace-pre-wrap opacity-90 pb-20">
             {typedResume}
             <span className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-1 align-middle"></span>
           </div>
        </div>

        {/* Footer Status */}
        <div className="p-2 border-t border-green-900 bg-black text-[10px] font-mono flex justify-between opacity-70">
          <span>SOURCE: SARTHAK_MAYANI.pdf</span>
          <span>INTEGRITY: 100%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-900/50 bg-black/20">
         <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <Lock size={14} />
            <span className="text-xs font-bold tracking-widest uppercase">LOCKED // ENCRYPTED</span>
         </div>
         <div className="text-[10px] text-green-800 font-mono">AUTH_REQUIRED</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
         {/* Background elements */}
         <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Binary size={200} />
         </div>

         {/* Mode Switcher */}
         <div className="flex gap-4 mb-8 z-10">
            <button 
              onClick={() => setAuthMode('biometric')}
              className={`flex items-center gap-2 px-3 py-1 text-xs border transition-all ${
                authMode === 'biometric' 
                ? 'border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                : 'border-green-900 text-green-800 hover:border-green-700'
              }`}
            >
              <Fingerprint size={12} /> BIOMETRIC
            </button>
            <button 
               onClick={() => setAuthMode('passcode')}
               className={`flex items-center gap-2 px-3 py-1 text-xs border transition-all ${
                authMode === 'passcode' 
                ? 'border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                : 'border-green-900 text-green-800 hover:border-green-700'
              }`}
            >
              <Grid3x3 size={12} /> PASSCODE
            </button>
         </div>

         {authMode === 'biometric' ? (
           <div className="flex flex-col items-center gap-4 z-10">
              <div className="relative group">
                <button
                  onMouseDown={startScan}
                  onMouseUp={stopScan}
                  onMouseLeave={stopScan}
                  onTouchStart={startScan}
                  onTouchEnd={stopScan}
                  className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-100 ${
                    isScanning 
                      ? 'border-green-400 bg-green-500/20 scale-95 shadow-[0_0_30px_rgba(74,222,128,0.4)]' 
                      : 'border-green-800 bg-black hover:border-green-600 hover:bg-green-900/10'
                  }`}
                >
                  <Fingerprint size={48} className={isScanning ? 'text-green-300 animate-pulse' : 'text-green-700'} />
                </button>
                
                {/* Circular Progress */}
                {isScanning && (
                   <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none">
                     <circle 
                       cx="50%" cy="50%" r="48%" 
                       fill="none" 
                       stroke="#22c55e" 
                       strokeWidth="2"
                       strokeDasharray="300"
                       strokeDashoffset={300 - (300 * scanProgress) / 100}
                       className="transition-all duration-75"
                     />
                   </svg>
                )}
              </div>
              
              <div className="h-8 flex flex-col items-center justify-center">
                {isScanning ? (
                  <>
                    <span className="text-xs text-green-400 font-mono font-bold animate-pulse">SCANNING... {Math.floor(scanProgress)}%</span>
                    <span className="text-[10px] text-green-600 font-mono h-3">{decryptText}</span>
                  </>
                ) : (
                  <span className="text-xs text-green-700 font-mono animate-pulse">HOLD TO SCAN</span>
                )}
              </div>
           </div>
         ) : (
           <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-4 w-full max-w-[200px] z-10">
             <div className="relative w-full">
               <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="____"
                className={`w-full bg-black border-2 text-center text-2xl tracking-[0.5em] py-3 outline-none font-mono transition-colors ${
                  error 
                    ? 'border-red-500 text-red-500 placeholder-red-900/50' 
                    : 'border-green-800 focus:border-green-500 text-green-400 placeholder-green-900/30'
                }`}
                autoFocus
               />
               {error && (
                 <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-1 text-red-500 text-[10px] animate-bounce">
                   <AlertTriangle size={10} />
                   <span>INVALID CODE</span>
                 </div>
               )}
             </div>
             
             <button 
               type="submit"
               className="w-full bg-green-900/20 border border-green-800 text-green-600 hover:bg-green-600 hover:text-black hover:border-green-500 py-2 text-xs font-bold uppercase tracking-wider transition-all mt-2"
             >
               Authenticate
             </button>
             <div className="text-[10px] text-green-800 mt-2">HINT: LEET SPEAK</div>
           </form>
         )}
      </div>

      <div className="p-3 border-t border-green-900/30 bg-black/40 text-[10px] text-green-900 font-mono flex justify-between">
         <span>SECURE_ID: 994-A</span>
         <span>ENCRYPTION: AES-256</span>
      </div>
    </div>
  );
};