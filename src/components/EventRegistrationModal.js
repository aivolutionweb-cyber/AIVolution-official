import { Fragment, useEffect, useState } from "react";
import "animate.css";

const STEPS = ["IDENTITY", "DETAILS", "CONFIRM"];

const emptyForm = {
  fullName: "",
  enrollment: "",
  branch: "",
  year: "",
  email: "",
  phone: "",
  experienceLevel: "Beginner",
  note: "",
  teamName: "",
  teammates: [{ name: "", enrollment: "" }],
};

const inputClass =
  "w-full bg-surface border-b-2 border-gridline px-0 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all duration-300";
const labelClass =
  "font-mono text-[10px] text-muted tracking-widest uppercase mb-1 block";

export const EventRegistrationModal = ({ event, onClose }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(emptyForm);
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!event) return;
    setStep(0);
    setFormData(emptyForm);
    setAttemptedNext(false);
    setSubmitting(false);
    setConfirmation(null);
  }, [event]);

  useEffect(() => {
    if (!event) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [event, onClose]);

  if (!event) return null;

  const isTeam = event.registrationKind === "team";

  const update = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const updateTeammate = (idx, field, value) =>
    setFormData((p) => {
      const teammates = [...p.teammates];
      teammates[idx] = { ...teammates[idx], [field]: value };
      return { ...p, teammates };
    });

  const addTeammate = () =>
    setFormData((p) => ({
      ...p,
      teammates: [...p.teammates, { name: "", enrollment: "" }],
    }));

  const removeTeammate = (idx) =>
    setFormData((p) => ({
      ...p,
      teammates: p.teammates.filter((_, i) => i !== idx),
    }));

  const stepValid = (s) => {
    if (s === 0) {
      return (
        formData.fullName.trim() &&
        formData.enrollment.trim() &&
        formData.branch.trim() &&
        formData.year &&
        /\S+@\S+\.\S+/.test(formData.email) &&
        /^\d{10}$/.test(formData.phone)
      );
    }
    if (s === 1 && isTeam) {
      return (
        formData.teamName.trim() &&
        formData.teammates.every((t) => t.name.trim() && t.enrollment.trim())
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!stepValid(step)) {
      setAttemptedNext(true);
      return;
    }
    setAttemptedNext(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setAttemptedNext(false);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // Frontend-only stub — no backend yet. Fake a short "processing" beat
    // so the flow reads as real, then generate a client-side confirmation.
    setTimeout(() => {
      const regId = `AIV-${event.id}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`;
      setSubmitting(false);
      setConfirmation({ regId });
    }, 900);
  };

  const errClass = (ok) =>
    attemptedNext && !ok ? "border-red-500" : "border-gridline";

  return (
    <div
      className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-gridline bg-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 text-white/50 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
        >
          CLOSE ×
        </button>

        {confirmation ? (
          <SuccessScreen
            event={event}
            formData={formData}
            isTeam={isTeam}
            confirmation={confirmation}
            onClose={onClose}
          />
        ) : (
          <div className="p-6 md:p-10 animate__animated animate__fadeIn">
            <span className="block font-mono text-[10px] tracking-widest uppercase text-primary mb-2">
              Registration Protocol
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl uppercase tracking-tight text-white mb-8">
              {event.title}
            </h2>

            <Stepper step={step} />

            <div key={step} className="animate__animated animate__fadeIn animate__faster mt-8">
              {step === 0 && (
                <IdentityStep
                  formData={formData}
                  update={update}
                  attemptedNext={attemptedNext}
                  errClass={errClass}
                />
              )}
              {step === 1 && (
                <DetailsStep
                  isTeam={isTeam}
                  formData={formData}
                  update={update}
                  updateTeammate={updateTeammate}
                  addTeammate={addTeammate}
                  removeTeammate={removeTeammate}
                  attemptedNext={attemptedNext}
                  errClass={errClass}
                />
              )}
              {step === 2 && (
                <ConfirmStep event={event} formData={formData} isTeam={isTeam} />
              )}
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gridline">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="font-mono text-xs uppercase tracking-widest text-muted hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-colors"
              >
                ← Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 border border-white text-white font-mono text-xs tracking-widest uppercase hover:bg-primary hover:border-primary transition-all duration-300"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 border border-primary bg-primary/10 text-white font-mono text-xs tracking-widest uppercase hover:bg-primary transition-all duration-300 disabled:opacity-60"
                >
                  {submitting ? "Processing…" : "Submit Registration"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Stepper = ({ step }) => (
  <div className="flex items-center">
    {STEPS.map((label, idx) => (
      <Fragment key={label}>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border-2 transition-colors duration-300 ${
              idx < step
                ? "bg-primary border-primary text-white"
                : idx === step
                ? "border-primary text-primary"
                : "border-gridline text-muted"
            }`}
          >
            {idx < step ? "✓" : idx + 1}
          </div>
          <span
            className={`font-mono text-[9px] uppercase tracking-widest whitespace-nowrap ${
              idx <= step ? "text-primary" : "text-muted"
            }`}
          >
            {label}
          </span>
        </div>
        {idx < STEPS.length - 1 && (
          <div
            className={`flex-1 h-px mx-2 mb-5 transition-colors duration-500 ${
              idx < step ? "bg-primary" : "bg-gridline"
            }`}
          />
        )}
      </Fragment>
    ))}
  </div>
);

const IdentityStep = ({ formData, update, attemptedNext, errClass }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <label className={labelClass}>
        <span className="text-primary mr-1">&gt;</span> Full Name
      </label>
      <input
        type="text"
        value={formData.fullName}
        onChange={(e) => update("fullName", e.target.value)}
        className={`${inputClass} ${errClass(formData.fullName.trim())}`}
      />
    </div>
    <div>
      <label className={labelClass}>
        <span className="text-primary mr-1">&gt;</span> Enrollment No.
      </label>
      <input
        type="text"
        value={formData.enrollment}
        onChange={(e) => update("enrollment", e.target.value)}
        className={`${inputClass} ${errClass(formData.enrollment.trim())}`}
      />
    </div>
    <div>
      <label className={labelClass}>
        <span className="text-primary mr-1">&gt;</span> Branch / Course
      </label>
      <input
        type="text"
        placeholder="e.g. CSE-AI"
        value={formData.branch}
        onChange={(e) => update("branch", e.target.value)}
        className={`${inputClass} ${errClass(formData.branch.trim())}`}
      />
    </div>
    <div>
      <label className={labelClass}>
        <span className="text-primary mr-1">&gt;</span> Year
      </label>
      <select
        value={formData.year}
        onChange={(e) => update("year", e.target.value)}
        className={`${inputClass} ${errClass(!!formData.year)}`}
      >
        <option value="" disabled>
          Select year
        </option>
        <option>1st Year</option>
        <option>2nd Year</option>
        <option>3rd Year</option>
        <option>4th Year</option>
      </select>
    </div>
    <div>
      <label className={labelClass}>
        <span className="text-primary mr-1">&gt;</span> Email
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => update("email", e.target.value)}
        className={`${inputClass} ${errClass(/\S+@\S+\.\S+/.test(formData.email))}`}
      />
    </div>
    <div>
      <label className={labelClass}>
        <span className="text-primary mr-1">&gt;</span> Phone
      </label>
      <input
        type="tel"
        placeholder="10-digit number"
        value={formData.phone}
        onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
        className={`${inputClass} ${errClass(/^\d{10}$/.test(formData.phone))}`}
      />
    </div>
  </div>
);

const DetailsStep = ({
  isTeam,
  formData,
  update,
  updateTeammate,
  addTeammate,
  removeTeammate,
  attemptedNext,
  errClass,
}) => {
  if (!isTeam) {
    return (
      <div className="space-y-6">
        <div>
          <label className={labelClass}>
            <span className="text-primary mr-1">&gt;</span> Prior Experience
          </label>
          <select
            value={formData.experienceLevel}
            onChange={(e) => update("experienceLevel", e.target.value)}
            className={inputClass}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>
            <span className="text-primary mr-1">&gt;</span> Anything else? (optional)
          </label>
          <textarea
            rows="3"
            value={formData.note}
            onChange={(e) => update("note", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>
          <span className="text-primary mr-1">&gt;</span> Team Name
        </label>
        <input
          type="text"
          value={formData.teamName}
          onChange={(e) => update("teamName", e.target.value)}
          className={`${inputClass} ${errClass(formData.teamName.trim())}`}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-[10px] text-muted tracking-widest uppercase">
            Teammates (besides you)
          </label>
          {formData.teammates.length < 5 && (
            <button
              type="button"
              onClick={addTeammate}
              className="font-mono text-[10px] text-primary hover:text-white uppercase tracking-widest transition-colors"
            >
              + Add Teammate
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.teammates.map((tm, idx) => (
            <div
              key={idx}
              className="animate__animated animate__fadeIn animate__faster grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end border-b border-gridline pb-4"
            >
              <div>
                <label className="font-mono text-[9px] text-muted uppercase tracking-widest mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  value={tm.name}
                  onChange={(e) => updateTeammate(idx, "name", e.target.value)}
                  className={`${inputClass} ${errClass(tm.name.trim())}`}
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-muted uppercase tracking-widest mb-1 block">
                  Enrollment No.
                </label>
                <input
                  type="text"
                  value={tm.enrollment}
                  onChange={(e) => updateTeammate(idx, "enrollment", e.target.value)}
                  className={`${inputClass} ${errClass(tm.enrollment.trim())}`}
                />
              </div>
              {formData.teammates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTeammate(idx)}
                  className="font-mono text-[10px] text-muted hover:text-red-400 uppercase tracking-widest transition-colors pb-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConfirmStep = ({ event, formData, isTeam }) => (
  <div className="border border-gridline rounded-lg p-6 md:p-8 font-mono text-xs md:text-sm bg-surface/50">
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-gridline">
      <span className="text-muted uppercase tracking-widest">Registration Summary</span>
      <span className="text-primary uppercase tracking-widest">Review</span>
    </div>
    <dl className="space-y-3">
      <Row label="Event" value={event.title} />
      <Row label="Name" value={formData.fullName} />
      <Row label="Enrollment" value={formData.enrollment} />
      <Row label="Branch / Year" value={`${formData.branch} · ${formData.year}`} />
      <Row label="Contact" value={`${formData.email} · ${formData.phone}`} />
      {isTeam ? (
        <>
          <Row label="Team" value={formData.teamName} />
          {formData.teammates.map((t, idx) => (
            <Row key={idx} label={`Teammate ${idx + 1}`} value={`${t.name} (${t.enrollment})`} />
          ))}
        </>
      ) : (
        <>
          <Row label="Experience" value={formData.experienceLevel} />
          {formData.note && <Row label="Note" value={formData.note} />}
        </>
      )}
    </dl>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-6">
    <dt className="text-muted uppercase tracking-widest shrink-0">{label}</dt>
    <dd className="text-white text-right break-words">{value}</dd>
  </div>
);

const SuccessScreen = ({ event, formData, confirmation, onClose }) => (
  <div className="p-8 md:p-14 text-center animate__animated animate__zoomIn animate__faster">
    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
      <span className="text-green-400 text-3xl">✓</span>
    </div>
    <span className="block font-mono text-[10px] tracking-widest uppercase text-green-400 mb-2">
      Registration Confirmed
    </span>
    <h2 className="font-display font-extrabold text-2xl md:text-3xl uppercase tracking-tight text-white mb-8">
      You're In, {formData.fullName.split(" ")[0]}
    </h2>

    <div className="text-left border border-gridline rounded-lg overflow-hidden max-w-md mx-auto">
      <div className="bg-primary/10 border-b border-dashed border-gridline px-6 py-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Event</span>
        <span className="font-display font-bold text-white uppercase text-sm">{event.title}</span>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-b border-gridline">
        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Registration ID</span>
        <span className="font-mono text-primary text-sm tracking-widest">{confirmation.regId}</span>
      </div>
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Attendee</span>
        <span className="font-mono text-white text-sm">{formData.fullName}</span>
      </div>
    </div>

    <p className="font-mono text-[10px] text-muted tracking-widest uppercase mt-8 max-w-sm mx-auto leading-relaxed">
      This is a frontend preview — nothing has been saved yet. Real registrations will be stored once the backend is connected.
    </p>

    <button
      onClick={onClose}
      className="mt-8 px-10 py-3 border border-white text-white font-mono text-xs tracking-widest uppercase hover:bg-primary hover:border-primary transition-all duration-300"
    >
      Close
    </button>
  </div>
);
