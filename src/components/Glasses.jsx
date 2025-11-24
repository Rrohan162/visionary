import React from 'react';

export const Glasses = ({ className, style }) => {
    return (
        <div className={className} style={{ position: 'relative', width: '100%', maxWidth: '90vw', margin: '0 auto', aspectRatio: '2/1', pointerEvents: 'none', ...style }}>
            <svg
                viewBox="0 0 1000 500"
                style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
            >
                <defs>
                    {/* Define the lens shape for clipping the clear view */}
                    {/* We need a relative clip path for HTML elements to scale correctly */}
                    <clipPath id="lens-clip-left" clipPathUnits="objectBoundingBox">
                        <path d="M 0.28,0.2 C 0.15,0.2 0.1,0.4 0.1,0.6 C 0.1,0.84 0.18,0.96 0.3,0.96 C 0.42,0.96 0.48,0.8 0.48,0.56 C 0.48,0.3 0.4,0.2 0.28,0.2 Z" />
                    </clipPath>
                    <clipPath id="lens-clip-right" clipPathUnits="objectBoundingBox">
                        <path d="M 0.72,0.2 C 0.59,0.2 0.52,0.3 0.52,0.56 C 0.52,0.8 0.58,0.96 0.7,0.96 C 0.82,0.96 0.9,0.84 0.9,0.6 C 0.9,0.4 0.85,0.2 0.72,0.2 Z" />
                    </clipPath>

                    <path
                        id="lens-shape-left"
                        d="M 280,100 C 150,100 100,200 100,300 C 100,420 180,480 300,480 C 420,480 480,400 480,280 C 480,150 400,100 280,100 Z"
                    />
                    <path
                        id="lens-shape-right"
                        d="M 720,100 C 590,100 520,150 520,280 C 520,400 580,480 700,480 C 820,480 900,420 900,300 C 900,200 850,100 720,100 Z"
                    />
                    <clipPath id="lens-clip">
                        <use href="#lens-shape-left" />
                        <use href="#lens-shape-right" />
                    </clipPath>
                </defs>

                {/* The Frame */}
                <g fill="none" stroke="#1a1a1a" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round">
                    {/* Left Rim */}
                    <path d="M 280,100 C 150,100 100,200 100,300 C 100,420 180,480 300,480 C 420,480 480,400 480,280 C 480,150 400,100 280,100 Z" />

                    {/* Right Rim */}
                    <path d="M 720,100 C 590,100 520,150 520,280 C 520,400 580,480 700,480 C 820,480 900,420 900,300 C 900,200 850,100 720,100 Z" />

                    {/* Bridge */}
                    <path d="M 480,250 Q 500,220 520,250" strokeWidth="20" />

                    {/* Temples (Arms) - stylized */}
                    <path d="M 100,250 L 20,240" strokeWidth="20" />
                    <path d="M 900,250 L 980,240" strokeWidth="20" />
                </g>

                {/* Reflections/Gloss */}
                <path d="M 150,150 Q 200,120 250,140" stroke="rgba(255,255,255,0.4)" strokeWidth="10" fill="none" />
                <path d="M 850,150 Q 800,120 750,140" stroke="rgba(255,255,255,0.4)" strokeWidth="10" fill="none" />

            </svg>
        </div>
    );
};
