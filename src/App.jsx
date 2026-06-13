import { useState, useEffect, useCallback } from 'react'
import './App.css'

const REDIRECT_URL = 'vsl-diagnostica.html'

const PAIN_LABELS = {
  rodilla: 'la rodilla',
  lumbar: 'la zona lumbar y ciática',
  cervical: 'la zona cervical y cuello',
  caderas: 'las caderas',
}

const Q1_OPTIONS = [
  { id: 'rodilla', label: 'Rodilla' },
  { id: 'lumbar', label: 'Lumbar o Ciática' },
  { id: 'cervical', label: 'Cervical y Cuello' },
  { id: 'caderas', label: 'Caderas' },
]

const Q2_OPTIONS = [
  'Menos de 3 meses',
  'Entre 3 meses y 1 año',
  'Más de 1 año',
  'Ya he perdido la cuenta',
]

const Q3_LOWER = {
  title: 'Entendido. Sabiendo que el dolor está en el tren inferior, ¿qué actividad diaria le resulta más difícil realizar hoy?',
  options: [
    'Bajar o subir escaleras',
    'Caminar por más de 15 minutos',
    'Levantarme de una silla baja',
  ],
}

const Q3_SPINE = {
  title: 'Entendido. La compresión en la columna limita el cuerpo entero. ¿En qué momento del día el dolor es más punzante?',
  options: [
    'Al levantarme de la cama por la mañana',
    'Al estar mucho tiempo de pie',
    'Al intentar dormir',
  ],
}

const Q4_OPTIONS = [
  'Menos de 50 años',
  '50 a 58 años',
  '59 a 68 años',
  'Más de 68 años',
]

function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner-ring" />
    </div>
  )
}

function ProgressBar({ step, total }) {
  return (
    <div className="progress-container">
      <p className="progress-label">Paso {step} de {total}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  )
}

function OptionBtn({ label, selected, onClick }) {
  return (
    <button
      className={`option-btn${selected ? ' option-btn--selected' : ''}`}
      onClick={onClick}
    >
      <span className="option-radio" aria-hidden="true">
        {selected ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#0066CC" strokeWidth="2" fill="#EBF4FF" />
            <circle cx="10" cy="10" r="5" fill="#0066CC" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="2" fill="white" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [visible, setVisible] = useState(true)
  const [q1, setQ1] = useState(null)
  const [selectedQ1, setSelectedQ1] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const goTo = useCallback((next) => {
    setVisible(false)
    setTimeout(() => {
      setScreen(next)
      setVisible(true)
    }, 380)
  }, [])

  useEffect(() => {
    if (screen !== 'loading1') return
    setLoadingStep(0)
    const t1 = setTimeout(() => setLoadingStep(1), 1500)
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(() => { setScreen('q3'); setVisible(true) }, 380)
    }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [screen])

  useEffect(() => {
    if (screen !== 'loading2') return
    setLoadingStep(0)
    const t1 = setTimeout(() => setLoadingStep(1), 1500)
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(() => { setScreen('q4'); setVisible(true) }, 380)
    }, 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [screen])

  function handleQ1(id) {
    setSelectedQ1(id)
    setQ1(id)
    setTimeout(() => goTo('q2'), 280)
  }

  function handleQ2() {
    setTimeout(() => goTo('loading1'), 280)
  }

  function handleQ3() {
    setTimeout(() => goTo('loading2'), 280)
  }

  function handleQ4() {
    setTimeout(() => goTo('lead'), 280)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor, introduzca un correo electrónico válido.')
      return
    }
    setEmailError('')
    console.log('Lead capturado:', { q1, email })
    window.location.href = REDIRECT_URL
  }

  const isLowerBody = q1 === 'rodilla' || q1 === 'caderas'
  const q3Config = isLowerBody ? Q3_LOWER : Q3_SPINE

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Instituto Biomecánico&nbsp;<strong>ClinicArticular</strong></span>
          </div>
          <span className="header-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="rgba(255,255,255,0.75)" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="rgba(255,255,255,0.75)" strokeWidth="2"/>
            </svg>
            &nbsp;Datos protegidos — RGPD
          </span>
        </div>
      </header>

      <main className="main">
        <div className={`card${visible ? '' : ' card--hidden'}`}>

          {screen === 'intro' && (
            <div className="screen">
              <span className="tag tag--blue">Cuestionario Clínico Gratuito</span>
              <h1 className="intro-title">Evaluación de Dolor Articular y Estructural</h1>
              <p className="intro-desc">
                En menos de 2 minutos, nuestro sistema de triaje biomecánico identificará el origen
                de su dolor y le mostrará el protocolo conservador más adecuado para su caso.
              </p>
              <div className="checklist">
                {[
                  'Cuestionario validado clínicamente',
                  'Protocolo personalizado en 4 preguntas',
                  'Sin compromiso — 100% gratuito',
                ].map((item) => (
                  <div key={item} className="checklist-item">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <circle cx="9" cy="9" r="9" fill="#0066CC" />
                      <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="cta-btn" onClick={() => goTo('q1')}>
                Iniciar Evaluación Clínica
              </button>
              <p className="privacy-note">
                Sus datos son tratados conforme al RGPD (UE) 2016/679. No se compartirán con terceros.
              </p>
            </div>
          )}

          {screen === 'q1' && (
            <div className="screen">
              <ProgressBar step={1} total={4} />
              <h2 className="question-title">
                ¿Dónde se localiza su principal foco de dolor o rigidez estructural?
              </h2>
              <div className="options-grid">
                {Q1_OPTIONS.map((opt) => (
                  <OptionBtn
                    key={opt.id}
                    label={opt.label}
                    selected={selectedQ1 === opt.id}
                    onClick={() => handleQ1(opt.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {screen === 'q2' && (
            <div className="screen">
              <ProgressBar step={2} total={4} />
              <h2 className="question-title">
                ¿Cuánto tiempo lleva conviviendo con esta limitación?
              </h2>
              <div className="options-list">
                {Q2_OPTIONS.map((opt) => (
                  <OptionBtn key={opt} label={opt} selected={false} onClick={handleQ2} />
                ))}
              </div>
            </div>
          )}

          {screen === 'loading1' && (
            <div className="screen loading-screen">
              <Spinner />
              <p className="loading-text" key={loadingStep}>
                {loadingStep === 0
                  ? 'Analizando la cronicidad de su dolor\u2026'
                  : 'Cruzando datos con el banco biomecánico\u2026'}
              </p>
            </div>
          )}

          {screen === 'q3' && (
            <div className="screen">
              <ProgressBar step={3} total={4} />
              <h2 className="question-title">{q3Config.title}</h2>
              <div className="options-list">
                {q3Config.options.map((opt) => (
                  <OptionBtn key={opt} label={opt} selected={false} onClick={handleQ3} />
                ))}
              </div>
            </div>
          )}

          {screen === 'loading2' && (
            <div className="screen loading-screen">
              {loadingStep === 0 ? (
                <>
                  <Spinner />
                  <p className="loading-text">Evaluando el nivel de desgaste articular\u2026</p>
                </>
              ) : (
                <div className="success-box">
                  <div className="success-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="success-text">
                    <strong>¡Excelente noticia!</strong> Según sus respuestas, su condición actual
                    tiene un alto porcentaje de reversión biomecánica mediante descompresión guiada.
                  </p>
                </div>
              )}
            </div>
          )}

          {screen === 'q4' && (
            <div className="screen">
              <ProgressBar step={4} total={4} />
              <h2 className="question-title">¿Cuál es su rango de edad actual?</h2>
              <div className="options-list">
                {Q4_OPTIONS.map((opt) => (
                  <OptionBtn key={opt} label={opt} selected={false} onClick={handleQ4} />
                ))}
              </div>
            </div>
          )}

          {screen === 'lead' && (
            <div className="screen">
              <span className="tag tag--green">Su protocolo clínico está listo</span>
              <h2 className="lead-title">Protocolo Clínico de 8 Semanas</h2>
              <p className="lead-desc">
                Hemos encontrado la solución conservadora exacta para aliviar{' '}
                <strong>{PAIN_LABELS[q1] || 'su dolor'}</strong>. Introduzca su correo electrónico
                para recibir su diagnóstico gratuito y ver el vídeo de prescripción.
              </p>
              <form onSubmit={handleSubmit} className="lead-form" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Su correo electrónico principal..."
                  className={`email-input${emailError ? ' email-input--error' : ''}`}
                  autoComplete="email"
                />
                {emailError && (
                  <p className="error-msg" role="alert">{emailError}</p>
                )}
                <button type="submit" className="cta-btn cta-btn--blue">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Ver mi Protocolo Biomecánico Ahora
                </button>
              </form>
              <p className="gdpr-note">
                Al enviar, acepta nuestra{' '}
                <a href="#" className="text-link">Política de Privacidad</a>.
                Sus datos son tratados conforme al RGPD. No compartiremos su información con terceros.
              </p>
            </div>
          )}

        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <a href="#" className="footer-link">Aviso Legal</a>
          <span className="footer-sep" aria-hidden="true">·</span>
          <a href="#" className="footer-link">Política de Privacidad</a>
          <span className="footer-sep" aria-hidden="true">·</span>
          <a href="#" className="footer-link">Términos y Condiciones</a>
        </div>
      </footer>
    </div>
  )
}
