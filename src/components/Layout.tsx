import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-graphite-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <Header />
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
