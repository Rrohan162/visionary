
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './DialSelector.css';

export const DialSelector = ({ items, selectedId, onSelect, radius, zIndex, label, visibleOffset = 100, angleStep = 40 }) => {
    // Initialize rotation to match the selected item immediately
    const [rotation, setRotation] = useState(() => {
        const index = items.findIndex(item => item.id === selectedId);
        return -index * angleStep;
    });
    const controls = useAnimation();

    // Find index of selected item
    const selectedIndex = items.findIndex(item => item.id === selectedId);

    // Track previous index to determine direction
    const prevIndexRef = useRef(selectedIndex);

    useEffect(() => {
        if (selectedIndex === -1) return;

        const prevIndex = prevIndexRef.current;
        let diff = selectedIndex - prevIndex;

        // Handle wrapping for infinite feel
        // If we jump from last to first (e.g. 19 -> 0), diff is -19. We want +1.
        if (diff < -items.length / 2) {
            diff += items.length;
        }
        // If we jump from first to last (e.g. 0 -> 19), diff is +19. We want -1.
        else if (diff > items.length / 2) {
            diff -= items.length;
        }

        // Update rotation
        const newRotation = rotation - (diff * angleStep);
        setRotation(newRotation);
        prevIndexRef.current = selectedIndex;

        controls.start({ rotate: newRotation });
    }, [selectedIndex, items.length, controls, rotation, angleStep]);

    return (
        <div
            className="dial-container"
            style={{
                width: radius * 2,
                height: radius * 2,
                zIndex: zIndex,
                bottom: visibleOffset - (radius * 2),
                cursor: 'pointer' // Indicate clickable
            }}
            onClick={(e) => {
                // Handle clicks on the empty space of the dial
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const clickX = e.clientX;

                if (clickX < centerX) {
                    // Clicked Left -> Go Prev
                    let prevIndex = selectedIndex - 1;
                    if (prevIndex < 0) prevIndex = items.length - 1;
                    onSelect(items[prevIndex].id);
                } else {
                    // Clicked Right -> Go Next
                    let nextIndex = selectedIndex + 1;
                    if (nextIndex >= items.length) nextIndex = 0;
                    onSelect(items[nextIndex].id);
                }
            }}
        >
            <div className="dial-label-floating" style={{ top: 20 }}>{label}</div>

            <motion.div
                className="dial-wheel"
                animate={controls}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                style={{ width: '100%', height: '100%', touchAction: 'none' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                    const threshold = 10;
                    if (info.offset.x > threshold) {
                        // Dragged Right -> Previous Item (Counter-Clockwise)
                        // Logic: index - 1. If < 0, wrap to length - 1.
                        let newIndex = selectedIndex - 1;
                        if (newIndex < 0) newIndex = items.length - 1;
                        onSelect(items[newIndex].id);
                    } else if (info.offset.x < -threshold) {
                        // Dragged Left -> Next Item (Clockwise)
                        let newIndex = selectedIndex + 1;
                        if (newIndex >= items.length) newIndex = 0;
                        onSelect(items[newIndex].id);
                    }
                }}
                onClick={(e) => e.stopPropagation()} // Prevent drag/click on wheel from bubbling to container if handled
            >
                {items.map((item, index) => {
                    // We render items at their absolute positions.
                    // The wheel rotates to bring the selected one to top (0 deg).
                    const angle = index * angleStep;
                    const isActive = item.id === selectedId;

                    // Calculate distance from selection for visibility
                    let diff = index - selectedIndex;
                    if (diff < -items.length / 2) diff += items.length;
                    if (diff > items.length / 2) diff -= items.length;
                    const dist = Math.abs(diff);

                    // Show items within a certain angle range
                    // 135 degrees ensures we see the center and ~3 neighbors on each side
                    // This hides the "back" items that would otherwise overlap in a >360deg circle
                    const isVisible = (dist * angleStep) <= 135;

                    return (
                        <div
                            key={item.id}
                            className={`dial-item ${isActive ? 'active' : ''}`}
                            style={{
                                transform: `rotate(${angle}deg)`,
                                height: radius,
                                opacity: isVisible ? undefined : 0,
                                pointerEvents: isVisible ? 'auto' : 'none',
                                transition: 'opacity 0.3s ease'
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Stop bubbling to container

                                // Calculate diff to determine direction
                                let diff = index - selectedIndex;
                                // Handle wrapping
                                if (diff < -items.length / 2) diff += items.length;
                                if (diff > items.length / 2) diff -= items.length;

                                if (diff === 0) return; // Already selected

                                if (diff > 0) {
                                    // Clicked Right -> Go Next
                                    let nextIndex = selectedIndex + 1;
                                    if (nextIndex >= items.length) nextIndex = 0;
                                    onSelect(items[nextIndex].id);
                                } else {
                                    // Clicked Left -> Go Prev
                                    let prevIndex = selectedIndex - 1;
                                    if (prevIndex < 0) prevIndex = items.length - 1;
                                    onSelect(items[prevIndex].id);
                                }
                            }}
                        >
                            <div
                                className="dial-item-content"
                                style={{
                                    marginTop: '4px',
                                }}
                            >
                                {item.icon && <span className="dial-icon">{item.icon}</span>}
                                <span className="dial-text">{item.label}</span>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};
