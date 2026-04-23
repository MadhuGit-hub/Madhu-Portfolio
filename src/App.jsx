import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView, useMotionValue } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Download, 
  Menu, 
  X, 
  ChevronDown, 
  Code, 
  Cpu, 
  Database, 
  Globe, 
  Award, 
  Terminal,
  Layers,
  Sparkles,
  Zap,
  Briefcase
} from 'lucide-react';
import resume from './assets/resume.pdf';
import profilePic from './assets/Photo.png';

const Github = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// --- HELPER: 3D Tilt Hook ---
const useTilt = () => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((y - 0.5) * -20);
    rotateY.set((x - 0.5) * 20);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
};

// --- COMPONENT: 3D Tilt Card ---
const TiltCard = ({ children, className = "" }) => {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
  const springConfig = { stiffness: 300, damping: 30 };
  const dx = useSpring(rotateY, springConfig);
  const dy = useSpring(rotateX, springConfig);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: dy,
        rotateY: dx,
        transformPerspective: 1200,
      }}
      className={`glass-card holographic relative group overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50" />
      {/* HUD Corners Decor */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan/40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan/40" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan/40" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// --- COMPONENT: HUD Decorator ---
const HUDDecorator = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
    <div className="absolute top-10 left-10 font-mono text-[10px] text-cyber-cyan/20 space-y-1">
      <div>SYSTEM_STATUS: ACTIVE</div>
      <div>CORE_TEMP: 32.4C</div>
      <div>NEURAL_LINK: STABLE</div>
    </div>
    <div className="absolute bottom-10 right-10 font-mono text-[10px] text-cyber-purple/20 text-right space-y-1">
      <div>PROTOCOL: CYBER_P0RT_V4</div>
      <div>ENCRYPTION: AES-256</div>
      <div>LOCATION: HYDERABAD_IN</div>
    </div>
    <div className="scanline" />
    <div className="noise" />
  </div>
);

// --- COMPONENT: Neural Grid ---
const NeuralGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const lines = [];
    const lineCount = 40;

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Perspective Grid
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Vertical lines from perspective point
      const centerX = canvas.width / 2;
      const horizon = canvas.height * 0.4;
      for (let i = -canvas.width; i < canvas.width * 2; i += 80) {
        ctx.beginPath();
        ctx.moveTo(centerX, horizon);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Moving Data Streams
      ctx.lineWidth = 2;
      lines.forEach(l => {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(l.x, l.y, l.x, l.y + l.length);
        gradient.addColorStop(0, `rgba(0, 242, 255, 0)`);
        gradient.addColorStop(1, `rgba(0, 242, 255, ${l.opacity})`);
        ctx.strokeStyle = gradient;
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y + l.length);
        ctx.stroke();

        l.y += l.speed;
        if (l.y > canvas.height) {
          l.y = -l.length;
          l.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

// --- COMPONENT: Loading Screen ---
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      className="fixed inset-0 z-[1000] bg-cyber-bg flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="scanline" />
        <div className="noise" />
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center mb-12">
        <div className="absolute inset-0 border border-cyber-cyan/20 rounded-full animate-spin-slow" />
        <div className="absolute inset-[-10px] border-t-2 border-l-2 border-cyber-cyan/60 rounded-full animate-spin" />
        <div className="absolute inset-[-20px] border-b-2 border-r-2 border-cyber-purple/60 rounded-full animate-reverse-spin" style={{ animationDuration: '3s' }} />
        <span className="text-5xl font-orbitron font-900 text-neon-cyan relative z-10">MC</span>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-cyber-cyan font-mono tracking-[0.5em] uppercase text-xs animate-pulse">
          // ESTABLISHING_NEURAL_LINK
        </h2>
        <div className="font-mono text-[10px] text-cyber-muted space-y-1">
          <div>ENCRYPTING_DATA... [OK]</div>
          <div>LOADING_ASSETS... [{progress}%]</div>
        </div>
      </div>

      <div className="w-full max-w-[400px] h-1 bg-cyber-cyan/10 mt-8 relative overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan shadow-[0_0_15px_rgba(0,242,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan" style={{ animationDuration: '2s' }} />
      </div>
    </motion.div>
  );
};

// --- SECTION: Hero ---
const Hero = () => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrases = ["SDE Aspirant", "AI/ML Developer", "Backend Engineer", "Generative AI Builder", "Python Developer"];
  const typingSpeed = isDeleting ? 40 : 80;

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timer = setTimeout(() => {
      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      } else {
        setText(currentPhrase.substring(0, isDeleting ? text.length - 1 : text.length + 1));
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex]);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5">
            <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]" />
            <span className="text-[10px] font-mono tracking-widest text-cyber-cyan uppercase">SYSTEM_MANIFEST: ONLINE</span>
          </div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-orbitron font-900 text-white mb-6 leading-tight"
          >
            MADHU <span className="text-neon-cyan italic">CHERUKURI</span>
          </motion.h1>

          <div className="font-mono text-xl md:text-2xl text-cyber-purple mb-8 flex items-center gap-2">
            <span className="opacity-50">#</span>
            <span className="animate-glitch">{text}</span>
            <span className="w-2 h-6 bg-cyber-purple inline-block animate-blink" />
          </div>

          <p className="text-cyber-muted text-lg max-w-lg mb-10 leading-relaxed font-rajdhani font-medium">
             PRE_FINAL_YEAR_CSE • HYDERABAD_IN • SDE_ENGINEERING
             <br />
             <span className="text-xs opacity-50 mt-2 block tracking-tighter">// DEVELOPING_SCALABLE_AI_INFRASTRUCTURE</span>
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.a 
              href="#projects"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="btn-cyber"
            >
              ACCESS_PROJECTS
            </motion.a>
            <motion.a 
              href={resume} target="_blank"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 glass-card text-cyber-cyan font-orbitron font-bold text-sm tracking-widest hover:border-cyber-cyan/50"
            >
              EXTRACT_CV
            </motion.a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative flex justify-center"
        >
          <motion.div style={{ y: yParallax }} className="relative w-full max-w-md aspect-square">
            <TiltCard className="p-2 h-full rounded-none">
               <div className="absolute inset-4 border border-white/5 pointer-events-none" />
               <div className="w-full h-full bg-black/40 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-overlay">
                    <div className="scanline" style={{ position: 'absolute' }} />
                  </div>
                  <img src={profilePic} alt="Madhu" className="w-full h-full object-cover grayscale opacity-80 mix-blend-lighten" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-transparent" />
               </div>
               
               {/* Floating Stats */}
               <div className="absolute -right-4 top-1/4 space-y-4">
                 {['3 Internships', '5+ Projects', '8.0 GPA'].map((stat, i) => (
                   <motion.div 
                    key={stat}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="glass-card px-4 py-2 text-[10px] font-mono border-cyber-cyan/30 text-cyber-cyan backdrop-blur-md"
                   >
                     {stat}
                   </motion.div>
                 ))}
               </div>
            </TiltCard>
            
            {/* HUD Elements */}
            <div className="absolute -inset-10 border border-cyber-cyan/10 pointer-events-none rounded-full animate-spin-slow opacity-20" />
            <div className="absolute -inset-6 border border-cyber-purple/10 pointer-events-none rounded-full animate-reverse-spin opacity-10" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyber-cyan cursor-pointer"
        onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

// --- SECTION: About ---
const About = () => {
  const skills = [
    { name: "Python", value: 92 },
    { name: "Generative AI/LLMs", value: 85 },
    { name: "Machine Learning", value: 80 },
    { name: "Backend Dev", value: 78 },
    { name: "React.js", value: 72 },
    { name: "SQL/Databases", value: 75 },
    { name: "Spring Boot", value: 70 },
  ];

  return (
    <section id="about" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col md:flex-row items-center gap-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-900 text-white uppercase tracking-tighter">
            USER_<span className="text-neon-cyan">PROFILE</span>
          </h2>
          <div className="flex-grow h-[2px] bg-gradient-to-r from-cyber-cyan/50 to-transparent" />
          <span className="font-mono text-[10px] text-cyber-muted opacity-50 tracking-[0.3em]">ID: MC_SDE_V4</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 space-y-6 relative"
          >
            <div className="absolute top-4 right-4 font-mono text-[8px] text-cyber-cyan/30 animate-pulse">
              // READING_BIO...
            </div>
            <p className="text-cyber-text text-xl leading-relaxed font-rajdhani">
              I'm Madhu, a pre-final year CS student passionate about building <span className="text-cyber-cyan">AI-powered 
              systems</span> and scalable backend architectures. I thrive at the intersection of 
              Machine Learning, Generative AI, and real-world software engineering.
            </p>
            <p className="text-cyber-muted text-lg leading-relaxed font-rajdhani">
              Based in <span className="text-white font-medium">Hyderabad, India</span>, I spend my time exploring LLMs, 
              optimizing data pipelines, and contributing to open-source projects.
            </p>
            <div className="inline-flex items-center gap-3 glass-card px-5 py-3 border-cyber-cyan/20">
              <span className="w-3 h-3 bg-cyber-pink rounded-full animate-pulse shadow-[0_0_10px_#ff00f7]" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan">Status: Available for SDE Roles</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-cyber-cyan opacity-80">{skill.name}</span>
                  <span className="font-mono text-xs text-cyber-purple">{skill.value}%</span>
                </div>
                <div className="h-1 bg-white/5 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" style={{ animationDuration: '3s' }} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION: Experience ---
const Experience = () => {
  const experiences = [
    {
      role: "Backend Engineering Intern",
      company: "Infosys Springboard — Cohort 6.0",
      period: "Feb 2026 – Mar 2026",
      badge: "Industry",
      color: "cyan",
      points: [
        "Built full-stack Smart Ride-Sharing Platform (React + Spring Boot + MySQL)",
        "Integrated OSRM APIs for real-time dynamic route optimization",
        "Implemented Stripe Payment Gateway + automated notification pipeline"
      ]
    },
    {
      role: "AI/ML Research Intern",
      company: "IIITDM Kancheepuram",
      period: "Sep 2025 – Nov 2025",
      badge: "Research",
      color: "purple",
      points: [
        "Designed Hybrid ML model for real-time ransomware detection",
        "Applied ensemble techniques to classify malicious vs. benign behavior",
        "Curated multi-feature system activity datasets for threat intelligence"
      ]
    },
    {
      role: "Backend Development Intern",
      company: "VaultOfCodes",
      period: "Aug 2025",
      badge: "Backend",
      color: "pink",
      points: [
        "Built Library Management System in Java with JDBC-MySQL",
        "Implemented full CRUD operations for 1,000+ records"
      ]
    }
  ];

  return (
    <section id="experience" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-orbitron font-900 text-white uppercase tracking-tighter">
            CAREER_<span className="text-neon-purple">LOGS</span>
          </h2>
          <div className="flex-grow h-[2px] bg-gradient-to-r from-cyber-purple/50 to-transparent" />
        </div>

        <div className="relative">
          {/* Vertical Grid Line */}
          <div className="absolute left-[21px] md:left-1/2 top-0 bottom-0 w-[1px] bg-cyber-purple/20 hidden md:block" />

          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-[45%]">
                  <TiltCard className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-orbitron font-700 text-white uppercase">{exp.role}</h3>
                      <span className="font-mono text-[8px] tracking-[0.2em] px-2 py-1 border border-cyber-cyan/30 text-cyber-cyan uppercase bg-cyber-cyan/5">
                        {exp.badge}
                      </span>
                    </div>
                    <p className="text-cyber-cyan font-mono text-xs mb-1 uppercase opacity-80">{exp.company}</p>
                    <p className="text-cyber-muted font-mono text-[10px] mb-6 flex items-center gap-2">
                       <Briefcase size={12} /> {exp.period}
                    </p>
                    <ul className="space-y-4">
                      {exp.points.map((p, i) => (
                        <li key={i} className="text-sm text-cyber-text/80 flex items-start gap-4">
                           <span className="w-4 h-[1px] bg-cyber-purple mt-2.5 shrink-0" />
                           <span className="font-rajdhani">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </div>

                <div className="hidden md:flex z-10 bg-cyber-bg p-1 border border-cyber-purple/50 my-6 md:my-0 rotate-45">
                  <div className="w-4 h-4 bg-cyber-purple shadow-[0_0_10px_#bc13fe]" />
                </div>

                <div className="w-full md:w-[45%] hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION: Projects ---
const Projects = () => {
  const projects = [
    {
      title: "Kisan AI",
      category: "Agricultural Assistant",
      emoji: "🌾",
      desc: "Scalable AI assistant for rural farmers integrating LLM, weather, and government data APIs with reliable fallback architecture.",
      tech: ["OpenRouter LLM", "Weather API", "REST APIs"],
      tags: ["AI", "Backend"],
      links: { github: "#", live: "#" }
    },
    {
      title: "Emergency Triage AI",
      category: "Healthcare System",
      emoji: "🏥",
      desc: "Reduced emergency patient prioritization from 20 mins to 3 secs using XGBoost ML model with real-time dashboard.",
      tech: ["XGBoost", "Flask-SocketIO", "SQLite"],
      tags: ["ML", "Real-time"],
      links: { github: "#", live: "#" }
    },
    {
      title: "AI Commercial Ad",
      category: "Creative GenAI",
      emoji: "🎬",
      desc: "End-to-end AI-generated advertisement: LLM scriptwriting, diffusion image generation, AI animation, and voice synthesis.",
      tech: ["Midjourney", "Runway", "ElevenLabs"],
      tags: ["GenAI", "Creative"],
      links: { github: "#", live: "#" }
    },
    {
      title: "Smart Ride-Sharing",
      category: "Full-Stack",
      emoji: "🚗",
      desc: "Carpooling platform with multi-role workflows, real-time route optimization, and secure payments via Stripe.",
      tech: ["Spring Boot", "MySQL", "OSRM APIs"],
      tags: ["Full-Stack", "Backend"],
      links: { github: "#", live: "#" }
    },
    {
      title: "Ransomware Detector",
      category: "Cybersecurity",
      emoji: "🛡️",
      desc: "Real-time detection system using hybrid ensemble ML on behavioral system-level datasets for threat intelligence.",
      tech: ["Python", "Ensemble ML", "Scikit"],
      tags: ["Security", "Research"],
      links: { github: "#", live: "#" }
    }
  ];

  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-20 justify-end text-right">
          <div className="flex-grow h-[2px] bg-gradient-to-l from-cyber-cyan/50 to-transparent" />
          <h2 className="text-4xl md:text-5xl font-orbitron font-900 text-white uppercase tracking-tighter">
            ACTIVE_<span className="text-neon-cyan">PROJECTS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <TiltCard key={index} className="flex flex-col h-full">
              <div className="p-8 flex flex-col h-full relative">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-cyber-muted opacity-30">
                  PROJECT_REF: {index + 104}
                </div>
                <div className="w-14 h-14 rounded-none border border-cyber-cyan/20 bg-cyber-cyan/5 flex items-center justify-center text-3xl mb-8">
                  {project.emoji}
                </div>
                <h3 className="text-xl font-orbitron font-700 mb-2 uppercase text-white tracking-wider">{project.title}</h3>
                <p className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.2em] mb-4">{project.category}</p>
                <p className="text-cyber-muted text-sm leading-relaxed mb-8 flex-grow font-rajdhani">
                  {project.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8 border-l border-white/5 pl-4">
                  {project.tech.map(t => (
                    <span key={t} className="text-[10px] font-mono text-cyber-cyan/70">[{t}]</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-4">
                    <motion.a href={project.links.github} whileHover={{ color: '#00f2ff' }} className="text-cyber-muted transition-colors"><Github size={18} /></motion.a>
                    <motion.a href={project.links.live} whileHover={{ color: '#00f2ff' }} className="text-cyber-muted transition-colors"><ExternalLink size={18} /></motion.a>
                  </div>
                  <span className="text-[9px] text-cyber-muted font-mono tracking-tighter uppercase">// STATUS: DEPLOYED</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SECTION: Skills ---
const Skills = () => {
  const mainSkills = [
    { name: "Python", icon: "🐍" }, { name: "Java", icon: "☕" }, 
    { name: "JavaScript", icon: "⚡" }, { name: "SQL", icon: "🗄️" }, 
    { name: "Spring Boot", icon: "🍃" }, { name: "React.js", icon: "⚛️" }, 
    { name: "REST APIs", icon: "🔗" }, { name: "MySQL", icon: "🐬" }, 
    { name: "Git", icon: "🔀" }, { name: "Machine Learning", icon: "🤖" }, 
    { name: "Generative AI", icon: "✨" }, { name: "Prompt Eng", icon: "💬" },
    { name: "LLM APIs", icon: "🧠" }, { name: "OSRM APIs", icon: "🗺️" }, 
    { name: "Stripe", icon: "💳" }, { name: "JDBC", icon: "🔧" }
  ];

  const tools = ["ChatGPT", "Midjourney", "Runway", "ElevenLabs", "GitHub", "VS Code", "LeetCode"];

  return (
    <section id="skills" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-24">
          <h2 className="text-4xl md:text-5xl font-orbitron font-900 text-white uppercase tracking-tighter">
            TECH_<span className="text-neon-cyan">STACK</span>
          </h2>
          <div className="flex-grow h-[2px] bg-gradient-to-r from-cyber-cyan/50 to-transparent" />
        </div>

        <div className="space-y-24">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {mainSkills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, borderColor: '#00f2ff', boxShadow: '0 0 15px rgba(0,242,255,0.2)' }}
                className="glass-card p-6 flex flex-col items-center gap-4 border-white/5 cursor-default transition-all duration-300"
              >
                <span className="text-3xl">{skill.icon}</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-center text-cyber-text">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center bg-cyber-purple/5 p-12 border-y border-cyber-purple/20">
             <h3 className="text-cyber-pink font-orbitron font-700 mb-10 tracking-[0.3em] uppercase text-sm">// GEN_AI_&_WORKFLOW_ENGINES</h3>
             <div className="flex flex-wrap justify-center gap-4">
                {tools.map((tool) => (
                  <motion.span 
                    key={tool}
                    whileHover={{ scale: 1.05, background: 'rgba(255,0,247,0.1)' }}
                    className="glass-card px-6 py-2 text-xs font-mono text-cyber-text tracking-widest border-cyber-pink/20"
                  >
                    {tool}
                  </motion.span>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION: GitHub Heatmap ---
const GitHubHeatmap = () => {
  const seed = 123;
  const getRandom = (i) => {
    const x = Math.sin(i * 999) * 10000;
    return x - Math.floor(x);
  };

  const cells = useMemo(() => {
    return Array.from({ length: 52 * 7 }).map((_, i) => {
      const val = getRandom(i);
      if (val < 0.6) return 0;
      if (val < 0.8) return 1;
      if (val < 0.9) return 2;
      if (val < 0.97) return 3;
      return 4;
    });
  }, []);

  const getCellColor = (level) => {
    switch(level) {
      case 0: return 'rgba(0, 242, 255, 0.05)';
      case 1: return 'rgba(188, 19, 254, 0.2)';
      case 2: return 'rgba(188, 19, 254, 0.4)';
      case 3: return 'rgba(188, 19, 254, 0.7)';
      case 4: return 'rgba(188, 19, 254, 1.0)';
      default: return 'rgba(0, 242, 255, 0.05)';
    }
  };

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="glass-card p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-cyber-cyan opacity-20">DATA_MIRROR: @MadhuGit-hub</div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-orbitron font-800 mb-2 uppercase text-white tracking-widest">NEURAL_ACTIVITY</h2>
              <a href="https://github.com/MadhuGit-hub" target="_blank" className="text-cyber-cyan hover:text-white transition-colors flex items-center gap-2 font-mono text-xs">
                ACCESS_REMOTE_REPO <ExternalLink size={12} />
              </a>
            </div>
            <div className="flex gap-4">
               {['ACTIVE', 'COMMITTING'].map(s => <div key={s} className="glass-card px-4 py-1 text-[8px] uppercase font-bold text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5">{s}</div>)}
            </div>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="grid grid-flow-col grid-rows-7 gap-[4px] min-w-[700px]">
              {cells.map((level, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.001 }}
                  style={{ backgroundColor: getCellColor(level) }}
                  className={`w-3 h-3 ${level > 2 && getRandom(i) > 0.9 ? 'shadow-[0_0_10px_#bc13fe] !bg-cyber-purple' : ''} border border-white/5`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 text-[8px] text-cyber-muted uppercase tracking-[0.4em] font-mono">
            <span>DORMANT</span>
            <div className="flex gap-1">
              {[0,1,2,3,4].map(l => <div key={l} style={{ backgroundColor: getCellColor(l) }} className="w-3 h-3" />)}
            </div>
            <span>INTENSE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION: Certs & Achievements ---
const CertsAchievements = () => {
  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-orbitron font-800 text-white uppercase tracking-wider">CERTIFICATIONS</h2>
            <div className="flex-grow h-[1px] bg-cyber-cyan/30" />
          </div>
          <div className="space-y-4">
            {[
              { title: "Generative AI — Google Cloud", icon: "🎓" },
              { title: "Python AI Development", icon: "🐍" },
              { title: "Infosys Springboard", icon: "📜" },
              { title: "Internshala Partner", icon: "🤝" }
            ].map((cert, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="glass-card p-6 border-l-2 border-cyber-cyan flex items-center gap-6 hover:bg-cyber-cyan/5 transition-all"
              >
                <span className="text-2xl">{cert.icon}</span>
                <span className="font-orbitron font-600 text-sm tracking-widest text-cyber-text uppercase">{cert.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-orbitron font-800 text-white uppercase tracking-wider">ACHIEVEMENTS</h2>
            <div className="flex-grow h-[1px] bg-cyber-purple/30" />
          </div>
          <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-cyber-purple/20">
            {[
              { title: "Hackathon Finalist", desc: "Top 10 in State-level AI Hackathon", icon: "🏆" },
              { title: "Open Source Contributor", desc: "Merged 15+ PRs in GenAI tools", icon: "🚀" },
              { title: "Academic Excellence", desc: "Consistent top tier GPA performer", icon: "📈" }
            ].map((ach, i) => (
              <motion.div 
                key={i}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="relative"
              >
                <div className="absolute -left-[36px] top-1 w-4 h-4 bg-cyber-bg border border-cyber-purple flex items-center justify-center rotate-45 z-10">
                  <div className="w-1.5 h-1.5 bg-cyber-purple shadow-[0_0_5px_#bc13fe]" />
                </div>
                <div className="glass-card p-6 border-l-2 border-cyber-purple">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{ach.icon}</span>
                    <h3 className="font-orbitron font-700 text-sm uppercase text-white">{ach.title}</h3>
                  </div>
                  <p className="text-cyber-muted text-xs font-mono">{ach.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION: Contact ---
const Contact = () => {
  return (
    <section id="contact" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-20 relative overflow-hidden"
        >
          {/* HUD decor */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-scan" style={{ animationDuration: '4s' }} />
          
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-900 text-white uppercase mb-6 tracking-tighter">
              INITIALIZE_<span className="text-neon-cyan">UPLINK</span>
            </h2>
            <p className="text-cyber-muted font-rajdhani text-lg">
              Encryption active. Secure channel established. 
              <br />
              Ready to process your communication.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-20">
             <motion.a 
               href="https://www.linkedin.com/in/madhu-cherukuri-827094303" target="_blank"
               whileHover={{ scale: 1.05 }}
               className="btn-cyber !bg-none border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10"
             >
               CONNECT_VIA_LINKEDIN
             </motion.a>
             <motion.a 
               href="https://github.com/MadhuGit-hub" target="_blank"
               whileHover={{ scale: 1.05 }}
               className="btn-cyber !bg-none border border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10"
             >
               ACCESS_GIT_RECON
             </motion.a>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto border-t border-white/5 pt-16">
            <form 
              action="https://formspree.io/f/mqewpjao"
              method="POST"
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-left">
                  <label htmlFor="name" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-cyan mb-3 ml-1">// PROTOCOL: SENDER_NAME</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required
                    className="w-full bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:outline-none focus:border-cyber-cyan transition-all" 
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-cyan mb-3 ml-1">// PROTOCOL: RETURN_ADDR</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required
                    className="w-full bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:outline-none focus:border-cyber-cyan transition-all" 
                  />
                </div>
              </div>
              <div className="text-left">
                <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-purple mb-3 ml-1">// PROTOCOL: PAYLOAD_CONTENT</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows="5" 
                  required
                  className="w-full bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:outline-none focus:border-cyber-purple transition-all resize-none"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-cyber w-full !clip-none py-5 tracking-[0.5em]"
              >
                EXECUTE_MESSAGE_LAUNCH
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- COMPONENT: Navbar ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home', code: '01' },
    { name: 'PROFILE', href: '#about', code: '02' },
    { name: 'CAREER', href: '#experience', code: '03' },
    { name: 'ACTIVE_PROJECTS', href: '#projects', code: '04' },
    { name: 'TECH_STACK', href: '#skills', code: '05' },
    { name: 'CONTACT', href: '#contact', code: '06' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-cyber-cyan/20 shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 border border-cyber-cyan flex items-center justify-center font-orbitron font-900 text-xl text-cyber-cyan group-hover:bg-cyber-cyan group-hover:text-black transition-all">
            MC
          </div>
          <span className="text-[10px] font-mono text-cyber-muted tracking-[0.3em] uppercase hidden sm:block group-hover:text-cyber-cyan transition-colors">Madhu_Cherukuri.sys</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-8">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="font-mono text-[10px] tracking-[0.2em] text-cyber-muted hover:text-cyber-cyan transition-all flex flex-col items-center group"
            >
              <span className="text-cyber-purple/50 group-hover:text-cyber-purple transition-colors mb-1">{link.code}</span>
              {link.name}
              <span className="w-0 h-[1px] bg-cyber-cyan group-hover:w-full transition-all duration-300 mt-1" />
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-cyber-cyan" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-[90] bg-cyber-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-10">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-orbitron font-800 text-white hover:text-cyber-cyan transition-colors tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xs font-mono text-cyber-purple mr-4">{link.code}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- COMPONENT: App ---
function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-cyber-bg min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <NeuralGrid />
          <HUDDecorator />
          <Navbar />
          
          <main className="relative z-10">
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <GitHubHeatmap />
            <CertsAchievements />
            <Contact />
          </main>

          <footer className="py-12 border-t border-cyber-cyan/10 relative z-10 bg-black/40 backdrop-blur-sm">
            <div className="container mx-auto px-6 text-center">
               <p className="font-mono text-xs tracking-tighter text-cyber-cyan/40 mb-8 uppercase">
                 // DESIGN_MANIFEST: BUILT_BY_MADHU_CHERUKURI // YEAR_2025 // [V4.0_CYBER]
               </p>
               <div className="flex justify-center gap-6">
                 {[
                   { icon: <Github size={20} />, href: "https://github.com/MadhuGit-hub" },
                   { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/madhu-cherukuri-827094303" },
                   { icon: <Mail size={20} />, href: "mailto:cherukurimadhu52@gmail.com" }
                 ].map((social, i) => (
                   <motion.a 
                    key={i}
                    href={social.href} 
                    target="_blank"
                    whileHover={{ scale: 1.2, color: '#00f2ff', boxShadow: '0 0 15px rgba(0,242,255,0.4)' }}
                    className="glass-card w-12 h-12 flex items-center justify-center text-cyber-muted transition-all duration-300"
                   >
                     {social.icon}
                   </motion.a>
                 ))}
               </div>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}

export default App;
