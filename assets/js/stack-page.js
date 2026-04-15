// Renders an entire stack-pillar page from STACK_DATA.
(function () {
  const D = window.STACK_DATA;
  if (!D) return;
  document.title = `${D.titlePlain} — Airtel Secure`;

  const phaseClass = D.phaseClass === "live" ? "tier-advanced"
    : D.phaseClass === "p1" ? "tier-developing" : "tier-basic";

  const html = `
  <div class="container bread">
    <a href="../index.html">Home</a><span>/</span><span>Platform</span><span>/</span><span>${D.titlePlain}</span>
  </div>

  <section class="stack-hero">
    <div class="container">
      <div class="grid grid-2">
        <div class="reveal">
          <span class="eyebrow">${D.eyebrow}</span>
          <h1>${D.title}</h1>
          <p style="font-size:1.1rem">${D.subtitle}</p>
          <div class="hero-ctas mt-6">
            <a class="btn btn-primary" href="../index.html#contact">Talk to a ${D.contactRole || "specialist"} →</a>
            <a class="btn btn-ghost" href="../tools/architecture.html">Build into my architecture</a>
          </div>
          <div class="mt-6"><span class="tier-pill ${phaseClass}">${D.phase}</span></div>
        </div>
        <div class="reveal">
          <div class="stack-side">
            <h5>What's in this pillar</h5>
            ${D.sideFeatures.map((f) => `<div class="feat">${f}</div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Capabilities</span>
        <h2>${D.capabilitiesHead}</h2>
        <p>${D.capabilitiesSub || ""}</p>
      </div>
      <div class="grid grid-3" id="caps-host">
        ${D.capabilities.map((c) => `
          <div class="card reveal">
            <div class="card-icon">${c.icon || `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12 L10 17 L20 7"/></svg>`}</div>
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
          </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section" style="padding:40px 0 60px">
    <div class="container">
      <div class="grid grid-4">
        ${D.outcomes.map((o) => `
          <div class="stat reveal">
            <div class="num"><span data-count="${o.value}" data-suffix="${o.suffix || ""}" data-prefix="${o.prefix || ""}">0</span></div>
            <div class="lbl">${o.label}</div>
          </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">How it works</span>
        <h2>From PO to production — in weeks.</h2>
      </div>
      <div class="grid grid-2">
        <div class="reveal">
          <div class="timeline">
            ${D.howItWorks.map((s, i) => `
              <div class="item">
                <b>Step ${i + 1} · ${s.title}</b>
                <p>${s.desc}</p>
              </div>`).join("")}
          </div>
        </div>
        <div class="card reveal" style="padding:32px">
          <h3 style="margin-bottom:12px">${D.diagramTitle || "Reference deployment"}</h3>
          <p style="font-size:.9rem">${D.diagramSub || ""}</p>
          <div style="margin-top:18px">${D.diagramSvg || ""}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Where it's working</span>
        <h2>Customer proof — anonymised, not theoretical.</h2>
      </div>
      <div class="grid grid-3">
        ${D.useCases.map((u) => `
          <div class="card reveal">
            <span class="eyebrow" style="font-size:.7rem;padding:3px 8px">${u.industry}</span>
            <h3 class="mt-4">${u.title}</h3>
            <p>${u.desc}</p>
            ${u.metric ? `<div style="font-family:var(--display);font-weight:700;font-size:1.5rem;color:#6ee8a6;margin-top:10px">${u.metric}</div>` : ""}
          </div>`).join("")}
      </div>
    </div>
  </section>

  ${D.integrations && D.integrations.length ? `
  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Ecosystem</span>
        <h2>Plays well with what you already own.</h2>
      </div>
      <div class="logos reveal">
        ${D.integrations.map((i) => `<span>${i}</span>`).join("")}
      </div>
    </div>
  </section>` : ""}

  <section class="section">
    <div class="container narrow">
      <div class="section-head reveal">
        <span class="eyebrow">FAQ</span>
        <h2>What buyers ask us most.</h2>
      </div>
      <div class="grid" style="gap:12px">
        ${D.faqs.map((f, i) => `
          <details class="card" style="padding:18px 22px" ${i === 0 ? "open" : ""}>
            <summary style="cursor:pointer;font-weight:600;font-family:var(--display);font-size:1.05rem;list-style:none;display:flex;justify-content:space-between;align-items:center">${f.q}<span style="color:var(--red-2);font-size:1.4rem">+</span></summary>
            <p style="margin-top:12px;color:var(--text-dim)">${f.a}</p>
          </details>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="callout reveal">
        <div class="grid grid-2" style="align-items:center">
          <div>
            <h2>${D.ctaTitle || "Ready to add this pillar to your defence fabric?"}</h2>
            <p class="mt-4">${D.ctaSub || "Book a 30-min architecture session. Walk away with a written blueprint, references and pricing range — within 3 business days."}</p>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap">
            <a class="btn btn-primary" href="../index.html#contact">Book session →</a>
            <a class="btn btn-ghost" href="../tools/tco.html">Calculate TCO</a>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  document.getElementById("stack-host").innerHTML = html;

  // Trigger reveals + counters now that content is injected
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const cio = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const dur = 1400; const start = performance.now();
        function tick(t) {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
})();
