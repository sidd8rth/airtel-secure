// Shared header / footer injected across pages
(function () {
  const base = document.currentScript.dataset.base || "";
  const p = (u) => base + u;

  const header = `
  <header class="nav">
    <div class="container nav-inner">
      <a class="brand" href="${p("index.html")}">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>airtel <b style="color:var(--red-2)">secure</b></span>
      </a>
      <nav class="nav-links" aria-label="Main">
        <span class="has-menu"><a href="#">Platform ▾</a>
          <div class="submenu">
            <a href="${p("stack/advisory.html")}">Advisory<small>Strategy, compliance, training</small></a>
            <a href="${p("stack/secure-access.html")}">Secure Access<small>Firewall, DDoS, SSE, NDR, NAC</small></a>
            <a href="${p("stack/secure-workforce.html")}">Secure Workforce<small>Endpoint, IAM, DLP, VDI</small></a>
            <a href="${p("stack/secure-workload.html")}">Secure Workload<small>Web/API, CNAPP, DSPM, Cloud AI</small></a>
            <a href="${p("stack/managed-services.html")}">Managed Services<small>SOC, MDR, TI, Dark Web</small></a>
            <a href="${p("stack/professional-services.html")}">Professional Services<small>VAPT, Red/Blue team, Gap</small></a>
            <a href="${p("stack/incident-response.html")}">Incident Response<small>IR planning, forensics, RCA</small></a>
            <a href="${p("stack/ai-security.html")}">AI Security<small>Agentic AI, prompt, runtime</small></a>
            <a href="${p("stack/iot-ot-security.html")}">IoT & OT Security<small>Network seg, OT SOC, IAM</small></a>
            <a href="${p("stack/program-management.html")}">Program & GRC<small>Dashboards, change, issues</small></a>
          </div>
        </span>
        <span class="has-menu"><a href="#">Tools ▾</a>
          <div class="submenu">
            <a href="${p("tools/assessment.html")}">Security Maturity Quiz<small>10-question self assessment</small></a>
            <a href="${p("tools/compliance.html")}">Compliance Command Center<small>DPDP, RBI, SEBI, CERT-In</small></a>
            <a href="${p("tools/tco.html")}">TCO & ROI Calculator<small>Consolidation savings</small></a>
            <a href="${p("tools/architecture.html")}">Architecture Builder<small>Visual solution designer</small></a>
          </div>
        </span>
        <span class="has-menu"><a href="#">Industries ▾</a>
          <div class="submenu">
            <a href="${p("industries/bfsi.html")}">BFSI<small>Banking, NBFC, insurance</small></a>
            <a href="${p("industries/bfsi.html")}">Healthcare<small>Coming soon</small></a>
            <a href="${p("industries/bfsi.html")}">Manufacturing / OT<small>Coming soon</small></a>
            <a href="${p("industries/bfsi.html")}">Public sector<small>Coming soon</small></a>
          </div>
        </span>
        <a href="${p("index.html")}#why">Why Airtel</a>
        <a href="${p("index.html")}#contact">Contact</a>
      </nav>
      <div class="nav-cta">
        <a class="btn btn-ghost btn-sm" href="${p("tools/assessment.html")}">Take the quiz</a>
        <a class="btn btn-primary btn-sm" href="${p("index.html")}#contact">Talk to an expert</a>
        <button class="menu-toggle" aria-label="Menu">☰</button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer>
    <div class="container foot-grid">
      <div>
        <a class="brand" href="${p("index.html")}">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>airtel <b style="color:var(--red-2)">secure</b></span>
        </a>
        <p style="margin-top:14px; max-width:320px">India's telco-grade cyber defence fabric. One partner across network, cloud, workforce and AI — with a 24×7 SOC you can actually call.</p>
        <div class="chips mt-4" style="justify-content:flex-start">
          <span class="chip-link">ISO 27001</span>
          <span class="chip-link">SOC 2</span>
          <span class="chip-link">CERT-In empaneled</span>
        </div>
      </div>
      <div>
        <h4>Platform</h4>
        <a href="${p("stack/secure-access.html")}">Secure Access</a>
        <a href="${p("stack/secure-workforce.html")}">Secure Workforce</a>
        <a href="${p("stack/secure-workload.html")}">Secure Workload</a>
        <a href="${p("stack/managed-services.html")}">Managed Services</a>
        <a href="${p("stack/ai-security.html")}">AI Security</a>
        <a href="${p("stack/iot-ot-security.html")}">IoT & OT Security</a>
      </div>
      <div>
        <h4>Services</h4>
        <a href="${p("stack/advisory.html")}">Advisory</a>
        <a href="${p("stack/professional-services.html")}">Professional Services</a>
        <a href="${p("stack/incident-response.html")}">Incident Response</a>
        <a href="${p("stack/program-management.html")}">Program & GRC</a>
      </div>
      <div>
        <h4>Tools</h4>
        <a href="${p("tools/assessment.html")}">Maturity quiz</a>
        <a href="${p("tools/compliance.html")}">Compliance center</a>
        <a href="${p("tools/tco.html")}">TCO calculator</a>
        <a href="${p("tools/architecture.html")}">Architecture builder</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="${p("index.html")}#why">Why Airtel</a>
        <a href="${p("industries/bfsi.html")}">Industries</a>
        <a href="${p("index.html")}#contact">Contact sales</a>
        <a href="tel:+911244220000">1800-103-3838</a>
      </div>
    </div>
    <div class="container foot-bottom">
      <span>© ${new Date().getFullYear()} Bharti Airtel Limited. All rights reserved.</span>
      <span>Privacy · Terms · Responsible disclosure · Sitemap</span>
    </div>
  </footer>`;

  // Inject
  const hostHeader = document.getElementById("site-header");
  const hostFooter = document.getElementById("site-footer");
  if (hostHeader) hostHeader.outerHTML = header;
  if (hostFooter) hostFooter.outerHTML = footer;
})();
