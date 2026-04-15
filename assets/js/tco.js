// TCO / ROI Calculator
(function () {
  const $ = (id) => document.getElementById(id);

  // Airtel pricing ratios relative to category
  const RATIO = {
    network: 0.62,   // Airtel network stack is 38% cheaper at scale
    endpoint: 0.60,
    cloud: 0.68,
    managed: 0.70
  };

  function inr(v) {
    if (v >= 100) return "₹" + (v / 100).toFixed(2) + " K Cr";
    if (v >= 1) return "₹" + v.toFixed(2) + " Cr";
    return "₹" + (v * 100).toFixed(1) + " L";
  }

  function fmtN(n) { return n.toLocaleString("en-IN"); }

  function compute() {
    const net = parseFloat($("in-network").value);
    const ep = parseFloat($("in-endpoint").value);
    const cl = parseFloat($("in-cloud").value);
    const mg = parseFloat($("in-managed").value);
    const users = parseInt($("in-users").value);
    const vendors = parseInt($("in-vendors").value);
    const ftes = parseInt($("in-ftes").value);

    $("in-network-val").value = inr(net);
    $("in-endpoint-val").value = inr(ep);
    $("in-cloud-val").value = inr(cl);
    $("in-managed-val").value = inr(mg);
    $("in-users-val").value = fmtN(users);
    $("in-vendors-val").value = vendors;
    $("in-ftes-val").value = ftes;

    const current = net + ep + cl + mg;
    // Scale discount at higher user counts
    const scaleBonus = users > 20000 ? 0.08 : users > 10000 ? 0.05 : users > 3000 ? 0.03 : 0;

    const airtel =
      net * (RATIO.network - scaleBonus) +
      ep * (RATIO.endpoint - scaleBonus) +
      cl * (RATIO.cloud - scaleBonus) +
      mg * (RATIO.managed - scaleBonus);

    const savings = Math.max(0, current - airtel);
    const pct = current > 0 ? Math.round((savings / current) * 100) : 0;
    const threeYr = savings * 3 + (ftes * 0.18); // FTE redirection @ ₹18L
    const fteHours = Math.round(ftes * 0.32 * 2080); // 32% of FTE time redirected
    const vendorsEliminated = Math.max(0, vendors - 2);
    const riskReduction = Math.min(72, 28 + pct); // heuristic
    const payback = Math.max(3, Math.round((current * 0.3) / (savings / 12 || 1))); // months

    $("r-current").textContent = inr(current);
    $("r-airtel").textContent = inr(airtel);
    $("r-savings").textContent = inr(savings);
    $("r-savings-pct").textContent = pct + "% reduction via consolidation + telco pricing";
    $("r-3yr").textContent = inr(threeYr);
    $("r-fte").textContent = fmtN(fteHours) + " hrs/yr";
    $("r-vendors").textContent = vendorsEliminated;
    $("r-risk").textContent = "-" + riskReduction + "%";
    $("r-payback").textContent = payback + " months";

    drawChart(current, airtel);
  }

  function drawChart(cur, air) {
    const svg = $("chart");
    const W = 600, H = 260, pad = 40;
    const years = [1, 2, 3];
    const curSeries = years.map((y) => cur * y);
    const airSeries = years.map((y) => air * y);
    const max = Math.max(...curSeries) * 1.15 || 1;
    const bw = 60;
    const gap = 20;
    const groupW = bw * 2 + gap;
    const totalW = groupW * years.length + gap * (years.length - 1);
    const startX = (W - totalW) / 2;

    let html = "";
    // Y axis
    for (let i = 0; i <= 4; i++) {
      const y = H - pad - (i / 4) * (H - pad * 2);
      const v = (max * i) / 4;
      html += `<line x1="${pad}" y1="${y}" x2="${W - pad}" y2="${y}" stroke="rgba(255,255,255,.05)"/>`;
      html += `<text x="${pad - 6}" y="${y + 4}" text-anchor="end" fill="#6b6b75" font-size="10">${v.toFixed(1)}</text>`;
    }
    years.forEach((yr, i) => {
      const x = startX + i * (groupW + gap);
      const yCur = H - pad - (curSeries[i] / max) * (H - pad * 2);
      const yAir = H - pad - (airSeries[i] / max) * (H - pad * 2);
      html += `<rect x="${x}" y="${yCur}" width="${bw}" height="${H - pad - yCur}" fill="#3b82f6" rx="6"/>`;
      html += `<rect x="${x + bw + 4}" y="${yAir}" width="${bw}" height="${H - pad - yAir}" fill="url(#redg)" rx="6"/>`;
      html += `<text x="${x + bw}" y="${H - pad + 18}" text-anchor="middle" fill="#a1a1aa" font-size="11">Year ${yr}</text>`;
      html += `<text x="${x + bw / 2}" y="${yCur - 6}" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">${curSeries[i].toFixed(1)}</text>`;
      html += `<text x="${x + bw + 4 + bw / 2}" y="${yAir - 6}" text-anchor="middle" fill="#ff8080" font-size="11" font-weight="600">${airSeries[i].toFixed(1)}</text>`;
    });
    svg.innerHTML = `
      <defs>
        <linearGradient id="redg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff2b2b"/><stop offset="1" stop-color="#990000"/>
        </linearGradient>
      </defs>` + html;
  }

  ["in-network", "in-endpoint", "in-cloud", "in-managed", "in-users", "in-vendors", "in-ftes"].forEach((id) => {
    $(id).addEventListener("input", compute);
  });
  $("print-btn").addEventListener("click", () => window.print());
  compute();
})();
