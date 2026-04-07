import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/utils/cn';

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'glass' | 'outline' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  className, 
  variant = 'glass', 
  padding = 'md',
  ...props 
}: CardProps) => {
  const variants = {
    glass: 'glass-panel',
    outline: 'bg-transparent border border-white/5',
    flat: 'bg-white/5'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <motion.div
      className={cn(
        'rounded-[32px] overflow-hidden transition-all',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    />
  );
};
