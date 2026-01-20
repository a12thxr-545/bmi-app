import Link from 'next/link';

export default function Home() {
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero container">
        <h1 className="hero-title">
          Track Your Health<br />with BMI Tracker
        </h1>
        <p className="hero-subtitle">
          Record and analyze your Body Mass Index with comprehensive MIS reports.
          Daily, weekly, monthly, and yearly insights.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="btn btn-primary btn-lg">
            Get Started Free
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mt-8">
        <h2 className="text-center mb-6">✨ Key Features</h2>
        <div className="grid grid-3">
          <div className="card feature-card">
            <div className="feature-icon">⚖️</div>
            <h3 className="feature-title">Calculate BMI</h3>
            <p className="feature-description">
              Record your weight and height. The system calculates your BMI with category and recommendations.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">MIS Reports</h3>
            <p className="feature-description">
              View historical reports by day, week, month, and year.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Trend Charts</h3>
            <p className="feature-description">
              Track your BMI changes through beautiful and easy-to-understand charts.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Multi-User Support</h3>
            <p className="feature-description">
              Register and securely store your personal data.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Set Goals</h3>
            <p className="feature-description">
              Define your BMI goals and track your progress.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure</h3>
            <p className="feature-description">
              Your data is encrypted and stored securely.
            </p>
          </div>
        </div>
      </section>

      {/* BMI Categories */}
      <section className="container mt-8">
        <h2 className="text-center mb-6">📋 BMI Categories</h2>
        <div className="grid grid-4">
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#3B82F6' }}>&lt; 18.5</div>
            <div className="stat-label">Underweight</div>
          </div>
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#22C55E' }}>18.5 - 24.9</div>
            <div className="stat-label">Normal</div>
          </div>
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#F59E0B' }}>25 - 29.9</div>
            <div className="stat-label">Overweight</div>
          </div>
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#EF4444' }}>≥ 30</div>
            <div className="stat-label">Obese</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mt-8 text-center">
        <div className="card" style={{ padding: '3rem' }}>
          <h2 className="mb-4">🚀 Ready to get started?</h2>
          <p className="text-secondary mb-6">
            Sign up for free today and start tracking your health.
          </p>
          <Link href="/register" className="btn btn-success btn-lg">
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mt-8 text-center text-muted" style={{ padding: '2rem 0' }}>
        <p>© 2024 BMI Tracker. Built with ❤️ using Next.js + SQLite</p>
      </footer>
    </div>
  );
}
