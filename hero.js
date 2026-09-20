(() => {
  "use strict";

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const rain = hero.querySelector(".hero-rain");
  const toggle = hero.querySelector(".hero-motion-toggle");
  let visible = false;
  let paused = false;

  const updateAtmosphere = () => {
    const playing = visible && !paused && !document.hidden;
    hero.classList.toggle("is-in-view", visible);
    hero.classList.toggle("is-atmosphere-paused", !playing);
    if (playing) rain?.play().catch(() => { /* Autoplay may be blocked; the base plate remains. */ });
    else rain?.pause();
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateAtmosphere();
  }, { threshold: 0 });
  observer.observe(hero);
  document.addEventListener("visibilitychange", updateAtmosphere);
  window.addEventListener("pagehide", () => rain?.pause());
  window.addEventListener("pageshow", updateAtmosphere);
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    paused = !paused;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = paused ? "Play atmosphere" : "Pause atmosphere";
    updateAtmosphere();
  });

  // Progressive enhancement: unavailable scripts leave a readable one-screen hero.
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();
  media.add("(min-height: 741px), (min-width: 641px) and (min-height: 601px)", () => {
    hero.classList.add("is-cinematic");
    const cinema = hero.querySelector(".hero-cinema");
    const content = hero.querySelector(".hero-content");
    const lines = [...hero.querySelectorAll("h1 span")];
    const kicker = hero.querySelector(".hero-kicker");
    const copy = hero.querySelector(".hero-detail > p");
    const actions = hero.querySelector(".hero-actions");

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate() {
        window.SperionSceneSystem?.setProgress("hero_01", this.progress());
      },
      scrollTrigger: {
        id: "sperion-hero",
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
      },
    });
    timeline
      .fromTo(cinema, { scale: 1.025 }, { scale: 1.055, duration: 1 }, 0)
      .fromTo(hero.querySelector(".hero-vignette"), { opacity: .45 }, { opacity: 1, duration: .52 }, .12)
      .fromTo(kicker, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .14 }, .13)
      .fromTo(lines[0], { opacity: 0, y: 14, filter: "blur(2px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .21 }, .15)
      .fromTo(lines[1], { opacity: 0, y: 14, filter: "blur(2px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .21 }, .36)
      .fromTo(copy, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .16 }, .55)
      .fromTo(actions, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .14 }, .64)
      .to(content, { opacity: .72, duration: .12 }, .88);

    // Keyboard access reveals the complete introduction before focus can enter it.
    const revealForFocus = () => {
      if (timeline.progress() < .78) {
        const trigger = timeline.scrollTrigger;
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * .8, behavior: "instant" });
        trigger.update();
        trigger.getTween()?.progress(1);
      }
    };
    content.addEventListener("focusin", revealForFocus);
    return () => {
      content.removeEventListener("focusin", revealForFocus);
      hero.classList.remove("is-cinematic");
      window.SperionSceneSystem?.setProgress("hero_01", 0);
    };
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
