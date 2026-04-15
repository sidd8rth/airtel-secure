// Architecture Builder
(function () {
  const $ = (id) => document.getElementById(id);

  const SIZES = [
    { id: "sme", label: "Under 500 employees" },
    { id: "mid", label: "500 – 5,000" },
    { id: "large", label: "5,000 – 25,000" },
    { id: "ent", label: "25,000+" }
  ];
  const ENVS = [
    { id: "cloud", label: "Cloud-first (AWS/Azure/GCP)" },
    { id: "hybrid", label: "Hybrid (cloud + datacenter)" },
    { id: "onprem", label: "Primarily on-prem" },
    { id: "ot", label: "OT / industrial heavy" }
  ];
  const CONCERNS = [
    { id: "ddos", label: "DDoS / public-facing app attacks" },
    { id: "ransom", label: "Ransomware / endpoint" },
    { id: "insider", label: "Insider threats / data loss" },
    { id: "identity", label: "Identity & privileged access" },
    { id: "cloud", label: "Cloud misconfiguration / DSPM" },
    { id: "api", label: "API abuse / bot traffic" },
    { id: "compliance", label: "DPDP / RBI / SEBI / CERT-In" },
    { id: "ai", label: "GenAI / model risk" },
    { id: "ot", label: "OT / IoT / factory floor" }
  ];

  // Full component catalogue per lane
  const COMPONENTS = {
    edge: [
      { id: "antiddos", name: "Anti-DDoS (telco)", sub: "Multi-Tbps scrubbing on backbone" },
      { id: "fw", name: "Next-gen Firewall", sub: "Perimeter + east-west" },
      { id: "sse", name: "SSE / SASE", sub: "SWG, ZTNA, CASB, RBI" },
      { id: "ndr", name: "NDR", sub: "Network detection & response" },
      { id: "nac", name: "NAC", sub: "Posture-based access" },
      { id: "dns", name: "Secure DNS", sub: "DNS layer filtering" }
    ],
    workforce: [
      { id: "edr", name: "EDR / XDR", sub: "Managed endpoint detection" },
      { id: "iam", name: "IAM + PAM", sub: "SSO, MFA, JIT, reviews" },
      { id: "dlp", name: "DLP", sub: "Endpoint + email + SaaS" },
      { id: "email", name: "Email security", sub: "Phishing, BEC, sandbox" },
      { id: "vdi", name: "VDI", sub: "Contractor / BYOD" },
      { id: "browser", name: "Secure browser", sub: "Isolation, policy" },
      { id: "datadisc", name: "Data discovery", sub: "PII/PCI classification" }
    ],
    workload: [
      { id: "waap", name: "Web App & API", sub: "WAF, bot, API threat" },
      { id: "cnapp", name: "CNAPP", sub: "Cloud workload posture" },
      { id: "dspm", name: "DSPM", sub: "Data security posture" },
      { id: "dam", name: "Database activity monitoring", sub: "DAM, audit" },
      { id: "cloudiam", name: "Cloud IAM", sub: "Entitlements, CIEM" },
      { id: "appsec", name: "AppSec / SDLC", sub: "SAST, DAST, SBOM" }
    ],
    managed: [
      { id: "soc", name: "Managed SOC / MDR", sub: "24×7 AI-assisted" },
      { id: "ti", name: "Threat intel", sub: "Dark web + brand" },
      { id: "ir", name: "Incident response", sub: "Retainer, forensics" },
      { id: "vapt", name: "VAPT / Red team", sub: "Pen test + purple" },
      { id: "patch", name: "Policy & patch mgmt", sub: "Automated governance" }
    ],
    emerging: [
      { id: "aisec", name: "AI Security", sub: "Prompt, model, agent" },
      { id: "aiiam", name: "Agentic AI IAM", sub: "Identity for agents" },
      { id: "airun", name: "AI runtime protection", sub: "Runtime monitoring" },
      { id: "iot", name: "IoT / OT segmentation", sub: "Visibility + segment" },
      { id: "otsoc", name: "OT SOC", sub: "Purdue-aware detection" },
      { id: "otasset", name: "OT asset discovery", sub: "Passive inventory" }
    ],
    program: [
      { id: "advisory", name: "Advisory & strategy", sub: "CISO-as-a-service" },
      { id: "grc", name: "GRC platform", sub: "Policy, risk, audit" },
      { id: "dashboard", name: "Dashboarding", sub: "Board reporting" },
      { id: "training", name: "Training & awareness", sub: "Phishing sim, elearn" },
      { id: "bcm", name: "BCM / DR", sub: "RTO/RPO, tabletop" }
    ]
  };

  const state = {
    industry: "bfsi",
    size: "large",
    env: "hybrid",
    concerns: new Set(["ddos", "ransom", "compliance", "identity"])
  };

  // Render control options
  function renderControls() {
    $("size-opts").innerHTML = SIZES.map((s) =>
      `<label class="opt-pill${state.size === s.id ? " selected" : ""}"><input type="radio" name="size" value="${s.id}" ${state.size === s.id ? "checked" : ""}/> ${s.label}</label>`
    ).join("");
    $("env-opts").innerHTML = ENVS.map((s) =>
      `<label class="opt-pill${state.env === s.id ? " selected" : ""}"><input type="radio" name="env" value="${s.id}" ${state.env === s.id ? "checked" : ""}/> ${s.label}</label>`
    ).join("");
    $("concerns-opts").innerHTML = CONCERNS.map((s) =>
      `<label class="opt-pill${state.concerns.has(s.id) ? " selected" : ""}"><input type="checkbox" name="concerns" value="${s.id}" ${state.concerns.has(s.id) ? "checked" : ""}/> ${s.label}</label>`
    ).join("");

    $("size-opts").querySelectorAll("input").forEach((i) =>
      i.addEventListener("change", () => { state.size = i.value; renderControls(); renderDiagram(); })
    );
    $("env-opts").querySelectorAll("input").forEach((i) =>
      i.addEventListener("change", () => { state.env = i.value; renderControls(); renderDiagram(); })
    );
    $("concerns-opts").querySelectorAll("input").forEach((i) =>
      i.addEventListener("change", () => {
        if (i.checked) state.concerns.add(i.value); else state.concerns.delete(i.value);
        renderControls(); renderDiagram();
      })
    );
  }

  $("industry").addEventListener("change", (e) => {
    state.industry = e.target.value;
    applyIndustryDefaults();
    renderControls();
    renderDiagram();
  });

  $("reset-btn").addEventListener("click", () => {
    state.industry = "bfsi";
    state.size = "large";
    state.env = "hybrid";
    state.concerns = new Set(["ddos", "ransom", "compliance", "identity"]);
    $("industry").value = "bfsi";
    renderControls();
    renderDiagram();
  });

  function applyIndustryDefaults() {
    if (state.industry === "bfsi") state.concerns = new Set(["ddos", "ransom", "compliance", "identity", "api"]);
    else if (state.industry === "healthcare") state.concerns = new Set(["insider", "compliance", "ransom", "identity"]);
    else if (state.industry === "manufacturing") { state.concerns = new Set(["ot", "ransom", "identity"]); state.env = "ot"; }
    else if (state.industry === "retail") state.concerns = new Set(["ddos", "api", "insider", "compliance"]);
    else if (state.industry === "public") state.concerns = new Set(["compliance", "ddos", "insider", "identity"]);
    else if (state.industry === "telco") state.concerns = new Set(["ddos", "identity", "compliance", "ai"]);
  }

  // Decide active components
  function activeSet() {
    const a = new Set();
    // Baseline — always
    ["fw", "edr", "iam", "email", "soc", "advisory", "training", "grc"].forEach((x) => a.add(x));

    // Concerns-driven
    if (state.concerns.has("ddos")) { a.add("antiddos"); a.add("waap"); a.add("dns"); }
    if (state.concerns.has("ransom")) { a.add("edr"); a.add("patch"); a.add("ir"); a.add("bcm"); }
    if (state.concerns.has("insider")) { a.add("dlp"); a.add("datadisc"); a.add("browser"); }
    if (state.concerns.has("identity")) { a.add("iam"); a.add("nac"); }
    if (state.concerns.has("cloud")) { a.add("cnapp"); a.add("dspm"); a.add("cloudiam"); }
    if (state.concerns.has("api")) { a.add("waap"); a.add("appsec"); }
    if (state.concerns.has("compliance")) { a.add("dashboard"); a.add("grc"); a.add("vapt"); a.add("ti"); }
    if (state.concerns.has("ai")) { a.add("aisec"); a.add("aiiam"); a.add("airun"); }
    if (state.concerns.has("ot") || state.env === "ot") { a.add("iot"); a.add("otsoc"); a.add("otasset"); }

    // Env-driven
    if (state.env === "cloud" || state.env === "hybrid") { a.add("sse"); a.add("cnapp"); a.add("dspm"); }
    if (state.env === "hybrid" || state.env === "onprem") { a.add("ndr"); }

    // Size-driven (larger orgs need more)
    if (state.size === "large" || state.size === "ent") {
      a.add("ti"); a.add("ir"); a.add("vapt"); a.add("dashboard"); a.add("vdi"); a.add("dam");
    }
    if (state.size === "ent") { a.add("dspm"); a.add("cnapp"); a.add("aisec"); }

    // Industry
    if (state.industry === "bfsi") { ["waap", "dam", "antiddos", "vapt", "ti", "dashboard"].forEach((x) => a.add(x)); }
    if (state.industry === "healthcare") { ["datadisc", "dlp", "vdi"].forEach((x) => a.add(x)); }
    if (state.industry === "manufacturing") { ["iot", "otsoc", "otasset", "ndr"].forEach((x) => a.add(x)); }

    return a;
  }

  function renderDiagram() {
    const active = activeSet();
    let total = 0, activeCount = 0;
    Object.entries(COMPONENTS).forEach(([lane, items]) => {
      const host = $("lane-" + lane);
      let laneActive = 0;
      host.innerHTML = items.map((c) => {
        total++;
        const on = active.has(c.id);
        if (on) { activeCount++; laneActive++; }
        return `<div class="block ${on ? "active" : "dim"}"><b>${c.name}</b><small>${c.sub}</small></div>`;
      }).join("");
      $("c-" + lane).textContent = `${laneActive} selected`;
    });

    // Title + horizon + price
    const industryLabels = {
      bfsi: "BFSI reference", healthcare: "Healthcare reference",
      manufacturing: "Manufacturing / OT reference", retail: "Retail & e-commerce reference",
      public: "Public sector reference", telco: "Telecom & media reference",
      other: "Enterprise reference"
    };
    $("d-title").textContent = `${industryLabels[state.industry]} · ${activeCount} capabilities selected`;

    // Horizon
    const horizonMap = {
      sme: "Phase 1 · 4 weeks · Phase 2 · 60 days",
      mid: "Phase 1 · 6 weeks · Phase 2 · 90 days",
      large: "Phase 1 · 8 weeks · Phase 2 · 120 days",
      ent: "Phase 1 · 10 weeks · Phase 2 · 180 days"
    };
    $("horizon").textContent = horizonMap[state.size];

    // Price band (illustrative)
    const base = { sme: [55, 120], mid: [45, 110], large: [35, 95], ent: [28, 80] };
    const [lo, hi] = base[state.size];
    const mult = 1 + (activeCount / 38) * 0.6;
    $("price").textContent = `₹${Math.round(lo * mult)}–₹${Math.round(hi * mult)} / user / month`;
  }

  applyIndustryDefaults();
  renderControls();
  renderDiagram();
})();
