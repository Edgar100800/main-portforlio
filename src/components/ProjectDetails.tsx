import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

/** Keep native disclosure semantics; only pointer interactions animate. */
export function ProjectDetails({ children, summary }: { children: ReactNode; summary: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const animation = useRef<Animation | null>(null);
  const targetOpen = useRef(false);

  useEffect(() => () => { animation.current?.cancel(); }, []);

  function toggle(event: MouseEvent<HTMLElement>) {
    const details = ref.current;
    if (!details) return;
    const nextOpen = animation.current ? !targetOpen.current : !details.open;
    const startHeight = details.getBoundingClientRect().height;
    animation.current?.cancel();
    animation.current = null;
    details.style.height = '';
    details.style.overflow = '';

    if (event.detail === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Let the browser handle keyboard and reduced-motion toggles immediately.
      details.open = !nextOpen;
      return;
    }

    event.preventDefault();
    targetOpen.current = nextOpen;
    details.open = nextOpen;
    const endHeight = details.getBoundingClientRect().height;
    details.open = true;
    details.style.height = `${startHeight}px`;
    details.style.overflow = 'hidden';
    const transition = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: nextOpen ? 220 : 160, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' },
    );
    animation.current = transition;
    transition.onfinish = () => {
      details.open = nextOpen;
      details.style.height = '';
      details.style.overflow = '';
      animation.current = null;
      transition.cancel();
    };
  }

  return <details ref={ref} className="project-details">
    <summary className="project-details-trigger project-glass-button liquid-glass" onClick={toggle}>{summary}</summary>
    {children}
  </details>;
}
