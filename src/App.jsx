import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glasses } from './components/Glasses';
import { DialSelector } from './components/DialSelector';
import { Eye, EyeOff } from 'lucide-react';
import './App.css';

function App() {
  const [prescription, setPrescription] = useState({ left: -2.0, right: -1.5 });
  const [glassesOn, setGlassesOn] = useState(true);
  const [backgroundId, setBackgroundId] = useState('interior');
  const [viewer, setViewer] = useState('human');
  const [compareSlider, setCompareSlider] = useState(50);

  // Background Options
  const backgrounds = [
    { id: 'tree', src: '/minimal_tree.png', label: 'Nature', type: 'far' },
    { id: 'street', src: '/india_street.png', label: 'Street', type: 'far' },
    { id: 'interior', src: '/modern_interior.png', label: 'Interior', type: 'mid' },
    { id: 'people', src: '/portrait_group.png', label: 'People', type: 'mid' },
    { id: 'animal', src: '/golden_retriever.png', label: 'Animal', type: 'close' },
    { id: 'book', src: '/open_book_reading.png', label: 'Reading', type: 'near' },
    // New Scenes
    { id: 'beach', src: '/scene_beach.png', label: 'Beach', type: 'far' },
    { id: 'night', src: '/scene_night_city.png', label: 'Night City', type: 'far' },
    { id: 'forest', src: '/scene_forest.png', label: 'Forest', type: 'far' },
    { id: 'snow', src: '/scene_snow.png', label: 'Snow', type: 'mid' },
  ];

  const currentBackground = backgrounds.find(b => b.id === backgroundId) || backgrounds[0];

  // Viewer Options
  const viewers = [
    { id: 'human', label: 'Human', icon: '👤' },
    { id: 'dog', label: 'Dog', icon: '🐕' },
    { id: 'cat', label: 'Cat', icon: '🐈' },
    { id: 'horse', label: 'Horse', icon: '🐎' },
    { id: 'rabbit', label: 'Rabbit', icon: '🐇' },
    { id: 'ant', label: 'Ant', icon: '🐜' },
    { id: 'cow', label: 'Cow', icon: '🐄' },
    // New Viewers
    { id: 'owl', label: 'Owl', icon: '🦉' },
    { id: 'snake', label: 'Snake', icon: '🐍' },
    { id: 'lizard', label: 'Lizard', icon: '🦎' },
    { id: 'lion', label: 'Lion', icon: '🦁' },
    { id: 'tiger', label: 'Tiger', icon: '🐅' },
    { id: 'shark', label: 'Shark', icon: '🦈' },
    { id: 'dolphin', label: 'Dolphin', icon: '🐬' },
    { id: 'parrot', label: 'Parrot', icon: '🦜' },
    { id: 'elephant', label: 'Elephant', icon: '🐘' },
    { id: 'peacock', label: 'Peacock', icon: '🦚' },
    { id: 'rat', label: 'Rat', icon: '🐀' },
    { id: 'pigeon', label: 'Pigeon', icon: '🐦' },
    { id: 'sparrow', label: 'Sparrow', icon: '🐤' },
  ];

  // Helper: Calculate blur for depth layers based on prescription
  const getBlurConfig = (diopter) => {
    // Myopia (-): Far is blurry. Near is clear.
    // Hyperopia (+): Near is blurry. Far is clear(er).

    let farBlur = 0;
    let nearBlur = 0;

    if (diopter < 0) {
      // Myopia
      farBlur = Math.abs(diopter) * 4; // Stronger multiplier for visibility
      nearBlur = 0;
    } else if (diopter > 0) {
      // Hyperopia
      nearBlur = diopter * 4;
      farBlur = 0;
    }

    return { farBlur, nearBlur };
  };

  // Helper: Explanation Text
  const getExplanation = (diopter, eye) => {
    if (diopter === 0) return `${eye} eye has perfect vision.`;
    if (diopter < 0) return `${eye} eye is nearsighted (Myopia). Good at reading nearby objects, but distant objects are blurry.`;
    return `${eye} eye is farsighted (Hyperopia). Good at seeing distant objects, but nearby objects (like reading) are blurry.`;
  };

  const getAnimalFilter = (type) => {
    switch (type) {
      case 'dog': return { filter: 'url(#protanopia) blur(1px)' };
      case 'cat': return { filter: 'url(#deuteranopia) contrast(1.2)' };
      case 'horse': return { filter: 'url(#protanopia) sepia(0.3)' };
      case 'rabbit': return { filter: 'url(#protanopia) blur(0.5px)' }; // Protanopic + lower acuity
      case 'ant': return { filter: 'url(#pixelate)' };
      case 'cow': return { filter: 'url(#protanopia) blur(0.5px)' };
      // New Filters
      case 'owl': return { filter: 'grayscale(100%) contrast(1.5) brightness(1.2)' }; // Night vision
      case 'snake': return { filter: 'sepia(1) hue-rotate(-50deg) saturate(300%) contrast(1.2)' }; // Thermal/Infrared simulation
      case 'lizard': return { filter: 'saturate(150%) contrast(110%)' };
      case 'lion': return { filter: 'url(#deuteranopia) blur(0.5px)' };
      case 'tiger': return { filter: 'url(#deuteranopia) blur(0.5px)' };
      case 'shark': return { filter: 'grayscale(100%) contrast(120%) blur(1px)' }; // Monochromatic + lower acuity
      case 'dolphin': return { filter: 'grayscale(100%) contrast(110%) blur(0.5px)' };
      case 'parrot': return { filter: 'saturate(200%) contrast(110%)' }; // UV/Tetrachromatic
      case 'elephant': return { filter: 'url(#deuteranopia)' };
      case 'peacock': return { filter: 'saturate(200%) contrast(110%)' };
      case 'rat': return { filter: 'url(#protanopia) blur(2px)' };
      case 'pigeon': return { filter: 'contrast(1.2) saturate(1.8) hue-rotate(-10deg)' }; // Hyper-color/UV proxy
      case 'sparrow': return { filter: 'brightness(1.1) saturate(1.2) sepia(0.3)' }; // Warmer, brighter
      default: return {};
    }
  };

  // Render a Lens View (Left or Right)
  const renderLens = (side) => {
    const diopter = prescription[side];
    const { farBlur, nearBlur } = getBlurConfig(diopter);
    const clipId = side === 'left' ? 'url(#lens-clip-left)' : 'url(#lens-clip-right)';

    return (
      <div
        className={`lens-view-layer lens-${side}`}
        style={{
          clipPath: clipId,
          // The container itself doesn't blur, the inner layers do
        }}
      >
        {/* Base Image (Clear) - Acts as the foundation */}
        <div
          className="lens-content base"
          style={{ backgroundImage: `url(${currentBackground.src})` }}
        />

        {/* Far Blur Layer (Top Half) */}
        <div
          className="lens-content far-layer"
          style={{
            backgroundImage: `url(${currentBackground.src})`,
            filter: `blur(${farBlur}px)`,
            opacity: farBlur > 0 ? 1 : 0,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)'
          }}
        />

        {/* Near Blur Layer (Bottom Half) */}
        <div
          className="lens-content near-layer"
          style={{
            backgroundImage: `url(${currentBackground.src})`,
            filter: `blur(${nearBlur}px)`,
            opacity: nearBlur > 0 ? 1 : 0,
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)'
          }}
        />
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 1, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 1, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="pixelate" x="0" y="0">
            <feFlood x="4" y="4" height="2" width="2" />
            <feComposite width="10" height="10" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="5" />
          </filter>
        </defs>
      </svg>

      {/* --- VIEWPORT AREA --- */}
      <div className="viewport">

        {/* CASE 1: ANIMAL COMPARISON VIEW */}
        {viewer !== 'human' && (
          <div className="comparison-container">
            <div
              className="comparison-layer base"
              style={{ backgroundImage: `url(${currentBackground.src})` }}
            >
              <span className="layer-label left">Human View</span>
            </div>



            {/* Layer 2: Animal (Clipped) */}
            <div
              className="comparison-layer overlay"
              style={{
                width: `${compareSlider}%`,
              }}
            >
              <div
                className="comparison-image-fixed"
                style={{
                  backgroundImage: `url(${currentBackground.src})`,
                  ...getAnimalFilter(viewer)
                }}
              />
              <span className="layer-label right">
                {viewers.find(v => v.id === viewer)?.label} View
              </span>
            </div>
            <div
              className="comparison-handle"
              style={{ left: `${compareSlider}%` }}
            >
              <div className="handle-line" />
              <div className="handle-circle">↔</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={compareSlider}
              onChange={(e) => setCompareSlider(e.target.value)}
              className="comparison-input"
            />
          </div>
        )}

        {/* CASE 2: HUMAN GLASSES VIEW */}
        {viewer === 'human' && (
          <>
            {/* Background: ALWAYS CLEAR (Requirement 1) */}
            <div
              className="background-layer"
              style={{
                backgroundImage: `url(${currentBackground.src})`,
                filter: 'none',
                transition: 'filter 0.3s ease'
              }}
            />

            {/* Glasses Frame & Lens */}
            <AnimatePresence>
              {glassesOn && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="glasses-wrapper"
                >
                  <div className="glasses-inner-container">
                    {renderLens('left')}
                    {renderLens('right')}
                    <Glasses className="glasses-frame-svg" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* --- NEW SPATIAL CONTROLS --- */}

      {/* Top Left: Credits */}
      <div className="app-credits">
        <p>Built with ❤️ by Rohan Mayekar</p>
        <a href="https://www.linkedin.com/in/rohanmayekar/" target="_blank" rel="noopener noreferrer">
          Connect on LinkedIn
        </a>
        <p>Last Update: November 2025</p>
      </div>

      {/* Top Right: Glasses Toggle */}
      {viewer === 'human' && (
        <div className="spatial-toggle">
          <button
            onClick={() => setGlassesOn(!glassesOn)}
            className={`toggle-button ${glassesOn ? 'active' : ''}`}
          >
            {glassesOn ? 'Glasses ON' : 'Glasses OFF'}
          </button>
        </div>
      )}

      {/* Bottom Left: Left Eye Control */}
      {viewer === 'human' && (
        <div className="spatial-control left">
          <div className="spatial-label">Left Eye</div>
          <div className="spatial-value">{prescription.left > 0 ? '+' : ''}{prescription.left.toFixed(2)}D</div>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.25"
            value={prescription.left}
            onChange={(e) => setPrescription({ ...prescription, left: parseFloat(e.target.value) })}
            className="spatial-slider"
          />
          <div className="spatial-hint">{getExplanation(prescription.left, 'Left')}</div>
        </div>
      )}

      {/* Bottom Right: Right Eye Control */}
      {viewer === 'human' && (
        <div className="spatial-control right">
          <div className="spatial-label">Right Eye</div>
          <div className="spatial-value">{prescription.right > 0 ? '+' : ''}{prescription.right.toFixed(2)}D</div>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.25"
            value={prescription.right}
            onChange={(e) => setPrescription({ ...prescription, right: parseFloat(e.target.value) })}
            className="spatial-slider"
          />
          <div className="spatial-hint">{getExplanation(prescription.right, 'Right')}</div>
        </div>
      )}

      {/* Bottom Center: Rotating Dials */}
      <div className="dials-wrapper">
        {/* Inner Dial: Viewers */}
        <DialSelector
          items={viewers}
          selectedId={viewer}
          onSelect={setViewer}
          radius={190}
          zIndex={20}
          visibleOffset={120}
          angleStep={36}
        />

        {/* Outer Dial: Scenes */}
        <DialSelector
          items={backgrounds}
          selectedId={backgroundId}
          onSelect={setBackgroundId}
          radius={240}
          zIndex={10}
          label="Scene"
          visibleOffset={170}
          angleStep={36}
        />

        {/* Center Indicator Line */}
        <div className="dial-center-line" />
      </div>

      <div className="vignette" />
    </div>
  );
}

export default App;
