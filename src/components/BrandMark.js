// The society's logo as a sticker stuck on the page, with the name beside it.
// Uses the tightly-cropped mark so the logo fills its tile instead of floating in padding.
// Tilts straight when a parent `.group` (e.g. the navbar's home link) is hovered.
const SIZES = {
  md: { img: 'h-6 xl:h-7', pad: 'p-1.5', name: 'text-xl xl:text-2xl' },
  lg: { img: 'h-9', pad: 'p-2', name: 'text-3xl' },
};

export const BrandMark = ({ size = 'md', nameClass = 'text-ink', className = '' }) => {
  const s = SIZES[size] || SIZES.md;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`shrink-0 -rotate-3 rounded-xl border-2 border-ink bg-cream shadow-[3px_3px_0_var(--ink)] ${s.pad} transition-transform duration-300 ease-out group-hover:rotate-0`}>
        <img src="/main-logo-mark.png" alt="" width="221" height="160" decoding="async" className={`${s.img} w-auto`} />
      </span>
      <span className={`font-bricolage font-extrabold leading-none tracking-[-0.03em] ${s.name} ${nameClass}`}>AIvolutions</span>
    </span>
  );
};
