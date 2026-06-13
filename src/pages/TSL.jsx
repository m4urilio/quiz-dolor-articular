import { useParams } from 'react-router-dom'
import '../TSL.css'

const CHECKOUT_URL = 'https://pay.hotmart.com/X106313372V?checkoutMode=10'

const CONTENT = {
  rodilla: {
    hero: '¿El dolor de rodilla le impide caminar, subir escaleras o dormir tranquilo?',
    sub: 'Descubra cómo miles de personas mayores de 55 años han recuperado su movilidad sin cirugía ni medicación.',
  },
  lumbar: {
    hero: '¿El dolor lumbar o la ciática no le deja vivir con normalidad?',
    sub: 'Conozca el método natural que está ayudando a miles de personas a eliminar el dolor de espalda de forma definitiva.',
  },
  cervical: {
    hero: '¿El dolor cervical y de cuello le roba energía y calidad de vida cada día?',
    sub: 'Descubra cómo recuperar la movilidad del cuello y eliminar la tensión cervical en pocas semanas.',
  },
  caderas: {
    hero: '¿El dolor de cadera limita cada uno de sus movimientos cotidianos?',
    sub: 'El protocolo biomecánico que está transformando la vida de personas que pensaban que ya no tenían solución.',
  },
  bienestar: {
    hero: '¿El dolor articular le impide disfrutar de la vida que merece?',
    sub: 'Descubra el método natural que está ayudando a miles de personas a moverse sin dolor y recuperar su libertad.',
  },
}

const BLOCKS = [
  {
    label: 'Por qué su dolor no desaparece solo',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    hasImage: true,
  },
  {
    label: 'El método que cambia todo',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.\n\nSed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    hasImage: true,
  },
  {
    label: 'Lo que conseguirá en 8 semanas',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.\n\nNam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    hasImage: true,
  },
  {
    label: 'Sin cirugía. Sin medicación. Sin riesgo.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
    hasImage: false,
  },
]

const TESTIMONIALS = [
  {
    name: 'María G., 67 años',
    text: '"[Espacio para depoimento real] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."',
  },
  {
    name: 'José R., 71 años',
    text: '"[Espacio para depoimento real] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."',
  },
  {
    name: 'Carmen L., 63 años',
    text: '"[Espacio para depoimento real] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit."',
  },
]

function CTAButton() {
  return (
    <a href={CHECKOUT_URL} className="tsl-cta">
      Quiero Recuperar mi Movilidad Ahora
    </a>
  )
}

export default function TSL() {
  const { slug } = useParams()
  const content = CONTENT[slug] || CONTENT.bienestar

  return (
    <div className="tsl-page">

      {/* Header */}
      <header className="tsl-header">
        <img src="/logo.png" alt="Programa Movimiento Sin Dolor" className="tsl-logo" />
      </header>

      {/* Hero */}
      <section className="tsl-hero">
        <h1 className="tsl-hero-title">{content.hero}</h1>
        <p className="tsl-hero-sub">{content.sub}</p>
        <CTAButton />
      </section>

      {/* Content Blocks */}
      {BLOCKS.map((block, i) => (
        <section key={i} className="tsl-block">
          <h2 className="tsl-block-title">{block.label}</h2>
          {block.body.split('\n\n').map((p, j) => (
            <p key={j} className="tsl-block-text">{p}</p>
          ))}
          {block.hasImage && (
            <div className="tsl-img-slot">
              <span className="tsl-img-slot-label">[ Inserir print do aplicativo aqui ]</span>
            </div>
          )}
          <div className="tsl-cta-wrap">
            <CTAButton />
          </div>
        </section>
      ))}

      {/* Social Proof */}
      <section className="tsl-testimonials">
        <h2 className="tsl-testimonials-title">Lo que dicen nuestros pacientes</h2>
        <div className="tsl-testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="tsl-testimonial">
              <p className="tsl-testimonial-text">{t.text}</p>
              <p className="tsl-testimonial-name">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="tsl-final-cta">
        <h2 className="tsl-final-title">Su protocolo personalizado está listo</h2>
        <p className="tsl-final-sub">Acceda hoy y empiece a moverse sin dolor en las próximas semanas.</p>
        <CTAButton />
        <p className="tsl-guarantee">
          Garantía de 7 días · Sin compromisos · Acceso inmediato
        </p>
      </section>

      {/* Footer */}
      <footer className="tsl-footer">
        <p>© {new Date().getFullYear()} Programa Movimiento Sin Dolor · Todos los derechos reservados</p>
        <p>Empresa Ejemplo S.L. · NIF B12345678. Los resultados pueden variar. Este programa no sustituye el consejo médico profesional.</p>
      </footer>

    </div>
  )
}
