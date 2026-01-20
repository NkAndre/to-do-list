self.addEventListener('install', (event) => {
  console.log('Service Worker instalado!');
});

self.addEventListener('fetch', (event) => {
  // Apenas log, você pode adicionar cache aqui depois
  console.log('Fetching:', event.request.url);
});
