export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    window.$toast('¡Enlace copiado al portapapeles!', { class: 'bg-teal-700/80 border-teal-500' })
  }).catch(err => {
    console.error('Error al copiar al portapapeles:', err)
    window.$toast('Error al copiar el enlace', { class: 'bg-red-500' })
  })
}
