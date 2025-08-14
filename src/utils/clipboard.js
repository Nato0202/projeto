export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    alert('Copiado!')
  } catch {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    alert('Copiado!')
  }
}
