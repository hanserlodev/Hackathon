// Visualización 3D de la Tierra con Three.js
class Earth3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.meteor = null;
        this.controls = null;
        this.impactPoint = null;
        this.animationId = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        const canvas = document.getElementById('earth-canvas');
        const container = document.getElementById('earth-container');
        
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        
        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Crear controles de órbita
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        
        // Configurar raycasting para selección de puntos
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Agregar event listener para clics
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        
        // Crear la Tierra
        this.createEarth();
        
        // Crear iluminación
        this.createLighting();
        
        // Crear estrellas de fondo
        this.createStars();
        
        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Iniciar animación
        this.animate();
    }
    
    createEarth() {
        // Geometría de la esfera
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        
        // Textura de la Tierra (usando una textura procedural por ahora)
        const texture = this.createEarthTexture();
        
        // Material de la Tierra
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.1,
            shininess: 100
        });
        
        // Crear mesh de la Tierra
        this.earth = new THREE.Mesh(geometry, material);
        this.earth.castShadow = true;
        this.earth.receiveShadow = true;
        this.scene.add(this.earth);
        
        // Crear atmósfera
        this.createAtmosphere();
    }
    
    createEarthTexture() {
        // Crear textura más realista de la Tierra
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Fondo oceánico con gradiente más realista
        const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1024);
        oceanGradient.addColorStop(0, '#1e3c72');
        oceanGradient.addColorStop(0.3, '#2a5298');
        oceanGradient.addColorStop(0.7, '#1e3c72');
        oceanGradient.addColorStop(1, '#0f1b3a');
        
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, 2048, 1024);
        
        // Continentes más detallados y realistas
        this.drawRealisticContinents(ctx);
        
        // Agregar nubes más realistas
        this.drawRealisticClouds(ctx);
        
        // Agregar hielo polar
        this.drawPolarIce(ctx);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        return texture;
    }
    
    drawRealisticContinents(ctx) {
        // América del Norte
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.moveTo(200, 300);
        ctx.bezierCurveTo(150, 250, 180, 200, 250, 180);
        ctx.bezierCurveTo(300, 160, 350, 170, 400, 200);
        ctx.bezierCurveTo(450, 230, 420, 280, 380, 320);
        ctx.bezierCurveTo(320, 350, 250, 340, 200, 300);
        ctx.fill();
        
        // América del Sur
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.moveTo(350, 600);
        ctx.bezierCurveTo(320, 580, 330, 550, 360, 540);
        ctx.bezierCurveTo(400, 520, 450, 530, 480, 560);
        ctx.bezierCurveTo(500, 590, 480, 650, 420, 680);
        ctx.bezierCurveTo(380, 700, 350, 680, 350, 600);
        ctx.fill();
        
        // Europa
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.moveTo(900, 200);
        ctx.bezierCurveTo(880, 180, 900, 160, 920, 170);
        ctx.bezierCurveTo(950, 180, 980, 200, 1000, 220);
        ctx.bezierCurveTo(1020, 250, 1000, 280, 960, 290);
        ctx.bezierCurveTo(920, 300, 900, 280, 900, 200);
        ctx.fill();
        
        // África
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.moveTo(950, 400);
        ctx.bezierCurveTo(920, 380, 940, 350, 970, 360);
        ctx.bezierCurveTo(1000, 370, 1020, 400, 1040, 450);
        ctx.bezierCurveTo(1060, 500, 1040, 580, 1000, 620);
        ctx.bezierCurveTo(960, 660, 920, 650, 900, 600);
        ctx.bezierCurveTo(880, 550, 900, 500, 950, 400);
        ctx.fill();
        
        // Asia
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.moveTo(1200, 150);
        ctx.bezierCurveTo(1150, 120, 1200, 100, 1250, 110);
        ctx.bezierCurveTo(1300, 120, 1350, 150, 1400, 180);
        ctx.bezierCurveTo(1450, 220, 1500, 250, 1550, 300);
        ctx.bezierCurveTo(1600, 350, 1580, 400, 1520, 420);
        ctx.bezierCurveTo(1460, 440, 1400, 430, 1350, 400);
        ctx.bezierCurveTo(1300, 370, 1250, 320, 1200, 280);
        ctx.bezierCurveTo(1150, 240, 1200, 200, 1200, 150);
        ctx.fill();
        
        // Australia
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.moveTo(1600, 700);
        ctx.bezierCurveTo(1580, 680, 1600, 660, 1620, 670);
        ctx.bezierCurveTo(1650, 680, 1680, 700, 1700, 720);
        ctx.bezierCurveTo(1720, 750, 1700, 780, 1660, 790);
        ctx.bezierCurveTo(1620, 800, 1600, 780, 1600, 700);
        ctx.fill();
        
        // Agregar detalles de vegetación
        this.addVegetationDetails(ctx);
    }
    
    addVegetationDetails(ctx) {
        // Bosques tropicales (verde más oscuro)
        ctx.fillStyle = '#1e3a0f';
        
        // Amazonas
        ctx.beginPath();
        ctx.ellipse(400, 550, 60, 30, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // África central
        ctx.beginPath();
        ctx.ellipse(1000, 500, 50, 40, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Desiertos (amarillo-marrón)
        ctx.fillStyle = '#8b7355';
        
        // Sahara
        ctx.beginPath();
        ctx.ellipse(950, 350, 80, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Desierto de Gobi
        ctx.beginPath();
        ctx.ellipse(1300, 250, 60, 25, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawRealisticClouds(ctx) {
        // Nubes más realistas con diferentes opacidades
        const cloudColors = [
            'rgba(255, 255, 255, 0.4)',
            'rgba(255, 255, 255, 0.3)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(240, 248, 255, 0.3)'
        ];
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 2048;
            const y = Math.random() * 1024;
            const size = Math.random() * 40 + 10;
            const color = cloudColors[Math.floor(Math.random() * cloudColors.length)];
            
            ctx.fillStyle = color;
            ctx.beginPath();
            
            // Crear formas de nube más orgánicas
            const points = 8;
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * 2 * Math.PI;
                const radius = size + Math.random() * 20;
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                
                if (j === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fill();
        }
    }
    
    drawPolarIce(ctx) {
        // Hielo del Ártico
        ctx.fillStyle = 'rgba(240, 248, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(1024, 50, 800, 100, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Hielo de la Antártida
        ctx.beginPath();
        ctx.ellipse(1024, 974, 800, 100, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    createAtmosphere() {
        const geometry = new THREE.SphereGeometry(2.1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(geometry, material);
        this.scene.add(atmosphere);
    }
    
    createLighting() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Luz direccional (sol)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
    }
    
    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5
        });
        
        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            starVertices.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createMeteor(size = 0.1, position = { x: 0, y: 0, z: 8 }) {
        // Geometría del meteorito
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        
        // Material del meteorito
        const material = new THREE.MeshPhongMaterial({
            color: 0xff4500,
            emissive: 0xff2200,
            emissiveIntensity: 0.3
        });
        
        // Crear mesh del meteorito
        this.meteor = new THREE.Mesh(geometry, material);
        this.meteor.position.set(position.x, position.y, position.z);
        this.meteor.castShadow = true;
        this.scene.add(this.meteor);
        
        // Crear estela del meteorito
        this.createMeteorTrail();
    }
    
    createMeteorTrail() {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.6
        });
        
        const trailPoints = [];
        for (let i = 0; i < 20; i++) {
            trailPoints.push(new THREE.Vector3(0, 0, 8 - i * 0.1));
        }
        
        trailGeometry.setFromPoints(trailPoints);
        
        this.meteorTrail = new THREE.Line(trailGeometry, trailMaterial);
        this.scene.add(this.meteorTrail);
    }
    
    animateMeteorToEarth(targetLat, targetLon, duration = 3000) {
        if (!this.meteor) return;
        
        this.isAnimating = true;
        
        // Convertir coordenadas geográficas a coordenadas 3D
        const phi = (90 - targetLat) * (Math.PI / 180);
        const theta = (targetLon + 180) * (Math.PI / 180);
        
        const targetX = 2.1 * Math.sin(phi) * Math.cos(theta);
        const targetY = 2.1 * Math.cos(phi);
        const targetZ = 2.1 * Math.sin(phi) * Math.sin(theta);
        
        const startPosition = this.meteor.position.clone();
        const endPosition = new THREE.Vector3(targetX, targetY, targetZ);
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolación suave
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.meteor.position.lerpVectors(startPosition, endPosition, easeProgress);
            
            // Actualizar estela
            if (this.meteorTrail) {
                this.updateMeteorTrail();
            }
            
            // Rotar el meteorito
            this.meteor.rotation.x += 0.1;
            this.meteor.rotation.y += 0.1;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.createImpactEffect(targetX, targetY, targetZ);
            }
        };
        
        animate();
    }
    
    updateMeteorTrail() {
        if (!this.meteorTrail) return;
        
        const positions = this.meteorTrail.geometry.attributes.position.array;
        
        // Mover todos los puntos hacia atrás
        for (let i = positions.length - 3; i >= 3; i -= 3) {
            positions[i] = positions[i - 3];
            positions[i + 1] = positions[i - 2];
            positions[i + 2] = positions[i - 1];
        }
        
        // Agregar nueva posición al frente
        positions[0] = this.meteor.position.x;
        positions[1] = this.meteor.position.y;
        positions[2] = this.meteor.position.z;
        
        this.meteorTrail.geometry.attributes.position.needsUpdate = true;
    }
    
    createImpactEffect(x, y, z) {
        // Crear explosión
        const explosionGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const explosionMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.8
        });
        
        const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
        explosion.position.set(x, y, z);
        this.scene.add(explosion);
        
        // Animación de explosión
        const startTime = Date.now();
        const animateExplosion = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 1000;
            
            if (progress < 1) {
                explosion.scale.setScalar(1 + progress * 5);
                explosionMaterial.opacity = 0.8 * (1 - progress);
                requestAnimationFrame(animateExplosion);
            } else {
                this.scene.remove(explosion);
            }
        };
        
        animateExplosion();
        
        // Crear cráter en la superficie
        this.createCrater(x, y, z);
        
        // Crear ondas de choque
        this.createShockWaves(x, y, z);
    }
    
    createCrater(x, y, z) {
        // Crear un cráter simple como un círculo oscuro
        const craterGeometry = new THREE.CircleGeometry(0.3, 16);
        const craterMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        
        const crater = new THREE.Mesh(craterGeometry, craterMaterial);
        
        // Posicionar el cráter en la superficie de la Tierra
        const normal = new THREE.Vector3(x, y, z).normalize();
        crater.position.copy(normal.multiplyScalar(2.01));
        crater.lookAt(normal.multiplyScalar(3));
        
        this.scene.add(crater);
    }
    
    createShockWaves(x, y, z) {
        for (let i = 0; i < 3; i++) {
            const waveGeometry = new THREE.RingGeometry(0.1, 0.2, 16);
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.position.set(x, y, z);
            this.scene.add(wave);
            
            // Animar la onda
            const startTime = Date.now();
            const delay = i * 200;
            
            const animateWave = () => {
                const elapsed = Date.now() - startTime - delay;
                if (elapsed < 0) {
                    requestAnimationFrame(animateWave);
                    return;
                }
                
                const progress = elapsed / 2000;
                
                if (progress < 1) {
                    wave.scale.setScalar(1 + progress * 10);
                    waveMaterial.opacity = 0.6 * (1 - progress);
                    requestAnimationFrame(animateWave);
                } else {
                    this.scene.remove(wave);
                }
            };
            
            animateWave();
        }
    }
    
    setImpactPoint(lat, lon) {
        // Convertir coordenadas geográficas a coordenadas 3D
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = 2.1 * Math.sin(phi) * Math.cos(theta);
        const y = 2.1 * Math.cos(phi);
        const z = 2.1 * Math.sin(phi) * Math.sin(theta);
        
        // Crear marcador de impacto
        if (this.impactPoint) {
            this.scene.remove(this.impactPoint);
        }
        
        const markerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        
        this.impactPoint = new THREE.Mesh(markerGeometry, markerMaterial);
        this.impactPoint.position.set(x, y, z);
        this.scene.add(this.impactPoint);
        
        // Buscar ciudad más cercana
        this.findNearestCity(lat, lon);
        
        // Animación de pulso
        const pulse = () => {
            this.impactPoint.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.2);
            requestAnimationFrame(pulse);
        };
        pulse();
    }
    
    async findNearestCity(lat, lon) {
        try {
            // Lista de ciudades principales del mundo con sus coordenadas
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
            
        } catch (error) {
            console.error('Error al buscar ciudad más cercana:', error);
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
    
    onMouseClick(event) {
        // Calcular posición del mouse en coordenadas normalizadas
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Actualizar raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calcular intersecciones con la Tierra
        const intersects = this.raycaster.intersectObject(this.earth);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // Convertir coordenadas 3D a coordenadas geográficas
            const lat = 90 - Math.acos(point.y / 2) * 180 / Math.PI;
            const lon = Math.atan2(point.z, point.x) * 180 / Math.PI;
            
            // Establecer punto de impacto
            this.setImpactPoint(lat, lon);
            
            // Notificar a la simulación principal
            if (window.meteorSimulation) {
                window.meteorSimulation.setImpactLocation(lat, lon);
            }
            
            // Mostrar mensaje
            this.showClickMessage(lat, lon);
        }
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
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Rotar la Tierra
        if (this.earth) {
            this.earth.rotation.y += 0.001;
        }
        
        // Actualizar controles
        this.controls.update();
        
        // Renderizar
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = document.getElementById('earth-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        window.removeEventListener('resize', this.onWindowResize);
    }
}

// Exportar para uso global
window.Earth3D = Earth3D;
