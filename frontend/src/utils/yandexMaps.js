let mapsScriptPromise;

export function loadYandexMaps(apiKey) {
  if (window.ymaps) return Promise.resolve();
  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-yandex-maps]");
    const script = existing || document.createElement("script");

    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });

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
