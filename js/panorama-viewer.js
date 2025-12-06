// 360 Panorama Viewer
class PanoramaViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.currentLocation = 'aktorovyy-zal';
        this.mesh = null;

        // Location data - update image paths to your actual 360 images
        this.locations = {
            'aktorovyy-zal': {
                name: 'Актовый зал',
                image: 'C:/Users/natsu/OneDrive/Desktop/fotos/IITU/Актовый зал/aktorovyy-zal.jpg' // Replace with your image path
            },
            'ino-centre': {
                name: 'INO центр',
                image: 'C:/Users/natsu/OneDrive/Desktop/fotos/IITU/ИНО/ino-image.jpg' // Replace with your image path
            }
        };

        this.init();
        this.setupEventListeners();
    }

    init() {
        const canvas = document.getElementById('panorama-canvas');
        const container = document.getElementById('panorama-viewer');

        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 0.1);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Simple orbit controls
        this.setupControls();

        // Load initial panorama
        this.loadPanorama(this.currentLocation);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    setupControls() {
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        const canvas = document.getElementById('panorama-canvas');

        // Mouse controls
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;

            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;

            targetRotationY += deltaX * 0.005;
            targetRotationX += deltaY * 0.005;

            // Limit vertical rotation
            targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));

            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - touchStartX;
                const deltaY = e.touches[0].clientY - touchStartY;

                targetRotationY += deltaX * 0.005;
                targetRotationX += deltaY * 0.005;

                targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));

                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });

        // Mouse wheel for zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.fov += e.deltaY * 0.1;
            this.camera.fov = Math.max(10, Math.min(100, this.camera.fov));
            this.camera.updateProjectionMatrix();
        });

        // Store references for animate loop
        this.controlState = {
            isMouseDown,
            targetRotationX,
            targetRotationY
        };

        // Return an object-like interface for animation
        this.rotationTarget = { x: 0, y: 0 };
    }

    loadPanorama(location) {
        const imageUrl = this.locations[location].image;

        // Remove old mesh if it exists
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }

        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(500, 64, 64);

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            imageUrl,
            (texture) => {
                // Flip the texture for panorama
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                const material = new THREE.MeshBasicMaterial({ map: texture });
                this.mesh = new THREE.Mesh(geometry, material);
                
                // Flip the sphere inside-out
                this.mesh.scale.x = -1;
                
                this.scene.add(this.mesh);
            },
            undefined,
            (error) => {
                console.error('Error loading panorama image:', error);
                // Create a fallback error message
                const canvas = document.getElementById('panorama-canvas');
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Image not found: ' + imageUrl, canvas.width / 2, canvas.height / 2);
            }
        );

        this.currentLocation = location;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth camera rotation
        if (this.mesh) {
            // Rotate mesh instead of camera for better panorama effect
            if (this.rotationTarget.x !== undefined) {
                this.mesh.rotation.x += (this.rotationTarget.x - this.mesh.rotation.x) * 0.1;
                this.mesh.rotation.y += (this.rotationTarget.y - this.mesh.rotation.y) * 0.1;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        // Button click handlers
        const buttons = document.querySelectorAll('.btn-panorama');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const location = e.target.dataset.location;
                
                // Update active button
                buttons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Load new panorama
                this.loadPanorama(location);

                // Reset rotation
                this.rotationTarget = { x: 0, y: 0 };
            });
        });
    }

    onWindowResize() {
        const canvas = document.getElementById('panorama-canvas');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Initialize panorama viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PanoramaViewer();
    
    // Make it accessible globally if needed
    window.panoramaViewer = viewer;
});

// Handle mouse movement for rotation
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('panorama-canvas');
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    if (canvas && window.panoramaViewer) {
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;

            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;

            if (window.panoramaViewer.rotationTarget) {
                window.panoramaViewer.rotationTarget.y += deltaX * 0.01;
                window.panoramaViewer.rotationTarget.x += deltaY * 0.01;

                // Limit vertical rotation
                window.panoramaViewer.rotationTarget.x = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, window.panoramaViewer.rotationTarget.x)
                );
            }

            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - touchStartX;
                const deltaY = e.touches[0].clientY - touchStartY;

                if (window.panoramaViewer.rotationTarget) {
                    window.panoramaViewer.rotationTarget.y += deltaX * 0.01;
                    window.panoramaViewer.rotationTarget.x += deltaY * 0.01;

                    window.panoramaViewer.rotationTarget.x = Math.max(
                        -Math.PI / 2,
                        Math.min(Math.PI / 2, window.panoramaViewer.rotationTarget.x)
                    );
                }

                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });

        // Mouse wheel zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (window.panoramaViewer.camera) {
                window.panoramaViewer.camera.fov += e.deltaY * 0.1;
                window.panoramaViewer.camera.fov = Math.max(10, Math.min(100, window.panoramaViewer.camera.fov));
                window.panoramaViewer.camera.updateProjectionMatrix();
            }
        });
    }
});
