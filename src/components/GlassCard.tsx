import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  hoverGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  icon,
  hoverGlow = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card p-6 flex flex-col gap-4",
        hoverGlow && "hover:shadow-[0_0_30px_rgba(0,242,255,0.15)]",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {icon && <div className="text-electric-blue">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  );
};
