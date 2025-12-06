import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Shield, 
  BarChart3, 
  Star, 
  ArrowRight, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Zap,
  Lock,
  TrendingUp,
  GraduationCap,
  Eye
} from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentFloatingCard, setCurrentFloatingCard] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Features rotation
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);

    // Floating cards rotation (mobile)
    const cardInterval = setInterval(() => {
      setCurrentFloatingCard((prev) => (prev + 1) % floatingCards.length);
    }, 4000);

    // Testimonials rotation
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(featureInterval);
      clearInterval(cardInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: "Collect Feedback",
      description: "Create beautiful feedback forms and collect valuable insights from your users",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Anonymous Messages",
      description: "Enable honest communication with completely anonymous message collection",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: GraduationCap,
      title: "Exam Management",
      description: "Create, schedule, and manage secure online examinations with ease",
      color: "from-emerald-400 to-green-600"
    },
    {
      icon: Eye,
      title: "Secure Proctoring",
      description: "AI-powered proctoring system to ensure exam integrity and fairness",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Smart Grading",
      description: "Automated grading and detailed performance analytics for students",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track trends, analyze feedback patterns, and make data-driven decisions",
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const floatingCards = [
    {
      type: "rating",
      content: "Amazing product! Love the simplicity.",
      rating: 5
    },
    {
      type: "anonymous",
      content: "Your feedback system is incredible!",
      icon: Shield
    },
    {
      type: "analytics",
      content: "Data insights changed our strategy",
      icon: TrendingUp
    },
    {
      type: "rating",
      content: "Best tool for collecting honest feedback",
      rating: 5
    },
    {
      type: "security",
      content: "Complete privacy protection works!",
      icon: Lock
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      content: "FeedbackHub transformed how we collect user insights. The anonymous feature is a game-changer!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Startup Founder",
      company: "InnovateLab",
      content: "Simple, elegant, and powerful. Exactly what we needed to understand our customers better.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Davis",
      role: "UX Designer",
      company: "DesignStudio",
      content: "The analytics dashboard gives us actionable insights that directly improve our product.",
      rating: 5,
      avatar: "ED"
    },
    {
      name: "Alex Rivera",
      role: "Operations Manager",
      company: "ScaleUp Inc",
      content: "Anonymous feedback helped us identify issues we never knew existed. ROI was immediate.",
      rating: 5,
      avatar: "AR"
    },
    {
      name: "Jennifer Wong",
      role: "Team Lead",
      company: "DevTeam Pro",
      content: "Our team communication improved dramatically. Everyone feels comfortable sharing now.",
      rating: 5,
      avatar: "JW"
    },
    {
      name: "David Kim",
      role: "CEO",
      company: "StartupXYZ",
      content: "Whisper became essential to our product development cycle. Can't imagine working without it.",
      rating: 5,
      avatar: "DK"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const FloatingCard = ({ card, className = "" }) => {
    if (card.type === "rating") {
      return (
        <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl ${className}`}>
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(card.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-gray-300 leading-snug">"{card.content}"</p>
        </div>
      );
    }

    const Icon = card.icon;
    return (
      <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Icon className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white font-medium">
            {card.type === "anonymous" ? "Anonymous Message" : 
             card.type === "analytics" ? "Analytics Insight" : 
             card.type === "security" ? "Security Alert" : "Message"}
          </span>
        </div>
        <p className="text-sm text-gray-300 leading-snug">"{card.content}"</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
            Whisper
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Mobile Floating Cards Slideshow */}
      <div className="block lg:hidden relative z-10 px-6 mb-8">
        <div className="max-w-sm mx-auto">
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentFloatingCard * 100}%)` }}
            >
              {floatingCards.map((card, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <FloatingCard card={card} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {floatingCards.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentFloatingCard ? 'bg-pink-500' : 'bg-slate-600'
                }`}
                onClick={() => setCurrentFloatingCard(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-12 lg:py-32">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Share Your Truth
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
              That Matters
            </span>
          </h1>
          <p className="text-lg lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create secure anonymous message channels, collect honest feedback,
            conduct secure exams, and build trust through complete privacy protection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 flex items-center shadow-xl"
            >
              Start Free Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-gray-300 hover:text-white px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex items-center backdrop-blur-sm">
              Watch Demo
              <ChevronDown className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Floating Cards */}
        <div className="hidden lg:block">
          <div className="absolute top-20 left-4 xl:left-8 2xl:left-16 animate-float">
            <FloatingCard card={floatingCards[0]} className="w-48" />
          </div>
          <div className="absolute top-20 right-4 xl:right-8 2xl:right-16 animate-float-delayed">
            <FloatingCard card={floatingCards[1]} className="w-48" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help you collect, analyze, and act on feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              return (
                <div
                  key={index}
                  className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:bg-slate-900/70 ${
                    isActive ? "ring-2 ring-pink-500/50 bg-slate-900/70 scale-105" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "25K+", label: "Active Users" },
              { number: "150K+", label: "Messages Collected" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slideshow */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers have to say
            </p>
          </div>

          <div className="relative">
            {/* Testimonial Cards */}
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                      <div className="flex items-center justify-center space-x-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg text-gray-300 mb-8 italic leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.avatar}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700/80 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700/80 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of teams already using Whisper to collect honest,
              anonymous feedback and build better products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 lg:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Whisper</span>
            </div>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Whisper. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;