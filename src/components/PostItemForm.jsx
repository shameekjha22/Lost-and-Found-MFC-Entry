import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, LOCATIONS } from '../data/items';

const INITIAL_FORM = {
  name: '',
  category: '',
  location: '',
  status: 'Lost',
  date: '',
  description: '',
};

const INITIAL_ERRORS = {
  name: '',
  category: '',
  location: '',
  date: '',
};

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/** Field wrapper with pixel label and retro error. */
function Field({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
        {label}
        {required && <span className="text-pacman-blinky ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-vt text-pacman-blinky text-base flex items-center gap-1 mt-0.5">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasError) =>
  `w-full bg-black border-2 ${
    hasError
      ? 'border-pacman-blinky focus:border-pacman-blinky'
      : 'border-pacman-border focus:border-pacman-yellow'
  } text-pacman-yellow placeholder-pacman-yellow/20 font-vt text-xl px-3 py-2.5 focus:outline-none transition-colors`;

/**
 * Modal form — PacMan retro arcade style.
 */
export default function PostItemForm({ onAdd, onClose }) {
  const [form, setForm]             = useState(INITIAL_FORM);
  const [errors, setErrors]         = useState(INITIAL_ERRORS);
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef     = useRef(null);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape to close
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  function handleBackdropClick(e) {
    if (e.target === modalRef.current) onClose();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select a valid image file.'); return; }
    if (file.size > 5 * 1024 * 1024)    { alert('Image must be smaller than 5 MB.');  return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function validate() {
    const newErrors = { ...INITIAL_ERRORS };
    let valid = true;

    if (!form.name.trim()) {
      newErrors.name = 'Item name is required.'; valid = false;
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.'; valid = false;
    }
    if (!form.category) { newErrors.category = 'Please select a category.'; valid = false; }
    if (!form.location)  { newErrors.location  = 'Please select a location.';  valid = false; }
    if (!form.date) {
      newErrors.date = 'Date is required.'; valid = false;
    } else if (form.date > todayISO()) {
      newErrors.date = 'Date cannot be in the future.'; valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      onAdd({
        id:          Date.now(),
        name:        form.name.trim(),
        category:    form.category,
        location:    form.location,
        status:      form.status,
        date:        form.date,
        description: form.description.trim(),
        image:       imagePreview || null,
      });
      setSubmitting(false);
      onClose();
    }, 600);
  }

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-pacman-card border-2 border-pacman-yellow w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-pacman">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-pacman-border flex-shrink-0">
          <div>
            <h2 id="modal-title" className="font-pixel text-pacman-yellow text-[0.6rem] glow-yellow">
              REPORT AN ITEM
            </h2>
            <p className="font-vt text-pacman-yellow/50 text-base mt-1">
              Fields marked <span className="text-pacman-blinky">*</span> are required
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-pixel text-[0.5rem] text-pacman-yellow/50 hover:text-pacman-blinky border border-pacman-border hover:border-pacman-blinky px-2 py-1.5 transition-colors"
            aria-label="Close modal"
          >
            ✕ ESC
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-5">

            {/* Status toggle */}
            <div className="flex flex-col gap-2">
              <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
                I AM REPORTING A <span className="text-pacman-blinky">*</span>
              </label>
              <div className="flex border-2 border-pacman-border overflow-hidden">
                {['Lost', 'Found'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={`flex-1 py-2.5 font-pixel text-[0.45rem] transition-all ${
                      form.status === s
                        ? s === 'Lost'
                          ? 'bg-pacman-blinky text-white'
                          : 'bg-pacman-inky text-black'
                        : 'bg-black text-pacman-yellow/40 hover:text-pacman-yellow'
                    }`}
                  >
                    {s === 'Lost' ? '👻 LOST ITEM' : '✅ FOUND ITEM'}
                  </button>
                ))}
              </div>
            </div>

            {/* Item name */}
            <Field label="ITEM NAME" error={errors.name} required>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. BLUE WATER BOTTLE"
                className={inputCls(!!errors.name)}
                maxLength={80}
              />
            </Field>

            {/* Category + Location */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="CATEGORY" error={errors.category} required>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`${inputCls(!!errors.category)} appearance-none pr-8 cursor-pointer`}
                  >
                    <option value="">SELECT...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="font-pixel text-pacman-yellow text-[0.45rem]">▼</span>
                  </div>
                </div>
              </Field>

              <Field label="LOCATION" error={errors.location} required>
                <div className="relative">
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={`${inputCls(!!errors.location)} appearance-none pr-8 cursor-pointer`}
                  >
                    <option value="">SELECT...</option>
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="font-pixel text-pacman-yellow text-[0.45rem]">▼</span>
                  </div>
                </div>
              </Field>
            </div>

            {/* Date */}
            <Field label="DATE" error={errors.date} required>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={todayISO()}
                className={`${inputCls(!!errors.date)} [color-scheme:dark]`}
              />
            </Field>

            {/* Description */}
            <Field label="DESCRIPTION (OPTIONAL)" error="">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="ADD DETAILS: COLOUR, BRAND, MARKS..."
                rows={3}
                maxLength={300}
                className={`${inputCls(false)} resize-none`}
              />
              <p className="font-vt text-pacman-yellow/30 text-sm text-right">
                {form.description.length}/300
              </p>
            </Field>

            {/* Image upload */}
            <div className="flex flex-col gap-2">
              <label className="font-pixel text-pacman-yellow text-[0.45rem] tracking-wide">
                IMAGE (OPTIONAL)
              </label>

              {imagePreview ? (
                <div className="relative border-2 border-pacman-yellow overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover opacity-80" />
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)' }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 font-pixel text-[0.4rem] bg-black/80 text-pacman-blinky border border-pacman-blinky px-2 py-1.5 hover:bg-pacman-blinky/20 transition-colors"
                    aria-label="Remove image"
                  >
                    ✕ REMOVE
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <span className="font-vt text-sm bg-black/70 text-pacman-yellow px-2 py-0.5">
                      {imageFile?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-pacman-border hover:border-pacman-yellow cursor-pointer bg-black/50 hover:bg-pacman-card transition-all group"
                >
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <span className="text-3xl group-hover:animate-bounce select-none">🖼️</span>
                    <p className="font-vt text-pacman-yellow/40 group-hover:text-pacman-yellow text-lg transition-colors">
                      CLICK TO UPLOAD IMAGE
                    </p>
                    <p className="font-vt text-pacman-border text-base">PNG · JPG · WEBP · MAX 5MB</p>
                  </div>
                  <input
                    id="image-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t-2 border-pacman-border flex gap-3 flex-shrink-0">
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
              className="flex-1 py-2.5 bg-pacman-yellow hover:bg-pacman-yellow2 disabled:opacity-50 disabled:cursor-not-allowed text-black font-pixel text-[0.45rem] transition-colors flex items-center justify-center gap-2 border-2 border-pacman-yellow"
            >
              {submitting ? (
                <span className="animate-flicker">SUBMITTING...</span>
              ) : (
                '▶ SUBMIT REPORT'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
