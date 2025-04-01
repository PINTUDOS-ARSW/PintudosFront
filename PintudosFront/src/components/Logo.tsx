import React from 'react';

interface LogoProps {
  src: string;
  alt: string;
}

function Logo({ src, alt }: LogoProps) {
  return <img src={src} alt={alt} className="logo" />;
}

export default Logo;
