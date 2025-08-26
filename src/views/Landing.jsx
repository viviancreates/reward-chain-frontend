import { Link } from "react-router-dom";
import "../styles/landing.css";
import PrimeroLogo from "../components/PrimeroLogo";

const BRAND = "PRIMERO";

export default function Landing() {
  const authed = !!localStorage.getItem("auth");

  return (
    <main className="landing-page">
      <header className="hero">
        <div className="hero-content">
          <PrimeroLogo />
          <h2>Pay Yourself First — Always</h2>
          <p className="description">
            Each time you spend, set aside a small amount for you.
          </p>
          {/* CTA */}
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
            <p>Sign up. Use your own wallet, or leave it blank and we’ll make one for you. We show your recovery phrase once—save it somewhere safe.</p>
          </div>
          <div className="step">
            <h3>⚖️ Choose Your Split</h3>
            <p>Pick a small percent to save from each purchase. Choose how to split that between ETH and USDC. You can change this anytime.</p>
          </div>
          <div className="step">
            <h3>🤖 Save Automatically</h3>
            <p>When you add a purchase, we set aside your percent right away. Saving happens first, so you pay yourself before you spend the rest.</p>
          </div>
          <div className="step">
            <h3>📊 Track Your Savings and Investments</h3>
            <p>See your saves by date and by coin. Watch your totals grow over time, all in one place.</p>
          </div>
          <div className="step">
            <h3>🔑 You Hold the Keys</h3>
            <p>You control the wallet. The recovery phrase is not stored. Keep it safe and you’re always in charge.</p>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>

        <div className="accordion" id="faq-acc">
          <details className="accordion-item" open>
            <summary className="accordion-button">What is “pay yourself first”?</summary>
            <div className="accordion-body">
              <strong>Pay yourself first</strong> is a simple habit: before you pay any bills or spend, you automatically send a portion of your income to savings or investments. You treat saving like a non-negotiable bill, so progress happens <em>by default</em>, not only when there’s money “left over.”
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-button">Is my wallet secure?</summary>
            <div className="accordion-body">
              You control the wallet. Your recover phrase is never stored. Keep it safe, it’s shown once during setup.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-button">Which assets are supported?</summary>
            <div className="accordion-body">
              Choose your allocation split. Save in stablecoins or learn to invest in ETH.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-button">Can I use my existing wallet?</summary>
            <div className="accordion-body">
              Provide your wallet address during signup, or generate a new one.
            </div>
          </details>

        </div>
      </section>


    </main>
  );
}
