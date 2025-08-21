import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Shield, 
  BarChart3, 
  Star, 
  ArrowRight, 
  ChevronDown
} from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
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
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track trends, analyze feedback patterns, and make data-driven decisions",
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "FeedbackHub transformed how we collect user insights. The anonymous feature is a game-changer!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Startup Founder",
      content: "Simple, elegant, and powerful. Exactly what we needed to understand our customers better.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "UX Designer",
      content: "The analytics dashboard gives us actionable insights that directly improve our product.",
      rating: 5
    }
  ];

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
          <div className="w-8 h-8 bg-whisper-accent-pink rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-whisper-accent-pink font-mono">
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
            className="bg-whisper-accent-pink text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-20 lg:py-32">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Share Your Truth
            <span className="block text-whisper-accent-pink font-mono">
              That Matters
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create secure anonymous message channels, collect honest feedback,
            and build trust through complete privacy protection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="group bg-whisper-accent-pink text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              Start Free Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-gray-300 hover:text-white px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex items-center">
              Watch Demo
              <ChevronDown className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute top-10 left-4 sm:top-20 sm:left-10 lg:left-20 animate-float">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-3 sm:p-4 w-40 sm:w-48">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400"
                />
            ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">
            "Amazing product! Love the simplicity."
            </p>
        </div>
        </div>

        <div className="absolute top-28 right-4 sm:top-32 sm:right-10 lg:right-20 animate-float-delayed">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-3 sm:p-4 w-44 sm:w-52">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-xs sm:text-sm text-white font-medium">
                Anonymous Message
            </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">
            "Your feedback system is incredible!"
            </p>
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
              Powerful features designed to help you collect, analyze, and act
              on feedback
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              return (
                <div
                  key={index}
                  className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${
                    isActive ? "ring-2 ring-blue-500/50 bg-slate-900/70" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}
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
              { number: "10K+", label: "Active Users" },
              { number: "50K+", label: "Feedback Collected" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:bg-slate-900/70 transition-colors"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-slate-800 rounded-3xl p-12">
            <div className="bg-whisper-card backdrop-blur-xl border border-whisper-border rounded-3xl p-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using Whisper to collect honest,
                anonymous feedback
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="bg-whisper-accent-pink text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 lg:mb-0">
              <div className="w-8 h-8 bg-whisper-accent-pink rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">WhisperFeedback</span>
            </div>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} WhisperFeedback. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
