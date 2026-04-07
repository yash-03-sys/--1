import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';
import { BrandMark } from '@/src/components/common/BrandMark';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-brand-purple/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-40 left-[10%] red-dot animate-pulse" />
      <div className="absolute top-60 right-[15%] red-dot animate-pulse delay-700" />
      <div className="absolute bottom-20 left-[20%] red-dot animate-pulse delay-1000" />

      <Card
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        padding="lg"
        className="w-full max-w-md text-center relative z-10"
      >
        <div className="flex justify-center mb-10">
          <BrandMark size="lg" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
        <p className="text-gray-400 mb-10">Sign in to access your research workspace and intelligent insights.</p>

        <div className="flex flex-col gap-4">
          <Button variant="secondary" size="lg" className="w-full">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            Continue with Google
          </Button>
          
          <Button variant="outline" size="lg" className="w-full">
            <Mail size={20} />
            Continue with Email
          </Button>
        </div>

        <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck size={16} className="text-brand-purple" />
          <span>Secure, encrypted authentication</span>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Don't have an account? <Link to="/login" className="text-brand-purple hover:underline">Sign up for free</Link>
        </p>
      </Card>
    </div>
  );
}
