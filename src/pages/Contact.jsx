import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Contact() {
  useScrollReveal();
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle|sending|sent|error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if(!form.name.trim())    e.name    = "Name is required";
    if(!form.email.includes("@")) e.email = "Valid email required";
    if(!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if(Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStatus("sending");
    await new Promise(r => setTimeout(r, 1200));
    setStatus("sent");
  };

  const set = (k, v) => { setForm(f => ({...f,[k]:v})); if(errors[k]) setErrors(e => ({...e,[k]:""})); };

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"var(--s24)", minHeight:"100vh" }}>
      <div className="container">

        <div className="page-hero sr">
          <span className="section-tag">Contact Us</span>
          <h1>Let's<br /><span className="clip-text">Talk.</span></h1>
          <p>Questions, partnerships, press inquiries, or just want to say hi — we're here.</p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div className="sr">
            <h2 className="contact-info" style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(1.8rem,3vw,2.8rem)", letterSpacing:"-1px", marginBottom:"var(--s5)" }}>
              Get in Touch
            </h2>
            <p style={{ color:"var(--white-50)", lineHeight:1.85, marginBottom:"var(--s8)", fontSize:"var(--text-md)" }}>
              Our team responds within 24 hours. For urgent issues, Discord is fastest.
            </p>
            <div className="contact-items">
              {[
                { icon:"📧", label:"Email",   val:"hello@nexus.gg"     },
                { icon:"💬", label:"Discord", val:"discord.gg/nexus"   },
                { icon:"🐦", label:"Twitter", val:"@NexusGaming"       },
                { icon:"📍", label:"HQ",      val:"San Francisco, CA"  },
              ].map((item,i) => (
                <div key={i} className="contact-item">
                  <div className="c-icon" aria-hidden="true">{item.icon}</div>
                  <div>
                    <div className="c-label">{item.label}</div>
                    <div className="c-val">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Response time badges */}
            <div style={{ display:"flex", gap:"var(--s3)", marginTop:"var(--s8)", flexWrap:"wrap" }}>
              {[
                { icon:"⚡", text:"Replies in under 24h" },
                { icon:"🌍", text:"Available worldwide"  },
              ].map((b,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"var(--s2)", background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--r-full)", padding:"var(--s2) var(--s4)", fontSize:"var(--text-sm)", color:"var(--white-50)" }}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card sr">
            <h3 className="form-title">Send a Message</h3>

            {status === "sent" ? (
              <div className="form-success" role="alert">
                <span aria-hidden="true">✓</span>
                <div>
                  <div style={{ fontWeight:700 }}>Message sent!</div>
                  <div style={{ fontSize:"var(--text-sm)", opacity:.8 }}>We'll get back to you within 24 hours.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Full Name *</label>
                    <input id="contact-name" className="form-input" type="text" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Alex Mercer" aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name?"name-err":undefined} />
                    {errors.name && <p id="name-err" style={{ color:"var(--red)", fontSize:"var(--text-xs)", marginTop:"var(--s1)" }} role="alert">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email *</label>
                    <input id="contact-email" className="form-input" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="alex@example.com" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email?"email-err":undefined} />
                    {errors.email && <p id="email-err" style={{ color:"var(--red)", fontSize:"var(--text-xs)", marginTop:"var(--s1)" }} role="alert">{errors.email}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" className="form-select" value={form.subject} onChange={e=>set("subject",e.target.value)}>
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press & Media</option>
                    <option value="support">Technical Support</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message *</label>
                  <textarea id="contact-message" className="form-textarea" value={form.message} onChange={e=>set("message",e.target.value)} placeholder="Tell us how we can help..." aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message?"msg-err":undefined} />
                  {errors.message && <p id="msg-err" style={{ color:"var(--red)", fontSize:"var(--text-xs)", marginTop:"var(--s1)" }} role="alert">{errors.message}</p>}
                </div>
                <button type="submit" className="form-submit" disabled={status==="sending"} aria-label={status==="sending"?"Sending message...":"Send message"}>
                  {status === "sending" ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
