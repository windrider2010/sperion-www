(() => {
  "use strict";

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const sceneContracts = [
    {
      id: "hero_01",
      objective: "Establish Sperion as the translation layer between physical reality and capital decisions.",
      progress: 0,
    },
    {
      id: "gap_02",
      objective: "Show the disconnected layers that sit between conditions and decisions.",
      progress: 0,
    },
    {
      id: "transmission_03",
      objective: "Make the financial transmission chain visible before explaining the platform.",
      progress: 0,
    },
    {
      id: "platform_04",
      objective: "Connect evidence, translation and decision as one system.",
      progress: 0,
    },
    {
      id: "application_05",
      objective: "Show where Sperion intelligence enters a working underwriting workflow.",
      progress: 0,
    },
    {
      id: "research_06",
      objective: "Establish technical depth, governance and explicit uncertainty.",
      progress: 0,
    },
    {
      id: "philosophy_10",
      objective: "Leave the relationship between the real world and the financial model in memory.",
      progress: 0,
    },
    {
      id: "cta_11",
      objective: "Invite a concrete decision conversation.",
      progress: 0,
    },
  ];

  // Scroll and a future deterministic film clock can drive the same 0..1 scene state.
  window.SperionSceneSystem = {
    scenes: sceneContracts,
    setProgress(sceneId, progress) {
      const scene = sceneContracts.find((item) => item.id === sceneId);
      if (scene) scene.progress = clamp(progress);
    },
    getProgress(sceneId) {
      return sceneContracts.find((item) => item.id === sceneId)?.progress ?? 0;
    },
  };

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const gap = document.querySelector(".gap-scene");
  const transmission = document.querySelector(".transmission");
  const philosophy = document.querySelector(".philosophy");
  const flowSteps = [...document.querySelectorAll("[data-step]")];
  const gapLayers = [...document.querySelectorAll(".gap-layers li")];
  const philosophyLines = [...document.querySelectorAll("[data-philosophy-line]")];
  const assetReading = document.querySelector(".asset-reading [data-reading]");

  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  requestAnimationFrame(() => document.body.classList.add("is-ready"));

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7%" },
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const navTargets = navLinks
    .map((link) => ({ link, target: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.target);

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navTargets.forEach(({ link, target }) => link.classList.toggle("is-current", target === visible.target));
    },
    { threshold: [0.12, 0.3, 0.55], rootMargin: "-25% 0px -55%" },
  );
  navTargets.forEach(({ target }) => navObserver.observe(target));

  const sectionProgress = (element) => {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / travel);
  };

  let frameRequested = false;
  const updateScrollScenes = () => {
    frameRequested = false;
    const scrollY = window.scrollY;
    header?.classList.toggle("is-scrolled", scrollY > 32);

    if (gap && window.innerWidth > 920) {
      const progress = sectionProgress(gap);
      window.SperionSceneSystem.setProgress("gap_02", progress);
      gap.style.setProperty("--gap-progress", progress.toFixed(4));
      gap.style.setProperty("--gap-scale", (1.04 + progress * 0.05).toFixed(4));
      gap.style.setProperty("--gap-shift", `${(progress * -18).toFixed(2)}px`);
      const index = Math.min(gapLayers.length - 1, Math.floor(progress * gapLayers.length));
      gapLayers.forEach((layer, layerIndex) => layer.classList.toggle("is-active", layerIndex <= index));
    }

    if (transmission && window.innerWidth > 920) {
      const progress = sectionProgress(transmission);
      window.SperionSceneSystem.setProgress("transmission_03", progress);
      transmission.style.setProperty("--transmission-progress", progress.toFixed(4));
      transmission.style.setProperty("--transmission-shift", `${(progress * -3).toFixed(3)}%`);
      const index = Math.min(flowSteps.length - 1, Math.floor(progress * flowSteps.length));
      flowSteps.forEach((step, stepIndex) => {
        step.classList.toggle("is-active", stepIndex === index);
        step.classList.toggle("is-past", stepIndex < index);
      });
      if (assetReading) assetReading.textContent = flowSteps[index]?.dataset.reading ?? "Heavy precipitation";
    }

    if (philosophy) {
      const progress = sectionProgress(philosophy);
      window.SperionSceneSystem.setProgress("philosophy_10", progress);
      philosophy.style.setProperty("--philosophy-progress", progress.toFixed(4));
      philosophy.style.setProperty("--philosophy-scale", (1.03 + progress * 0.04).toFixed(4));
      philosophy.style.setProperty("--philosophy-shift", `${(progress * -1.4).toFixed(3)}%`);
      const index = Math.min(philosophyLines.length - 1, Math.floor(progress * philosophyLines.length));
      philosophyLines.forEach((line, lineIndex) => line.classList.toggle("is-active", lineIndex === index));
    }
  };

  const requestScrollUpdate = () => {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(updateScrollScenes);
    }
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  updateScrollScenes();
})();
