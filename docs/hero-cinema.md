# Hero cinematic scene

## Decision sheet

- Surface: narrative-led introduction for underwriting, credit and valuation teams.
- P1: a decision-maker in a real office, facing the rainy city. P2: the existing two-line promise. P3: the existing evidence-to-decision copy. Action: Explore the platform / See CRE Autopilot.
- Content: existing base photograph and copy; original procedural rain, no generated people or invented evidence.
- System: existing serif/sans pairing, cool exterior, warm practical lamp, amber CTA; one continuous photographic surface, no added panels.
- Signature: the same place remains alive while the story unfolds. Display type is the single existing generic motif; no particle field, telemetry or new decorative grain.
- Risks: rain incorrectly overlaps interior geometry; narrow-screen content exceeds the sticky viewport. Verify matched source coordinates and the complete reading state at every viewport.

Wide:   [ navigation ------------------------------------------ ]
        [ title / city window                  still person     ]
        [ supporting copy / actions            lamp and desk    ]
        [ continuation                         atmosphere pause ]

Mobile: [ brand / menu ]
        [ window and person, cropped as one shared coordinate plane ]
        [ two-line title, wrapping by phrase ]
        [ supporting copy / stacked actions ]
        [ continuation / atmosphere pause ]

## Shot and ownership

0–.15 establishes the office. .15–.36 reveals physical reality; .36–.57 reveals the financial conclusion. .55–.78 introduces supporting copy and actions. .78–.88 holds a readable composition; .88–1 slightly reduces copy prominence before normal document flow takes over.

One ScrollTrigger timeline owns the camera (1.025–1.055 scale, origin 65% / 42%), vignette and copy. CSS sticky provides a 210svh section with a 100svh stage. Reverse scrolling retraces exactly the same timeline. There is no automatic camera loop, pointer controller, scroll interception or Lenis.

Rain, mist, river reflection and warm interior reflection own only their respective optical layers. Every layer uses the original photograph's 1672:941 geometry. The rain matte excludes the frame, person and furniture; architectural pixels are never warped. Ambient animation pauses offscreen, on a hidden tab, or with the explicit pause button. User-requested removal of system reduced-motion branching is preserved.

At viewport heights of 600px or less (740px on narrow phones), content uses normal document flow so landscape, small phones and zoomed displays cannot clip the introduction. Atmospheric motion remains active. Without GSAP, text and links remain readable; video failure leaves the original plate. Without JavaScript the atmosphere is static and the full copy is visible.

## Assets and dependencies

- Base plate: unchanged `assets/sperion-hero-night.webp` from the existing website.
- Rain: original deterministic 960×540, 24fps, 12-second procedural loop. Rebuild with `python scripts/render-hero-rain.py` (Pillow + ffmpeg); WebM preferred, H.264 MP4 fallback. Droplets wrap outside the frame and have periodic paths.
- GSAP / ScrollTrigger: pinned 3.15.0 distribution files served locally under `assets/vendor/`, with upstream copyright/license headers retained and a source notice. https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Design guidance: https://github.com/Xialiang98/design-visual-frontend and the local cinematic-3d-web-design skill.

## Verification

Verify 390×844, 768×1024, 1440×900, 1920×1080 and 2560×1080; establishing / midpoint / reading / exit / reverse states; direct anchor navigation; mobile menu; keyboard; resize; failed GSAP and video; offscreen and manual pause. Physical-device performance and Safari autoplay need separate device testing.

### Browser evidence — 2026-09-20

- Chromium screenshots inspected at all five required sizes, plus 320×640 and 844×390. No horizontal overflow; the complete reading state fits the sticky viewport. Short viewports use normal document flow.
- Corrected phone/tablet crop to keep the person visible. All layers remain aligned because they share a single source coordinate plane.
- Forward/reverse capture recorded. Progress sampled through 46 forward positions was monotonic. At progress .5 in either direction camera scale was 1.04 and title opacity was [1, .6667]; returning to 0 restored scale 1.025 and both title lines to opacity 0. Recorded run produced no JavaScript exceptions. Sampled recording frames were inspected; this is not a physical-device frame-rate benchmark.
- Pause/play, offscreen suspension, mobile navigation, CTA keyboard focus/activation, fast anchor navigation and viewport resizing passed. OS reduced-motion emulation did not disable the requested animation.
- Blocking GSAP leaves a readable normal-flow hero; blocking video preserves the base and visible copy. JavaScript-disabled mobile context retains the introduction and CTAs.
- A pre-existing mobile-menu issue surfaced after scrolling: backdrop-filter on the fixed header contained the fixed menu. Disabling that filter while the menu is open restores the full-viewport menu.
- Main content after Hero and footer were compared against the previous revision and remain identical.
- Weakest remaining dimension: the source photograph itself still contains frozen rain; the added original rivulets, mist and reflected light provide restrained motion, not newly filmed footage. Actual Safari/iOS behavior and low-end hardware performance were not tested.
