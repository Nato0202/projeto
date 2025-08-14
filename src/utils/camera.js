export async function listVideoDevices() {
  // Garantir permissão: tenta um getUserMedia "rápido" (sem reter stream)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach(t => t.stop())
  } catch (_) {
    // usuário pode negar – ainda tentamos listar, mas rótulos podem vir vazios
  }

  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter(d => d.kind === 'videoinput')
}
