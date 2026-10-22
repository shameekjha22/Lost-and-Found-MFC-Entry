import React, { useState, useEffect, useRef } from 'react';
import { LOCATIONS } from '../data/items';

/**
 * ReportFoundModal:
 * For Lost items: enables another student who found it to report where they found it,
 * where they deposited it (e.g. Security Desk, Reception, Hostel Warden), and their details.
 */
export default function ReportFoundModal({ item, onFoundReported, onClose }) {
  const [founderName, setFounderName] = useState('');
  const [founderRegNo, setFounderRegNo] = useState('');
  const [founderRoomNo, setFounderRoomNo] = useState('');
  const [foundLocation, setFoundLocation] = useState(item.location || '');
  const [depositedAt, setDepositedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  // Valid 3-letter program codes per VIT Bhopal
  const VALID_PROGRAMS = [
    'BCE','BIT','BBI','BCI','BCB','BKT','BDS',
    'BAI','BMI','BIO','BEC','ECE','BVD','BEE','EEE','BME','BCL',
  ];
  const REG_NO_REGEX = /^(2[2-6])[A-Z]{3}\d{4}$/;

  const validate = () => {
    const errs = {};
    if (!founderName.trim()) {
      errs.name = 'Your name is required.';
    }
    if (!founderRegNo.trim()) {
      errs.regNo = 'Registration number is required.';
    } else {
      const val = founderRegNo.trim().toUpperCase();
      if (!REG_NO_REGEX.test(val)) {
        errs.regNo = 'Invalid format. Use YYPPP#### — e.g. 26BCE2412';
      } else {
        const program = val.slice(2, 5);
        if (!VALID_PROGRAMS.includes(program)) {
          errs.regNo = `'${program}' is not a valid program code.`;
        }
      }
    }
    if (!founderRoomNo.trim()) {
      errs.roomNo = 'Your room / hostel number is required.';
    }
    if (!depositedAt.trim()) {
      errs.depositedAt = 'Please state where you kept or handed over this item.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      onFoundReported(item.id, {
        founder: {
          name: founderName.trim(),
          regNo: founderRegNo.trim().toUpperCase(),
          roomNo: founderRoomNo.trim(),
          depositedAt: depositedAt.trim(),
          notes: notes.trim(),
          reportedAt: new Date().toISOString().split('T')[0],
        },
        location: foundLocation || item.location,
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
      <div className="bg-pacman-card border-2 border-pacman-inky w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-ghost-cyan flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-pacman-border flex-shrink-0 bg-black/60">
          <div>
            <span className="font-pixel text-[0.45rem] text-pacman-inky tracking-widest">
              GOOD SAMARITAN BEACON
            </span>
            <h2 className="font-pixel text-pacman-inky text-[0.68rem] glow-cyan mt-1">
              REPORT ITEM FOUND
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
            <span className="font-pixel text-[0.4rem] text-pacman-blinky bg-pacman-blinky/10 border border-pacman-blinky/30 px-1.5 py-0.5">
              🔴 REPORTED LOST
            </span>
            <h3 className="font-pixel text-pacman-yellow text-[0.6rem] truncate mt-1">
              {item.name}
            </h3>
            <p className="font-vt text-pacman-yellow/70 text-base">
              Original location: {item.location} &nbsp;|&nbsp; 🏷️ {item.category}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <p className="font-vt text-pacman-yellow/70 text-lg leading-tight">
            Did you find this lost item? Enter where you found it and where the owner can retrieve it!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Founder Name */}
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
                YOUR NAME <span className="text-pacman-blinky">*</span>
              </label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => {
                  setFounderName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. SARAH CONNOR"
                className="w-full bg-black border-2 border-pacman-border focus:border-pacman-inky text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 outline-none"
              />
              {errors.name && (
                <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.name}</p>
              )}
            </div>

            {/* Registration Number */}
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
                YOUR REG NO. <span className="text-pacman-blinky">*</span>
              </label>
              <input
                type="text"
                value={founderRegNo}
                onChange={(e) => {
                  setFounderRegNo(e.target.value.toUpperCase());
                  if (errors.regNo) setErrors((prev) => ({ ...prev, regNo: '' }));
                }}
                placeholder="e.g. 26BCE2412"
                className="w-full bg-black border-2 border-pacman-border focus:border-pacman-inky text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 uppercase outline-none"
              />
              {errors.regNo && (
                <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.regNo}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Founder Room Number */}
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
                YOUR ROOM NO. <span className="text-pacman-blinky">*</span>
              </label>
              <input
                type="text"
                value={founderRoomNo}
                onChange={(e) => {
                  setFounderRoomNo(e.target.value);
                  if (errors.roomNo) setErrors((prev) => ({ ...prev, roomNo: '' }));
                }}
                placeholder="e.g. Block C - 204"
                className="w-full bg-black border-2 border-pacman-border focus:border-pacman-inky text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 outline-none"
              />
              {errors.roomNo && (
                <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.roomNo}</p>
              )}
            </div>

            {/* Location Found */}
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
                LOCATION FOUND
              </label>
              <select
                value={foundLocation}
                onChange={(e) => setFoundLocation(e.target.value)}
                className="w-full bg-black border-2 border-pacman-border focus:border-pacman-inky text-pacman-yellow font-vt text-xl px-3 py-2 outline-none cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Where deposited */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
              DEPOSITED AT / HANDOVER POINT <span className="text-pacman-blinky">*</span>
            </label>
            <input
              type="text"
              value={depositedAt}
              onChange={(e) => {
                setDepositedAt(e.target.value);
                if (errors.depositedAt) setErrors((prev) => ({ ...prev, depositedAt: '' }));
              }}
              placeholder="e.g. Left with Library Front Desk / In my possession (Call me)"
              className="w-full bg-black border-2 border-pacman-border focus:border-pacman-inky text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 outline-none"
            />
            {errors.depositedAt && (
              <p className="font-vt text-pacman-blinky text-base mt-0.5">⚠ {errors.depositedAt}</p>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
              ADDITIONAL NOTES (OPTIONAL)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Found on 3rd floor sofa near study corner..."
              rows={2}
              className="w-full bg-black border-2 border-pacman-border focus:border-pacman-inky text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2 outline-none resize-none"
            />
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="pt-2 flex gap-3">
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
              className="flex-1 py-2.5 bg-pacman-inky text-black hover:bg-white disabled:opacity-50 font-pixel text-[0.45rem] transition-colors flex items-center justify-center gap-2 border-2 border-pacman-inky font-bold"
            >
              {submitting ? (
                <span className="animate-flicker">RECORDING...</span>
              ) : (
                '🔵 CONFIRM FOUND'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
