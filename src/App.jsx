import { useState, useEffect, useCallback, useRef } from 'react'
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

// ── Compliance documents ──────────────────────────────────────────────────────
const LEGAL_DOCS = {
  legal: {
    title: 'Aviso Legal',
    sections: [
      {
        heading: '1. Datos identificativos del titular',
        body: 'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se informa que el titular de este sitio web es Instituto Biomecánico ClinicArticular, S.L. (en adelante, "la Empresa"), con domicilio social en España, inscrita en el Registro Mercantil correspondiente y con NIF pendiente de actualización en el momento de acceso a esta página.',
      },
      {
        heading: '2. Objeto y ámbito de aplicación',
        body: 'El presente Aviso Legal regula el acceso y uso del sitio web, cuya finalidad es ofrecer información de carácter divulgativo sobre salud biomecánica y articular, así como facilitar el acceso a cuestionarios de triaje orientativo. El acceso al sitio implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.',
      },
      {
        heading: '3. Propiedad intelectual e industrial',
        body: 'Todos los contenidos del sitio web —incluyendo, a título enunciativo, textos, fotografías, gráficos, imágenes, iconos, tecnología, software, bases de datos y demás elementos audiovisuales— son propiedad exclusiva de la Empresa o de terceros que han autorizado su uso, y están protegidos por las leyes españolas e internacionales sobre propiedad intelectual e industrial. Queda expresamente prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y por escrito del titular.',
      },
      {
        heading: '4. Limitación de responsabilidad',
        body: 'La información contenida en este sitio web tiene carácter puramente orientativo y divulgativo. No sustituye en ningún caso el diagnóstico, consejo, tratamiento o prescripción de un profesional de la salud debidamente colegiado. La Empresa no se hace responsable de las decisiones tomadas por el usuario basándose en los contenidos del sitio web. El uso del cuestionario de triaje no genera ninguna relación clínica ni médico-paciente.',
      },
      {
        heading: '5. Ley aplicable y jurisdicción',
        body: 'El presente Aviso Legal se rige en su totalidad por la legislación española. Para la resolución de cualquier controversia derivada del uso de este sitio web, las partes se someten a la jurisdicción de los Juzgados y Tribunales competentes conforme a la normativa española vigente.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    sections: [
      {
        heading: '1. Responsable del tratamiento',
        body: 'Instituto Biomecánico ClinicArticular, S.L., con domicilio en España (en adelante, "el Responsable"), es el responsable del tratamiento de los datos personales que usted facilita a través de este sitio web.',
      },
      {
        heading: '2. Datos personales que recabamos',
        body: 'Mediante el formulario de captación de este sitio web, recabamos exclusivamente su dirección de correo electrónico, junto con las respuestas al cuestionario de triaje clínico (zona de dolor, duración de la limitación, actividades afectadas y rango de edad), con carácter anónimo y agregado.',
      },
      {
        heading: '3. Finalidad del tratamiento',
        body: 'Los datos son tratados con la finalidad de enviarle información personalizada sobre el protocolo biomecánico recomendado según sus respuestas, así como comunicaciones comerciales relacionadas con productos y servicios de salud articular. No se utilizarán para ninguna otra finalidad sin su consentimiento previo y expreso.',
      },
      {
        heading: '4. Base jurídica del tratamiento',
        body: 'El tratamiento se fundamenta en el consentimiento expreso del interesado, de conformidad con el artículo 6.1.a) del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD).',
      },
      {
        heading: '5. Plazo de conservación',
        body: 'Sus datos serán conservados durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados y, en cualquier caso, mientras no retire su consentimiento. Una vez retirado el consentimiento o transcurrido el plazo legal aplicable, los datos serán suprimidos de forma segura.',
      },
      {
        heading: '6. Derechos del interesado',
        body: 'En cualquier momento, usted tiene derecho a acceder a sus datos personales, rectificarlos, suprimirlos, oponerse a su tratamiento, solicitar la limitación del tratamiento o su portabilidad, dirigiéndose por escrito al Responsable a través de los canales habilitados en este sitio web. Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera que el tratamiento no se ajusta a la normativa vigente.',
      },
      {
        heading: '7. Transferencias internacionales',
        body: 'Sus datos no serán cedidos a terceros, salvo obligación legal o necesidad para la prestación del servicio. En caso de que sea necesario transferir datos a terceros países, se adoptarán las garantías adecuadas conforme al RGPD (cláusulas contractuales tipo u otros mecanismos aprobados por la Comisión Europea).',
      },
      {
        heading: '8. Uso de cookies',
        body: 'Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento. No se utilizan cookies de seguimiento o publicidad comportamental sin el consentimiento previo del usuario. Para más información, puede consultar nuestra Política de Cookies.',
      },
    ],
  },
  terms: {
    title: 'Términos y Condiciones',
    sections: [
      {
        heading: '1. Objeto',
        body: 'Los presentes Términos y Condiciones regulan el uso del sitio web y la contratación de los servicios ofrecidos por Instituto Biomecánico ClinicArticular, S.L. El acceso y utilización del sitio web atribuye la condición de usuario e implica la aceptación plena de estos Términos.',
      },
      {
        heading: '2. Carácter orientativo del cuestionario',
        body: 'El cuestionario de triaje clínico disponible en este sitio tiene carácter exclusivamente divulgativo y orientativo. Los resultados obtenidos no constituyen un diagnóstico médico, ni sustituyen la valoración de un especialista. El usuario reconoce y acepta que la información facilitada no tiene valor clínico vinculante.',
      },
      {
        heading: '3. Acceso al servicio y obligaciones del usuario',
        body: 'El usuario se compromete a utilizar el sitio web y sus contenidos de conformidad con la ley, la moral y el orden público, y a no llevar a cabo ninguna acción que pueda dañar los sistemas informáticos del Responsable o de terceros. Queda prohibido el uso del sitio con fines ilícitos o lesivos.',
      },
      {
        heading: '4. Propiedad intelectual',
        body: 'Todos los contenidos, marcas, logotipos, diseños y elementos del sitio web son propiedad del Responsable o de sus licenciantes y están protegidos por la normativa de propiedad intelectual e industrial. Su reproducción, distribución o uso no autorizado queda expresamente prohibido.',
      },
      {
        heading: '5. Exclusión de garantías y responsabilidad',
        body: 'El Responsable no garantiza la disponibilidad y continuidad del funcionamiento del sitio web ni que la información sea exacta, completa o actualizada en todo momento. El Responsable no será responsable de los daños y perjuicios de cualquier naturaleza que puedan derivarse del uso del sitio web o de la imposibilidad de acceder al mismo.',
      },
      {
        heading: '6. Modificación de los Términos',
        body: 'El Responsable se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento, comunicándolo mediante publicación en el sitio web. La continuación del uso del sitio tras la publicación de los cambios implicará la aceptación de los nuevos Términos.',
      },
      {
        heading: '7. Ley aplicable y jurisdicción',
        body: 'Estos Términos y Condiciones se rigen por la legislación española. Para la resolución de cualquier litigio derivado del uso de este sitio web, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a la jurisdicción de los Juzgados y Tribunales del domicilio del usuario, conforme a lo establecido en la normativa de consumidores y usuarios vigente en España.',
      },
    ],
  },
}

// ── Compliance Modal ──────────────────────────────────────────────────────────
function ComplianceModal({ docKey, onClose }) {
  const doc = LEGAL_DOCS[docKey]
  const bodyRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">{doc.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body" ref={bodyRef}>
          {doc.sections.map((s) => (
            <div key={s.heading} className="modal-section">
              <h3 className="modal-section-title">{s.heading}</h3>
              <p className="modal-section-body">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="cta-btn cta-btn--blue" onClick={onClose}>
            He leído y acepto
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner-ring" />
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
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

// ── Option button ─────────────────────────────────────────────────────────────
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

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('intro')
  const [visible, setVisible] = useState(true)
  const [q1, setQ1] = useState(null)
  const [selectedQ1, setSelectedQ1] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [activeModal, setActiveModal] = useState(null) // 'legal' | 'privacy' | 'terms'

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

  function handleQ2() { setTimeout(() => goTo('loading1'), 280) }
  function handleQ3() { setTimeout(() => goTo('loading2'), 280) }
  function handleQ4() { setTimeout(() => goTo('lead'), 280) }

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
      {/* ── Header ── */}
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

      {/* ── Main quiz ── */}
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
                <button className="text-link" onClick={() => setActiveModal('privacy')}>
                  Política de Privacidad
                </button>.
                Sus datos son tratados conforme al RGPD. No compartiremos su información con terceros.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <button className="footer-link" onClick={() => setActiveModal('legal')}>
            Aviso Legal
          </button>
          <span className="footer-sep" aria-hidden="true">·</span>
          <button className="footer-link" onClick={() => setActiveModal('privacy')}>
            Política de Privacidad
          </button>
          <span className="footer-sep" aria-hidden="true">·</span>
          <button className="footer-link" onClick={() => setActiveModal('terms')}>
            Términos y Condiciones
          </button>
        </div>
      </footer>

      {/* ── Compliance modal ── */}
      {activeModal && (
        <ComplianceModal
          docKey={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}
