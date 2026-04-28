import { Link } from "react-router-dom";

const NAV = [
  { to:"/",           label:"Home"        },
  { to:"/games",      label:"Games"       },
  { to:"/features",   label:"Features"    },
  { to:"/story",      label:"Our Story"   },
  { to:"/leaderboard",label:"Leaderboard" },
  { to:"/arcade",     label:"Arcade"      },
  { to:"/contact",    label:"Contact"     },
];

const SOCIALS = [
  { icon:"𝕏",  label:"Twitter",  href:"#" },
  { icon:"💬", label:"Discord",  href:"#" },
  { icon:"🎮", label:"Steam",    href:"#" },
  { icon:"📺", label:"YouTube",  href:"#" },
  { icon:"📸", label:"Instagram",href:"#" },
];

const STATS = [
  { num:"2.4M+", label:"Players"    },
  { num:"500+",  label:"Games"      },
  { num:"99.9%", label:"Uptime"     },
  { num:"<10ms", label:"Latency"    },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        {/* Top CTA strip */}
        <div className="footer-cta-strip">
          <div className="footer-cta-left">
            <span className="footer-cta-tag">Ready to Play?</span>
            <h3 className="footer-cta-title">Join 2.4M players today — free forever.</h3>
          </div>
          <div className="footer-cta-btns">
            <Link to="/register" className="btn-yellow">Create Account →</Link>
            <Link to="/games"    className="btn-outline">Browse Games</Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="footer-stats">
          {STATS.map((s,i) => (
            <div key={i} className="footer-stat">
              <span className="footer-stat-num">{s.num}</span>
              <span className="footer-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main footer grid */}
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">NEX<em>US</em></Link>
            <p>The ultimate gaming universe. Compete, explore, and dominate across hundreds of worlds with millions of players worldwide.</p>
            <div className="footer-socials">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} className="footer-social-btn" aria-label={s.label} title={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                {NAV.slice(0,4).map(n => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Community</h4>
              <ul>
                {NAV.slice(4).map(n => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Join Free</Link></li>
                <li><Link to="/contact">Support</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">DMCA</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© 2026 NEXUS Gaming. All rights reserved.</p>
          <div className="footer-bottom-right">
            <span className="footer-live-dot" />
            <p>All systems operational</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
