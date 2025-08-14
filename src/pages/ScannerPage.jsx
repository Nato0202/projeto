import { useState } from 'react'
import CameraSelector from '../components/CameraSelector'
import QRScanner from '../components/QRScanner'
import ResultCard from '../components/ResultCard'

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState(null)
  const [result, setResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  return (
    <main>
      <h2>Scanner</h2>

      <CameraSelector
        deviceId={deviceId}
        onChange={setDeviceId}
      />

      <QRScanner
        deviceId={deviceId}
        isScanning={isScanning}
        onStart={() => setIsScanning(true)}
        onStop={() => setIsScanning(false)}
        onResult={(text, raw) => setResult({ text, raw })}
      />

      <ResultCard result={result} />
    </main>
  )
}
