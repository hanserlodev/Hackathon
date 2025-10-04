// Mapa 2D interactivo para el simulador de impacto de meteoritos
class EarthMap2D {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.scale = 1;
        this.centerX = 0;
        this.centerY = 0;
        this.impactPoint = null;
        this.meteorTrail = [];
        this.impactZones = [];
        this.mitigationEffects = [];
        this.isAnimating = false;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        const container = document.getElementById('earth-container');
        this.canvas = document.getElementById('earth-canvas');
        
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'earth-canvas';
            container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        
        // Crear el mapa inicial
        this.createMap();
        this.startAnimation();
    }
    
    resizeCanvas() {
        const container = document.getElementById('earth-container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Calcular escala para mantener proporción del mapa
        this.scale = Math.min(this.width, this.height) / 400;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        this.createMap();
    }
    
    createMap() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Dibujar fondo del espacio
        this.drawSpaceBackground();
        
        // Dibujar la Tierra
        this.drawEarth();
        
        // Dibujar continentes
        this.drawContinents();
        
        // Dibujar efectos existentes
        this.drawImpactZones();
        this.drawMeteorTrail();
        this.drawMitigationEffects();
        
        // Dibujar punto de impacto si existe
        if (this.impactPoint) {
            this.drawImpactPoint();
        }
    }
    
    drawSpaceBackground() {
        // Gradiente del espacio
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, Math.max(this.width, this.height)
        );
        gradient.addColorStop(0, '#0c1445');
        gradient.addColorStop(0.5, '#1a237e');
        gradient.addColorStop(1, '#000011');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Dibujar estrellas
        this.drawStars();
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawEarth() {
        const earthRadius = 150 * this.scale;
        
        // Gradiente de la Tierra
        const gradient = this.ctx.createRadialGradient(
            this.centerX - earthRadius * 0.3, this.centerY - earthRadius * 0.3, 0,
            this.centerX, this.centerY, earthRadius
        );
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(0.7, '#2a5298');
        gradient.addColorStop(1, '#1e3c72');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, earthRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Borde de la Tierra
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawContinents() {
        const earthRadius = 150 * this.scale;
        
        // América del Norte
        this.ctx.fillStyle = '#2d5016';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX - earthRadius * 0.4, this.centerY - earthRadius * 0.2, earthRadius * 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // América del Sur
        this.ctx.beginPath();
        this.ctx.arc(this.centerX - earthRadius * 0.3, this.centerY + earthRadius * 0.3, earthRadius * 0.25, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Europa
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.1, this.centerY - earthRadius * 0.3, earthRadius * 0.2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // África
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.15, this.centerY + earthRadius * 0.1, earthRadius * 0.25, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Asia
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.4, this.centerY - earthRadius * 0.1, earthRadius * 0.35, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Australia
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.5, this.centerY + earthRadius * 0.4, earthRadius * 0.15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Agregar detalles
        this.drawVegetation();
        this.drawDeserts();
    }
    
    drawVegetation() {
        const earthRadius = 150 * this.scale;
        
        // Bosques tropicales (verde más oscuro)
        this.ctx.fillStyle = '#1e3a0f';
        
        // Amazonas
        this.ctx.beginPath();
        this.ctx.arc(this.centerX - earthRadius * 0.25, this.centerY + earthRadius * 0.2, earthRadius * 0.15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // África central
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.1, this.centerY + earthRadius * 0.15, earthRadius * 0.12, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawDeserts() {
        const earthRadius = 150 * this.scale;
        
        // Desiertos (amarillo-marrón)
        this.ctx.fillStyle = '#8b7355';
        
        // Sahara
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.05, this.centerY - earthRadius * 0.1, earthRadius * 0.2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Desierto de Gobi
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + earthRadius * 0.35, this.centerY - earthRadius * 0.05, earthRadius * 0.15, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawImpactPoint() {
        if (!this.impactPoint) return;
        
        const x = this.impactPoint.x;
        const y = this.impactPoint.y;
        
        // Círculo pulsante
        const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 1;
        const radius = 8 * pulse;
        
        // Sombra
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x, y + 2, radius + 2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Punto principal
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Borde brillante
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawImpactZones() {
        if (!this.impactPoint || this.impactZones.length === 0) return;
        
        const x = this.impactPoint.x;
        const y = this.impactPoint.y;
        
        this.impactZones.forEach((zone, index) => {
            const alpha = 0.3 - (index * 0.1);
            const radius = zone.radius * this.scale;
            
            this.ctx.strokeStyle = zone.color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = alpha;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawMeteorTrail() {
        if (this.meteorTrail.length < 2) return;
        
        this.ctx.strokeStyle = '#ff6600';
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.meteorTrail[0].x, this.meteorTrail[0].y);
        
        for (let i = 1; i < this.meteorTrail.length; i++) {
            this.ctx.lineTo(this.meteorTrail[i].x, this.meteorTrail[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawMitigationEffects() {
        this.mitigationEffects.forEach(effect => {
            this.ctx.fillStyle = effect.color;
            this.ctx.globalAlpha = effect.alpha;
            
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            this.ctx.globalAlpha = 1;
        });
    }
    
    onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Verificar si el clic está dentro de la Tierra
        const earthRadius = 150 * this.scale;
        const distance = Math.sqrt(
            Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2)
        );
        
        if (distance <= earthRadius) {
            // Convertir coordenadas de pantalla a coordenadas geográficas
            const lat = this.screenToLatitude(y);
            const lon = this.screenToLongitude(x);
            
            // Establecer punto de impacto
            this.setImpactPoint(x, y, lat, lon);
            
            // Notificar a la simulación principal
            if (window.meteorSimulation) {
                window.meteorSimulation.setImpactLocation(lat, lon);
            }
            
            // Mostrar mensaje
            this.showClickMessage(lat, lon);
        }
    }
    
    onCanvasMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Cambiar cursor si está sobre la Tierra
        const earthRadius = 150 * this.scale;
        const distance = Math.sqrt(
            Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2)
        );
        
        this.canvas.style.cursor = distance <= earthRadius ? 'crosshair' : 'default';
    }
    
    screenToLatitude(screenY) {
        const earthRadius = 150 * this.scale;
        const relativeY = (screenY - this.centerY) / earthRadius;
        return Math.asin(Math.max(-1, Math.min(1, relativeY))) * 180 / Math.PI;
    }
    
    screenToLongitude(screenX) {
        const earthRadius = 150 * this.scale;
        const relativeX = (screenX - this.centerX) / earthRadius;
        return Math.atan2(relativeX, Math.sqrt(1 - relativeX * relativeX)) * 180 / Math.PI;
    }
    
    setImpactPoint(x, y, lat, lon) {
        this.impactPoint = { x, y, lat, lon };
        
        // Buscar ciudad más cercana
        this.findNearestCity(lat, lon);
        
        // Limpiar efectos anteriores
        this.impactZones = [];
        this.meteorTrail = [];
        this.mitigationEffects = [];
    }
    
    async findNearestCity(lat, lon) {
        // Lista de ciudades principales (misma que en earth3d.js)
        const majorCities = [
            { name: "Nueva York", country: "Estados Unidos", lat: 40.7128, lon: -74.0060 },
            { name: "Londres", country: "Reino Unido", lat: 51.5074, lon: -0.1278 },
            { name: "París", country: "Francia", lat: 48.8566, lon: 2.3522 },
            { name: "Tokio", country: "Japón", lat: 35.6762, lon: 139.6503 },
            { name: "Madrid", country: "España", lat: 40.4168, lon: -3.7038 },
            { name: "Berlín", country: "Alemania", lat: 52.5200, lon: 13.4050 },
            { name: "Roma", country: "Italia", lat: 41.9028, lon: 12.4964 },
            { name: "Moscú", country: "Rusia", lat: 55.7558, lon: 37.6176 },
            { name: "Pekín", country: "China", lat: 39.9042, lon: 116.4074 },
            { name: "Sídney", country: "Australia", lat: -33.8688, lon: 151.2093 },
            { name: "São Paulo", country: "Brasil", lat: -23.5505, lon: -46.6333 },
            { name: "Ciudad de México", country: "México", lat: 19.4326, lon: -99.1332 },
            { name: "Buenos Aires", country: "Argentina", lat: -34.6118, lon: -58.3960 },
            { name: "Los Ángeles", country: "Estados Unidos", lat: 34.0522, lon: -118.2437 },
            { name: "Chicago", country: "Estados Unidos", lat: 41.8781, lon: -87.6298 },
            { name: "Toronto", country: "Canadá", lat: 43.6532, lon: -79.3832 },
            { name: "Vancouver", country: "Canadá", lat: 49.2827, lon: -123.1207 },
            { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 },
            { name: "Delhi", country: "India", lat: 28.7041, lon: 77.1025 },
            { name: "Shanghái", country: "China", lat: 31.2304, lon: 121.4737 },
            { name: "Hong Kong", country: "China", lat: 22.3193, lon: 114.1694 },
            { name: "Singapur", country: "Singapur", lat: 1.3521, lon: 103.8198 },
            { name: "Bangkok", country: "Tailandia", lat: 13.7563, lon: 100.5018 },
            { name: "Seúl", country: "Corea del Sur", lat: 37.5665, lon: 126.9780 },
            { name: "El Cairo", country: "Egipto", lat: 30.0444, lon: 31.2357 },
            { name: "Johannesburgo", country: "Sudáfrica", lat: -26.2041, lon: 28.0473 },
            { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792 },
            { name: "Nairobi", country: "Kenia", lat: -1.2921, lon: 36.8219 },
            { name: "Casablanca", country: "Marruecos", lat: 33.5731, lon: -7.5898 },
            { name: "Dubái", country: "Emiratos Árabes Unidos", lat: 25.2048, lon: 55.2708 },
            { name: "Riad", country: "Arabia Saudí", lat: 24.7136, lon: 46.6753 },
            { name: "Teherán", country: "Irán", lat: 35.6892, lon: 51.3890 },
            { name: "Bagdad", country: "Irak", lat: 33.3152, lon: 44.3661 },
            { name: "Estambul", country: "Turquía", lat: 41.0082, lon: 28.9784 },
            { name: "Atenas", country: "Grecia", lat: 37.9838, lon: 23.7275 },
            { name: "Lisboa", country: "Portugal", lat: 38.7223, lon: -9.1393 },
            { name: "Ámsterdam", country: "Países Bajos", lat: 52.3676, lon: 4.9041 },
            { name: "Bruselas", country: "Bélgica", lat: 50.8503, lon: 4.3517 },
            { name: "Viena", country: "Austria", lat: 48.2082, lon: 16.3738 },
            { name: "Zúrich", country: "Suiza", lat: 47.3769, lon: 8.5417 },
            { name: "Estocolmo", country: "Suecia", lat: 59.3293, lon: 18.0686 },
            { name: "Oslo", country: "Noruega", lat: 59.9139, lon: 10.7522 },
            { name: "Copenhague", country: "Dinamarca", lat: 55.6761, lon: 12.5683 },
            { name: "Helsinki", country: "Finlandia", lat: 60.1699, lon: 24.9384 },
            { name: "Varsovia", country: "Polonia", lat: 52.2297, lon: 21.0122 },
            { name: "Praga", country: "República Checa", lat: 50.0755, lon: 14.4378 },
            { name: "Budapest", country: "Hungría", lat: 47.4979, lon: 19.0402 },
            { name: "Bucarest", country: "Rumania", lat: 44.4268, lon: 26.1025 },
            { name: "Sofía", country: "Bulgaria", lat: 42.6977, lon: 23.3219 },
            { name: "Zagreb", country: "Croacia", lat: 45.8150, lon: 15.9819 },
            { name: "Belgrado", country: "Serbia", lat: 44.7866, lon: 20.4489 },
            { name: "Sarajevo", country: "Bosnia y Herzegovina", lat: 43.8563, lon: 18.4131 },
            { name: "Skopje", country: "Macedonia del Norte", lat: 41.9981, lon: 21.4254 },
            { name: "Tirana", country: "Albania", lat: 41.3275, lon: 19.8187 },
            { name: "Podgorica", country: "Montenegro", lat: 42.4304, lon: 19.2594 },
            { name: "Ljubljana", country: "Eslovenia", lat: 46.0569, lon: 14.5058 },
            { name: "Bratislava", country: "Eslovaquia", lat: 48.1486, lon: 17.1077 },
            { name: "Vilna", country: "Lituania", lat: 54.6872, lon: 25.2797 },
            { name: "Riga", country: "Letonia", lat: 56.9496, lon: 24.1052 },
            { name: "Tallin", country: "Estonia", lat: 59.4370, lon: 24.7536 },
            { name: "Kiev", country: "Ucrania", lat: 50.4501, lon: 30.5234 },
            { name: "Minsk", country: "Bielorrusia", lat: 53.9006, lon: 27.5590 },
            { name: "Chisinau", country: "Moldavia", lat: 47.0105, lon: 28.8638 }
        ];
        
        // Calcular distancia a cada ciudad
        let nearestCity = null;
        let minDistance = Infinity;
        
        for (const city of majorCities) {
            const distance = this.calculateDistance(lat, lon, city.lat, city.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city;
            }
        }
        
        if (nearestCity) {
            // Mostrar información de la ciudad más cercana
            this.showNearestCityInfo(nearestCity, minDistance);
            
            // Actualizar el campo de ubicación
            const locationInput = document.getElementById('location-input');
            if (locationInput) {
                locationInput.value = `${nearestCity.name}, ${nearestCity.country}`;
            }
            
            return nearestCity;
        }
        
        return null;
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        // Fórmula de Haversine para calcular distancia entre dos puntos
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    showNearestCityInfo(city, distance) {
        // Crear o actualizar información de ciudad más cercana
        let cityInfo = document.getElementById('nearest-city-info');
        if (!cityInfo) {
            cityInfo = document.createElement('div');
            cityInfo.id = 'nearest-city-info';
            cityInfo.className = 'nearest-city-info';
            document.querySelector('.control-panel').appendChild(cityInfo);
        }
        
        cityInfo.innerHTML = `
            <h4>🏙️ Ciudad Más Cercana</h4>
            <p><strong>Ciudad:</strong> ${city.name}</p>
            <p><strong>País:</strong> ${city.country}</p>
            <p><strong>Distancia:</strong> ${distance.toFixed(1)} km</p>
            <p><strong>Coordenadas:</strong> ${city.lat.toFixed(4)}°, ${city.lon.toFixed(4)}°</p>
        `;
    }
    
    showClickMessage(lat, lon) {
        // Crear mensaje temporal
        const message = document.createElement('div');
        message.className = 'click-message';
        message.innerHTML = `
            <div class="click-content">
                <span>📍 Punto seleccionado: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 3000);
    }
    
    // Métodos para simulación de impacto
    animateMeteorToEarth(lat, lon, duration = 3000) {
        if (!this.impactPoint) return;
        
        this.isAnimating = true;
        
        // Crear trayectoria del meteorito
        const startX = this.centerX + 200;
        const startY = this.centerY - 200;
        const endX = this.impactPoint.x;
        const endY = this.impactPoint.y;
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolación suave
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentX = startX + (endX - startX) * easeProgress;
            const currentY = startY + (endY - startY) * easeProgress;
            
            // Actualizar trayectoria
            this.meteorTrail.push({ x: currentX, y: currentY });
            if (this.meteorTrail.length > 20) {
                this.meteorTrail.shift();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.createImpactEffect();
            }
        };
        
        animate();
    }
    
    createImpactEffect() {
        if (!this.impactPoint) return;
        
        // Crear zonas de impacto
        this.impactZones = [
            { radius: 20, color: '#ff0000' },
            { radius: 40, color: '#ff6600' },
            { radius: 60, color: '#ffaa00' }
        ];
        
        // Crear explosión
        this.createExplosion();
    }
    
    createExplosion() {
        // Crear partículas de explosión
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 30;
            const x = this.impactPoint.x + Math.cos(angle) * distance;
            const y = this.impactPoint.y + Math.sin(angle) * distance;
            
            this.mitigationEffects.push({
                x: x,
                y: y,
                radius: Math.random() * 5 + 2,
                color: `hsl(${Math.random() * 60}, 100%, 50%)`,
                alpha: 0.8,
                lifetime: 1000
            });
        }
    }
    
    // Métodos para mitigación
    showMitigationEffect(method) {
        if (!this.impactPoint) return;
        
        // Limpiar efectos anteriores
        this.mitigationEffects = this.mitigationEffects.filter(effect => effect.type !== 'mitigation');
        
        const x = this.impactPoint.x;
        const y = this.impactPoint.y;
        
        switch (method) {
            case 'kinetic':
                this.createKineticEffect(x, y);
                break;
            case 'gravity':
                this.createGravityEffect(x, y);
                break;
            case 'laser':
                this.createLaserEffect(x, y);
                break;
            case 'shelters':
                this.createShelterEffect(x, y);
                break;
        }
    }
    
    createKineticEffect(x, y) {
        // Nave espacial
        this.mitigationEffects.push({
            x: x - 30,
            y: y - 30,
            radius: 8,
            color: '#00ff00',
            alpha: 0.8,
            type: 'mitigation'
        });
        
        // Trayectoria
        for (let i = 0; i < 10; i++) {
            this.mitigationEffects.push({
                x: x - 30 + i * 3,
                y: y - 30 + i * 3,
                radius: 2,
                color: '#00ff00',
                alpha: 0.6,
                type: 'mitigation'
            });
        }
    }
    
    createGravityEffect(x, y) {
        // Nave masiva
        this.mitigationEffects.push({
            x: x - 20,
            y: y - 20,
            radius: 15,
            color: '#0000ff',
            alpha: 0.8,
            type: 'mitigation'
        });
        
        // Campo gravitacional
        this.mitigationEffects.push({
            x: x,
            y: y,
            radius: 40,
            color: '#0000ff',
            alpha: 0.2,
            type: 'mitigation'
        });
    }
    
    createLaserEffect(x, y) {
        // Estación láser
        this.mitigationEffects.push({
            x: x - 25,
            y: y - 25,
            radius: 6,
            color: '#ff00ff',
            alpha: 0.8,
            type: 'mitigation'
        });
        
        // Haz láser
        for (let i = 0; i < 15; i++) {
            this.mitigationEffects.push({
                x: x - 25 + i * 1.5,
                y: y - 25 + i * 1.5,
                radius: 1,
                color: '#ff00ff',
                alpha: 0.8,
                type: 'mitigation'
            });
        }
    }
    
    createShelterEffect(x, y) {
        // Refugios alrededor del impacto
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * 2 * Math.PI;
            const radius = 25;
            
            this.mitigationEffects.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                radius: 4,
                color: '#ffff00',
                alpha: 0.8,
                type: 'mitigation'
            });
        }
    }
    
    removeMitigationEffects() {
        this.mitigationEffects = this.mitigationEffects.filter(effect => effect.type !== 'mitigation');
    }
    
    startAnimation() {
        const animate = () => {
            this.createMap();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        window.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('click', this.onCanvasClick);
        this.canvas.removeEventListener('mousemove', this.onCanvasMouseMove);
    }
}

// Exportar para uso global
window.EarthMap2D = EarthMap2D;
