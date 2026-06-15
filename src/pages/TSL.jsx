import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import '../TSL.css'

const CHECKOUT_URL = 'https://pay.hotmart.com/X106313372V?checkoutMode=10'

// ── Shared header / footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="tsl-footer">
      <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:'16px', marginBottom:'20px'}}>
        {[1,2,3,4,5].map((n) => (
          <img key={n} src={`/cred-${n}.webp`} alt={`Credencial ${n}`} style={{height:'48px', objectFit:'contain', opacity:0.85, borderRadius:'8px'}} />
        ))}
      </div>
      <p>© {new Date().getFullYear()} Programa Movimiento Sin Dolor · Todos los derechos reservados</p>
      <p>Empresa Movimiento Sin Dolor S.L. · NIF B12345678. Los resultados pueden variar. Este programa no sustituye el consejo médico profesional.</p>
    </footer>
  )
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onMeta = () => setDuration(audio.duration)
    const onTime = () => setCurrent(audio.currentTime)
    const onEnd  = () => setPlaying(false)
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
      <audio ref={audioRef} src={src} preload="none" />
      <button className="audio-play-btn" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="2" width="4" height="12" rx="1.5" fill="white"/>
            <rect x="9" y="2" width="4" height="12" rx="1.5" fill="white"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

function TSLAudioPlayer() {
  return (
    <>
      <div style={{margin:'24px 0', padding:'16px 20px', background:'#f0f4ff', borderRadius:'12px', border:'1px solid #d0daf5'}}>
        <p style={{margin:'0 0 10px', fontWeight:'600', fontSize:'15px', color:'#0066CC'}}>🎧 Escuche el mensaje de Elena Romero:</p>
        <AudioPlayer src="/tsl-audio.mp3" />
      </div>
      <p style={{textAlign:'center', fontWeight:'700', fontSize:'17px', color:'#0066CC', margin:'16px 0 8px'}}>Lea atentamente el texto que aparece a continuación</p>
    </>
  )
}

function CTAButton() {
  return (
    <a href={CHECKOUT_URL} className="tsl-cta">
      Quiero Recuperar mi Movilidad Ahora
    </a>
  )
}

function ImgSlot({ label }) {
  return (
    <div className="tsl-img-slot">
      <span className="tsl-img-slot-label">[ {label} ]</span>
    </div>
  )
}

const TESTIMONIALS = [
  {
    img: '/marta.webp',
    quote: '"Pensé que el dolor era parte de la vejez. Tras una semana con el método, la rigidez desapareció. ¡Es increíble volver a girar la cabeza sin miedo!"',
    name: '— Marta R., 58 años',
  },
  {
    img: '/carlos.webp',
    quote: '"Esos 7 minutos son mi momento sagrado. Recuperé la movilidad y, lo más importante, volví a jugar con mis nietos sin miedo a marearme o sentir ese bloqueo constante."',
    name: '— Carlos T., 72 años',
  },
  {
    img: '/elena.webp',
    quote: '"Llevaba años con molestias y en solo 14 días todo cambió. Es simple, es efectivo y realmente funciona. Ojalá lo hubiera conocido antes."',
    name: '— Elena G., 51 años',
  },
]

function TestimonialsBlock() {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:'24px', margin:'24px 0'}}>
      {TESTIMONIALS.map((t) => (
        <div key={t.name} style={{display:'flex', alignItems:'flex-start', gap:'20px', background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
          {t.img
            ? <img src={t.img} alt={t.name} style={{flexShrink:0, width:'72px', height:'72px', borderRadius:'50%', objectFit:'cover'}} />
            : <div style={{flexShrink:0, width:'72px', height:'72px', borderRadius:'50%', background:t.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'800', color:'#fff'}}>{t.initials}</div>
          }
          <div>
            <p style={{margin:'0 0 8px', fontWeight:'700', fontSize:'17px', lineHeight:'1.5', color:'#1a1a2e'}}>{t.quote}</p>
            <p style={{margin:0, fontWeight:'600', fontSize:'15px', color:'#0066CC'}}>{t.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function PricingBlock() {
  return (
    <section className="tsl-block">
      <h2 className="tsl-block-title">¿Cuánto costaría realmente recuperar su bienestar?</h2>
      <p className="tsl-block-text">Si analizamos lo que le cuesta tratar su dolor hoy, la cifra es alarmante:</p>
      <ul className="tsl-checklist tsl-checklist--costs">
        <li>Sesiones de fisioterapia: Una sola sesión privada puede costar entre 70€ y 100€.</li>
        <li>Medicamentos y analgésicos: A largo plazo, el gasto mensual es significativo y solo enmascaran el problema.</li>
        <li>Consultas especializadas: Largas listas de espera y un coste elevado por diagnóstico.</li>
      </ul>
      <p className="tsl-block-text">Si usted decidiera contratar a un especialista en biomecánica para que le guíe personalmente durante un mes, tendría que invertir cientos de euros.</p>
      <p className="tsl-block-text">Pero mi objetivo con "Movimiento Sin Dolor" no es ese.</p>
      <p className="tsl-block-text">Originalmente, el acceso al programa completo tenía un precio de <strong>47€</strong>, una cifra que ya representa una pequeña fracción de lo que usted gastaría en un tratamiento convencional. Sin embargo, mi misión es que la accesibilidad no sea un impedimento para que usted recupere su libertad.</p>
      <p className="tsl-block-text">Por eso, he tomado una decisión personal: no quiero que usted pague los 47€ habituales.</p>
      <p className="tsl-block-text" style={{textAlign:'center', fontSize:'22px', fontWeight:'800', color:'var(--tsl-navy)', margin:'24px 0'}}>
        Hoy, usted obtendrá acceso vitalicio a todo el sistema, ejercicios guiados y actualizaciones, por una inversión única de solo <span style={{color:'var(--tsl-green)'}}>27€</span>.
      </p>
      <p className="tsl-block-text">Usted no está pagando por un curso, está invirtiendo en su libertad de movimiento definitiva por menos de lo que cuesta una sola sesión de fisioterapia.</p>
    </section>
  )
}

// ── CERVICAL ─────────────────────────────────────────────────────────────────
function CervicalPage() {
  return (
    <div className="tsl-page">
      {/* Hero */}
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">¡Su análisis de movilidad está listo!</h1>
        <p className="tsl-hero-sub">He revisado su caso y tengo conclusiones que le devolverán la esperanza.</p>
      </section>

      {/* Bloco 1 — Diagnóstico */}
      <section className="tsl-block">
        <TSLAudioPlayer />
        <img src="/cervical-comparativo.webp" alt="Comparativo dolor cervical vs. alivio" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">He revisado su caso cervical personalmente y tengo conclusiones que le devolverán la esperanza. Lo que siente no es irreversible; he identificado el punto exacto donde su cuerpo está bloqueado. Es la clave que nadie le había mencionado hasta hoy y que cambia todo lo que pensaba sobre su dolor.</p>
        <p className="tsl-block-text">Hola, soy Elena Romero, especialista en biomecánica y creadora de Movimiento Sin Dolor. He dedicado mi carrera a descifrar por qué el cuerpo se "apaga". Tras analizar sus respuestas sobre esa tensión constante en su cuello, tengo una buena noticia: su estructura no está desgastada, está simplemente bloqueada.</p>
        <img src="/elenaromero.webp" alt="Elena Romero" loading="lazy" style={{display:'block', width:'180px', borderRadius:'50%', border:'4px solid #0066CC', margin:'20px auto'}} />
        <p className="tsl-block-text">Usted probablemente siente esa carga pesada sobre los hombros, como si llevara una mochila invisible, o ese bloqueo que le impide girar la cabeza con libertad. Muchos le dirán que es "solo estrés" o "cosas de la edad", pero mi diagnóstico es otro: es una compresión mecánica. Sus vértebras están atrapadas por una dinámica postural acumulada, no por una lesión definitiva.</p>
      </section>

      {/* Bloco 2 — Solução mecânica */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Si el problema es mecánico, la solución también lo es</h2>
        <p className="tsl-block-text">No necesita medicamentos que solo entorpecen sus sentidos; necesita devolverle a su cuello el espacio articular que ha perdido.</p>
        <p className="tsl-block-text">Sé que ha probado pomadas o fisioterapia que ofrecen un alivio pasajero. El sistema tradicional trata el síntoma; yo ataco la causa.</p>
        <p className="tsl-block-text">Mi método se basa en la reeducación biomecánica. No le pediré que vaya al gimnasio ni que levante pesas. Es una rutina innegociable de solo <strong>7 minutos diarios</strong> de "ajuste articular".</p>
        <img src="/cervical-vertebras.webp" alt="Engranaje recuperando espacio entre vértebras" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Imagínelo como un engranaje oxidado: el movimiento suave y constante recupera el espacio perdido. Desde su silla, sin complicaciones y usando solo su peso corporal, usted desbloquea su estructura. Es ciencia aplicada, no magia.</p>
      </section>

      {/* Bloco 3 — App e objeção */}
      <section className="tsl-block">
        <h2 className="tsl-block-title" style={{fontSize:'18px'}}>Por eso creé el programa Movimiento sin Dolor: una rutina de estiramientos de 7 minutos que cualquier persona puede realizar.</h2>
        <img src="/app-preview.webp" alt="Así es Movimiento Sin Dolor por dentro" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Este programa es una aplicación que puede utilizarse fácilmente tanto en el teléfono móvil como en el ordenador portátil, de forma sencilla e intuitiva, y ya ha ayudado a más de 2.000 personas a mejorar su calidad de vida mediante sencillos ejercicios de estiramiento.</p>
        <p className="tsl-block-text">¿Teme que estirar le cause más dolor o cree que el programa no es para usted porque nunca lo ha hecho? Ese es un error común. La inmovilidad es su peor enemiga: si no moviliza, su cuerpo se "oxida" y la compresión aumenta.</p>
        <p className="tsl-block-text">Mi programa está diseñado precisamente para personas que conviven con dolor severo y nunca han estirado. Nuestra aplicación es intuitiva, clara y segura. No necesita dominar la tecnología ni ser un atleta; el protocolo se adapta a su nivel actual, descomprimiendo suavemente.</p>
        <p className="tsl-block-text"><strong>Si no actúa, el bloqueo empeora.</strong> El movimiento es la medicina que su cuerpo necesita.</p>
      </section>

      <PricingBlock />

      {/* Bloco 4 — Fechamento e prova social */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Tiene dos caminos</h2>
        <p className="tsl-block-text">El del <strong>abandono</strong>, ignorando la causa y dependiendo de pastillas hasta perder su movilidad; o el de la <strong>preservación</strong>, dedicando 7 minutos al día para recuperar su autonomía.</p>
        <p className="tsl-block-text">Quiero que se sienta seguro. Por eso le ofrezco una <strong>garantía de 14 días</strong>. Si en dos semanas de práctica diaria no siente una mejoría clara en su movilidad, le devuelvo el 100% de su dinero. Sin preguntas, sin trabas.</p>
        <p className="tsl-block-text">No lo digo solo yo. Mire lo que dicen personas que, como usted, ya tomaron la decisión:</p>

        <div className="tsl-testimonials-grid tsl-testimonials-grid--images">
          <TestimonialsBlock />
        </div>

        <p className="tsl-block-text">¿Se identifica con ellos? No deje para mañana la movilidad que puede recuperar hoy.</p>


        <ul className="tsl-checklist">
          <li>✓ Acceso de por vida (Sin cuotas mensuales)</li>
          <li>✓ Compra 100% segura y privada</li>
          <li>✓ Acceso inmediato por correo electrónico</li>
          <li>✓ Para hombres y mujeres</li>
          <li>✓ Garantía de satisfacción total (14 días)</li>
        </ul>

      </section>

      <div className="tsl-cta-wrap" style={{padding:'40px 24px'}}>
        <CTAButton />
      </div>

      <Footer />
    </div>
  )
}

// ── GENERIC (Lorem Ipsum para os outros slugs) ─────────────────────────────
const HERO_CONTENT = {
  rodilla:   { title: '¿El dolor de rodilla le impide caminar, subir escaleras o dormir tranquilo?',    sub: 'Descubra cómo miles de personas mayores de 55 años han recuperado su movilidad sin cirugía ni medicación.' },
  lumbar:    { title: '¿El dolor lumbar o la ciática no le deja vivir con normalidad?',                  sub: 'Conozca el método natural que está ayudando a miles de personas a eliminar el dolor de espalda de forma definitiva.' },
  caderas:   { title: '¿El dolor de cadera limita cada uno de sus movimientos cotidianos?',              sub: 'El protocolo biomecánico que está transformando la vida de personas que pensaban que ya no tenían solución.' },
  bienestar: { title: '¿El dolor articular le impide disfrutar de la vida que merece?',                 sub: 'Descubra el método natural que está ayudando a miles de personas a moverse sin dolor y recuperar su libertad.' },
}

const GENERIC_BLOCKS = [
  { label: 'Por qué su dolor no desaparece solo',       hasImage: true  },
  { label: 'El método que cambia todo',                  hasImage: true  },
  { label: 'Lo que conseguirá en 8 semanas',             hasImage: true  },
  { label: 'Sin cirugía. Sin medicación. Sin riesgo.',   hasImage: false },
]

function GenericPage({ slug }) {
  const hero = HERO_CONTENT[slug] || HERO_CONTENT.bienestar
  return (
    <div className="tsl-page">
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">{hero.title}</h1>
        <p className="tsl-hero-sub">{hero.sub}</p>
        <CTAButton />
      </section>
      {GENERIC_BLOCKS.map((block, i) => (
        <section key={i} className={`tsl-block${i % 2 !== 0 ? ' tsl-block--alt' : ''}`}>
          <h2 className="tsl-block-title">{block.label}</h2>
          <p className="tsl-block-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p className="tsl-block-text">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
          {block.hasImage && <ImgSlot label="Inserir imagem aqui" />}
          <div className="tsl-cta-wrap"><CTAButton /></div>
        </section>
      ))}
      <section className="tsl-final-cta">
        <h2 className="tsl-final-title">Su protocolo personalizado está listo</h2>
        <p className="tsl-final-sub">Acceda hoy y empiece a moverse sin dolor en las próximas semanas.</p>
        <CTAButton />
        <p className="tsl-guarantee">Garantía de 14 días · Sin compromisos · Acceso inmediato</p>
      </section>
      <div className="tsl-cta-wrap" style={{padding:'40px 24px'}}>
        <CTAButton />
      </div>

      <Footer />
    </div>
  )
}

// ── LUMBAR ───────────────────────────────────────────────────────────────────
function LumbarPage() {
  return (
    <div className="tsl-page">
      {/* Hero */}
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">¡Su análisis de movilidad está listo!</h1>
        <p className="tsl-hero-sub">He revisado su caso y tengo conclusiones que le devolverán la esperanza.</p>
      </section>

      {/* Bloco 1 — Diagnóstico */}
      <section className="tsl-block">
        <TSLAudioPlayer />
        <img src="/lumbar-vertebras.webp" alt="Vértebras descomprimiéndose" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">He revisado su caso lumbar personalmente y tengo conclusiones que le devolverán la esperanza. Lo que siente no es irreversible; he identificado el punto exacto donde su cuerpo está bloqueado. Es la clave que nadie le había mencionado hasta hoy y que cambia todo lo que pensaba sobre su dolor.</p>
        <p className="tsl-block-text">Hola, soy Elena Romero, especialista en biomecánica y creadora de Movimiento Sin Dolor. He dedicado mi carrera a descifrar por qué el cuerpo se "apaga". Tras analizar sus respuestas sobre ese pinchazo en la espalda y el corrientazo hacia sus piernas, tengo una buena noticia: su estructura no está desgastada, está simplemente bloqueada.</p>
        <img src="/elenaromero.webp" alt="Elena Romero" loading="lazy" style={{display:'block', width:'180px', borderRadius:'50%', border:'4px solid #0066CC', margin:'20px auto'}} />
        <p className="tsl-block-text">Usted probablemente siente ese pinchazo sordo al agacharse, o ese dolor que le recorre desde la cintura hasta la pierna al intentar levantarse de la silla. Muchos le dirán que es "solo la edad" o "un nervio que no tiene cura", pero mi diagnóstico es otro: es una compresión mecánica. Sus vértebras lumbares están atrapadas por la gravedad y los años, pellizcando sus nervios.</p>
      </section>

      {/* Bloco 2 — Solução mecânica */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Si el problema es mecánico, la solución también lo es</h2>
        <p className="tsl-block-text">No necesita medicamentos que solo enfrían la piel o dañan su estómago; necesita devolverle a sus vértebras el espacio articular que han perdido.</p>
        <p className="tsl-block-text">Sé que ha probado fisioterapia o masajes que ofrecen un alivio pasajero. El sistema tradicional trata el síntoma; yo ataco la causa.</p>
        <p className="tsl-block-text">Mi método se basa en la reeducación biomecánica. No le pediré que vaya al gimnasio ni que haga movimientos peligrosos. Es una rutina innegociable de solo <strong>7 minutos diarios</strong> de "ajuste articular".</p>
        <img src="/lumbar-comparativo.webp" alt="Comparativo lumbar" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Imagínelo como un engranaje oxidado: el movimiento suave y constante recupera el espacio perdido. Desde su silla, sin complicaciones y usando solo su peso corporal, usted libera el nervio ciático y desbloquea su estructura. Es ciencia aplicada, no magia.</p>
      </section>

      {/* Bloco 3 — App e objeção */}
      <section className="tsl-block">
        <h2 className="tsl-block-title" style={{fontSize:'18px'}}>Por eso creé el programa Movimiento sin Dolor: una rutina de estiramientos de 7 minutos que cualquier persona puede realizar.</h2>
        <img src="/app-preview.webp" alt="Así es Movimiento Sin Dolor por dentro" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Este programa es una aplicación que puede utilizarse fácilmente tanto en el teléfono móvil como en el ordenador portátil, de forma sencilla e intuitiva, y ya ha ayudado a más de 2.000 personas a mejorar su calidad de vida mediante sencillos ejercicios de estiramiento.</p>
        <p className="tsl-block-text">¿Teme que estirar le cause más dolor o cree que el programa no es para usted porque siente un dolor muy fuerte? Ese es un error común. La inmovilidad es su peor enemiga: si no moviliza, su cuerpo se "oxida" y la compresión aumenta.</p>
        <p className="tsl-block-text">Mi programa está diseñado precisamente para personas que conviven con dolor lumbar severo y nunca han estirado. Nuestra aplicación es intuitiva, clara y segura. No necesita dominar la tecnología ni ser un atleta; el protocolo se adapta a su nivel actual, descomprimiendo suavemente.</p>
        <p className="tsl-block-text"><strong>Si no actúa, el bloqueo empeora.</strong> El movimiento es la medicina que su cuerpo necesita.</p>
      </section>

      <PricingBlock />

      {/* Bloco 4 — Fechamento e prova social */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Tiene dos caminos</h2>
        <p className="tsl-block-text">El del <strong>abandono</strong>, ignorando la causa y dependiendo de analgésicos hasta perder su autonomía; o el de la <strong>preservación</strong>, dedicando 7 minutos al día para recuperar su libertad.</p>
        <p className="tsl-block-text">Quiero que se sienta seguro. Por eso le ofrezco una <strong>garantía de 14 días</strong>. Si en dos semanas de práctica diaria no siente una mejoría clara en su movilidad, le devuelvo el 100% de su dinero. Sin preguntas, sin trabas.</p>
        <p className="tsl-block-text">No lo digo solo yo. Mire lo que dicen personas que, como usted, ya tomaron la decisión:</p>

        <div className="tsl-testimonials-grid tsl-testimonials-grid--images">
          <TestimonialsBlock />
        </div>

        <p className="tsl-block-text">¿Se identifica con ellos? No deje para mañana la movilidad que puede recuperar hoy.</p>


        <ul className="tsl-checklist">
          <li>✓ Acceso de por vida (Sin cuotas mensuales)</li>
          <li>✓ Compra 100% segura y privada</li>
          <li>✓ Acceso inmediato por correo electrónico</li>
          <li>✓ Para hombres y mujeres</li>
          <li>✓ Garantía de satisfacción total (14 días)</li>
        </ul>

        <p className="tsl-block-text" style={{textAlign:'center', fontWeight:'700', marginTop:'24px'}}>Haga clic en el botón de abajo y comencemos hoy mismo.</p>
      </section>

      <div className="tsl-cta-wrap" style={{padding:'40px 24px'}}>
        <CTAButton />
      </div>

      <Footer />
    </div>
  )
}

// ── RODILLA ──────────────────────────────────────────────────────────────────
function RodillaPage() {
  return (
    <div className="tsl-page">
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">¡Su análisis de movilidad está listo!</h1>
        <p className="tsl-hero-sub">He revisado su caso y tengo conclusiones que le devolverán la esperanza.</p>
      </section>

      {/* Bloco 1 */}
      <section className="tsl-block">
        <TSLAudioPlayer />
        <img src="/rodilla1.webp" alt="Comparativo visual rodilla" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">He revisado su caso de rodilla personalmente y tengo conclusiones que le devolverán la esperanza. Lo que siente no es irreversible; he identificado el punto exacto donde su cuerpo está bloqueado. Es la clave que nadie le había mencionado hasta hoy y que cambia todo lo que pensaba sobre su dolor.</p>
        <p className="tsl-block-text">Hola, soy Elena Romero, especialista en biomecánica y creadora de Movimiento Sin Dolor. He dedicado mi carrera a descifrar por qué el cuerpo se "apaga". Tras analizar sus respuestas sobre esa rigidez y dolor al dar cada paso, tengo una buena noticia: su rodilla no está simplemente "gastada", está bloqueada.</p>
        <img src="/elenaromero.webp" alt="Elena Romero" loading="lazy" style={{display:'block', width:'180px', borderRadius:'50%', border:'4px solid #0066CC', margin:'20px auto'}} />
        <p className="tsl-block-text">Usted probablemente siente ese dolor al subir o bajar escaleras, o la sensación de que su rodilla "falla" o le impide caminar con normalidad. Muchos le dirán que es "artrosis" o "desgaste de la edad", pero mi diagnóstico es otro: es una disfunción mecánica. Sus articulaciones están sufriendo por una compensación acumulada, no por una lesión definitiva.</p>
      </section>

      {/* Bloco 2 */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Si el problema es mecánico, la solución también lo es</h2>
        <p className="tsl-block-text">No necesita infiltraciones que solo enmascaran el dolor; necesita devolverle a su articulación el espacio y la estabilidad que ha perdido.</p>
        <p className="tsl-block-text">Sé que ha evitado el ejercicio por miedo a "forzar" la rodilla. El sistema tradicional trata el síntoma; yo ataco la causa.</p>
        <p className="tsl-block-text">Mi método se basa en la reeducación biomecánica. No le pediré que corra, ni que salte, ni que haga movimientos bruscos. Es una rutina innegociable de solo <strong>7 minutos diarios</strong> de "ajuste articular".</p>
        <img src="/rodilla-articulacion.webp" alt="Articulación recuperando su fluidez y espacio natural" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Imagínelo como un engranaje oxidado: el movimiento suave y constante recupera la lubricación natural. Desde su silla, sin complicaciones y usando solo su peso corporal, usted desbloquea la rodilla y recupera la firmeza. Es ciencia aplicada, no magia.</p>
      </section>

      {/* Bloco 3 */}
      <section className="tsl-block">
        <h2 className="tsl-block-title" style={{fontSize:'18px'}}>Por eso creé el programa Movimiento sin Dolor: una rutina de estiramientos de 7 minutos que cualquier persona puede realizar.</h2>
        <img src="/app-preview.webp" alt="Así es Movimiento Sin Dolor por dentro" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Este programa es una aplicación que puede utilizarse fácilmente tanto en el teléfono móvil como en el ordenador portátil, de forma sencilla e intuitiva, y ya ha ayudado a más de 2.000 personas a mejorar su calidad de vida mediante sencillos ejercicios de estiramiento.</p>
        <p className="tsl-block-text">¿Teme que mover la rodilla le cause más daño o cree que el programa no es para usted porque le cuesta incluso levantarse? Ese es un error común. La inmovilidad es su peor enemiga: si no moviliza, el tejido se vuelve rígido y la compresión aumenta.</p>
        <p className="tsl-block-text">Mi programa está diseñado precisamente para personas que conviven con dolor articular severo. Nuestra aplicación es intuitiva, clara y segura. No necesita dominar la tecnología ni ser un atleta; el protocolo se adapta a su nivel actual, movilizando la rodilla sin impacto.</p>
        <p className="tsl-block-text"><strong>Si no actúa, la rigidez empeora.</strong> El movimiento controlado es la mejor medicina para su rodilla.</p>
      </section>

      <PricingBlock />

      {/* Bloco 4 */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Tiene dos caminos</h2>
        <p className="tsl-block-text">El del <strong>abandono</strong>, aceptando una movilidad cada vez más reducida y dependiendo de ayudas para caminar; o el de la <strong>preservación</strong>, dedicando 7 minutos al día para recuperar su autonomía.</p>
        <p className="tsl-block-text">Quiero que se sienta seguro. Por eso le ofrezco una <strong>garantía de 14 días</strong>. Si en dos semanas de práctica diaria no siente una mejoría clara en su movilidad, le devuelvo el 100% de su dinero. Sin preguntas, sin trabas.</p>
        <p className="tsl-block-text">No lo digo solo yo. Mire lo que dicen personas que, como usted, ya tomaron la decisión:</p>
        <div className="tsl-testimonials-grid tsl-testimonials-grid--images">
          <TestimonialsBlock />
        </div>
        <p className="tsl-block-text">¿Se identifica con ellos? No deje para mañana la movilidad que puede recuperar hoy.</p>
        <ul className="tsl-checklist">
          <li>✓ Acceso de por vida (Sin cuotas mensuales)</li>
          <li>✓ Compra 100% segura y privada</li>
          <li>✓ Acceso inmediato por correo electrónico</li>
          <li>✓ Para hombres y mujeres</li>
          <li>✓ Garantía de satisfacción total (14 días)</li>
        </ul>
        <p className="tsl-block-text" style={{textAlign:'center', fontWeight:'700', marginTop:'24px'}}>Haga clic en el botón de abajo y comencemos hoy mismo.</p>
      </section>

      <div className="tsl-cta-wrap" style={{padding:'40px 24px'}}>
        <CTAButton />
      </div>

      <Footer />
    </div>
  )
}

// ── CADERAS ──────────────────────────────────────────────────────────────────
function CaderasPage() {
  return (
    <div className="tsl-page">
      {/* Hero */}
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">¡Su análisis de movilidad está listo!</h1>
        <p className="tsl-hero-sub">He revisado su caso y tengo conclusiones que le devolverán la esperanza.</p>
      </section>

      {/* Bloco 1 — Diagnóstico */}
      <section className="tsl-block">
        <TSLAudioPlayer />
        <img src="/caderas-comparativo.webp" alt="Comparativo cadera" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">He revisado su caso de cadera personalmente y tengo conclusiones que le devolverán la esperanza. Lo que siente no es irreversible; he identificado el punto exacto donde su cuerpo está bloqueado. Es la clave que nadie le había mencionado hasta hoy y que cambia todo lo que pensaba sobre su dolor.</p>
        <p className="tsl-block-text">Hola, soy Elena Romero, especialista en biomecánica y creadora de Movimiento Sin Dolor. He dedicado mi carrera a descifrar por qué el cuerpo se "apaga". Tras analizar sus respuestas sobre esa rigidez y el dolor en la cadera al caminar o al levantarse, tengo una buena noticia: su articulación no está simplemente "desgastada", está bloqueada por una compensación mecánica acumulada.</p>
        <img src="/elenaromero.webp" alt="Elena Romero" loading="lazy" style={{display:'block', width:'180px', borderRadius:'50%', border:'4px solid #0066CC', margin:'20px auto'}} />
        <p className="tsl-block-text">Usted probablemente siente ese dolor profundo al intentar cruzar las piernas, o esa sensación de que la cadera "se traba" al levantarse de la silla o al salir del coche. Muchos le dirán que es "artrosis" o "desgaste irreversible de la edad", pero mi diagnóstico es otro: es una compresión articular. Su cadera está sufriendo por una cadena de compensaciones que su cuerpo ha acumulado durante años, no por una lesión definitiva.</p>
      </section>

      {/* Bloco 2 — Solução mecânica */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Si el problema es mecánico, la solución también lo es</h2>
        <p className="tsl-block-text">No necesita infiltraciones que solo alivian temporalmente ni cirugías de alto riesgo; necesita devolverle a su articulación el espacio y la movilidad que ha perdido.</p>
        <p className="tsl-block-text">Sé que ha evitado moverse por miedo a "dañar más" la cadera. El sistema tradicional trata el síntoma; yo ataco la causa.</p>
        <p className="tsl-block-text">Mi método se basa en la reeducación biomecánica. No le pediré que corra, ni que haga sentadillas, ni que soporte impactos. Es una rutina innegociable de solo <strong>7 minutos diarios</strong> de "ajuste articular".</p>
        <img src="/caderas-articulacion.webp" alt="Articulación de cadera recuperando movilidad" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Imagínelo como un engranaje oxidado: el movimiento suave y constante recupera el espacio perdido y la lubricación natural. Desde su silla, sin complicaciones y usando solo su peso corporal, usted desbloquea la cadera y recupera la autonomía. Es ciencia aplicada, no magia.</p>
      </section>

      {/* Bloco 3 — App e objeção */}
      <section className="tsl-block">
        <h2 className="tsl-block-title" style={{fontSize:'18px'}}>Por eso creé el programa Movimiento sin Dolor: una rutina de estiramientos de 7 minutos que cualquier persona puede realizar.</h2>
        <img src="/app-preview.webp" alt="Así es Movimiento Sin Dolor por dentro" loading="lazy" style={{width:'100%', borderRadius:'12px', margin:'24px 0'}} />
        <p className="tsl-block-text">Este programa es una aplicación que puede utilizarse fácilmente tanto en el teléfono móvil como en el ordenador portátil, de forma sencilla e intuitiva, y ya ha ayudado a más de 2.000 personas a mejorar su calidad de vida mediante sencillos ejercicios de estiramiento.</p>
        <p className="tsl-block-text">¿Teme que moverse le cause más daño o cree que el programa no es para usted porque le cuesta hasta ponerse los zapatos? Ese es un error común. La inmovilidad es su peor enemiga: si no moviliza, el tejido se endurece y la compresión aumenta.</p>
        <p className="tsl-block-text">Mi programa está diseñado precisamente para personas que conviven con dolor de cadera severo. Nuestra aplicación es intuitiva, clara y segura. No necesita dominar la tecnología ni ser un atleta; el protocolo se adapta a su nivel actual, movilizando la cadera de forma progresiva y sin impacto.</p>
        <p className="tsl-block-text"><strong>Si no actúa, la rigidez empeora.</strong> El movimiento controlado es la mejor medicina para su cadera.</p>
      </section>

      <PricingBlock />

      {/* Bloco 4 — Fechamento e prova social */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Tiene dos caminos</h2>
        <p className="tsl-block-text">El del <strong>abandono</strong>, aceptando una movilidad cada vez más reducida y dependiendo de ayudas para caminar; o el de la <strong>preservación</strong>, dedicando 7 minutos al día para recuperar su independencia.</p>
        <p className="tsl-block-text">Quiero que se sienta seguro. Por eso le ofrezco una <strong>garantía de 14 días</strong>. Si en dos semanas de práctica diaria no siente una mejoría clara en su movilidad, le devuelvo el 100% de su dinero. Sin preguntas, sin trabas.</p>
        <p className="tsl-block-text">No lo digo solo yo. Mire lo que dicen personas que, como usted, ya tomaron la decisión:</p>

        <div className="tsl-testimonials-grid tsl-testimonials-grid--images">
          <TestimonialsBlock />
        </div>

        <p className="tsl-block-text">¿Se identifica con ellos? No deje para mañana la movilidad que puede recuperar hoy.</p>


        <ul className="tsl-checklist">
          <li>✓ Acceso de por vida (Sin cuotas mensuales)</li>
          <li>✓ Compra 100% segura y privada</li>
          <li>✓ Acceso inmediato por correo electrónico</li>
          <li>✓ Para hombres y mujeres</li>
          <li>✓ Garantía de satisfacción total (14 días)</li>
        </ul>

        <p className="tsl-block-text" style={{textAlign:'center', fontWeight:'700', marginTop:'24px'}}>Haga clic en el botón de abajo y comencemos hoy mismo.</p>
      </section>

      <div className="tsl-cta-wrap" style={{padding:'40px 24px'}}>
        <CTAButton />
      </div>

      <Footer />
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function TSL() {
  const { slug } = useParams()
  if (slug === 'cervical')  return <CervicalPage />
  if (slug === 'lumbar')    return <LumbarPage />
  if (slug === 'rodilla')   return <RodillaPage />
  if (slug === 'caderas')   return <CaderasPage />
  return <GenericPage slug={slug} />
}
