import { Link } from "react-router-dom";
import "../styles/landing.css";

const BRAND = "PRIMERO"; // rename anytime

export default function Landing() {
  const authed = !!localStorage.getItem("auth"); // matches your navbar auth check

  return (
    <main className="landing-page">
      <header className="hero">
        <div className="hero-content">
          <h1 className="tanda-logo" aria-label={BRAND}>
            <span className="p">P</span><span className="r">R</span><span className="i">I</span>
            <span className="m">M</span><span className="e">E</span><span className="r2">R</span><span className="o">O</span>
          </h1>

          <h2>Pay Yourself First — Automatically</h2>
          <p className="description">
            Set your savings on autopilot. We skim a small % from spending and send it to your wallet
            (ETH / USDC). Simple, secure, and habit-friendly.
          </p>

          {authed ? (
            <Link className="cta-button" to="/profile">Profile</Link>
          ) : (
            <Link className="cta-button" to="/register">Get Started</Link>
          )}
        </div>
      </header>

      <section className="works" id="how-it-works">
        <h2>How {BRAND} Works</h2>
        <div className="steps">
          <div className="step">
            <h3>📱 Create Your Account</h3>
            <p>Sign up in seconds. Auto-create a wallet or use yours.</p>
          </div>
          <div className="step">
            <h3>⚖️ Choose Your Split</h3>
            <p>Pick how much to skim and how to split ETH / USDC.</p>
          </div>
          <div className="step">
            <h3>🤖 Save Automatically</h3>
            <p>Set aside a small percentage from spending - pay yourself first.</p>
          </div>
          <div className="step">
            <h3>📊 Track Your Savings and Investments</h3>
            <p>History of contributions, allocations, and totals.</p>
          </div>
          <div className="step">
            <h3>🔑 You Hold the Keys</h3>
            <p>Your secret phrase is not stored. Save it once and you’re in control.</p>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>

        <div className="accordion" id="faq-acc">
          <details className="accordion-item" open>
            <summary className="accordion-button">What is “pay yourself first”?</summary>
            <div className="accordion-body">
              Save before you spend. {BRAND} automates this by skimming a small percent into your wallet, so saving happens by default.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-button">Is my wallet secure?</summary>
            <div className="accordion-body">
              Yes. You control the wallet. We never store your recovery phrase. Keep it safe — it’s shown once during setup.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-button">Which assets are supported?</summary>
            <div className="accordion-body">
              ETH and USDC to start (more ERC-20s planned). You choose your allocation split.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-button">Can I use my existing wallet?</summary>
            <div className="accordion-body">
              Absolutely. Provide your wallet address during signup, or let us generate one for you.
            </div>
          </details>

        </div>
      </section>

      <footer>
        <nav>
          <ul className="footer-links">
            <li><a href="mailto:viviandavilacodes@gmail.com">Contact</a></li>
            <li><a href="https://dev.to/viviancreates" target="_blank" rel="noreferrer">Blog</a></li>
          </ul>
        </nav>
      </footer>
    </main>
  );
}
