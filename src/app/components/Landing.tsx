"use client"
import React, { useState, useEffect } from 'react';

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "Hacktua has transformed how we onboard patients. The AI triage is incredibly accurate and saves us hours every week.",
      author: "Dr. Sarah Chen",
      role: "Clinical Psychologist"
    },
    {
      quote: "As a therapist, this platform helps me focus on what matters—helping people—not paperwork.",
      author: "Michael Rodriguez",
      role: "Licensed Therapist"
    },
    {
      quote: "The matching algorithm connected me with the perfect therapist on my first try. Game-changing.",
      author: "Emma Thompson",
      role: "Patient"
    }
  ];

  return (
    <div className="min-h-screen bg-[#336666] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
        @font-face {
          font-family: 'Londoners';
          src: local('Georgia'), local('Times New Roman');
          font-weight: normal;
          font-style: normal;
        }
        
        * {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }
        
        h1, h2, h3, .logo {
          font-family: 'Londoners', Georgia, serif;
          font-weight: normal;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #7BADE2 0%, #99CCCC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-in forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        
        .testimonial-enter {
          animation: testimonialEnter 0.6s ease-out;
        }
        
        @keyframes testimonialEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section-spacing {
          padding: 120px 24px;
        }
        
        @media (max-width: 768px) {
          .section-spacing {
            padding: 80px 24px;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#336666]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="logo text-2xl tracking-tight">hacktua</div>
          <div className="hidden md:flex gap-8 items-center text-sm">
            <a href="#product" className="hover:text-[#7BADE2] transition-colors">Product</a>
            <a href="#mission" className="hover:text-[#7BADE2] transition-colors">Mission</a>
            <a href="#join" className="hover:text-[#7BADE2] transition-colors">Join Waitlist</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl mb-8 fade-in tracking-tight leading-[0.95]">
            Mental health care,<br/>reimagined
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed fade-in delay-1">
            AI-powered triage connecting patients with the right therapists, 
            streamlining care delivery for better outcomes.
          </p>
          <button className="bg-white text-[#336666] px-8 py-4 rounded-full text-sm font-medium hover-lift fade-in delay-2">
            Request early access
          </button>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="bg-[#339999] section-spacing">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-5xl md:text-6xl mb-6 tracking-tight">Intelligent triage</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Our AI analyzes patient needs with clinical precision, matching them 
                to therapists based on specialization, availability, and therapeutic approach. 
                Get patients the right care faster.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BADE2] mt-2"></div>
                  <p className="text-white/80">Evidence-based assessment algorithms</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BADE2] mt-2"></div>
                  <p className="text-white/80">Real-time therapist matching</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BADE2] mt-2"></div>
                  <p className="text-white/80">Seamless insurance verification</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <div className="space-y-6">
                <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                <div className="h-3 bg-white/20 rounded-full w-full"></div>
                <div className="h-3 bg-white/20 rounded-full w-5/6"></div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#7BADE2]"></div>
                    <div>
                      <div className="h-3 bg-white/20 rounded-full w-32 mb-2"></div>
                      <div className="h-2 bg-white/10 rounded-full w-24"></div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full w-full mb-2"></div>
                  <div className="h-2 bg-white/10 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">This week</span>
                  <span className="text-[#7BADE2] text-sm">↑ 12%</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">New patients</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Hours saved</span>
                    <span className="font-medium">23.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Match accuracy</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-5xl md:text-6xl mb-6 tracking-tight">Streamlined onboarding</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Reduce administrative burden with automated intake, scheduling, and 
                documentation. Let therapists focus on what they do best—helping people heal.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BADE2] mt-2"></div>
                  <p className="text-white/80">Automated patient intake forms</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BADE2] mt-2"></div>
                  <p className="text-white/80">Smart scheduling optimization</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BADE2] mt-2"></div>
                  <p className="text-white/80">Clinical documentation assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="bg-[#336974] section-spacing">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl mb-8 tracking-tight">Our mission</h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12">
            Everyone deserves timely access to quality mental health care. We're building 
            technology that removes barriers between patients and therapists, making the 
            path to healing clearer and faster.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7BADE2] mb-2">95%</div>
              <div className="text-white/60 text-sm">Patient satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7BADE2] mb-2">10K+</div>
              <div className="text-white/60 text-sm">Patients matched</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7BADE2] mb-2">500+</div>
              <div className="text-white/60 text-sm">Partner therapists</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#336699] section-spacing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 tracking-tight">What people are saying</h2>
          </div>
          <div className="relative min-h-[200px]">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeTestimonial === idx ? 'opacity-100 testimonial-enter' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="text-center">
                  <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white/90">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonial === idx ? 'bg-white w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="bg-[#7BADE2] section-spacing">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl mb-6 tracking-tight text-[#336666]">Join the waitlist</h2>
          <p className="text-[#336666]/70 text-lg mb-12 leading-relaxed">
            We're launching soon. Be among the first to experience the future of mental health care.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-full bg-white/90 text-[#336666] placeholder-[#336666]/50 focus:outline-none focus:ring-2 focus:ring-[#336666]/30 mb-4"
            />
            <button className="w-full bg-[#336666] text-white px-8 py-4 rounded-full text-sm font-medium hover-lift">
              Request early access
            </button>
            <p className="text-[#336666]/60 text-xs mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#336666] py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="logo text-xl">hacktua</div>
            <div className="flex gap-8 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-white/40 text-sm">
              © 2024 Hacktua. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;