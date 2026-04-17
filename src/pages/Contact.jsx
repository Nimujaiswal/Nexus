import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"General Inquiry", message:"" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields."); return;
    }
    setLoading(true);
    // Simulate async send
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name:"", email:"", subject:"General Inquiry", message:"" });
    }, 1200);
  };

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">
        <div style={{ textAlign:"center", paddingBottom:"2rem" }}>
          <span className="section-tag">Get in Touch</span>
          <h1 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(3rem,7vw,6.5rem)", textTransform:"uppercase", letterSpacing:"-2px", lineHeight:.95 }}>
            Talk to<br /><span className="clip-text">The Team</span>
          </h1>
        </div>

        <div className="contact-grid">
          {/* Left info */}
          <div className="contact-info">
            <h2>We'd Love to<br />Hear From You</h2>
            <p>Whether you have a question about features, pricing, partnerships, or just want to share feedback — our team responds within 24 hours.</p>

            <div className="contact-items">
              {[
                { icon:"📧", label:"Email",   value:"hello@nexusgaming.com" },
                { icon:"💬", label:"Discord", value:"discord.gg/nexusgaming" },
                { icon:"🐦", label:"Twitter", value:"@NexusGaming" },
                { icon:"📍", label:"HQ",      value:"Mumbai, India" },
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="c-icon">{c.icon}</div>
                  <div>
                    <div className="c-label">{c.label}</div>
                    <div className="c-val">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Response times */}
            <div style={{ marginTop:"2.5rem", background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"1.6rem" }}>
              <p style={{ fontFamily:"var(--ff-mono)", fontSize:".6rem", letterSpacing:"3px", textTransform:"uppercase", color:"var(--white-dim)", marginBottom:"1rem" }}>Response Times</p>
              {[
                { label:"General Inquiries",   time:"< 24 hours" },
                { label:"Technical Support",   time:"< 4 hours" },
                { label:"Partnership Requests",time:"< 48 hours" },
              ].map((r, i, a) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:".65rem 0", borderBottom: i < a.length-1 ? "1px solid var(--border)" : "none", fontSize:".87rem" }}>
                  <span style={{ color:"var(--white-dim)" }}>{r.label}</span>
                  <span style={{ color:"var(--blue)", fontFamily:"var(--ff-mono)", fontSize:".78rem" }}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="contact-form-card">
            <h3 className="form-title">Send a Message</h3>

            {error   && <div className="form-error">⚠ {error}</div>}
            {success && <div className="form-success">✅ Message sent! We'll get back to you within 24 hours.</div>}

            <form onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" name="name" value={form.name} onChange={onChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={onChange} placeholder="your@email.com" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" name="subject" value={form.subject} onChange={onChange}>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Press</option>
                  <option>Bug Report</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" name="message" value={form.message} onChange={onChange} placeholder="Tell us what's on your mind..." />
              </div>

              <button className="form-submit" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}