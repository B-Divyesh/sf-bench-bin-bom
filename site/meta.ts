declare const __BUILD_ID__: string;
document.querySelectorAll<HTMLElement>('[data-build-id]').forEach((element) => { element.textContent = __BUILD_ID__; });

