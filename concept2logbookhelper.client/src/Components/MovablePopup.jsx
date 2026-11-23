import React, { useState, useRef, useEffect } from 'react';
import "../css/MovablePopup.css";

function MovablePopup({ title = 'Popup Window', isOpen = false, onClose, children}) {
    const [position, setPosition] = useState({ x: 16, y: 16 });
    const [isDragging, setIsDragging] = useState(false);
    const [size, setSize] = useState({ width: 800, height: 500 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);

    const popupRef = useRef(null);

    const startResizing = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseDown = (e) => {
		const rect = popupRef.current.getBoundingClientRect();
		setOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
		setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            });
        } else if (isResizing) {
            const newWidth = Math.max(200, e.clientX - position.x);
            const newHeight = Math.max(150, e.clientY - position.y);
            setSize({ width: newWidth, height: newHeight });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) { 
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, position]);

    useEffect(() => {
        if (!isOpen) return;
        const width = Math.min(800, window.innerWidth - 32);
        const height = Math.min(500, window.innerHeight - 32);
        setSize({ width, height });
        setPosition({ x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 });
    }, [isOpen]);

    if (!isOpen) return null;

    return (
            <div ref={popupRef}
                className="movable-popup"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${size.width}px`,
                    height: `${size.height}px`
                }}
			>
                <div className="popup-header" onMouseDown={handleMouseDown}>
                <h2>{title}</h2>
                    <button onClick={onClose} onMouseDown={event => event.stopPropagation()} className="popup-close-btn" aria-label="Close graph">
                        ×
                    </button>
                </div>

                <div className="popup-content">{children}</div>
				<div className="resize" onMouseDown={startResizing} /> 

            </div>
    );
}


export default MovablePopup;
