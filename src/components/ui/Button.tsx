import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  glow = false,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purple/90',
    secondary: 'bg-white text-black hover:bg-gray-100',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',
    outline: 'bg-transparent border border-white/10 hover:bg-white/5 text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3 text-sm rounded-2xl',
    lg: 'px-8 py-4 text-base rounded-2xl'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        glow && variant === 'primary' && 'purple-glow',
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';
