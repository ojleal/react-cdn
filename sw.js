//Archivo para crear el serviceWorker

//Array de elementos que van a utilizar el caché
const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js",
    "./index.js"
]

const CACHE_NAME = "v2_cache_contador_react" //Nombre del serviceWorker

//Instalación del serviceWorker
//Constante de tipo globalThis
self.addEventListener("install", (e) => {
    e.waitUntil (
        //Caches es el Almacenamiento de caché del dispositivo
        caches.open(CACHE_NAME).then(cache => {
            //cache.addAll agrega los elementos que se quieren colocar en cache
            cache.addAll(CACHE_ELEMENTS).then( () =>{
                self.skipWaiting()
            }).catch(console.log)
        })
    )
})

self.addEventListener("activate", (e) => {

    const cacheWhitelist = [CACHE_NAME] 
    e.waitUntil (
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map(cacheName =>{
                //Si se cumple la promesa se retorna lo que está después del &&
                return (cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName))
            }))
        }).then(() => self.clients.claim())

    )
})

self.addEventListener("fetch", (e) => {
    e.respondWith(( 
        caches.match(e.request).then((res) => {
            if (res) {
                return res;
            }
            return fetch(e.request)
        })
    ))  
})