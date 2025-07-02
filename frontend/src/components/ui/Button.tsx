import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-neubrutalist font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-neubrutalist hover:shadow-neubrutalist-lg hover:scale-105 focus:ring-primary-500",
        secondary: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 shadow-neubrutalist hover:shadow-neubrutalist-lg hover:scale-105 focus:ring-gray-500",
        glass: "glass text-gray-900 dark:text-white shadow-glass hover:shadow-glass-lg hover:scale-105 focus:ring-primary-500",
        success: "bg-gradient-to-r from-accentA-500 to-accentA-600 text-white shadow-neubrutalist hover:shadow-neubrutalist-lg hover:scale-105 focus:ring-accentA-500",
        warning: "bg-gradient-to-r from-accentB-500 to-accentB-600 text-white shadow-neubrutalist hover:shadow-neubrutalist-lg hover:scale-105 focus:ring-accentB-500",
        ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        xl: "h-14 px-8 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        <span className={cn(loading && "opacity-0")}>
          {children}
        </span>
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 