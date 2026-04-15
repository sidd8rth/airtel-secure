// Compliance Command Center
(function () {
  const F = "full", P = "partial", N = "na";
  const ROWS = [
    {
      cap: "Firewall · Anti-DDoS · NDR · NAC",
      sub: "Network perimeter, backbone DDoS scrubbing, east-west inspection, posture-based NAC.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "Secure Service Edge (SSE / SASE)",
      sub: "ZTNA, SWG, CASB, RBI — cloud-delivered from Airtel backbone.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: P
    },
    {
      cap: "Identity & Access Management (IAM)",
      sub: "SSO, MFA, PAM, just-in-time access, continuous access review.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: P
    },
    {
      cap: "Endpoint Protection & XDR",
      sub: "Managed EDR/XDR with 24×7 Airtel SOC, device control, USB policy.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "Data Discovery & Classification (DLP)",
      sub: "PII/PCI/source-code discovery across SaaS, email, endpoints and storage.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: P
    },
    {
      cap: "VDI & Browser Isolation",
      sub: "Contractor, BYOD and third-party access without data leakage.",
      dpdp: F, rbi: P, sebi: P, irdai: F, certin: N
    },
    {
      cap: "Email & Collaboration Security",
      sub: "Advanced phishing, BEC, malware sandboxing, MS365/Google Workspace.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "Web App & API Protection (WAAP)",
      sub: "WAF, bot, API threat, DDoS for public apps — edge + origin.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "CNAPP · DSPM · Cloud AI Security",
      sub: "Continuous cloud posture, data security posture, cloud workload protection.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: P
    },
    {
      cap: "Managed SOC / MDR",
      sub: "AI-assisted 24×7 SOC, SIEM, SOAR, threat intel, dark web monitoring.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "Incident Response & Forensics",
      sub: "Retainer, 1-hour SLA, CERT-In aligned playbooks, RCA and breach management.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "VAPT · Red / Blue / Purple Team",
      sub: "Pen testing, adversary simulation, continuous validation.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: P
    },
    {
      cap: "180-day Log Retention (SOC storage)",
      sub: "Dedicated log store with integrity, time-sync, tamper evidence.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "Advisory · GRC · Policy Management",
      sub: "DPIA, DPO advisory, policies, training, audit prep, board reporting.",
      dpdp: F, rbi: F, sebi: F, irdai: F, certin: F
    },
    {
      cap: "AI Security (Agentic, Prompt, Model Integrity)",
      sub: "Guardrails for LLMs, model integrity scans, AI-IAM, runtime monitoring.",
      dpdp: F, rbi: P, sebi: P, irdai: P, certin: P
    },
    {
      cap: "IoT / OT Security",
      sub: "Asset discovery, segmentation, OT SOC, device classification.",
      dpdp: P, rbi: P, sebi: P, irdai: P, certin: F
    },
    {
      cap: "Business Continuity & DR Advisory",
      sub: "BCM, RTO/RPO, tabletop exercises, DR site design.",
      dpdp: P, rbi: F, sebi: F, irdai: F, certin: P
    }
  ];

  const COVERAGE_TEXT = {
    full: "Full coverage", partial: "Supports", na: "Not applicable"
  };
  const REGS = ["dpdp", "rbi", "sebi", "irdai", "certin"];

  function cell(val, reg) {
    return `<div class="matrix-cell" data-label="${reg.toUpperCase()}">
      <span class="dot ${val}"></span>
      <span class="coverage-val">${COVERAGE_TEXT[val]}</span>
    </div>`;
  }

  function render(filterReg = "all", q = "") {
    const body = document.getElementById("matrix-body");
    body.innerHTML = "";
    ROWS.filter((r) => {
      if (q && !(r.cap + " " + r.sub).toLowerCase().includes(q.toLowerCase())) return false;
      if (filterReg !== "all" && r[filterReg] === "na") return false;
      return true;
    }).forEach((r) => {
      const row = document.createElement("div");
      row.className = "matrix-row";
      row.innerHTML = `
        <div class="matrix-cell cap">${r.cap}<small>${r.sub}</small></div>
        ${REGS.map((reg) => cell(r[reg], reg)).join("")}`;
      body.appendChild(row);
    });
    if (!body.children.length) {
      body.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text-mute)">No matching capabilities. Try a different search.</div>`;
    }
  }

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      render(chip.dataset.reg, document.getElementById("search").value);
    });
  });
  document.getElementById("search").addEventListener("input", (e) => {
    const active = document.querySelector(".filter-chip.active");
    render(active ? active.dataset.reg : "all", e.target.value);
  });

  render();
})();
