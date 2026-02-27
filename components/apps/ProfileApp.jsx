import React from 'react';
import { MapPin, Globe, GraduationCap, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay },
});

export const ProfileApp = () => {
  return (
    <div className="text-green-400 font-mono space-y-5">

      {/* ── Top hero card ── */}
      <motion.div {...fadeUp(0)} className="relative p-5 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,77,48,0.3), rgba(0,0,0,0.4))',
          border: '1px solid rgba(0,255,157,0.2)',
        }}
      >
        {/* Glow blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,255,157,0.08) 0%, transparent 70%)' }} />

        <div className="flex gap-5 items-start relative z-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden"
              style={{ border: '2px solid rgba(0,255,157,0.35)', boxShadow: '0 0 20px rgba(0,255,157,0.15)' }}>
              <img
                src="https://picsum.photos/200/200?grayscale&random=42"
                alt="Agent Sarthak"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0) brightness(0.9) sepia(0.15) hue-rotate(90deg)' }}
              />
            </div>
            {/* Status badge */}
            <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold"
              style={{ background: 'rgba(0,255,157,0.15)', border: '1px solid rgba(0,255,157,0.4)', color: '#00ff9d' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              ACTIVE
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] mb-1" style={{ color: 'rgba(0,255,157,0.4)' }}>
              AGENT_PROFILE.dat // CLEARANCE: OMEGA
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white mb-0.5">
              Sarthak Mayani
            </h1>
            <p className="text-[11px] mb-3" style={{ color: 'rgba(0,255,157,0.6)' }}>
              SOFTWARE ENGINEER // FULL STACK DEVELOPER
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,255,157,0.7)' }}>
                <MapPin size={11} /> <span>Surat, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,255,157,0.7)' }}>
                <Globe size={11} /> <span>sarthakmayani22@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 pt-4 text-xs leading-relaxed"
          style={{ borderTop: '1px solid rgba(0,255,157,0.1)', color: 'rgba(0,255,157,0.75)' }}>
          <span style={{ color: '#00ff9d', fontWeight: 600 }}>BIO_SUMMARY: </span>
          Motivated software engineer skilled in Java, C, and Python. Comfortable with both front-end (React, Angular) and back-end development. Strong problem-solving skills with a focus on writing clean, efficient code and creating reliable software solutions.
        </div>
      </motion.div>

      {/* ── Education ── */}
      <motion.div {...fadeUp(0.1)}>
        <h3 className="text-[10px] font-bold tracking-[0.25em] mb-3 flex items-center gap-2 pb-2"
          style={{ color: 'rgba(0,255,157,0.5)', borderBottom: '1px solid rgba(0,255,157,0.1)' }}>
          <GraduationCap size={13} /> EDUCATION_LOG
        </h3>
        <div className="space-y-3">
          {[
            { degree: 'BCA – Bachelor of Computer Application', inst: 'UKA TARSADIA UNIVERSITY', year: '2021–2024' },
            { degree: 'HSC', inst: 'Ashadeep Group of Schools, Surat', year: '2020–2021' },
            { degree: 'SSC', inst: 'Ashadeep Group of Schools, Surat', year: '2018–2019' },
          ].map((edu, i) => (
            <motion.div key={i} {...fadeUp(0.12 + i * 0.07)}
              className="flex items-start gap-3 pl-3"
              style={{ borderLeft: '2px solid rgba(0,255,157,0.2)' }}>
              <div>
                <div className="text-xs font-semibold text-white">{edu.degree}</div>
                <div className="text-[10px]" style={{ color: 'rgba(0,255,157,0.55)' }}>{edu.inst}</div>
                <div className="text-[9px] font-bold mt-0.5" style={{ color: 'rgba(0,229,255,0.5)' }}>{edu.year}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Certifications ── */}
      <motion.div {...fadeUp(0.25)}>
        <h3 className="text-[10px] font-bold tracking-[0.25em] mb-3 flex items-center gap-2 pb-2"
          style={{ color: 'rgba(0,255,157,0.5)', borderBottom: '1px solid rgba(0,255,157,0.1)' }}>
          <Award size={13} /> CERTIFICATIONS
        </h3>
        <div className="p-3 rounded-lg flex items-start gap-3"
          style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)' }}>
          <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)' }}>
            <Award size={16} style={{ color: '#00e5ff' }} />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Java Full Stack Certification</div>
            <div className="text-[10px]" style={{ color: 'rgba(0,229,255,0.6)' }}>SEED Foundation</div>
            <div className="text-[9px] mt-1 font-bold tracking-wider" style={{ color: '#00e5ff' }}>
              ✓ VERIFIED CREDENTIAL
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
