let mapsScriptPromise;

export function loadYandexMaps(apiKey) {
  if (window.ymaps?.ready) return Promise.resolve();
  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-yandex-maps]");
    const script = existing || document.createElement("script");

    const handleLoad = () => {
      if (window.ymaps?.ready) {
        resolve();
      } else {
        reject(new Error("Yandex Maps script loaded without initializing the API."));
      }
    };
    const handleError = () => reject(new Error("Failed to load the Yandex Maps script."));

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
      script.async = true;
      script.dataset.yandexMaps = "true";
      document.head.appendChild(script);
    }
  }).catch((error) => {
    mapsScriptPromise = undefined;
    throw error;
  });

  return mapsScriptPromise;
}
