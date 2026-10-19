import React, { useState, useEffect, useRef } from 'react';

/**
 * Claim Modal for claiming available (Lost or Found) items.
 * Collects Registration Number and Room Number.
 * Displays item details and retro arcade success feedback.
 */
export default function ClaimModal({ item, onClaim, onClose }) {
  const [regNo, setRegNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Escape key listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleBackdrop = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const validate = () => {
    const errs = {};
    if (!studentName.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!regNo.trim()) {
      errs.regNo = 'Registration number is required.';
    } else if (regNo.trim().length < 5) {
      errs.regNo = 'Please enter a valid Registration No.';
    }
    if (!roomNo.trim()) {
      errs.roomNo = 'Room number / Hostel details required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      onClaim(item.id, {
        claimedBy: {
          name: studentName.trim(),
          regNo: regNo.trim().toUpperCase(),
          roomNo: roomNo.trim(),
          claimedAt: new Date().toISOString().split('T')[0],
        },
      });
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-pacman-card border-2 border-pacman-yellow w-full max-w-md overflow-hidden shadow-pacman flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-pacman-border flex-shrink-0 bg-black/60">
          <div>
            <span className="font-pixel text-[0.45rem] text-pacman-inky tracking-widest">
              CLAIM PROTOCOL
            </span>
            <h2 className="font-pixel text-pacman-yellow text-[0.7rem] glow-yellow mt-1">
              CLAIM THIS ITEM
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-pixel text-[0.5rem] text-pacman-yellow/50 hover:text-pacman-blinky border border-pacman-border hover:border-pacman-blinky px-2 py-1.5 transition-colors"
          >
            ✕ ESC
          </button>
        </div>

        {/* Item Summary Banner */}
        <div className="p-4 bg-black/40 border-b-2 border-pacman-border flex items-center gap-3">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            className="w-16 h-16 object-cover border border-pacman-border"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-pixel text-pacman-yellow text-[0.6rem] truncate">
              {item.name}
            </h3>
            <p className="font-vt text-pacman-inky text-base">
              📍 {item.location} &nbsp;|&nbsp; 🏷️ {item.category}
            </p>
            <span className="font-pixel text-[0.4rem] text-pacman-yellow/70">
              STATUS: {item.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <p className="font-vt text-pacman-yellow/70 text-lg leading-tight">
            Please enter your campus verification details to claim or collect this item.
          </p>

          {/* Student Name */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
              YOUR NAME <span className="text-pacman-blinky">*</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. ALEX CHEN"
              className="w-full bg-black border-2 border-pacman-border focus:border-pacman-yellow text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 outline-none"
            />
            {errors.name && (
              <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.name}</p>
            )}
          </div>

          {/* Registration Number */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
              REGISTRATION NO. <span className="text-pacman-blinky">*</span>
            </label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => {
                setRegNo(e.target.value);
                if (errors.regNo) setErrors((prev) => ({ ...prev, regNo: '' }));
              }}
              placeholder="e.g. 23BCE10452"
              className="w-full bg-black border-2 border-pacman-border focus:border-pacman-yellow text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 uppercase outline-none"
            />
            {errors.regNo && (
              <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.regNo}</p>
            )}
          </div>

          {/* Room Number */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
              ROOM NO. / HOSTEL <span className="text-pacman-blinky">*</span>
            </label>
            <input
              type="text"
              value={roomNo}
              onChange={(e) => {
                setRoomNo(e.target.value);
                if (errors.roomNo) setErrors((prev) => ({ ...prev, roomNo: '' }));
              }}
              placeholder="e.g. Block B - Room 304"
              className="w-full bg-black border-2 border-pacman-border focus:border-pacman-yellow text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 outline-none"
            />
            {errors.roomNo && (
              <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.roomNo}</p>
            )}
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-pacman-border text-pacman-yellow/60 hover:border-pacman-yellow hover:text-pacman-yellow font-pixel text-[0.45rem] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-pacman-pinky text-black hover:bg-white disabled:opacity-50 font-pixel text-[0.45rem] transition-colors flex items-center justify-center gap-2 border-2 border-pacman-pinky font-bold"
            >
              {submitting ? (
                <span className="animate-flicker">PROCESSING...</span>
              ) : (
                '🟣 CONFIRM CLAIM'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
