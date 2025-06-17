export const copyToClipboard = (text: string) => {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			window.$toast("¡Enlace copiado al portapapeles!", {
				class: "bg-green-950/80 border-green-600 text-green-200",
			});
		})
		.catch((err) => {
			console.error("Error al copiar al portapapeles:", err);
			window.$toast("Error al copiar el enlace", { class: "bg-red-500" });
		});
};
