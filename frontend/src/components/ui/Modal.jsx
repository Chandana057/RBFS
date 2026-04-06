import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-16 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={cn(
                "glass-card w-full max-w-md p-6 pointer-events-auto max-h-full overflow-y-auto shadow-ambient",
                className
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium tracking-tight text-on-surface">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-on-surface-variant">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
