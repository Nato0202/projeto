import { copyToClipboard } from '../utils/clipboard'

export default function ResultCard({ result }) {
  if (!result?.text) return null
  const isURL = /^https?:\/\//i.test(result.text)

  return (
    <>
    <section style={{ marginTop: 16 }}>
      <h3>Resultado</h3>
      <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, background: '#fafafa' }}>
        <p style={{ wordBreak: 'break-word', margin: 0 }}>
          {result.text}
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => copyToClipboard(result.text)}>Copiar</button>
          {isURL && (
            <a href={result.text} target="_blank" rel="noreferrer">
              <button>Abrir link</button>
            </a>
          )}
        </div>
      </div>
    </section>
    </>
  )
}
