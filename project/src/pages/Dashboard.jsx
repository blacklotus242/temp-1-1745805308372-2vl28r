import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Calendar, MessageSquare, Settings, Layout, ArrowRight, Zap, Rocket, Star, Shield, Sparkles, Orbit, Satellite, ChevronDown, ChevronUp, Briefcase, Heart, Brain, Target, Cpu, Palette, Search, MessageCircle, DollarSign, BarChart as ChartBar, Users, Lightbulb, Database, Code, Gauge, Award, BookOpen, Workflow, Activity, Coffee, Moon, Image, PenTool, Globe, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const QuickAccessCard = ({ icon: Icon, title, description, to, color }) => (
  <Link to={to} className="group relative overflow-hidden rounded-xl">
    <div className={`absolute inset-0 ${color} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}></div>
    <div className="relative p-6 flex flex-col items-start">
      <div className="rounded-full p-3 bg-black/20 mb-3">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:underline">{title}</h3>
      <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
      <ArrowRight className="absolute bottom-4 right-4 h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
    </div>
  </Link>
);

const MissionProgress = ({ icon: Icon, title, description, progress, color }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-3">
      <div className={`rounded-full w-8 h-8 flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`absolute left-0 top-0 h-full ${color}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const CategorySection = ({ title, icon: Icon, color, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-purple-500/10 transition-colors duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'Commander';

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      
      <div className="relative z-10">
        <TopNav />
        
        <main className="container mx-auto px-4 py-8 animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                  Welcome back, {userName}! <Rocket className="inline-block w-8 h-8 ml-2 animate-pulse" />
                </h1>
                <p className="text-gray-400">
                  Your mission control center awaits. What shall we explore today?
                </p>
              </div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <QuickAccessCard
                icon={MessageSquare}
                title="Mission Control"
                description="Command your AI assistant and manage operations"
                to="/chat"
                color="bg-gradient-to-br from-purple-600 to-indigo-600"
              />
              <QuickAccessCard
                icon={Calendar}
                title="Time Matrix"
                description="Navigate through your temporal coordinates"
                to="/calendar"
                color="bg-gradient-to-br from-blue-600 to-cyan-600"
              />
              <QuickAccessCard
                icon={Layout}
                title="Task Nexus"
                description="Coordinate your mission objectives"
                to="/tasks"
                color="bg-gradient-to-br from-violet-600 to-purple-600"
              />
              <QuickAccessCard
                icon={Settings}
                title="Integration Hub"
                description="Connect with allied systems"
                to="/integrations"
                color="bg-gradient-to-br from-teal-600 to-emerald-600"
              />
            </div>

            {/* Mission Progress - Now defaultOpen is false */}
            <CategorySection 
              title="Mission Progress" 
              icon={Target} 
              color="bg-gradient-to-br from-purple-600 to-indigo-600"
              defaultOpen={false}
            >
              <div className="space-y-6">
                <MissionProgress
                  icon={Shield}
                  title="Secure Your Base"
                  description="Set up your profile, customize preferences, and establish security protocols"
                  progress={75}
                  color="bg-gradient-to-br from-emerald-600 to-teal-600"
                />
                <MissionProgress
                  icon={Orbit}
                  title="Establish Neural Network"
                  description="Train your AI assistant with your preferences and common tasks"
                  progress={45}
                  color="bg-gradient-to-br from-purple-600 to-indigo-600"
                />
                <MissionProgress
                  icon={Satellite}
                  title="Deploy Integration Fleet"
                  description="Connect essential tools and services to enhance your command capabilities"
                  progress={30}
                  color="bg-gradient-to-br from-blue-600 to-cyan-600"
                />
                <MissionProgress
                  icon={Sparkles}
                  title="Optimize Operations"
                  description="Fine-tune your workflow with automated tasks and smart suggestions"
                  progress={15}
                  color="bg-gradient-to-br from-violet-600 to-fuchsia-600"
                />
              </div>
            </CategorySection>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keep all existing CategorySection components */}
              <CategorySection 
                title="Business & Finance" 
                icon={Briefcase} 
                color="bg-gradient-to-br from-green-600 to-emerald-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Financial Planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ChartBar className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Market Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Team Management</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Health & Wellness" 
                icon={Heart} 
                color="bg-gradient-to-br from-red-600 to-pink-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300">Fitness Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300">Nutrition Planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300">Sleep Analytics</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Personal Development" 
                icon={Brain} 
                color="bg-gradient-to-br from-yellow-600 to-orange-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Learning Goals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Skill Development</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Career Planning</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Project Management" 
                icon={Target} 
                color="bg-gradient-to-br from-blue-600 to-cyan-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Workflow className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Task Workflows</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Team Collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Progress Tracking</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Technology" 
                icon={Cpu} 
                color="bg-gradient-to-br from-indigo-600 to-purple-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Development</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Infrastructure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Security</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Creative & Design" 
                icon={Palette} 
                color="bg-gradient-to-br from-pink-600 to-rose-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Image className="w-5 h-5 text-pink-400" />
                    <span className="text-gray-300">Visual Design</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PenTool className="w-5 h-5 text-pink-400" />
                    <span className="text-gray-300">Content Creation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-5 h-5 text-pink-400" />
                    <span className="text-gray-300">Innovation</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Research & Analysis" 
                icon={Search} 
                color="bg-gradient-to-br from-violet-600 to-purple-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ChartBar className="w-5 h-5 text-violet-400" />
                    <span className="text-gray-300">Data Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5 text-violet-400" />
                    <span className="text-gray-300">Market Research</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-violet-400" />
                    <span className="text-gray-300">Trend Analysis</span>
                  </div>
                </div>
              </CategorySection>

              <CategorySection 
                title="Communication" 
                icon={MessageCircle} 
                color="bg-gradient-to-br from-teal-600 to-emerald-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-teal-400" />
                    <span className="text-gray-300">Team Communication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-teal-400" />
                    <span className="text-gray-300">External Relations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <span className="text-gray-300">Documentation</span>
                  </div>
                </div>
              </CategorySection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;