// components/LogoLoader.jsx
import React from 'react';
import { Shell } from "lucide-react";

const LogoLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Shell className="animate-spin text-primary w-16 h-16" />
    </div>
  );
};

export default LogoLoader;
