import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser'

export default function QRScanner({ deviceId, isScanning, onStart, onStop, onResult }) {
  const videoRef = useRef(null)
  const readerRef = useRef(null)
  const [torchAvailable, setTorchAvailable] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const trackRef = useRef(null)

  // Inicia a leitura
  const start = useCallback(async () => {
    if (!videoRef.current) return
    if (!deviceId) {
      alert('Selecione uma câmera primeiro.')
      return
    }
    if (!readerRef.current) {
      readerRef.current = new BrowserMultiFormatReader()
    }

    try {
      onStart && onStart()
      await readerRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, err, controls) => {
          // salva referência ao track p/ lanterna
          if (!trackRef.current && videoRef.current?.srcObject) {
            const [track] = videoRef.current.srcObject.getVideoTracks()
            trackRef.current = track
            const caps = track?.getCapabilities?.()
            setTorchAvailable(!!caps?.torch)
          }

          if (result) {
            const text = result.getText()
            onResult && onResult(text, result)
          }
          // ignoramos NotFoundException (quadro sem QR)
          if (err && !(err instanceof NotFoundException)) {
            console.error(err)
          }
        }
      )
    } catch (e) {
      console.error(e)
      alert('Erro ao iniciar a câmera: ' + (e?.message || e))
      onStop && onStop()
    }
  }, [deviceId, onResult, onStart, onStop])

  // Parar a leitura
  const stop = useCallback(async () => {
    try {
      // para o leitor
      await readerRef.current?.reset?.()
    } finally {
      // para trilhas de vídeo
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
        videoRef.current.srcObject = null
      }
      trackRef.current = null
      setTorchOn(false)
      setTorchAvailable(false)
      onStop && onStop()
    }
  }, [onStop])

  // Alterna lanterna (se disponível)
  const toggleTorch = useCallback(async () => {
    const track = trackRef.current
    if (!track?.applyConstraints) return
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] })
      setTorchOn(!torchOn)
    } catch (e) {
      console.warn('Lanterna não pôde ser alternada:', e)
    }
  }, [torchOn])

  // Efeito para sincronizar estado externo (isScanning)
  useEffect(() => {
    if (isScanning) start()
    else stop()
    // limpar ao desmontar
    return () => { stop() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning, start, stop])

  return (
    <section>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        {!isScanning ? (
          <button onClick={start}>Iniciar</button>
        ) : (
          <button onClick={stop}>Parar</button>
        )}
        <button onClick={toggleTorch} disabled={!torchAvailable}>
          {torchOn ? 'Lanterna: ON' : 'Lanterna: OFF'}
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
        <video
          ref={videoRef}
          style={{ width: '100%', borderRadius: 8, background: '#000' }}
          muted
          playsInline
          autoPlay
        />
        {/* Moldura simples para guiar o enquadramento */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          border: '2px dashed rgba(255,255,255,0.6)', borderRadius: 8
        }} />
      </div>
    </section>
  )
}
