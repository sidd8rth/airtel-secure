// Security Maturity Self-Assessment
(function () {
  const QUESTIONS = [
    {
      domain: "Governance & Compliance",
      q: "How do you track compliance with Indian regulations (DPDP Act, RBI, SEBI, IRDAI, CERT-In 6-hr reporting)?",
      opts: [
        { t: "We rely on legal/audit to flag issues when they come up.", s: 1 },
        { t: "A spreadsheet owned by one team, updated ad-hoc.", s: 2 },
        { t: "A GRC tool with mapped controls, reviewed quarterly.", s: 3 },
        { t: "Continuous evidence collection, auto-mapped controls, real-time board dashboard.", s: 4 }
      ]
    },
    {
      domain: "Identity & Access",
      q: "How do privileged users (admins, contractors, executives) authenticate into critical systems?",
      opts: [
        { t: "Shared passwords or static credentials.", s: 1 },
        { t: "Individual passwords + MFA on some systems.", s: 2 },
        { t: "SSO + MFA across most systems, periodic access reviews.", s: 3 },
        { t: "Zero-standing privilege, phishing-resistant MFA, just-in-time access, continuous review.", s: 4 }
      ]
    },
    {
      domain: "Network & Perimeter",
      q: "If a volumetric DDoS attack hits your public-facing applications tomorrow, what happens?",
      opts: [
        { t: "We'd find out when customers complain — no dedicated protection.", s: 1 },
        { t: "Firewall/WAF would blunt it; expect downtime for anything >5 Gbps.", s: 2 },
        { t: "Cloud-based scrubbing kicks in automatically up to moderate scale.", s: 3 },
        { t: "Multi-terabit telco-grade scrubbing on the backbone; no customer-visible impact.", s: 4 }
      ]
    },
    {
      domain: "Network & Perimeter",
      q: "How do your remote workforce and branch offices reach SaaS, cloud and private apps?",
      opts: [
        { t: "Traditional MPLS + on-prem VPN, traffic hairpins through datacenter.", s: 1 },
        { t: "VPN + split-tunnel, some SaaS direct.", s: 2 },
        { t: "Cloud-delivered SWG/ZTNA for most users, SASE partly rolled out.", s: 3 },
        { t: "Full SSE/SASE: identity-aware, inspected-anywhere, private apps via ZTNA.", s: 4 }
      ]
    },
    {
      domain: "Endpoint & Workforce",
      q: "What's running on your endpoints (laptops, workstations, mobiles)?",
      opts: [
        { t: "Legacy AV — signature-based, locally managed.", s: 1 },
        { t: "Next-gen AV with some EDR features, patched monthly.", s: 2 },
        { t: "EDR with 24x7 alerting, DLP on critical devices, MDM enforced.", s: 3 },
        { t: "EDR + managed XDR, data classification, browser isolation, BYOD via VDI.", s: 4 }
      ]
    },
    {
      domain: "Data & Cloud",
      q: "Do you know where your sensitive data (PII, PCI, source code, financial records) lives?",
      opts: [
        { t: "Not comprehensively — it's sprawled across systems and SaaS.", s: 1 },
        { t: "We've mapped the top 3-5 critical stores.", s: 2 },
        { t: "Data classification is rolled out; DSPM/CSPM scans run regularly.", s: 3 },
        { t: "Continuous data discovery, classification, lineage and auto-remediation across multi-cloud + SaaS.", s: 4 }
      ]
    },
    {
      domain: "Detection & Response",
      q: "You've been breached at 2am on a Sunday. Walk us through the first 30 minutes.",
      opts: [
        { t: "Honestly… it would probably take a few hours before anyone notices.", s: 1 },
        { t: "Someone on-call gets paged, logs into tools, starts investigating.", s: 2 },
        { t: "SOC or MSSP triages within 15 min, IR runbook invoked.", s: 3 },
        { t: "Managed SOC contains in <15 min, IR retainer firm engaged automatically, legal/PR notified per playbook.", s: 4 }
      ]
    },
    {
      domain: "Detection & Response",
      q: "What's your median time to detect (MTTD) a real incident today?",
      opts: [
        { t: "Days or weeks — we usually hear from a third party first.", s: 1 },
        { t: "Hours. We eventually find it via SIEM alerts.", s: 2 },
        { t: "Under an hour for most categories of attack.", s: 3 },
        { t: "Minutes. Managed SOC with AI-assisted triage and automated containment.", s: 4 }
      ]
    },
    {
      domain: "AI, IoT & Emerging",
      q: "Which of these is true about AI, ML models or GenAI apps in your org?",
      opts: [
        { t: "Employees use shadow AI; no policies or controls.", s: 1 },
        { t: "We've blocked public GenAI tools at the proxy; approved a sanctioned one.", s: 2 },
        { t: "Prompt filtering, DLP on AI traffic, logged and audited.", s: 3 },
        { t: "Model integrity scanning, prompt-injection defence, AI-IAM, runtime monitoring for agentic workloads.", s: 4 }
      ]
    },
    {
      domain: "Governance & Compliance",
      q: "How many security vendors/tools do you actively operate today?",
      opts: [
        { t: "15+ vendors, teams fragmented, lots of overlap.", s: 1 },
        { t: "8-14 vendors, consolidation is a stated goal.", s: 2 },
        { t: "4-7 vendors, strategic partners identified.", s: 3 },
        { t: "≤3 strategic partners with outcome-based SLAs.", s: 4 }
      ]
    }
  ];

  const state = {
    step: 0,
    answers: new Array(QUESTIONS.length).fill(null)
  };

  const $ = (id) => document.getElementById(id);

  $("start-btn").addEventListener("click", start);
  $("back-btn").addEventListener("click", prev);
  $("next-btn").addEventListener("click", next);
  $("retake-btn").addEventListener("click", () => location.reload());

  function start() {
    $("intro").style.display = "none";
    $("quiz").style.display = "block";
    render();
  }

  function render() {
    const q = QUESTIONS[state.step];
    const idx = state.step;
    $("step-label").textContent = `Question ${idx + 1} of ${QUESTIONS.length}`;
    $("domain-label").textContent = q.domain;
    $("q-title").textContent = q.q;
    $("q-counter").textContent = `${idx + 1} / ${QUESTIONS.length}`;
    $("bar").style.width = ((idx) / QUESTIONS.length) * 100 + "%";
    $("back-btn").style.visibility = idx === 0 ? "hidden" : "visible";
    $("next-btn").textContent = idx === QUESTIONS.length - 1 ? "See my results →" : "Next →";
    $("next-btn").disabled = state.answers[idx] === null;

    const opts = $("opts");
    opts.innerHTML = "";
    q.opts.forEach((o, i) => {
      const el = document.createElement("div");
      el.className = "opt" + (state.answers[idx] === i ? " selected" : "");
      el.innerHTML = `<span class="radio"></span><span class="txt"><b>${o.t}</b></span>`;
      el.addEventListener("click", () => {
        state.answers[idx] = i;
        render();
      });
      opts.appendChild(el);
    });
  }

  function prev() {
    if (state.step > 0) { state.step--; render(); }
  }
  function next() {
    if (state.answers[state.step] === null) return;
    if (state.step < QUESTIONS.length - 1) { state.step++; render(); }
    else finish();
  }

  function finish() {
    $("quiz").style.display = "none";
    $("results").style.display = "block";
    $("bar").style.width = "100%";
    computeResults();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function computeResults() {
    // Aggregate by domain
    const domains = {};
    QUESTIONS.forEach((q, i) => {
      const a = state.answers[i];
      const s = q.opts[a].s; // 1..4
      if (!domains[q.domain]) domains[q.domain] = { total: 0, count: 0 };
      domains[q.domain].total += s;
      domains[q.domain].count += 1;
    });

    const domainScores = Object.entries(domains).map(([name, v]) => ({
      name,
      pct: Math.round(((v.total / v.count - 1) / 3) * 100) // map 1..4 -> 0..100
    }));

    const overall = Math.round(
      domainScores.reduce((a, b) => a + b.pct, 0) / domainScores.length
    );

    // Tier
    let tier, tierCls, msg;
    if (overall < 35) {
      tier = "Basic";
      tierCls = "tier-basic";
      msg = "You're exposed. Foundational controls are missing or fragmented. A breach is likely a question of when, not if — but this is also the stage where Airtel Secure delivers the fastest uplift.";
    } else if (overall < 60) {
      tier = "Developing";
      tierCls = "tier-developing";
      msg = "You have building blocks in place but significant gaps remain. Consolidation and a managed SOC will dramatically improve your posture without adding headcount.";
    } else if (overall < 80) {
      tier = "Established";
      tierCls = "tier-established";
      msg = "You're in a solid middle — better than most Indian enterprises. The next leap is AI-assisted detection, zero-trust at scale, and outcome-based managed services.";
    } else {
      tier = "Advanced";
      tierCls = "tier-advanced";
      msg = "You're operating at the top decile. Focus now should be AI/IoT emerging threats, red-teaming your controls continuously, and resilience engineering.";
    }

    $("tier-pill").textContent = tier;
    $("tier-pill").className = "tier-pill " + tierCls;
    $("tier-msg").textContent = msg;

    // Animate score
    animateNumber($("score-num"), 0, overall, 1400);
    animateRing($("score-ring"), overall);

    // Domain breakdown
    const colors = ["#ff2b2b", "#ffb020", "#06b6d4", "#8b5cf6", "#2ecc71"];
    const sorted = [...domainScores].sort((a, b) => b.pct - a.pct);
    const dom = $("domains");
    dom.innerHTML = "";
    sorted.forEach((d, i) => {
      const row = document.createElement("div");
      row.className = "domain-row";
      row.innerHTML = `
        <div style="font-size:.9rem">${d.name}</div>
        <div class="domain-bar"><span style="width:${d.pct}%;background:linear-gradient(90deg,${colors[i % 5]}, #fff3)"></span></div>
        <div style="text-align:right;font-weight:600;font-family:var(--display)">${d.pct}</div>`;
      dom.appendChild(row);
    });

    // Recommendations: pick weakest domains and map to SKUs
    const SKU_MAP = {
      "Governance & Compliance": {
        title: "Advisory + Program Management & GRC",
        desc: "We map your DPDP / RBI / SEBI / IRDAI / CERT-In obligations into a single GRC workbench with auto-evidence. Consolidate policy, risk, audit and board reporting.",
        href: "../stack/advisory.html"
      },
      "Identity & Access": {
        title: "Secure Workforce · IAM & Privileged Access",
        desc: "Phishing-resistant MFA, zero-standing privilege, just-in-time access, and continuous access reviews — delivered as a managed service.",
        href: "../stack/secure-workforce.html"
      },
      "Network & Perimeter": {
        title: "Secure Access · SSE + Anti-DDoS",
        desc: "Move off hairpinned VPNs. India's largest multi-terabit scrubbing + SWG/ZTNA/CASB in one cloud delivered from Airtel's backbone.",
        href: "../stack/secure-access.html"
      },
      "Endpoint & Workforce": {
        title: "Managed Endpoint + XDR",
        desc: "EDR/XDR with 24×7 Airtel SOC, DLP, email & browser isolation, and BYOD via VDI. MTTD drops below 5 minutes.",
        href: "../stack/secure-workforce.html"
      },
      "Data & Cloud": {
        title: "Secure Workload · CNAPP, DSPM & WAAP",
        desc: "Continuous multi-cloud + SaaS posture, data discovery, API protection and AppSec — run by our cloud security pod.",
        href: "../stack/secure-workload.html"
      },
      "Detection & Response": {
        title: "Managed SOC / MDR + Incident Response Retainer",
        desc: "AI-assisted SOC with CERT-In aligned playbooks, 24×7 analyst coverage and a 1-hour IR response retainer. Outcome-based SLAs.",
        href: "../stack/managed-services.html"
      },
      "AI, IoT & Emerging": {
        title: "AI Security + IoT/OT Security",
        desc: "Agentic AI defence, prompt injection protection, model integrity and OT-aware segmentation. Covers what your current stack doesn't.",
        href: "../stack/ai-security.html"
      }
    };

    const recsHost = $("recs");
    recsHost.innerHTML = "";
    const weakest = [...domainScores].sort((a, b) => a.pct - b.pct).slice(0, 3);
    weakest.forEach((d, i) => {
      const sku = SKU_MAP[d.name];
      if (!sku) return;
      const r = document.createElement("div");
      r.className = "rec";
      r.innerHTML = `
        <div class="rank">${i + 1}</div>
        <div class="rec-body">
          <b>${sku.title}</b>
          <small>${sku.desc}</small>
          <a href="${sku.href}">Explore this capability →</a>
        </div>`;
      recsHost.appendChild(r);
    });
  }

  function animateNumber(el, from, to, dur) {
    const start = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function animateRing(ring, pct) {
    const circ = 2 * Math.PI * 96;
    const offset = circ * (1 - pct / 100);
    ring.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)";
    requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
  }
})();
