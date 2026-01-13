import React, { useEffect, useState } from "react";

/* ---------- PRICING ---------- */

const investorPricing = {
  "Under $50K": 15,
  "$50K – $250K": 30,
  "$250K – $1M": 60,
  "$1M – $5M": 120,
  "$5M – $10M": 200,
  "$10M+": 300,
};

const startupPricing = {
  "Pre-Revenue": 10,
  "$0 – $100K": 20,
  "$100K – $500K": 40,
  "$500K – $1M": 70,
  "$1M – $5M": 120,
  "$5M+": 200,
};

const expertBase = (y) =>
  y <= 1 ? 5 : y === 2 ? 7 : y === 3 ? 9 : y <= 7 ? 12 : y <= 12 ? 15 : y <= 15 ? 20 : 25;

const expertFollowers = {
  "Less than 20K": 0,
  "20K to 30K": 20,
  "30K to 50K": 40,
  "50K to 100K": 60,
  "100K to 200K": 80,
  "200K to 400K": 100,
  "More than 400K": 120,
};

/* ---------- MAIN ---------- */

export default function App() {
  const [tab, setTab] = useState("investors");
  const [unlock, setUnlock] = useState({});

  // published / verified lists
  const [investors, setInvestors] = useState([]);
  const [startups, setStartups] = useState([]);
  const [experts, setExperts] = useState([]);

  // pending (awaiting admin approval)
  const [investorsPending, setInvestorsPending] = useState([]);
  const [startupsPending, setStartupsPending] = useState([]);
  const [expertsPending, setExpertsPending] = useState([]);

  /* ---------- FORMS ---------- */

  const [investorForm, setInvestorForm] = useState({
    name: "",
    type: "",
    amount: "",
    email: "",
    linkedin: "",
    verified: false,
  });

  const [startupForm, setStartupForm] = useState({
    name: "",
    industry: "",
    otherIndustry: "",
    revenue: "",
    email: "",
    linkedin: "",
    verified: false,
  });

  const [expertForm, setExpertForm] = useState({
    name: "",
    years: 0,
    expertise: "",
    followers: "",
    email: "",
    social: "",
    verified: false,
  });

  const unlockContact = (key) => setUnlock((prev) => ({ ...prev, [key]: true }));

  /* persistence */
  useEffect(() => {
    const s = localStorage.getItem("bc_data");
    if (s) {
      const d = JSON.parse(s);
      setInvestors(d.investors || []);
      setStartups(d.startups || []);
      setExperts(d.experts || []);
      setInvestorsPending(d.investorsPending || []);
      setStartupsPending(d.startupsPending || []);
      setExpertsPending(d.expertsPending || []);
    }
  }, []);

  useEffect(() => {
    const d = {
      investors,
      startups,
      experts,
      investorsPending,
      startupsPending,
      expertsPending,
    };
    localStorage.setItem("bc_data", JSON.stringify(d));
  }, [investors, startups, experts, investorsPending, startupsPending, expertsPending]);

  /* ---------- ADMIN ACTIONS ---------- */
  const approveInvestor = (index) => {
    const item = investorsPending[index];
    if (!item) return;
    const approved = { ...item, verified: true };
    setInvestors((p) => [...p, approved]);
    setInvestorsPending((p) => p.filter((_, i) => i !== index));
  };
  const rejectInvestor = (index) => setInvestorsPending((p) => p.filter((_, i) => i !== index));

  const approveStartup = (index) => {
    const item = startupsPending[index];
    if (!item) return;
    const approved = { ...item, verified: true };
    setStartups((p) => [...p, approved]);
    setStartupsPending((p) => p.filter((_, i) => i !== index));
  };
  const rejectStartup = (index) => setStartupsPending((p) => p.filter((_, i) => i !== index));

  const approveExpert = (index) => {
    const item = expertsPending[index];
    if (!item) return;
    const approved = { ...item, verified: true };
    setExperts((p) => [...p, approved]);
    setExpertsPending((p) => p.filter((_, i) => i !== index));
  };
  const rejectExpert = (index) => setExpertsPending((p) => p.filter((_, i) => i !== index));

  /* ---------- UI ---------- */

  return (
    <div style={{ padding: 20 }}>
      <h2>Marketplace</h2>

      <div className="tabs">
        {[
          "investors",
          "startups",
          "experts",
          "register-investor",
          "register-startup",
          "register-expert",
          "admin",
        ].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ marginRight: 6 }}>
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* ---------- INVESTORS LIST ---------- */}

      {tab === "investors" && (
        <>
          <h3>Verified Investors</h3>
          {investors.filter((i) => i.verified).length === 0 && <div>No verified investors yet.</div>}
          {investors.filter((i) => i.verified).map((i, idx) => (
            <div className="card" key={idx}>
              <b>Investor</b> | {i.type} | {i.amount}
              <br />
              {unlock[`i${idx}`] ? (
                <>
                  <div>Name: {i.name}</div>
                  <div>Email: {i.email}</div>
                </>
              ) : (
                <button onClick={() => unlockContact(`i${idx}`)}>
                  Unlock Contact (${investorPricing[i.amount] || "—"})
                </button>
              )}
            </div>
          ))}
        </>
      )}

      {/* ---------- STARTUPS LIST ---------- */}

      {tab === "startups" && (
        <>
          <h3>Verified Startups</h3>
          {startups.filter((s) => s.verified).length === 0 && <div>No verified startups yet.</div>}
          {startups.filter((s) => s.verified).map((s, idx) => (
            <div className="card" key={idx}>
              <b>Startup</b> | {s.industry === "Other" ? s.otherIndustry : s.industry}
              <br />
              {unlock[`s${idx}`] ? (
                <>
                  <div>Name: {s.name}</div>
                  <div>Email: {s.email}</div>
                </>
              ) : (
                <button onClick={() => unlockContact(`s${idx}`)}>
                  Unlock Contact (${startupPricing[s.revenue] || "—"})
                </button>
              )}
            </div>
          ))}
        </>
      )}

      {/* ---------- EXPERTS LIST ---------- */}

      {tab === "experts" && (
        <>
          <h3>Verified Experts</h3>
          {experts.filter((e) => e.verified).length === 0 && <div>No verified experts yet.</div>}
          {experts.filter((e) => e.verified).map((e, idx) => {
            const price = expertBase(e.years) + (expertFollowers[e.followers] || 0);
            return (
              <div className="card" key={idx}>
                <b>Expert</b> | {e.years} yrs
                <div>Expertise: {e.expertise}</div>
                {unlock[`e${idx}`] ? (
                  <>
                    <div>Name: {e.name}</div>
                    <div>Email: {e.email}</div>
                  </>
                ) : (
                  <button onClick={() => unlockContact(`e${idx}`)}>
                    Unlock Contact (${price})
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* ---------- REGISTER INVESTOR ---------- */}

      {tab === "register-investor" && (
        <>
          <h3>Register Investor (Pending Approval)</h3>
          <input placeholder="Full Name" value={investorForm.name} onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })} />
          <input placeholder="LinkedIn URL" value={investorForm.linkedin} onChange={(e) => setInvestorForm({ ...investorForm, linkedin: e.target.value })} />
          <input placeholder="Email" value={investorForm.email} onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })} />
          <select value={investorForm.type} onChange={(e) => setInvestorForm({ ...investorForm, type: e.target.value })}>
            <option value="">Select type</option>
            <option>Angel</option><option>VC</option>
            <option>Private Equity</option><option>Strategic Investor</option>
          </select>
          <select value={investorForm.amount} onChange={(e) => setInvestorForm({ ...investorForm, amount: e.target.value })}>
            <option value="">Select amount</option>
            {Object.keys(investorPricing).map((k) => <option key={k}>{k}</option>)}
          </select>
          <br />
          <button onClick={() => { setInvestorsPending([...investorsPending, investorForm]); setInvestorForm({ name: "", type: "", amount: "", email: "", linkedin: "", verified: false }); }}>
            Submit
          </button>
        </>
      )}

      {/* ---------- REGISTER STARTUP ---------- */}

      {tab === "register-startup" && (
        <>
          <h3>Register Startup (Pending Approval)</h3>
          <input placeholder="Startup Name" value={startupForm.name} onChange={(e) => setStartupForm({ ...startupForm, name: e.target.value })} />
          <input placeholder="LinkedIn URL" value={startupForm.linkedin} onChange={(e) => setStartupForm({ ...startupForm, linkedin: e.target.value })} />
          <input placeholder="Email" value={startupForm.email} onChange={(e) => setStartupForm({ ...startupForm, email: e.target.value })} />

          <select value={startupForm.industry} onChange={(e) => setStartupForm({ ...startupForm, industry: e.target.value })}>
            <option value="">Select industry</option>
            <option>Fintech</option><option>Healthtech</option><option>SaaS</option>
            <option>E-commerce</option><option>AI / ML</option>
            <option>Climate / Energy</option><option>Other</option>
          </select>

          {startupForm.industry === "Other" && (
            <input
              placeholder="Specify Industry"
              value={startupForm.otherIndustry}
              onChange={(e) => setStartupForm({ ...startupForm, otherIndustry: e.target.value })}
            />
          )}

          <select value={startupForm.revenue} onChange={(e) => setStartupForm({ ...startupForm, revenue: e.target.value })}>
            <option value="">Select revenue</option>
            {Object.keys(startupPricing).map((k) => <option key={k}>{k}</option>)}
          </select>

          <br />
          <button onClick={() => { setStartupsPending([...startupsPending, startupForm]); setStartupForm({ name: "", industry: "", otherIndustry: "", revenue: "", email: "", linkedin: "", verified: false }); }}>
            Submit
          </button>
        </>
      )}

      {/* ---------- REGISTER EXPERT ---------- */}

      {tab === "register-expert" && (
        <>
          <h3>Register Expert (Pending Approval)</h3>
          <input placeholder="Full Name" value={expertForm.name} onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })} />
          <input placeholder="LinkedIn / Instagram" value={expertForm.social} onChange={(e) => setExpertForm({ ...expertForm, social: e.target.value })} />
          <input type="number" placeholder="Years Experience" value={expertForm.years} onChange={(e) => setExpertForm({ ...expertForm, years: +e.target.value })} />
          <input placeholder="Expertise" value={expertForm.expertise} onChange={(e) => setExpertForm({ ...expertForm, expertise: e.target.value })} />
          <input placeholder="Email" value={expertForm.email} onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })} />

          <select value={expertForm.followers} onChange={(e) => setExpertForm({ ...expertForm, followers: e.target.value })}>
            <option value="">Select followers</option>
            {Object.keys(expertFollowers).map((k) => <option key={k}>{k}</option>)}
          </select>

          <br />
          <button onClick={() => { setExpertsPending([...expertsPending, expertForm]); setExpertForm({ name: "", years: 0, expertise: "", followers: "", email: "", social: "", verified: false }); }}>
            Submit
          </button>
        </>
      )}

      {/* ---------- ADMIN PANEL ---------- */}
      {tab === "admin" && (
        <>
          <h3>Admin — Pending Approvals</h3>

          <h4>Investors Pending</h4>
          {investorsPending.length === 0 && <div>No pending investors.</div>}
          {investorsPending.map((p, idx) => (
            <div className="card" key={idx}>
              <div><b>{p.name}</b> — {p.type} — {p.amount}</div>
              <div>Email: {p.email}</div>
              <button onClick={() => approveInvestor(idx)}>Approve</button>
              <button onClick={() => rejectInvestor(idx)} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          ))}

          <h4>Startups Pending</h4>
          {startupsPending.length === 0 && <div>No pending startups.</div>}
          {startupsPending.map((p, idx) => (
            <div className="card" key={idx}>
              <div><b>{p.name}</b> — {p.industry === "Other" ? p.otherIndustry : p.industry}</div>
              <div>Email: {p.email}</div>
              <button onClick={() => approveStartup(idx)}>Approve</button>
              <button onClick={() => rejectStartup(idx)} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          ))}

          <h4>Experts Pending</h4>
          {expertsPending.length === 0 && <div>No pending experts.</div>}
          {expertsPending.map((p, idx) => (
            <div className="card" key={idx}>
              <div><b>{p.name}</b> — {p.years} yrs — {p.expertise}</div>
              <div>Email: {p.email}</div>
              <button onClick={() => approveExpert(idx)}>Approve</button>
              <button onClick={() => rejectExpert(idx)} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
