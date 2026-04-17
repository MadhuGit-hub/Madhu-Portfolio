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
        transformPerspective: 1000,
      }}
      className={`glass relative group overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
};

// --- COMPONENT: Particle Canvas ---
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};

// --- COMPONENT: Loading Screen ---
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 1.25;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-[#03000f] flex flex-col items-center justify-center p-6"
    >
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div 
          className="absolute inset-0 rounded-full border-2 border-dashed border-violet/30"
          style={{ animation: 'rotate 4s linear infinite' }}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-t-violet border-r-cyan border-b-pink border-l-transparent shadow-[0_0_60px_rgba(124,58,237,0.6)]"
          style={{ animation: 'rotate 1s linear infinite' }}
        />
        <span className="text-4xl font-syne font-800 text-gradient">MC</span>
      </div>
      
      <h2 className="text-muted font-dmsans tracking-[0.3em] uppercase text-sm mb-6 animate-shimmer">
        Initializing Portfolio...
      </h2>

      <div className="w-full max-w-[480px] h-1.5 glass overflow-hidden rounded-full">
        <motion.div 
          className="h-full bg-gradient-to-r from-violet via-cyan to-pink shadow-[0_0_20px_rgba(124,58,237,0.8)]"
          style={{ width: `${progress}%` }}
        />
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

  // Parallax logic for blobs
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 1000], [0, 200]);
  const blob2Y = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <ParticleCanvas />
      
      {/* Background Blobs */}
      <motion.div style={{ y: blob1Y }} className="blob top-[-10%] left-[-10%] bg-[#7c3aed1e]" />
      <motion.div style={{ y: blob2Y }} className="blob bottom-[-20%] right-[-10%] bg-[#06b6d412]" />
      <div className="blob top-[30%] right-[-5%] bg-[#ec48990e]" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          <motion.p className="text-muted font-dmsans mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Hi, I'm 👋
          </motion.p>
          <motion.h1 
            className="text-6xl md:text-8xl font-syne font-800 text-gradient mb-6 drop-shadow-[0_0_80px_rgba(124,58,237,0.3)]"
          >
            Madhu Cherukuri
          </motion.h1>
          <div className="text-2xl md:text-3xl font-dmsans font-medium min-h-[40px] mb-6">
            <span>{text}</span>
            <span className="w-[3px] h-8 bg-violet inline-block ml-1 animate-blink align-middle" />
          </div>
          <p className="text-muted text-lg max-w-lg mb-10 leading-relaxed font-dmsans">
            Pre-Final Year CSE @ Anurag Engineering College · Hyderabad, India
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.a 
              href="#projects"
              whileHover={{ scale: 1.04 }} 
              whileTap={{ scale: 0.97 }}
              className="btn-glass"
            >
              View Projects
            </motion.a>
            <motion.a 
              href={resume} target="_blank"
              whileHover={{ scale: 1.04 }} 
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2"
            >
              Download Resume <Download size={18} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-full max-w-sm"
          >
            <TiltCard className="p-1 rounded-full aspect-square flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-4 border-dashed border-violet/20 animate-spin-slow" />
               <div className="w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-[#0a0025] to-[#000d1a] flex items-center justify-center overflow-hidden">
                  <span className="text-8xl font-syne font-800 text-gradient opacity-20">MC</span>
                  <img src={profilePic} alt="Madhu Cherukuri" className="absolute inset-0 w-full h-full object-cover opacity-80" />
               </div>
            </TiltCard>
            
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              {['3 Internships', '5+ Projects', '8.0 GPA'].map((stat) => (
                <div key={stat} className="glass px-4 py-2 text-sm font-medium border-violet/30 text-white/90">
                  {stat}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted"
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
        <motion.h2 
          className="text-4xl md:text-5xl font-syne font-800 text-gradient mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 space-y-6"
          >
            <p className="text-muted text-xl leading-relaxed">
              I'm Madhu, a pre-final year CS student passionate about building AI-powered 
              systems and scalable backend architectures. I thrive at the intersection of 
              Machine Learning, Generative AI, and real-world software engineering.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              Based in <span className="text-white font-medium">Hyderabad, India</span>, I spend my time exploring LLMs, 
              optimizing data pipelines, and contributing to open-source projects.
            </p>
            <div className="inline-flex items-center gap-3 glass px-5 py-3 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Open to: SDE · AI Engineering · Backend Roles</span>
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
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted">{skill.value}%</span>
                </div>
                <div className="h-2 glass rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet to-cyan"
                  />
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
      badge: "Industry Internship",
      color: "pink",
      points: [
        "Built full-stack Smart Ride-Sharing & Carpooling Platform (React + Spring Boot + MySQL)",
        "Integrated OSRM APIs for real-time dynamic distance calculation & route optimization",
        "Implemented Stripe Payment Gateway for secure transactions + automated notification pipeline"
      ]
    },
    {
      role: "AI/ML Research Intern",
      company: "IIITDM Kancheepuram — Prof. Sk. Noor Mahammad",
      period: "Sep 2025 – Nov 2025",
      badge: "Research Internship",
      color: "cyan",
      points: [
        "Designed and deployed a Hybrid ML model for real-time ransomware detection",
        "Applied ensemble ML techniques to classify malicious vs. benign behavior",
        "Curated & preprocessed multi-feature system activity datasets for threat intelligence"
      ]
    },
    {
      role: "Backend Development Intern",
      company: "VaultOfCodes (AICTE Approved)",
      period: "Aug 2025",
      badge: "Backend Internship",
      color: "violet",
      points: [
        "Built Library Management System backend in Java with JDBC-MySQL integration",
        "Implemented full CRUD operations for 1,000+ book & user records"
      ]
    }
  ];

  return (
    <section id="experience" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-syne font-800 text-gradient inline-block relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-violet after:to-cyan"
          >
            Experience
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet via-cyan to-transparent hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-[45%]">
                  <TiltCard className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-syne font-600">{exp.role}</h3>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border border-${exp.color}-500/30 bg-${exp.color}-500/10 text-${exp.color}-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]`}>
                        {exp.badge}
                      </span>
                    </div>
                    <p className="text-cyan font-medium mb-1">{exp.company}</p>
                    <p className="text-muted text-sm mb-6 flex items-center gap-2">
                       <Briefcase size={14} /> {exp.period}
                    </p>
                    <ul className="space-y-3">
                      {exp.points.map((p, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-violet mt-1.5 shrink-0" />
                           {p}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </div>

                <div className="z-10 bg-[#03000f] p-2 rounded-full border-2 border-violet shadow-[0_0_20px_rgba(124,58,237,0.5)] my-6 md:my-0">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet to-cyan" />
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
      category: "Agricultural AI Assistant",
      emoji: "🌾",
      desc: "Scalable AI assistant for rural farmers integrating LLM, weather, and government data APIs with reliable fallback architecture.",
      tech: ["OpenRouter LLM", "Weather API", "data.gov.in", "REST APIs"],
      tags: ["AI", "APIs", "Backend"],
      links: { github: "#", live: "#" }
    },
    {
      title: "Emergency Triage AI",
      category: "Hospital Triage System",
      emoji: "🏥",
      desc: "Reduced emergency patient prioritization from 20 minutes to 3 seconds using XGBoost ML model with real-time dashboard.",
      tech: ["XGBoost", "Flask-SocketIO", "SQLite", "Pandas"],
      tags: ["ML", "Healthcare", "Real-time"],
      links: { github: "#", live: "#" }
    },
    {
      title: "AI Commercial Ad",
      category: "Creative GenAI",
      emoji: "🎬",
      desc: "End-to-end AI-generated advertisement: LLM scriptwriting, diffusion image generation, AI animation, and voice synthesis.",
      tech: ["ChatGPT", "Midjourney", "Runway", "ElevenLabs"],
      tags: ["GenAI", "Creative", "Multimodal"],
      links: { github: "#", live: "#" }
    },
    {
      title: "Smart Ride-Sharing",
      category: "Full-Stack Project",
      emoji: "🚗",
      desc: "Carpooling platform with multi-role workflows, real-time route optimization, and secure payments via Stripe.",
      tech: ["React", "Spring Boot", "MySQL", "OSRM APIs"],
      tags: ["Full-Stack", "Backend", "Infosys"],
      links: { github: "#", live: "#" }
    },
    {
      title: "Ransomware Detector",
      category: "Cybersecurity ML",
      emoji: "🛡️",
      desc: "Real-time detection system using hybrid ensemble ML on behavioral system-level datasets for cybersecurity threat intelligence.",
      tech: ["Python", "Ensemble ML", "Scikit", "CyberSec"],
      tags: ["ML", "Security", "Research"],
      links: { github: "#", live: "#" }
    }
  ];

  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-syne font-800 text-gradient text-center mb-20"
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <TiltCard key={index} className="flex flex-col h-full hover:scale-[1.02] transition-transform duration-300">
              <div className="p-8 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center text-3xl mb-6 shadow-[0_0_20px_rgba(124,58,237,0.1)] border border-white/5">
                  {project.emoji}
                </div>
                <h3 className="text-xl font-syne font-600 mb-2">{project.title}</h3>
                <p className="text-cyan text-xs font-medium uppercase tracking-widest mb-4">{project.category}</p>
                <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">
                  {project.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 glass border-violet/20 text-[10px] text-violet-300 rounded font-medium">#{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-4">
                    <motion.a href={project.links.github} className="text-muted hover:text-white transition-colors"><Github size={20} /></motion.a>
                    <motion.a href={project.links.live} className="text-muted hover:text-white transition-colors"><ExternalLink size={20} /></motion.a>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">2025</span>
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
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-syne font-800 text-gradient text-center mb-20"
        >
          Technical Universe
        </motion.h2>

        <div className="space-y-16">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
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
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(124, 58, 237, 0.15)', borderColor: 'rgba(124, 58, 237, 0.5)' }}
                className="glass px-6 py-3 flex items-center gap-3 border-white/5 cursor-default transition-all duration-300"
              >
                <span>{skill.icon}</span>
                <span className="font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
             <h3 className="text-pink font-syne font-600 mb-8 tracking-widest uppercase text-sm">GenAI & Workflow Tools</h3>
             <div className="flex flex-wrap justify-center gap-3">
                {tools.map((tool) => (
                  <motion.span 
                    key={tool}
                    whileHover={{ scale: 1.05, borderLeft: '3px solid #EC4899' }}
                    className="glass px-4 py-2 text-sm text-muted rounded-full border-pink/20"
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
      case 0: return 'rgba(255,255,255,0.04)';
      case 1: return 'rgba(124,58,237,0.25)';
      case 2: return 'rgba(124,58,237,0.45)';
      case 3: return 'rgba(124,58,237,0.7)';
      case 4: return 'rgba(124,58,237,1.0)';
      default: return 'rgba(255,255,255,0.04)';
    }
  };

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="glass p-12 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-syne font-800 mb-2">GitHub Activity</h2>
              <a href="https://github.com/MadhuGit-hub" target="_blank" className="text-muted hover:text-white transition-colors flex items-center gap-2">
                @MadhuGit-hub <ExternalLink size={14} />
              </a>
            </div>
            <div className="flex gap-4">
               {['🔥 Active', '⭐ Contributor'].map(s => <div key={s} className="glass px-4 py-1 text-[10px] uppercase font-bold text-cyan border-cyan/20">{s}</div>)}
            </div>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-[700px]">
              {cells.map((level, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.001 }}
                  style={{ backgroundColor: getCellColor(level) }}
                  className={`w-3 h-3 rounded-[2px] ${level > 2 && getRandom(i) > 0.9 ? 'shadow-[0_0_8px_rgba(6,182,212,0.8)] !bg-cyan' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 text-[10px] text-muted uppercase tracking-widest font-medium">
            <span>Less</span>
            <div className="flex gap-1">
              {[0,1,2,3,4].map(l => <div key={l} style={{ backgroundColor: getCellColor(l) }} className="w-3 h-3 rounded-[2px]" />)}
            </div>
            <span>More</span>
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
          <h2 className="text-3xl font-syne font-800 text-gradient mb-12">Certifications</h2>
          <div className="space-y-4">
            {[
              { title: "Generative AI — Google Cloud", icon: "🎓" },
              { title: "Python AI Development", icon: "🐍" },
              { title: "Infosys Springboard — Certifications", icon: "📜" },
              { title: "Internshala Student Partner", icon: "🤝" }
            ].map((cert, i) => (
              <motion.div 
                key={i}
                whileInView={{ x: [ -20, 0 ], opacity: [0, 1] }}
                className="glass p-6 border-l-4 border-violet flex items-center gap-6 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-shadow"
              >
                <span className="text-2xl">{cert.icon}</span>
                <span className="font-medium text-lg">{cert.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-syne font-800 text-gradient mb-12">Achievements</h2>
          <div className="relative pl-8 space-y-12 after:content-[''] after:absolute after:left-[11px] after:top-2 after:bottom-2 after:w-[2px] after:bg-white/10">
             {[
               "Adobe India Hackathon — Participant",
               "SRM Smart Park Hackathon — Participant",
               "National Level Tech Fest — Coding & Design Winner"
             ].map((ach, i) => (
               <motion.div 
                 key={i}
                 whileInView={{ x: [ 20, 0 ], opacity: [0, 1] }}
                 className="relative"
               >
                 <div className="absolute left-[-29px] top-1.5 w-[14px] h-[14px] rounded-full bg-violet shadow-[0_0_10px_#7C3AED] z-10" />
                 <h3 className="text-xl font-syne flex items-center gap-3 italic">
                    <Award className="text-violet" size={24} /> {ach}
                 </h3>
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
      <div className="container mx-auto px-6 text-center">
        <motion.div 
          className="glass max-w-4xl mx-auto p-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/10 blur-[100px] pointer-events-none" />

          <h2 className="text-5xl md:text-6xl font-syne font-800 text-gradient mb-8">
            Let's Build Something Incredible
          </h2>
          <p className="text-muted text-xl mb-12 max-w-2xl mx-auto">
             Open to SDE · AI Engineering · Backend roles — Full-time / Internship.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-left">
            {[
              { icon: <Mail />, label: "Email", value: "cherukurimadhu52@gmail.com", href: "mailto:cherukurimadhu52@gmail.com" },
              { icon: <Linkedin />, label: "LinkedIn", value: "in/madhu-cherukuri", href: "https://www.linkedin.com/in/madhu-cherukuri-827094303" },
              { icon: <Github />, label: "GitHub", value: "MadhuGit-hub", href: "https://github.com/MadhuGit-hub" },
              { icon: <MapPin />, label: "Location", value: "Hyderabad, India" },
              { icon: <Phone />, label: "Phone", value: "+91 78422-85972", href: "tel:+917842285972" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                 <div className="w-12 h-12 glass flex items-center justify-center text-violet group-hover:text-cyan transition-colors">
                    {item.icon}
                 </div>
                 <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium hover:text-violet transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm font-medium">{item.value}</p>
                    )}
                 </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-20">
             <motion.a 
               href="https://www.linkedin.com/in/madhu-cherukuri-827094303" target="_blank"
               whileHover={{ scale: 1.04 }}
               className="btn-glass flex items-center gap-2 border-violet/50"
             >
               LinkedIn Profile <ExternalLink size={18} />
             </motion.a>
             <motion.a 
               href="https://github.com/MadhuGit-hub" target="_blank"
               whileHover={{ scale: 1.04 }}
               className="btn-glass flex items-center gap-2 border-cyan/50"
             >
               GitHub Profile <ExternalLink size={18} />
             </motion.a>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-syne font-600 mb-8 text-center flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-violet/50" />
              Send a Message
              <span className="w-8 h-[1px] bg-violet/50" />
            </h3>
            <form 
              action="https://formspree.io/f/mqewpjao"
              method="POST"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    placeholder="John Doe"
                    required
                    className="input-field" 
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="john@example.com"
                    required
                    className="input-field" 
                  />
                </div>
              </div>
              <div className="text-left">
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted mb-2 ml-1">Your Message</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows="5" 
                  placeholder="Hello, I'd like to talk about..."
                  required
                  className="input-field resize-none"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full shadow-lg shadow-violet/20"
              >
                Launch Message
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
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 glass !rounded-none border-b border-violet/20' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-syne font-800 text-gradient">MC</span>
          <span className="text-xs font-dmsans text-muted hidden sm:block">Madhu Cherukuri</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/80 hover:text-violet transition-colors relative group"
            >
              {link.name}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-gradient-to-r from-violet to-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden !rounded-none border-b border-white/10"
          >
            <div className="flex flex-col p-8 gap-4">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-xl font-syne font-600"
                  onClick={() => setIsOpen(false)}
                >
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
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="relative bg-[#03000f] text-white selection:bg-violet/30 min-h-screen">
          <Navbar />
          
          <main>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <GitHubHeatmap />
            <CertsAchievements />
            <Contact />
          </main>

          <footer className="py-12 border-t border-white/5 relative z-10">
            <div className="container mx-auto px-6 text-center">
               <p className="text-muted text-sm mb-8">
                 Designed & Built with ❤️ by Madhu Cherukuri · 2025
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
                    whileHover={{ scale: 1.2, color: '#7C3AED' }}
                    className="glass w-12 h-12 flex items-center justify-center text-muted transition-colors"
                   >
                     {social.icon}
                   </motion.a>
                 ))}
               </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
