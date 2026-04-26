import './style.css'
import { fetchStats, submitContact, subscribe, ping } from './api.js'

const services = [
  ['01', 'AI Consultation Services', 'Practical AI guidance to identify valuable use cases, reduce risk, and define a clear implementation roadmap.', 'AI'],
  ['02', 'Full-Stack Website Development', 'Complete website delivery from frontend interfaces to backend APIs, databases, deployment, and ongoing support.', 'Engineering'],
  ['03', 'Software Development', 'Custom software solutions designed and built around your operations, goals, and long-term product vision.', 'Engineering'],
  ['04', 'Automated Systems Development', 'Automation systems that remove repetitive tasks, improve accuracy, and increase operational efficiency.', 'Automation']
]

// ── Render ────────────────────────────────────────────────
document.querySelector('#app').innerHTML = `
<nav class="nav" id="nav">
  <a class="logo" href="#">FLUX<em>ORA</em></a>
  <ul class="nav-links" id="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#team">Team</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#contact" class="nav-btn">Let's talk</a></li>
  </ul>
  <button class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme" title="Toggle color theme">Theme</button>
  <button class="burger" id="burger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<div class="mobile-menu" id="mobile-menu">
  <a href="#about" class="mm-link">About</a>
  <a href="#services" class="mm-link">Services</a>
  <a href="#team" class="mm-link">Team</a>
  <a href="#faq" class="mm-link">FAQ</a>
  <a href="#contact" class="mm-link mm-cta">Let's talk →</a>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-grid-bg"></div>
  <div class="glow g1"></div>
  <div class="glow g2"></div>
  <div class="hero-content">
    <div class="eyebrow">
      <span class="pulse-dot"></span>
      AI &amp; Software Company &nbsp;·&nbsp; Accra, Ghana
    </div>
    <h1>We build technology<br><em>that feels human.</em></h1>
    <p class="hero-sub">
      FLUXORA Technologies crafts intelligent software — powerful enough to transform industries, thoughtful enough to feel like second nature.
    </p>
    <div class="hero-actions">
      <a href="#services" class="btn btn-primary">See what we build</a>
      <a href="#contact" class="btn btn-ghost">Start a conversation</a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="hero-blocks">
      <div class="block block-top"></div>
      <div class="block block-bottom"></div>
    </div>
    <div class="hero-orb"></div>
  </div>
</section>

<!-- LIVE STATS BAR -->
<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat-item">
      <span class="stat-val" id="stat-visitors">—</span>
      <span class="stat-lbl">Visitors this month</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-val" id="stat-projects">50+</span>
      <span class="stat-lbl">Projects shipped</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-val" id="stat-uptime">99.9%</span>
      <span class="stat-lbl">Uptime SLA</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-val api-status" id="api-status">●&nbsp;Connecting...</span>
      <span class="stat-lbl">API Status</span>
    </div>
  </div>
</div>

<!-- MARQUEE -->
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <span>AI Consultation</span><b>✦</b>
    <span>Full-Stack Websites</span><b>✦</b>
    <span>Software Development</span><b>✦</b>
    <span>Automated Systems</span><b>✦</b>
    <span>AI Consultation</span><b>✦</b>
    <span>Full-Stack Websites</span><b>✦</b>
    <span>Software Development</span><b>✦</b>
    <span>Automated Systems</span><b>✦</b>
  </div>
</div>

<!-- ABOUT -->
<section class="section about" id="about">
  <div class="container about-grid">
    <div class="reveal">
      <span class="label">// Who we are</span>
      <h2>Built by people,<br><em>for people.</em></h2>
      <p class="body-text">
        We started FLUXORA because we believed AI was becoming cold — all power, no warmth. So we built a company where engineers care as much about experience as they do about performance.
      </p>
      <p class="body-text mt">
        Every product we ship is designed to disappear into your workflow — quietly doing the hard work so you can focus on what matters most.
      </p>
      <div class="about-stats">
        <div class="astat"><strong>50+</strong><span>Projects shipped</span></div>
        <div class="astat"><strong>12</strong><span>Countries served</span></div>
        <div class="astat"><strong>99.9%</strong><span>Uptime SLA</span></div>
      </div>
    </div>
    <div class="value-cards reveal">
      <div class="vcard">
        <div class="vcard-icon">◎</div>
        <h3>Clarity over complexity</h3>
        <p>We distil hard problems into clean, usable solutions. No unnecessary abstraction, no bloat.</p>
      </div>
      <div class="vcard">
        <div class="vcard-icon">⬡</div>
        <h3>Adaptive by design</h3>
        <p>Our systems learn and evolve — built to grow alongside your business, not against it.</p>
      </div>
      <div class="vcard">
        <div class="vcard-icon">◈</div>
        <h3>Honest engineering</h3>
        <p>We ship what works. No vanity features, no inflated timelines — just reliable craft.</p>
      </div>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section class="section services" id="services">
  <div class="container">
    <div class="section-header reveal">
      <span class="label">// What we do</span>
      <h2>Tools that work as<br>hard as you do.</h2>
    </div>
    <div class="service-controls reveal">
      <div class="service-filters" id="service-filters">
        <button class="chip active" data-filter="All">All</button>
        <button class="chip" data-filter="AI">AI</button>
        <button class="chip" data-filter="Engineering">Engineering</button>
        <button class="chip" data-filter="Automation">Automation</button>
      </div>
      <input id="service-search" class="service-search" type="search" placeholder="Search services..." aria-label="Search services" />
    </div>
    <div class="services-list">
      ${services.map(([n, t, d, c]) => `
        <div class="service-row reveal" data-category="${c}" data-title="${t.toLowerCase()}" data-desc="${d.toLowerCase()}">
          <span class="svc-num">${n}</span>
          <div class="svc-body"><h3>${t}</h3><p>${d}</p></div>
          <span class="svc-arrow">→</span>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- TEAM -->
<section class="section team" id="team">
  <div class="container">
    <div class="section-header reveal" style="text-align:center">
      <span class="label">// Leadership</span>
      <h2>Founder-led,<br>execution-focused.</h2>
      <p class="body-text" style="max-width:520px;margin:0 auto">FLUXORA is led by a hands-on founder focused on delivering practical AI, web, and automation solutions for modern businesses.</p>
    </div>
    <div class="team-grid">
      ${[
        ['Tibil Nurudeen Bore','CEO & Founder','/ceo-profile.png','A young and driven technology professional with over three years of experience in web development, AI systems, and automation. He began programming at age 14 and is currently 18, studying at university while leading FLUXORA.'],
      ].map(([n,r,img,b]) => `
        <div class="member reveal">
          <img class="avatar-photo" src="${img}" alt="${n} profile photo" />
          <h3>${n}</h3>
          <span class="role">${r}</span>
          <p>${b}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section faq" id="faq">
  <div class="container">
    <div class="section-header reveal">
      <span class="label">// Common questions</span>
      <h2>Answers before<br>our first call.</h2>
    </div>
    <div class="faq-list" id="faq-list">
      ${[
        ['How fast can you start?', 'Most projects start discovery within one week, with kickoff after scope sign-off.'],
        ['Do you work with startups?', 'Yes. We work with startups and established teams, and shape delivery to match budget and pace.'],
        ['Can you improve existing systems?', 'Absolutely. We frequently modernize and stabilize existing products before adding new features.'],
        ['How do you handle AI risk?', 'We define guardrails early: data boundaries, model monitoring, fallback logic, and human review where needed.']
      ].map(([q, a], i) => `
        <details class="faq-item reveal" ${i === 0 ? 'open' : ''}>
          <summary>${q}</summary>
          <p>${a}</p>
        </details>
      `).join('')}
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="section contact" id="contact">
  <div class="container contact-grid">
    <div class="contact-text reveal">
      <span class="label">// Say hello</span>
      <h2>Got something<br>in mind? <em>Let's talk.</em></h2>
      <p class="body-text">We reply within 24 hours — usually faster. No sales pitch, just a real conversation about what you're trying to build.</p>
      <div class="contact-info">
        <a href="mailto:nbt2124@gmail.com">nbt2124@gmail.com</a>
        <a href="tel:+233543081925">(+233543081925)</a>
        <span>Accra, Ghana 🇬🇭</span>
      </div>
    </div>
    <form class="contact-form reveal" id="contact-form">
      <div class="form-row">
        <div class="fg"><label>Your name</label><input type="text" name="name" placeholder="Kofi Boateng" required /></div>
        <div class="fg"><label>Email address</label><input type="email" name="email" placeholder="you@company.com" required /></div>
      </div>
      <div class="fg">
        <label>What can we help with?</label>
        <select name="service">
          <option value="">Choose a service...</option>
          <option>AI Consultation Services</option>
          <option>Full-Stack Website Development</option>
          <option>Software Development</option>
          <option>Automated Systems Development</option>
          <option>Something else entirely</option>
        </select>
      </div>
      <div class="fg">
        <label>Tell us more</label>
        <textarea name="message" rows="4" placeholder="Describe your project or challenge — we love context." required></textarea>
        <small class="hint" id="message-count">0 / 600</small>
      </div>
      <div class="form-footer">
        <button type="submit" class="btn btn-primary" id="submit-btn">Send message →</button>
        <span class="form-msg" id="form-msg"></span>
      </div>
    </form>
  </div>
</section>

<!-- NEWSLETTER -->
<div class="newsletter-bar">
  <div class="container nl-inner">
    <div>
      <h3>Stay in the loop</h3>
      <p>Occasional updates on what we're building and thinking.</p>
    </div>
    <form class="nl-form" id="nl-form">
      <input type="email" name="email" placeholder="your@email.com" required />
      <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
    <span class="nl-msg" id="nl-msg"></span>
  </div>
</div>

<!-- FOOTER -->
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <span class="logo">FLUX<em>ORA</em></span>
      <p>Intelligent software, built with care.</p>
    </div>
    <nav class="footer-nav">
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#team">Team</a>
      <a href="#contact">Contact</a>
    </nav>
    <p class="footer-copy">© 2024 FLUXORA Technologies · Accra, Ghana · All rights reserved.</p>
  </div>
</footer>

<button class="to-top" id="to-top" aria-label="Back to top">↑</button>
`

// ── Nav scroll ────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40)
  document.getElementById('to-top').classList.toggle('show', window.scrollY > 700)
})

// ── Mobile menu ───────────────────────────────────────────
const burger = document.getElementById('burger')
const mobileMenu = document.getElementById('mobile-menu')
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open')
  burger.classList.toggle('active')
})
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open')
    burger.classList.remove('active')
  })
})

// ── Theme toggle ──────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle')
const savedTheme = localStorage.getItem('fluxora-theme') || 'dark'
document.documentElement.setAttribute('data-theme', savedTheme)
themeToggle.textContent = savedTheme === 'light' ? 'Dark' : 'Light'
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('fluxora-theme', next)
  themeToggle.textContent = next === 'light' ? 'Dark' : 'Light'
})

// ── Scroll reveal ─────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target) } })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el))

// ── Active nav section ────────────────────────────────────
const navLinks = [...document.querySelectorAll('#nav-links a')]
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
    })
  })
}, { threshold: 0.5 })
;['about', 'services', 'team', 'faq', 'contact'].forEach(id => {
  const section = document.getElementById(id)
  if (section) sectionObserver.observe(section)
})

// ── Service search/filter ─────────────────────────────────
const serviceRows = [...document.querySelectorAll('.service-row')]
const serviceSearch = document.getElementById('service-search')
const serviceFilters = [...document.querySelectorAll('#service-filters .chip')]
let activeFilter = 'All'

function applyServiceFilter() {
  const term = serviceSearch.value.trim().toLowerCase()
  serviceRows.forEach(row => {
    const isCategoryMatch = activeFilter === 'All' || row.dataset.category === activeFilter
    const isSearchMatch = !term || row.dataset.title.includes(term) || row.dataset.desc.includes(term)
    row.style.display = isCategoryMatch && isSearchMatch ? '' : 'none'
  })
}

serviceSearch.addEventListener('input', applyServiceFilter)
serviceFilters.forEach(chip => {
  chip.addEventListener('click', () => {
    serviceFilters.forEach(c => c.classList.remove('active'))
    chip.classList.add('active')
    activeFilter = chip.dataset.filter
    applyServiceFilter()
  })
})

// ── Live stats from API ───────────────────────────────────
async function loadStats() {
  const statusEl = document.getElementById('api-status')
  const data = await ping()
  if (data?.ok) {
    statusEl.textContent = '● Live'
    statusEl.style.color = '#34d399'
  } else {
    statusEl.textContent = '● Offline'
    statusEl.style.color = '#fb7185'
  }
  const stats = await fetchStats()
  if (stats) {
    document.getElementById('stat-visitors').textContent = stats.visitors.toLocaleString()
    document.getElementById('stat-projects').textContent = stats.projects + '+'
    document.getElementById('stat-uptime').textContent = stats.uptime + '%'
  } else {
    document.getElementById('stat-visitors').textContent = '1,247+'
  }
}
loadStats()

// ── Contact form ──────────────────────────────────────────
const messageField = document.querySelector('textarea[name="message"]')
const messageCount = document.getElementById('message-count')
messageField.setAttribute('maxlength', '600')
messageField.addEventListener('input', () => {
  messageCount.textContent = `${messageField.value.length} / 600`
})

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn = document.getElementById('submit-btn')
  const msg = document.getElementById('form-msg')
  const fd = new FormData(e.target)
  const payload = Object.fromEntries(fd)

  if (String(payload.message || '').trim().length < 12) {
    msg.textContent = 'Please provide at least 12 characters in your message.'
    msg.style.color = '#fb7185'
    return
  }

  btn.disabled = true
  btn.textContent = 'Sending...'
  try {
    const res = await submitContact(payload)
    if (res.ok) {
      btn.textContent = 'Sent ✓'
      btn.style.background = '#34d399'
      btn.style.color = '#000'
      msg.textContent = res.message
      msg.style.color = '#34d399'
      e.target.reset()
    } else {
      throw new Error(res.error)
    }
  } catch (err) {
    btn.textContent = 'Try again'
    msg.textContent = err.message || 'Something went wrong.'
    msg.style.color = '#fb7185'
    btn.disabled = false
  }
  setTimeout(() => {
    btn.textContent = 'Send message →'
    btn.style.background = ''
    btn.style.color = ''
    btn.disabled = false
    msg.textContent = ''
  }, 4000)
})

// ── Newsletter form ───────────────────────────────────────
document.getElementById('nl-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const msgEl = document.getElementById('nl-msg')
  const email = e.target.email.value
  const btn = e.target.querySelector('button')
  btn.disabled = true
  btn.textContent = '...'
  try {
    const res = await subscribe(email)
    msgEl.textContent = res.message || 'You\'re on the list!'
    msgEl.style.color = '#34d399'
    e.target.reset()
  } catch {
    msgEl.textContent = 'Try again shortly.'
    msgEl.style.color = '#fb7185'
  }
  btn.disabled = false
  btn.textContent = 'Subscribe'
})

// ── Back to top ───────────────────────────────────────────
const toTop = document.getElementById('to-top')
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
