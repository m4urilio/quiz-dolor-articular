import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

const REDIRECT_URL = 'https://pay.hotmart.com/X106313372V?checkoutMode=10'

const PAIN_LABELS = {
  'Rodilla': 'la rodilla',
  'Lumbar o Ciática': 'la zona lumbar y ciática',
  'Cervical y Cuello': 'la zona cervical y cuello',
  'Caderas': 'las caderas',
  'Otro lugar': 'su zona de dolor',
}

const PAIN_IMAGES = {
  'Rodilla': '/rodilla.png',
  'Lumbar o Ciática': '/lumbar.png',
  'Cervical y Cuello': '/cuello.png',
  'Caderas': '/caderas.png',
}

// ── 15 Questions ──────────────────────────────────────────────────────────────
const QUESTIONS = [
  // Bloque 1 — Sobre usted (Q1–Q5)
  {
    id: 'q1', block: 1,
    title: '¿Cuál es su sexo?',
    options: ['Hombre', 'Mujer', 'Prefiero no indicarlo'],
  },
  {
    id: 'q2', block: 1,
    title: '¿En qué rango de edad se encuentra usted?',
    options: ['Menos de 45 años', 'Entre 45 y 55 años', 'Entre 55 y 65 años', 'Más de 65 años'],
  },
  {
    id: 'q3', block: 1,
    title: '¿Cómo definiría su nivel de actividad física habitual?',
    options: [
      'Sedentario/a — poco movimiento en el día a día',
      'Ligero/a — camino, pero sin ejercicio regular',
      'Moderado/a — ejercicio 1 o 2 veces por semana',
      'Activo/a — ejercicio 3 o más veces por semana',
    ],
  },
  {
    id: 'q4', block: 1,
    title: '¿Dónde localiza su principal foco de dolor o rigidez articular?',
    options: ['Rodilla', 'Lumbar o Ciática', 'Cervical y Cuello', 'Caderas', 'Otro lugar'],
  },
  {
    id: 'q5', block: 1,
    title: '¿Qué es lo que más le molesta de su dolor?',
    options: [
      'Me impide dormir bien por las noches',
      'No puedo caminar ni moverme con libertad',
      'Dependo de medicación para funcionar',
      'Siento que empeora con el tiempo',
    ],
  },
  // Bloque 2 — Sobre su dolor (Q6–Q10)
  {
    id: 'q6', block: 2,
    title: '¿Cuánto tiempo lleva conviviendo con este dolor o limitación?',
    options: [
      'Menos de 3 meses',
      'Entre 3 meses y 1 año',
      'Más de 1 año',
      'Ya he perdido la cuenta',
    ],
  },
  {
    id: 'q7', block: 2,
    title: '¿Cómo calificaría la intensidad de su dolor en un día normal?',
    options: [
      'Leve — molesta, pero puedo ignorarlo',
      'Moderado — interfiere con mis actividades',
      'Intenso — me limita considerablemente',
      'Muy intenso — me incapacita en ciertos momentos',
    ],
  },
  {
    id: 'q8', block: 2,
    title: '¿El dolor o la rigidez le impide descansar con normalidad por las noches?',
    options: [
      'Sí, me despierta o me cuesta dormirme',
      'A veces me cuesta conciliar el sueño',
      'No afecta directamente mi descanso',
      'Depende del día',
    ],
  },
  {
    id: 'q9', block: 2,
    title: '¿Ha probado algún tratamiento sin obtener mejoras duraderas?',
    options: [
      'Sí, he hecho fisioterapia sin éxito a largo plazo',
      'Sí, he tomado medicación o antiinflamatorios',
      'He probado varias cosas y nada ha funcionado',
      'Todavía no he probado ningún tratamiento',
    ],
  },
  {
    id: 'q10', block: 2,
    title: '¿El dolor le ha impedido realizar actividades que antes disfrutaba?',
    options: [
      'Sí, ya no puedo hacer muchas cosas que amaba',
      'Sí, pero sigo haciendo lo que puedo',
      'A veces debo adaptar o reducir las actividades',
      'Todavía puedo hacer casi todo, aunque con esfuerzo',
    ],
  },
  // Bloque 3 — Su solución (Q11–Q15)
  {
    id: 'q11', block: 3,
    title: '¿Sabía que el 87 % de los dolores articulares crónicos pueden resolverse sin cirugía mediante un protocolo de descompresión específico?',
    options: [
      'No lo sabía — me alegra saberlo',
      'Lo había escuchado, pero no sabía cómo lograrlo',
      'Tenía mis dudas sobre si era posible',
      'No lo creía posible para mi caso concreto',
    ],
  },
  {
    id: 'q12', block: 3,
    title: 'Si existiese un programa de 8 semanas diseñado exactamente para su tipo de dolor, ¿cuántos minutos al día le dedicaría?',
    options: [
      '10 a 15 minutos al día',
      '20 a 30 minutos al día',
      'Más de 30 minutos al día',
      'Lo que sea necesario para recuperarme',
    ],
  },
  {
    id: 'q13', block: 3,
    title: '¿Qué es lo que más le motivaría a seguir un programa de recuperación articular?',
    options: [
      'Volver a moverme y caminar sin dolor',
      'Recuperar mi independencia y autonomía',
      'Dormir bien y despertar sin rigidez',
      'Disfrutar de nuevo de mis actividades favoritas',
    ],
  },
  {
    id: 'q14', block: 3, yesno: true,
    title: '¿Le gustaría recuperar su movilidad y volver a vivir sin dolor articular en las próximas semanas?',
    options: ['Sí, quiero recuperarme', 'No, prefiero seguir como estoy'],
  },
  {
    id: 'q15', block: 3, yesno: true,
    title: '¿Está dispuesto/a a seguir un método natural, sin cirugía y sin medicación, durante 8 semanas para eliminar su dolor definitivamente?',
    options: ['Sí, estoy dispuesto/a', 'Necesito más información primero'],
  },
]

const Q_BY_ID = Object.fromEntries(QUESTIONS.map(q => [q.id, q]))
const Q_STEP  = Object.fromEntries(QUESTIONS.map((q, i) => [q.id, i + 1]))
const TOTAL_Q = QUESTIONS.length

// Non-linear progress: fast start, gradual slowdown (keeps users engaged)
// Q1→15%, Q2→24%, Q3→33%, Q4→42%, Q5→50%, Q6→56%, Q7→62%, Q8→67%,
// Q9→72%, Q10→77%, Q11→82%, Q12→87%, Q13→91%, Q14→96%, Q15→100%
const PROGRESS_PCT = [0, 15, 24, 33, 42, 50, 56, 62, 67, 72, 77, 82, 87, 91, 96, 100]

// Full navigation flow
const FLOW = [
  'intro',
  'q1', 'q2', 'q3', 'q4', 'q5',
  'loading1',
  'q6', 'q7', 'q8', 'q9', 'q10',
  'loading2',
  'q11', 'q12', 'q13', 'q14', 'q15',
  'elena2',
  'loading3',
  'lead',
]

// Back map — loading screens are transparent (skipped)
const BACK_MAP = (() => {
  const map = {}
  let last = null
  for (const s of FLOW) {
    if (last !== null && !s.startsWith('loading') && s !== 'intro') map[s] = last
    if (!s.startsWith('loading')) last = s
  }
  return map
})()

const NEXT_MAP = Object.fromEntries(FLOW.map((s, i) => [s, FLOW[i + 1]]))

const LOADING_CFG = {
  loading1: {
    spinner: true,
    messages: [
      'Analizando su perfil personal\u2026',
      'Preparando su protocolo especializado\u2026',
    ],
    t1: 1600, t2: 3400, next: 'q6',
  },
  loading2: {
    manual: true, // controlled manually via AudioPlayer onEnded
    next: 'q11',
  },
  loading3: {
    spinner: false,
    t1: 0, t2: 4200, redirect: true,
  },
}

const BLOCK_TAGS = {
  1: { label: 'Conociéndole mejor',       cls: 'tag--blue'   },
  2: { label: 'Sobre su dolor',           cls: 'tag--orange' },
  3: { label: 'Su solución personalizada', cls: 'tag--green'  },
}

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
  const pct = PROGRESS_PCT[step] ?? Math.round((step / total) * 100)
  return (
    <div className="progress-container">
      <p className="progress-label">Pregunta {step} de {total}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Option button ─────────────────────────────────────────────────────────────
function OptionBtn({ label, selected, onClick, variant, img }) {
  return (
    <button
      className={`option-btn${selected ? ' option-btn--selected' : ''}${variant ? ` option-btn--${variant}` : ''}${img ? ' option-btn--img' : ''}`}
      onClick={onClick}
    >
      {img && <img src={img} alt="" className="option-btn-img" aria-hidden="true" />}
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

// ── Back button ───────────────────────────────────────────────────────────────
function BackBtn({ onClick }) {
  return (
    <button className="back-btn" onClick={onClick} aria-label="Volver">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Volver
    </button>
  )
}

// ── Audio Player (Messenger-style) ───────────────────────────────────────────
function AudioPlayer({ src, onEnded }) {
  const audioRef = useRef(null)
  const [playing, setPlaying]     = useState(false)
  const [currentTime, setCurrent] = useState(0)
  const [duration, setDuration]   = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onMeta = () => setDuration(audio.duration)
    const onTime = () => setCurrent(audio.currentTime)
    const onEnd  = () => { setPlaying(false); onEnded?.() }
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  function fmt(t) {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const progress = duration > 0 ? currentTime / duration : 0
  const bars = Array.from({ length: 32 }, (_, i) =>
    10 + Math.abs(Math.sin(i * 0.85) * 11 + Math.cos(i * 0.45) * 7)
  )

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="auto" />
      <button className="audio-play-btn" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="2" width="4" height="12" rx="1.5" fill="white"/>
            <rect x="9" y="2" width="4" height="12" rx="1.5" fill="white"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 2l10 6-10 6V2z" fill="white"/>
          </svg>
        )}
      </button>
      <div className="audio-waveform">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`audio-bar${playing ? ' audio-bar--playing' : ''}`}
            style={{
              height: `${h}px`,
              opacity: i / bars.length <= progress ? 1 : 0.28,
              animationDelay: `${(i % 8) * 0.07}s`,
            }}
          />
        ))}
      </div>
      <span className="audio-time">
        {duration > 0 ? fmt(playing ? currentTime : duration) : '\u2013:--'}
      </span>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]           = useState('intro')
  const [visible, setVisible]         = useState(true)
  const [answers, setAnswers]         = useState({})
  const [loadingStep, setLoadingStep] = useState(0)
  const [showContinue, setShowContinue]   = useState(false)
  const [showContinue2, setShowContinue2] = useState(false)
  const [email, setEmail]             = useState('')
  const [emailError, setEmailError]   = useState('')
  const [activeModal, setActiveModal] = useState(null)

  const goTo = useCallback((next) => {
    setVisible(false)
    setTimeout(() => { setScreen(next); setVisible(true) }, 380)
  }, [])

  // Unified loading effect — skips manual screens (loading2)
  useEffect(() => {
    const cfg = LOADING_CFG[screen]
    if (!cfg || cfg.manual) return
    setLoadingStep(0)
    const t1 = cfg.t1 ? setTimeout(() => setLoadingStep(1), cfg.t1) : null
    const t2 = setTimeout(() => {
      if (cfg.redirect) {
        window.location.href = REDIRECT_URL
      } else {
        setVisible(false)
        setTimeout(() => { setScreen(cfg.next); setVisible(true) }, 380)
      }
    }, cfg.t2)
    return () => { if (t1) clearTimeout(t1); clearTimeout(t2) }
  }, [screen])

  // Reset continue button when entering loading2
  useEffect(() => {
    if (screen !== 'loading2') return
    setShowContinue(false)
    const t = setTimeout(() => setShowContinue(true), 14000)
    return () => clearTimeout(t)
  }, [screen])

  // Reset continue2 button when entering elena2
  useEffect(() => {
    if (screen !== 'elena2') return
    setShowContinue2(false)
    const t = setTimeout(() => setShowContinue2(true), 14000)
    return () => clearTimeout(t)
  }, [screen])

  function handleBack() {
    const prev = BACK_MAP[screen]
    if (prev) goTo(prev)
  }

  function handleAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
    setTimeout(() => goTo(NEXT_MAP[screen]), 280)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor, introduzca un correo electrónico válido.')
      return
    }
    setEmailError('')
    window.location.href = REDIRECT_URL
  }

  const painLabel = PAIN_LABELS[answers.q4] || 'su dolor articular'
  const currentQ  = Q_BY_ID[screen]

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <img src="/logo.png" alt="Programa Movimiento Sin Dolor" className="header-logo-img" />
            <span className="header-logo-text"><strong>Programa Movimiento Sin Dolor</strong></span>
          </div>
          <span className="header-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{flexShrink:0}}>
              <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span>Protegido y anónimo —<br />RGPD</span>
          </span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">
        <div className={`card${visible ? '' : ' card--hidden'}`}>

          {/* ── Intro ── */}
          {screen === 'intro' && (
            <div className="screen">
              <span className="tag tag--blue">Cuestionario Clínico Personalizado</span>
              <h1 className="intro-title">Evaluación de Dolor Articular y Estructural</h1>
              <p className="intro-desc">
                En menos de 3 minutos, nuestro sistema de triaje biomecánico identificará el origen
                de su dolor y le mostrará el protocolo más adecuado para su caso.
              </p>
              <div className="checklist">
                {[
                  'Cuestionario validado clínicamente',
                  'Protocolo 100 % personalizado para su perfil',
                  'Más de 4.800 personas ya han recuperado su movilidad',
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
                ✓ Iniciar Evaluación
              </button>
              <p className="privacy-note">
                Sus datos son tratados conforme al RGPD (UE) 2016/679. No se compartirán con terceros.
              </p>
            </div>
          )}

          {/* ── Generic question render (Q1–Q15) ── */}
          {currentQ && (
            <div className="screen">
              <BackBtn onClick={handleBack} />
              <ProgressBar step={Q_STEP[screen]} total={TOTAL_Q} />
              <h2 className="question-title">{currentQ.title}</h2>
              <div className={currentQ.yesno ? 'options-yesno' : 'options-list'}>
                {currentQ.options.map((opt, i) => (
                  <OptionBtn
                    key={opt}
                    label={opt}
                    selected={false}
                    variant={currentQ.yesno && i === 0 ? 'yes' : undefined}
                    img={currentQ.id === 'q4' ? PAIN_IMAGES[opt] : undefined}
                    onClick={() => handleAnswer(screen, opt)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Loading 1 — after Q5 ── */}
          {screen === 'loading1' && (
            <div className="screen loading-screen">
              <Spinner />
              <p className="loading-text" key={loadingStep}>
                {loadingStep === 0
                  ? 'Analizando su perfil personal\u2026'
                  : 'Preparando su protocolo especializado\u2026'}
              </p>
              {loadingStep === 1 && (
                <div className="loading-notice">
                  ¡Estamos preparando un protocolo especializado para su caso!
                </div>
              )}
            </div>
          )}

          {/* ── Loading 2 — after Q10: audio message ── */}
          {screen === 'loading2' && (
            <div className="screen loading-screen loading-screen--audio">
              <div className="expert-profile">
                <img src="/elena-romero.png" alt="Elena Romero" className="expert-avatar" />
                <div className="expert-info">
                  <p className="expert-name">Elena Romero</p>
                  <p className="expert-bio">Especialista en biomecánica y creadora del Método Movimiento Sin Dolor, con más de 7 años de experiencia en el sector.</p>
                </div>
              </div>
              <p className="audio-prompt">
                Tenemos un mensaje de voz especial para usted:
              </p>
              <AudioPlayer
                src="/audio-quiz.mp3"
                onEnded={() => setShowContinue(true)}
              />
              {showContinue && (
                <button
                  className="cta-btn cta-btn--blue"
                  onClick={() => goTo(LOADING_CFG.loading2.next)}
                >
                  Continuar
                </button>
              )}
            </div>
          )}

          {/* ── Elena 2 — after Q15: second audio message ── */}
          {screen === 'elena2' && (
            <div className="screen loading-screen loading-screen--audio">
              <div className="expert-profile">
                <img src="/elena-romero.png" alt="Elena Romero" className="expert-avatar" />
                <div className="expert-info">
                  <p className="expert-name">Elena Romero</p>
                  <p className="expert-bio">Especialista en biomecánica y creadora del Método Movimiento Sin Dolor, con más de 7 años de experiencia en el sector.</p>
                </div>
              </div>
              <p className="audio-prompt">
                Elena tiene un mensaje especial para usted:
              </p>
              <AudioPlayer
                src="/audio2-elena.mp3"
                onEnded={() => setShowContinue2(true)}
              />
              {showContinue2 && (
                <button
                  className="cta-btn cta-btn--blue"
                  onClick={() => goTo('loading3')}
                >
                  Continuar
                </button>
              )}
            </div>
          )}

          {/* ── Loading 3 — after Q15: final success message ── */}
          {screen === 'loading3' && (
            <div className="screen loading-screen">
              <div className="success-box">
                <div className="success-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="success-text">
                  <strong>¡Su programa personalizado está casi listo!</strong>
                  En la página siguiente le mostraremos exactamente cómo funciona el Programa Movimiento Sin Dolor y cómo puede comenzar hoy mismo.
                </p>
              </div>
            </div>
          )}

          {/* ── Lead capture ── */}
          {screen === 'lead' && (
            <div className="screen">
              <BackBtn onClick={handleBack} />
              <span className="tag tag--green">Su protocolo clínico está listo</span>
              <h2 className="lead-title">Protocolo Clínico de 8 Semanas</h2>
              <p className="lead-desc">
                Hemos encontrado la solución conservadora exacta para aliviar{' '}
                <strong>{painLabel}</strong>. Introduzca su correo electrónico
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
        <div className="footer-cred">
          <p className="footer-cred-label">Avalado por</p>
          <div className="footer-cred-images">
            {[1,2,3,4,5].map((n) => (
              <img
                key={n}
                src={`/cred-${n}.png`}
                alt={`Credencial ${n}`}
                className="footer-cred-img"
              />
            ))}
          </div>
        </div>
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
        <p className="footer-legal-note">Empresa Ejemplo S.L. · NIF B12345678. Cumplimos la normativa española y europea de protección de datos, consumo y comercio electrónico.</p>
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
