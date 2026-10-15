import React from 'react';

export default function KloudspotLogo({ size = 32, showText = true }) {
  return (
    <div className="kloudspot-brand-wrap">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="kloudspot-symbol"
      >
        <defs>
          <linearGradient id="ks-blue-grad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="ks-dot-grad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="ks-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Connection Network Circles */}
        <circle cx="60" cy="60" r="54" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="42" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="1.5" />

        {/* Central Cloud Geometric Nodes */}
        {/* Node 1 - Top */}
        <circle cx="60" cy="34" r="10" fill="url(#ks-blue-grad)" filter="url(#ks-glow)" />
        {/* Node 2 - Left */}
        <circle cx="36" cy="54" r="12" fill="url(#ks-blue-grad)" />
        {/* Node 3 - Right */}
        <circle cx="84" cy="54" r="12" fill="url(#ks-blue-grad)" />
        {/* Node 4 - Bottom Left */}
        <circle cx="44" cy="78" r="9" fill="url(#ks-blue-grad)" />
        {/* Node 5 - Bottom Right */}
        <circle cx="76" cy="78" r="9" fill="url(#ks-blue-grad)" />

        {/* Connecting Data Links */}
        <line x1="60" y1="34" x2="36" y2="54" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="34" x2="84" y2="54" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="54" x2="44" y2="78" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="84" y1="54" x2="76" y2="78" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="78" x2="76" y2="78" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="54" x2="84" y2="54" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="2" strokeDasharray="2 3" />

        {/* The Central Intelligence Spot */}
        <circle cx="60" cy="58" r="6" fill="#FFFFFF" />
        <circle cx="60" cy="58" r="3" fill="#0284C7" />
      </svg>

      {showText && (
        <div className="kloudspot-wordmark">
          <div className="wordmark-primary">
            KLOUD<span>SPOT</span>
          </div>
          <div className="wordmark-tagline">PEOPLE OPERATIONS • WORKFORCE DIRECTORY</div>
        </div>
      )}
    </div>
  );
}
