import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Check, 
  Monitor,
  Zap
} from 'lucide-react';
import { Navbar } from '@/src/components/common/Navbar';
import { Footer } from '@/src/components/common/Footer';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/src/utils/cn';

const themes = [
  { id: 'dark', name: 'Deep Black', color: '#0a0a0a', accent: '#8b5cf6' },
  { id: 'light', name: 'Pure White', color: '#ffffff', accent: '#8b5cf6' },
  { id: 'grey', name: 'Slate Grey', color: '#1e293b', accent: '#8b5cf6' },
  { id: 'premium', name: 'Midnight Purple', color: '#1e1b4b', accent: '#c084fc' },
];

export default function SettingsPage() {
  const [activeTheme, setActiveTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="min-h-screen bg-bg-dark pt-28 px-6 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Settings</h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-2">
            {[
              { id: 'profile', name: 'Profile', icon: <User size={18} /> },
              { id: 'security', name: 'Security', icon: <Shield size={18} /> },
              { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
              { id: 'appearance', name: 'Appearance', icon: <Palette size={18} /> },
              { id: 'data', name: 'Data & Privacy', icon: <Database size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-brand-purple text-white purple-glow" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Main Settings Content */}
          <div className="flex-1 space-y-12">
            {activeTab === 'appearance' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Palette size={20} className="text-brand-purple" />
                    Theme Selection
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <Card
                        key={theme.id}
                        onClick={() => setActiveTheme(theme.id)}
                        padding="sm"
                        className={cn(
                          "text-left cursor-pointer relative overflow-hidden group",
                          activeTheme === theme.id ? "border-brand-purple/50 ring-1 ring-brand-purple/20" : "hover:border-white/20"
                        )}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                             <div className="w-full h-full" style={{ backgroundColor: theme.color }} />
                          </div>
                          {activeTheme === theme.id && (
                            <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center text-white purple-glow">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold mb-1">{theme.name}</h3>
                        <p className="text-xs text-gray-500">Premium {theme.id} aesthetic</p>
                        
                        {theme.id === 'premium' && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <Zap size={10} /> Pro
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-6">Interface Options</h2>
                  <Card padding="none" className="divide-y divide-white/5">
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <div className="font-bold mb-1">Smooth Animations</div>
                        <div className="text-sm text-gray-500">Enable fluid transitions and micro-interactions.</div>
                      </div>
                      <div className="w-12 h-6 bg-brand-purple rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                      </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <div className="font-bold mb-1">Glassmorphism Effects</div>
                        <div className="text-sm text-gray-500">Enable background blur and transparency.</div>
                      </div>
                      <div className="w-12 h-6 bg-brand-purple rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                      </div>
                    </div>
                  </Card>
                </section>
              </motion.div>
            )}

            {activeTab !== 'appearance' && (
              <Card padding="lg" className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-500">
                  <Monitor size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Section Under Development</h2>
                <p className="text-gray-400 max-w-sm mx-auto">
                  We're currently polishing the {activeTab} settings to provide the best research experience.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
