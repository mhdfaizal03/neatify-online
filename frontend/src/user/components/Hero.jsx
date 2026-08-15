import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl mt-8 mb-12 border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 z-0"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 lg:p-16 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Premium Vehicle Care
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Revitalize Your Ride with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Neatify</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            Professional detailing, ceramic coating, and advanced protection services to keep your vehicle looking showroom new.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              100% Satisfaction
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <Clock className="w-5 h-5 text-blue-500" />
              Fast Turnaround
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full flex justify-center"
        >
          <img 
            src="/assets/hero.png" 
            alt="Neatify Premium Service" 
            className="w-full max-w-md object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
