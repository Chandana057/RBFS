import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, ShieldCheck, BarChart3, Users, Building2, BadgeDollarSign, Info } from "lucide-react";
import { Button } from "../components/ui/Button";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col text-on-surface">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none z-0" />

      {/* Nav */}
      <header className="container mx-auto px-6 h-24 flex items-center justify-between relative z-10 border-b border-white/5">
        <div className="text-xl font-bold font-manrope tracking-tighter flex items-center gap-2">
          ShareVault.
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          <a href="#features" className="text-white border-b border-white pb-1">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-on-surface hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register">
            <Button className="bg-[#8A78F7] hover:bg-[#7e6be9] text-white rounded-full px-6 py-2 h-auto text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-on-surface-variant mb-6 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[#8A78F7]" />
              Military-Grade Security Protocol
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-manrope tracking-tight leading-[1.1] mb-6 text-white">
              Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b3a8eb] to-[#8A78F7]">Role-Based</span><br/>
              File Sharing
            </h1>
            
            <p className="text-base md:text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
              A decentralized obsidian-grade architecture for enterprise data sovereignty. Grant access with surgical precision through biometric-verified roles.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-[#8A78F7] hover:bg-[#7e6be9] text-white rounded-full px-8 h-12 text-base font-medium shadow-[0_0_30px_-5px_rgba(138,120,247,0.5)]">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="glass-panel text-white border-white/10 rounded-full px-8 h-12 text-base font-medium hover:bg-white/5">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Server Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container mx-auto px-6 mt-20"
        >
          <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-surface-container aspect-video">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80" 
              alt="Data Center" 
              className="w-full h-full object-cover object-center opacity-40 brightness-75 mix-blend-luminosity"
            />
            {/* Glowing orb center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_50px_20px_rgba(255,255,255,0.3)] z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white/0 via-white/20 to-white/0 z-0" />
          </div>
        </motion.div>

        {/* Feature Section */}
        <section id="features" className="container mx-auto px-6 mt-40 max-w-6xl scroll-mt-28">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 border-b border-white/10 pb-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold font-manrope text-white mb-4">
                Built for the modern <br/><span className="text-[#8A78F7]">enterprise.</span>
              </h2>
              <p className="text-on-surface-variant text-lg">
                Eliminate data leaks with ShareVault's zero-trust infrastructure. Your data, governed by your rules, encrypted forever. 
              </p>
            </div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
              SECTION 00 // CAPABILITY
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Shield className="w-5 h-5 text-[#8A78F7]" />}
              title="Role-Based Access"
              desc="Define granular permissions that evolve with your team. Use context-aware policies to ensure the right people have the right access at the right time."
              colSpan="lg:col-span-1"
            />
            <FeatureCard 
              icon={<Lock className="w-5 h-5 text-white" />}
              title="End to End Encryption"
              desc="AES-256 bit encryption in rest and in transit. Private keys never leave your device."
              colSpan="lg:col-span-2"
            />
            <FeatureCard 
              icon={<Users className="w-5 h-5 text-[#21d0a5]" />}
              title="Real-Time Collaboration"
              desc="Simultaneous multi-user editing with cryptographic integrity checks on every save."
              colSpan="lg:col-span-1"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-5 h-5 text-[#8A78F7]" />}
              title="Advanced Analytics"
              desc="Full audit trails and behavioral intelligence. Visualize every interaction with your secure parameter."
              colSpan="lg:col-span-2"
              showGraph={true}
            />
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-6 mt-32 max-w-6xl scroll-mt-28">
          <div className="flex items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-manrope text-white">Pricing without surprises.</h2>
              <p className="text-on-surface-variant mt-3 max-w-2xl">
                Start with controlled team sharing, then scale into audited enterprise security as your org grows.
              </p>
            </div>
            <BadgeDollarSign className="hidden md:block w-8 h-8 text-[#8A78F7]" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              icon={<Info className="w-5 h-5 text-[#8A78F7]" />}
              title="Starter"
              eyebrow="Free"
              desc="Best for demos, learning the product, and small internal document workflows."
            />
            <InfoCard
              icon={<BadgeDollarSign className="w-5 h-5 text-[#21d0a5]" />}
              title="Business"
              eyebrow="Custom Seats"
              desc="Adds audit history, role hierarchies, shared team vaults, and approval-based access control."
            />
            <InfoCard
              icon={<Building2 className="w-5 h-5 text-white" />}
              title="Enterprise"
              eyebrow="Contact Sales"
              desc="Designed for regulated environments with SSO, compliance reporting, and dedicated onboarding."
            />
          </div>
        </section>

        <section id="enterprise" className="container mx-auto px-6 mt-32 max-w-6xl scroll-mt-28">
          <div className="rounded-[2rem] border border-white/10 bg-[#121212] p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8A78F7] mb-4">Enterprise Control Plane</p>
                <h2 className="text-3xl md:text-4xl font-bold font-manrope text-white mb-4">
                  Govern every file with traceable access decisions.
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Map users to departments, apply role-specific file rules, and review every sensitive interaction from a single administrative surface.
                </p>
              </div>
              <div className="grid gap-4 min-w-[260px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-on-surface-variant mb-1">Policy Engine</p>
                  <p className="text-white font-medium">Role-aware access workflows</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-on-surface-variant mb-1">Audit Trail</p>
                  <p className="text-white font-medium">Every download, share, and permission change</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="container mx-auto px-6 mt-32 max-w-6xl scroll-mt-28">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A78F7] mb-4">About ShareVault</p>
              <h2 className="text-3xl md:text-4xl font-bold font-manrope text-white mb-4">
                Built to make RBFS understandable, enforceable, and fast.
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                ShareVault is a secure file-sharing experience centered on role-based access. Instead of giving everyone the same visibility, the platform is designed to match file actions to identity, responsibility, and trust level.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#141414] p-8">
              <p className="text-sm text-on-surface-variant mb-6">
                The goal is simple: reduce accidental exposure, keep ownership clear, and make access decisions visible to both users and admins.
              </p>
              <Link to="/register">
                <Button className="bg-[#8A78F7] hover:bg-[#7e6be9] text-white rounded-full px-6 h-11">
                  Start Building Securely
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Ready to secure your data legacy?</h3>
          <p className="text-on-surface-variant text-sm mb-12">Join 2,000+ companies who trust ShareVault with their most sensitive digital assets.</p>
          
          <div className="flex justify-between text-left text-sm mt-20 border-t border-white/5 pt-8">
            <div className="max-w-xs">
              <strong className="text-white text-lg block mb-4">ShareVault</strong>
              <p className="text-on-surface-variant text-xs mb-4">Redefining the standard of digital privacy through advanced role-based access and obsidian-grade security.</p>
            </div>
            <div className="flex gap-20 text-on-surface-variant">
              <div>
                <strong className="text-white block mb-4">Product</strong>
                <ul className="space-y-2 text-xs">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a></li>
                </ul>
              </div>
              <div>
                <strong className="text-white block mb-4">Company</strong>
                <ul className="space-y-2 text-xs">
                  <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-left text-[10px] text-on-surface-variant/50 mt-12 flex justify-between border-t border-white/5 pt-4">
            <p>© 2026 SHAREVAULT SYSTEMS INC. ALL RIGHTS RESERVED.</p>
            <p>LOCUS: ALL SYSTEMS OPERATIONAL | LATENCY: 22MS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const InfoCard = ({ icon, title, eyebrow, desc }) => (
  <div className="rounded-3xl border border-white/10 bg-[#141414] p-8">
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-5">
      {icon}
    </div>
    <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-3">{eyebrow}</p>
    <h3 className="text-2xl font-bold font-manrope text-white mb-3">{title}</h3>
    <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc, colSpan, showGraph }) => (
  <div className={`p-8 rounded-3xl border border-white/5 bg-[#141414] hover:bg-[#1A1A1A] transition-colors relative overflow-hidden flex flex-col justify-between group ${colSpan || ""}`}>
    <div>
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-manrope text-white mb-3">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">{desc}</p>
    </div>
    
    {showGraph && (
      <div className="absolute right-0 bottom-0 w-48 h-32 opacity-20 pointer-events-none translate-x-4 translate-y-4 group-hover:opacity-40 transition-opacity">
        <svg viewBox="0 0 100 50" className="w-full h-full fill-[#8A78F7]">
          <rect x="10" y="30" width="4" height="20" rx="2" />
          <rect x="20" y="15" width="4" height="35" rx="2" />
          <rect x="30" y="25" width="4" height="25" rx="2" />
          <rect x="40" y="10" width="4" height="40" rx="2" />
          <rect x="50" y="35" width="4" height="15" rx="2" />
          <rect x="60" y="5"  width="4" height="45" rx="2" />
          <rect x="70" y="20" width="4" height="30" rx="2" />
          <rect x="80" y="25" width="4" height="25" rx="2" />
          <rect x="90" y="12" width="4" height="38" rx="2" />
        </svg>
      </div>
    )}
  </div>
);
