import { useParams } from 'react-router-dom'
import '../TSL.css'

const CHECKOUT_URL = 'https://pay.hotmart.com/X106313372V?checkoutMode=10'

// ── Shared header / footer ────────────────────────────────────────────────────
function Header() {
  return (
    <header className="tsl-header">
      <img src="/logo.png" alt="Programa Movimiento Sin Dolor" className="tsl-logo" />
    </header>
  )
}

function Footer() {
  return (
    <footer className="tsl-footer">
      <p>© {new Date().getFullYear()} Programa Movimiento Sin Dolor · Todos los derechos reservados</p>
      <p>Empresa Ejemplo S.L. · NIF B12345678. Los resultados pueden variar. Este programa no sustituye el consejo médico profesional.</p>
    </footer>
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

// ── CERVICAL ─────────────────────────────────────────────────────────────────
function CervicalPage() {
  return (
    <div className="tsl-page">
      <Header />

      {/* Hero */}
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">¡Su análisis de movilidad está listo!</h1>
        <p className="tsl-hero-sub">He revisado su caso y tengo conclusiones que le devolverán la esperanza.</p>
        <CTAButton />
      </section>

      {/* Bloco 1 — Diagnóstico */}
      <section className="tsl-block">
        <ImgSlot label="image_a78ac2.png — comparación visual dolor vs. alivio" />
        <p className="tsl-block-text">He revisado su caso cervical personalmente y tengo conclusiones que le devolverán la esperanza. Lo que siente no es irreversible; he identificado el punto exacto donde su cuerpo está bloqueado. Es la clave que nadie le había mencionado hasta hoy y que cambia todo lo que pensaba sobre su dolor.</p>
        <p className="tsl-block-text">Hola, soy Elena Romero, especialista en biomecánica y creadora de Movimiento Sin Dolor. He dedicado mi carrera a descifrar por qué el cuerpo se "apaga". Tras analizar sus respuestas sobre esa tensión constante en su cuello, tengo una buena noticia: su estructura no está desgastada, está simplemente bloqueada.</p>
        <p className="tsl-block-text">Usted probablemente siente esa carga pesada sobre los hombros, como si llevara una mochila invisible, o ese bloqueo que le impide girar la cabeza con libertad. Muchos le dirán que es "solo estrés" o "cosas de la edad", pero mi diagnóstico es otro: es una compresión mecánica. Sus vértebras están atrapadas por una dinámica postural acumulada, no por una lesión definitiva.</p>
        <div className="tsl-cta-wrap"><CTAButton /></div>
      </section>

      {/* Bloco 2 — Solução mecânica */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Si el problema es mecánico, la solución también lo es</h2>
        <p className="tsl-block-text">No necesita medicamentos que solo entorpecen sus sentidos; necesita devolverle a su cuello el espacio articular que ha perdido.</p>
        <p className="tsl-block-text">Sé que ha probado pomadas o fisioterapia que ofrecen un alivio pasajero. El sistema tradicional trata el síntoma; yo ataco la causa.</p>
        <p className="tsl-block-text">Mi método se basa en la reeducación biomecánica. No le pediré que vaya al gimnasio ni que levante pesas. Es una rutina innegociable de solo <strong>7 minutos diarios</strong> de "ajuste articular".</p>
        <ImgSlot label="Gráfico / ícono de engranaje recuperando espacio entre vértebras" />
        <p className="tsl-block-text">Imagínelo como un engranaje oxidado: el movimiento suave y constante recupera el espacio perdido. Desde su silla, sin complicaciones y usando solo su peso corporal, usted desbloquea su estructura. Es ciencia aplicada, no magia.</p>
        <div className="tsl-cta-wrap"><CTAButton /></div>
      </section>

      {/* Bloco 3 — App e objeção */}
      <section className="tsl-block">
        <h2 className="tsl-block-title">Así es "Movimiento Sin Dolor" por dentro</h2>
        <div className="tsl-img-row">
          <ImgSlot label="image_a78b78.png — print app pantalla 1" />
          <ImgSlot label="image_a78b76.png — print app pantalla 2" />
        </div>
        <p className="tsl-block-text">¿Teme que estirar le cause más dolor o cree que el programa no es para usted porque nunca lo ha hecho? Ese es un error común. La inmovilidad es su peor enemiga: si no moviliza, su cuerpo se "oxida" y la compresión aumenta.</p>
        <p className="tsl-block-text">Mi programa está diseñado precisamente para personas que conviven con dolor severo y nunca han estirado. Nuestra aplicación es intuitiva, clara y segura. No necesita dominar la tecnología ni ser un atleta; el protocolo se adapta a su nivel actual, descomprimiendo suavemente.</p>
        <p className="tsl-block-text"><strong>Si no actúa, el bloqueo empeora.</strong> El movimiento es la medicina que su cuerpo necesita.</p>
        <div className="tsl-cta-wrap"><CTAButton /></div>
      </section>

      {/* Bloco 4 — Fechamento e prova social */}
      <section className="tsl-block tsl-block--alt">
        <h2 className="tsl-block-title">Tiene dos caminos</h2>
        <p className="tsl-block-text">El del <strong>abandono</strong>, ignorando la causa y dependiendo de pastillas hasta perder su movilidad; o el de la <strong>preservación</strong>, dedicando 7 minutos al día para recuperar su autonomía.</p>
        <p className="tsl-block-text">Quiero que se sienta seguro. Por eso le ofrezco una <strong>garantía de 14 días</strong>. Si en dos semanas de práctica diaria no siente una mejoría clara en su movilidad, le devuelvo el 100% de su dinero. Sin preguntas, sin trabas.</p>
        <p className="tsl-block-text">No lo digo solo yo. Mire lo que dicen personas que, como usted, ya tomaron la decisión:</p>

        <div className="tsl-testimonials-grid tsl-testimonials-grid--images">
          <ImgSlot label="image_a78b74.png — depoimento Marta" />
          <ImgSlot label="image_a78b5d.png — depoimento Carlos" />
          <ImgSlot label="image_a78b1f.png — depoimento Elena" />
        </div>

        <p className="tsl-block-text">¿Se identifica con ellos? No deje para mañana la movilidad que puede recuperar hoy.</p>

        <div className="tsl-benefits">
          <ImgSlot label="image_a78b18.png — checklist de beneficios" />
          <ImgSlot label="image_a78afd.png — sellos de garantía" />
        </div>

        <ul className="tsl-checklist">
          <li>✓ Acceso de por vida (Sin cuotas mensuales)</li>
          <li>✓ Compra 100% segura y privada</li>
          <li>✓ Acceso inmediato por correo electrónico</li>
          <li>✓ Para hombres y mujeres</li>
          <li>✓ Garantía de satisfacción total (14 días)</li>
        </ul>

        <div className="tsl-cta-wrap"><CTAButton /></div>
      </section>

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
      <Header />
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
      <Footer />
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function TSL() {
  const { slug } = useParams()
  if (slug === 'cervical') return <CervicalPage />
  return <GenericPage slug={slug} />
}
