# Payment Frontend (React Native - Wompi Integration)

Esta aplicación móvil (React Native vía Expo) cumple con la prueba técnica de integración con la API de Wompi.

## Requisitos Cumplidos
- **React Native (Expo)** utilizado para garantizar compilaciones multiplataforma (Android `.apk`).
- **Redux & Flux Architecture** implementados en `src/store`.
- **Almacenamiento Seguro:** La data de la transacción se encripta con `expo-secure-store`.
- **7-Step Flow:** Splash -> Home -> Select Product -> Checkout -> Modal Tarjeta -> Procesamiento -> Estado de Transacción.
- **Validación Visual:** El modal detecta la franquicia de la tarjeta (Visa/Mastercard) dinámicamente.
- **Testing:** Pruebas unitarias en Jest (Store y Slices).

## Instrucciones para Compilar y Correr (Local)

### 1. Instalación de Dependencias
```bash
npm install --legacy-peer-deps
```

### 2. Correr la App en Desarrollo
```bash
npm start
```
*Luego de ejecutar esto, la terminal mostrará un Código QR. Descarga la aplicación **Expo Go** en tu Android o iOS y escanea el código para probar la app en vivo en tu celular.*

### 3. Ejecutar las Pruebas Unitarias (Jest)
```bash
npm test
```

### 4. Compilar el archivo `.apk` (Android)
Expo facilita la exportación del binario. Para compilarlo directamente en tu máquina:
```bash
npm install -g eas-cli
eas build -p android --profile preview --local
```
*(Esto procesará el bundle de React Native y entregará un archivo `.apk` final en la raíz de tu proyecto para que lo subas a tu repositorio).*

## Notas
- Asegúrate de tener tu backend NestJS corriendo en `http://localhost:3000`.
- La llave pública de Sandbox de Wompi ya está inyectada en el código del Checkout.
