import React from 'react';
import { User, MapPin, Hash, Globe, Award, GraduationCap } from 'lucide-react';

export const ProfileApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full text-green-400">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-square bg-green-900/20 border border-green-500/30 relative overflow-hidden group">
            <img 
              src="https://picsum.photos/400/400?grayscale" 
              alt="Agent" 
              className="w-full h-full object-cover opacity-70 mix-blend-luminosity hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center border-t border-green-500">
              <span className="text-xs font-bold">STATUS: ACTIVE // HIRED</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white mb-1">SARTHAK MAYANI</h1>
            <p className="text-sm text-green-600 uppercase">Software Engineer // Full Stack Developer</p>
          </div>

          <div className="space-y-2 text-sm font-mono border-l-2 border-green-900 pl-4">
            <div className="flex items-center gap-3">
              <MapPin size={14} />
              <span>Surat, Gujarat, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Hash size={14} />
              <span>+91 78620 55445</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe size={14} />
              <span>sarthakmayani2004@gmail.com</span>
            </div>
          </div>

          <div className="bg-green-900/10 p-4 border border-green-900 text-sm leading-relaxed">
            <p className="mb-2">
              <span className="font-bold text-green-500">> BIO_SUMMARY:</span>
            </p>
            <p className="opacity-80">
              Motivated software engineer skilled in Java, C, and Python. Comfortable with both front-end (React, Angular) and back-end development. Strong problem-solving skills with a focus on writing clean, efficient code and creating reliable software solutions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education Section */}
        <div>
           <h3 className="text-sm font-bold border-b border-green-800 mb-3 pb-1 uppercase flex items-center gap-2">
             <GraduationCap size={16} /> Education
           </h3>
           <div className="space-y-3 text-xs">
              <div className="relative pl-4 border-l border-green-900">
                <div className="absolute left-[-2px] top-1 w-1 h-1 bg-green-500"></div>
                <div className="font-bold text-green-300">BCA (Bachelor of Computer App.)</div>
                <div className="opacity-70">UKA TARSADIA UNIVERSITY</div>
                <div className="font-mono text-[10px] text-green-700">2021 - 2024</div>
              </div>
              <div className="relative pl-4 border-l border-green-900">
                <div className="absolute left-[-2px] top-1 w-1 h-1 bg-green-500"></div>
                <div className="font-bold text-green-300">HSC</div>
                <div className="opacity-70">Ashadeep Group of Schools</div>
                <div className="font-mono text-[10px] text-green-700">2020 - 2021</div>
              </div>
           </div>
        </div>

        {/* Certifications Section */}
        <div>
           <h3 className="text-sm font-bold border-b border-green-800 mb-3 pb-1 uppercase flex items-center gap-2">
             <Award size={16} /> Certifications
           </h3>
           <div className="space-y-3 text-xs">
              <div className="bg-green-900/20 p-2 border border-green-900/50">
                <div className="font-bold text-green-300">Java Full Stack Certification</div>
                <div className="opacity-70">SEED Foundation</div>
                <div className="mt-1 text-[10px] text-green-600 font-mono">VERIFIED CERTIFICATE</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};