import Link from 'next/link';

export default function Home() {
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero container">
        <h1 className="hero-title">
          ติดตามสุขภาพของคุณ<br />ด้วย BMI Tracker
        </h1>
        <p className="hero-subtitle">
          บันทึกและวิเคราะห์ค่าดัชนีมวลกาย พร้อมรายงาน MIS ครบถ้วน
          รายวัน รายสัปดาห์ รายเดือน และรายปี
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="btn btn-primary btn-lg">
            เริ่มต้นใช้งานฟรี
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            เข้าสู่ระบบ
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mt-8">
        <h2 className="text-center mb-6">✨ คุณสมบัติหลัก</h2>
        <div className="grid grid-3">
          <div className="card feature-card">
            <div className="feature-icon">⚖️</div>
            <h3 className="feature-title">คำนวณ BMI</h3>
            <p className="feature-description">
              บันทึกน้ำหนักและส่วนสูง ระบบคำนวณ BMI พร้อมแสดงหมวดหมู่และคำแนะนำ
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">รายงาน MIS</h3>
            <p className="feature-description">
              ดูรายงานย้อนหลังได้ทั้งรายวัน รายสัปดาห์ รายเดือน และรายปี
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">กราฟแนวโน้ม</h3>
            <p className="feature-description">
              ติดตามการเปลี่ยนแปลง BMI ของคุณผ่านกราฟที่สวยงามและเข้าใจง่าย
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">รองรับหลายผู้ใช้</h3>
            <p className="feature-description">
              สมัครสมาชิกและเก็บข้อมูลส่วนตัวของคุณได้อย่างปลอดภัย
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">ตั้งเป้าหมาย</h3>
            <p className="feature-description">
              กำหนดเป้าหมาย BMI ของคุณ และติดตามความคืบหน้า
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">ปลอดภัย</h3>
            <p className="feature-description">
              ข้อมูลของคุณถูกเข้ารหัสและจัดเก็บอย่างปลอดภัย
            </p>
          </div>
        </div>
      </section>

      {/* BMI Categories */}
      <section className="container mt-8">
        <h2 className="text-center mb-6">📋 เกณฑ์ค่า BMI</h2>
        <div className="grid grid-4">
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#3B82F6' }}>&lt; 18.5</div>
            <div className="stat-label">น้ำหนักน้อย</div>
          </div>
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#22C55E' }}>18.5 - 24.9</div>
            <div className="stat-label">ปกติ</div>
          </div>
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#F59E0B' }}>25 - 29.9</div>
            <div className="stat-label">น้ำหนักเกิน</div>
          </div>
          <div className="card text-center">
            <div className="stat-value" style={{ color: '#EF4444' }}>≥ 30</div>
            <div className="stat-label">อ้วน</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mt-8 text-center">
        <div className="card" style={{ padding: '3rem' }}>
          <h2 className="mb-4">🚀 พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="text-secondary mb-6">
            สมัครสมาชิกฟรีวันนี้ และเริ่มติดตามสุขภาพของคุณ
          </p>
          <Link href="/register" className="btn btn-success btn-lg">
            สมัครสมาชิกฟรี
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mt-8 text-center text-muted" style={{ padding: '2rem 0' }}>
        <p>© 2024 BMI Tracker. สร้างด้วย ❤️ โดยใช้ Next.js + SQLite</p>
      </footer>
    </div>
  );
}
