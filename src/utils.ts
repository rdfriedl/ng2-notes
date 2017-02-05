export function readFile(file: Blob): Promise<String> {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = err => {
			reject(err);
		};
		reader.readAsDataURL(file);
	});
}
