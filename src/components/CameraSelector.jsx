import { useEffect, useState } from 'react'
import { listVideoDevices } from '../utils/camera'

export default function CameraSelector({ deviceId, onChange }) {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await listVideoDevices()
        if (mounted) {
          setDevices(list)
          // se não houver seleção, tenta escolher a traseira (environment)
          if (!deviceId) {
            const back = list.find(d => /back|traseira|environment/i.test(d.label))
            onChange(back?.deviceId || list[0]?.deviceId || null)
          }
        }
      } catch (e) {
        setError(e.message || 'Não foi possível listar câmeras.')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [deviceId, onChange])

  if (loading) return <p>Carregando câmeras…</p>
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>
  if (!devices.length) return <p>Nenhuma câmera encontrada.</p>

  return (
    <div style={{ marginBottom: 12 }}>
      <label>
        Câmera:{' '}
        <select value={deviceId || ''} onChange={(e) => onChange(e.target.value)}>
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Câmera (${d.deviceId.slice(0, 6)}…)`}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
