import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, Phone, Mail, Facebook, Send, CheckCircle2, Instagram,
  Clock, Award, Truck, Shield, Sparkles, ChevronRight, MessageCircle,
  Globe, Users, Star, ArrowRight, Calendar, Building, Heart,
  Twitter, Youtube, Linkedin
} from "lucide-react";

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    subject: "General Inquiry"
  });
  const [activeTab, setActiveTab] = useState("message");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setIsSent(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
      subject: "General Inquiry"
    });

    setTimeout(() => {
      setIsSent(false);
    }, 5000);
  };

  // Store hours
  const storeHours = [
    { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "11:00 AM - 6:00 PM" },
    { day: "Festival Days", hours: "10:00 AM - 9:00 PM" }
  ];

  // Quick contact options
  const quickContacts = [
    { 
      icon: Phone, 
      title: "Call Us", 
      value: "+91 98852 22227", 
      link: "tel:+919885222227",
      color: "from-blue-500 to-cyan-600",
      desc: "24/7 Customer Support"
    },
    { 
      icon: Mail, 
      title: "Email Us", 
      value: "hello@llmshop.com", 
      link: "mailto:hello@llmshop.com",
      color: "from-purple-500 to-indigo-600",
      desc: "Response within 2 hours"
    },
    { 
      icon: MessageCircle, 
      title: "WhatsApp", 
      value: "+91 98852 22227", 
      link: "https://wa.me/919885222227",
      color: "from-green-500 to-emerald-600",
      desc: "Chat with us instantly"
    }
  ];

  // Trust badges
  const trustBadges = [
    { icon: Award, title: "40+ Years", desc: "Of Excellence" },
    { icon: Users, title: "50,000+", desc: "Happy Customers" },
    { icon: Star, title: "4.9 Rating", desc: "Customer Love" },
    { icon: Truck, title: "Free Shipping", desc: "Above ₹999" }
  ];

  // Social links
  const socialLinks = [
    { icon: Facebook, link: "https://www.facebook.com/lmshowroomatnellore/", color: "bg-[#1877F2] hover:bg-[#1877F2]/90" },
    { icon: Instagram, link: "https://instagram.com/llmshowroom", color: "bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" },
    { icon: Twitter, link: "https://twitter.com/llmshowroom", color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" },
    { icon: Youtube, link: "https://youtube.com/llmshowroom", color: "bg-[#FF0000] hover:bg-[#FF0000]/90" },
    { icon: Linkedin, link: "https://linkedin.com/company/llmshowroom", color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      {/* ======================================================= */}
      {/* 🌟 PREMIUM HERO HEADER */}
      {/* ======================================================= */}
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated Gradients */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            We'd Love to Hear From You
            <Sparkles className="w-3 h-3 text-primary" />
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
            Get in <span className="text-primary italic">Touch</span>
          </h1>
          <p className="font-body text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
            Visit our showroom in Nellore or drop us a message for any inquiries about our exclusive collections
          </p>
        </div>
      </div>

      {/* ======================================================= */}
      {/* TRUST BADGES */}
      {/* ======================================================= */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-800 text-sm">{badge.title}</h4>
                    <p className="text-xs text-stone-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* ======================================================= */}
        {/* QUICK CONTACT CARDS */}
        {/* ======================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickContacts.map((contact, idx) => (
            <a
              key={idx}
              href={contact.link}
              target={contact.link.startsWith('http') ? "_blank" : "_self"}
              rel="noreferrer"
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${contact.color} group-hover:scale-110 transition-transform`}>
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-stone-800 mb-1">{contact.title}</h3>
                  <p className="text-primary font-medium">{contact.value}</p>
                  <p className="text-xs text-stone-500 mt-1">{contact.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ======================================================= */}
          {/* LEFT SIDE: CONTACT INFO & STORE DETAILS */}
          {/* ======================================================= */}
          <div className="w-full lg:w-5/12 space-y-6">
            
            {/* Store Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-xl text-stone-800">Our Flagship Store</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-stone-800">LM Showroom</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      By Line Of Kapu Street, Gaddamvari Street,<br />
                      Nellore, Andhra Pradesh 524001
                    </p>
                    <a 
                      href="https://maps.google.com/?q=LM+Showroom,Gaddamvari+Street,Nellore,Andhra+Pradesh" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      Get Directions <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Hours Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-xl text-stone-800">Store Hours</h2>
              </div>
              
              <div className="space-y-2">
                {storeHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-stone-600">{item.day}</span>
                    <span className="font-medium text-stone-800">{item.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Open now - Closing at 8:00 PM
                </p>
              </div>
            </div>

            {/* Connect With Us Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-xl text-stone-800">Connect With Us</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-xl text-white transition-all hover:scale-110 hover:shadow-lg ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              
              <p className="text-xs text-stone-500 mt-4">
                Follow us for exclusive offers, new arrivals, and behind-the-scenes content!
              </p>
            </div>
          </div>

          {/* ======================================================= */}
          {/* RIGHT SIDE: CONTACT FORM */}
          {/* ======================================================= */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
              
              {/* Form Header with Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-4">
                <button
                  onClick={() => setActiveTab("message")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "message"
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Send Message
                </button>
                <button
                  onClick={() => setActiveTab("callback")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "callback"
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Request Callback
                </button>
              </div>
              
              <form className="space-y-5" onSubmit={handleSendMessage}>
                {/* Subject Selection */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Custom Stitching">Custom Stitching</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Press & Media">Press & Media</option>
                    <option value="Careers">Careers</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      name="name" 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  
                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input 
                      type="tel"
                      name="phone" 
                      placeholder="Your Phone Number" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    name="email" 
                    placeholder="you@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                    {activeTab === "callback" ? "Best Time to Call" : "Your Message"}
                  </label>
                  <textarea 
                    name="message"
                    rows="5" 
                    placeholder={activeTab === "callback" ? "Let us know when to call you..." : "How can we help you?"}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Success Message */}
                {isSent && (
                  <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-medium">Thank you! Your message has been sent.</p>
                      <p className="text-xs text-green-600 mt-0.5">We will get back to you within 2 hours.</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <Send className="w-5 h-5" />
                  {activeTab === "callback" ? "Request Callback" : "Send Message"}
                </button>
              </form>

              {/* Form Footer */}
              <p className="text-center text-xs text-stone-400 mt-4">
                We respect your privacy. Your information is safe with us.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MAP SECTION */}
      {/* ======================================================= */}
      <div className="w-full h-[450px] mt-8 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Map Location" 
          className="w-full h-full object-cover"
        />
        
        {/* Map Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Floating Card */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-stone-800 mb-2">Visit Our Store</h3>
            <p className="text-stone-600 mb-4">
              By Line Of Kapu Street, Gaddamvari Street,<br />
              Nellore, Andhra Pradesh 524001
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <Clock className="w-4 h-4" />
                10AM - 8PM
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <Phone className="w-4 h-4" />
                +91 98852 22227
              </div>
            </div>
            
            <div className="flex gap-3">
              <a 
                href="https://maps.google.com/?q=LM+Showroom,Gaddamvari+Street,Nellore,Andhra+Pradesh" 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
              <a 
                href="tel:+919885222227"
                className="flex-1 bg-white text-stone-700 px-6 py-3 rounded-full text-sm font-medium border border-stone-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* WHY CHOOSE US */}
      {/* ======================================================= */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium">Why Choose LM Showroom</span>
          <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mt-2 mb-8">The LM Experience</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Award, title: "Authentic Products", desc: "100% genuine handloom with Silk Mark certification" },
              { icon: Truck, title: "Fast & Free Shipping", desc: "Free delivery on orders above ₹999" },
              { icon: Heart, title: "Customer First", desc: "Dedicated support team available 24/7" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-stone-800 mb-1">{item.title}</h4>
                <p className="text-xs text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;