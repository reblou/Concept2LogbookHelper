import React, { useState, useRef, useEffect } from 'react';
import "../css/MovablePopup.css";

function MovablePopup({ title = 'Popup Window', isOpen = false, onClose, children}) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const popupRef = useRef(null);

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
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    return (
            <div ref={popupRef}
                className="movable-popup"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            >
                <div className="popup-header" onMouseDown={handleMouseDown}>
                <h2 onMouseDown={handleMouseDown}>{title}</h2>
                    <button onClick={onClose} className="popup-close-btn">
                        X
                    </button>
                </div>

                <div className="popup-content">
                    {children}
                </div>
            </div>
    );
}


export default MovablePopup;