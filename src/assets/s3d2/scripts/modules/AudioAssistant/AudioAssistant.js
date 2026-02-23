let THREE;

const ensureThreeLoaded = async () => {
    if (THREE) return THREE;

    const threeModule = await import(
        /* webpackChunkName: "three" */ 'three'
    );
    THREE = threeModule;

    if (typeof window !== 'undefined') {
        window.THREE = window.THREE || THREE;
    }

    return THREE;
};

class AudioAssistant {
    constructor(config) {
        this.isActive = false;
        this.needToInitialize = config.needToInitialize;
        this.preloadedFiles = {};
        this.parent = config.parent;
        this.currentPlayback = null;
        this.config = config.config || {};
        this.events = config.events || [];
        this.firstClickInitialized = false;
        this.audioKey = '';
        this.KEY = 's3d_audioAssistantState';
        this.SWITCH_SELECTOR = '[data-s3d-audio-guide-switch]';
        this.REPEAT_SELECTOR = '[data-s3d-audio-guide-repeat]';
        this.STOP_SELECTOR = '[data-s3d-audio-guide-disable]';
        this.ENABLE_SELECTOR = '[data-s3d-audio-guide-enable]';
        this.PLAY_MARKER_SELECTOR = '[data-s3d-audio-guide-play-marker]';
        this.STATE_MARKER_SELECTOR = '[data-s3d-audio-guide-state-marker]';
        this.SPHERE_SELECTOR = '[data-s3d2-audio-assistant]';

        this.sphere_timings = {
            on: 0.0035,
            hover: 0.002,
            off: 0.001,
        }
        this.sphereAnimation = true;
        this.sphereSpeed = this.sphere_timings.off;

        if (this.needToInitialize) {
            this.init(); 
        } else {
            this.destroy();
        }
    }
    setPlaySphereSpeed() {
        this.sphereSpeed = this.sphere_timings.on;
    }
    setStopSphereSpeed() {
        this.sphereSpeed = this.sphere_timings.off;
    }
    turnOn() {
        // Code to turn on the audio assistant
        this.isActive = true;
        this.updateUI();
        localStorage.setItem(this.KEY, true);
        console.log('turnOn', this.audioKey);
        // this.setPlaySphereSpeed();
        this.play(this.audioKey);
    }
    turnOff() {
        localStorage.setItem(this.KEY, false);
        this.isActive = false;
        this.updateUI();
        if (this.currentPlayback) {
            this.currentPlayback.pause();
            this.setStopSphereSpeed();
        }
    }
    init() {
        this.startEvents();
        this.preloadFiles();
        this.initSphere();
        this.checkLocalStorage();
        this.firstClickHandler();
        this.initUIListeners();
        this.updateUI();
    }
    
    firstClickHandler() {
        document.body.addEventListener('click', () => {
            this.firstClickInitialized = true;
            this.play(this.audioKey);
        }, { once: true });
    }

    startEvents() {
        this.events.forEach(event => {
            this.parent.on(event, this.eventHandler.bind(this));
        })
    }

    eventHandler(event) {

        document.querySelector('.s3d-ctr__audio').classList.toggle('disabled', event.type === 'intro');

        let audioKey = event.type;
        switch (event.type) {
            case 'flyby':
            audioKey = `flyby_${event.flyby}_${event.side}`;
            if (event.controlPoint) {
                audioKey += `_${event.controlPoint}`;
            }
            break;
            case 'genplan':
            if (event.controlPoint) {
                audioKey = `genplan_${event.controlPoint}`;
            }
            break;
        }

        if (this.audioKey === audioKey) {
            return;
        }
        
        this.play(audioKey);
    }

    preloadFiles() {
        const config = this.config;
        if (this.config) {
            Object.keys(config).forEach(key => {
                const audio = new Audio(config[key]);
                audio.load();
                this.preloadedFiles[key] = audio;
            });
        }
    }
    checkLocalStorage() {
        const storedState = localStorage.getItem(this.KEY);
        if (storedState === null) {
            localStorage.setItem(this.KEY, false);
            this.isActive = false;
        }
        if (storedState === 'true') {
            this.isActive = true;
        }
        if (storedState === 'false') {
            this.isActive = false;
        }
    }
    updateUI() {
        document.querySelectorAll(this.SWITCH_SELECTOR).forEach(switcher => {
            switcher.classList.toggle('active', this.isActive);
            switcher.dataset.s3d_audioGuideState = this.isActive ? 'on' : 'off';
        });
        document.querySelectorAll(this.STOP_SELECTOR).forEach(marker => {
            marker.dataset.s3d_audioGuideState = this.isActive ? 'on' : 'off';
        });
        document.querySelectorAll(this.ENABLE_SELECTOR).forEach(marker => {
            marker.dataset.s3d_audioGuideState = this.isActive ? 'on' : 'off';
        });
        document.querySelectorAll(this.STATE_MARKER_SELECTOR).forEach(marker => {
            marker.classList.toggle(this.KEY + '-active', this.isActive);
            marker.classList.toggle(this.KEY + '-inactive', !this.isActive);
            marker.dataset.s3d_audioGuideState = this.isActive ? 'on' : 'off';
            this.sphereAnimation = this.isActive;
        });
        document.querySelectorAll(this.REPEAT_SELECTOR).forEach(marker => {
            marker.dataset.s3d_audioGuideState = this.isActive ? 'on' : 'off';
        });
    }  
    initUIListeners() {
        document.body.addEventListener('click', e => {
            if (e.target.closest(this.SWITCH_SELECTOR)) {
                if (this.isActive) {
                    this.turnOff();
                } else {
                    this.turnOn();
                }
            }
        });
        document.body.addEventListener('click', e => {
            if (e.target.closest(this.STOP_SELECTOR)) {
                this.turnOff();
            }
        })
        document.body.addEventListener('click', e => {
            if (e.target.closest(this.ENABLE_SELECTOR)) {
                this.turnOn();
            }
        })
        document.body.addEventListener('click', e => {
            if (e.target.closest(this.REPEAT_SELECTOR)) {
                if (this.isActive) this.play(this.audioKey);
            }
        });
        document.body.addEventListener('click', e => {
            if (e.target.closest(this.SPHERE_SELECTOR)) {
                e.stopPropagation();
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.resume();
                }
            }
        });
    }

    pause() {
        if (this.currentPlayback) {
            this.currentPlayback.pause();
            // this.setStopSphereSpeed();
        }
        this.isPlaying = false;
    }

    resume() {
        if (this.currentPlayback && this.preloadedFiles[this.audioKey]) {
            this.currentPlayback.play();
            // this.setPlaySphereSpeed();
        }
        this.isPlaying = true;
    }

    play(audioKey) {
        
        if (this.currentPlayback) {
            this.currentPlayback.pause();
        }
        this.audioKey = audioKey;
        if (this.firstClickInitialized && this.isActive && this.preloadedFiles[audioKey]) {
            const audio = this.preloadedFiles[this.audioKey];
            audio.currentTime = 0;
            this.currentPlayback = audio;
            this.defineCurrentPlaybackEvents();

            this.currentPlayback.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            
        }
        this.isPlaying = true;
    }
    defineCurrentPlaybackEvents() {
        this.currentPlayback.onpause = () => {
            this.stopMarkerAnimation();
            this.setStopSphereSpeed();
        }
        this.currentPlayback.onplay = () => {
            this.startMarkerAnimation();
            this.setPlaySphereSpeed();
        }
        this.currentPlayback.onended = (e) => {
            this.stopMarkerAnimation();
            this.isPlaying = false;
            e.target.currentTime = 0;
            this.setStopSphereSpeed();

        }
    }
    startMarkerAnimation() {
        document.querySelectorAll(this.PLAY_MARKER_SELECTOR).forEach(marker => {
            marker.classList.add('playing');
        });
        document.querySelector('.s3d-ctr__audio').classList.add('playing');
        this.setPlaySphereSpeed();
    }
    stopMarkerAnimation() {
        document.querySelectorAll(this.PLAY_MARKER_SELECTOR).forEach(marker => {
            marker.classList.remove('playing');
        });
        document.querySelector('.s3d-ctr__audio').classList.remove('playing');
        this.setStopSphereSpeed();
    }
    destroy() {
        document.querySelectorAll(this.PLAY_MARKER_SELECTOR).forEach(marker => {
            marker.remove();
        });
        document.querySelectorAll(this.SWITCH_SELECTOR).forEach(marker => {
            marker.remove();
        });
        document.querySelectorAll(this.REPEAT_SELECTOR).forEach(marker => {
            marker.remove();
        });
        document.querySelectorAll(this.STOP_SELECTOR).forEach(marker => {
            marker.remove();
        });
        document.querySelectorAll(this.STATE_MARKER_SELECTOR).forEach(marker => {
            marker.remove();
        });
        document.querySelectorAll(this.SPHERE_SELECTOR).forEach(marker => {
            marker.remove();
        });
        if (this.currentPlayback) {
            this.currentPlayback.pause();
            this.currentPlayback = null;
        }
        cancelAnimationFrame(this.requestAnimationFrame);
    }
    async initSphere() {
        this.sphere = document.querySelector(this.SPHERE_SELECTOR);
        if (!this.sphere) return;

        const THREE = await ensureThreeLoaded();
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl', { alpha: true });
        const renderer = new THREE.WebGLRenderer({ canvas, context });
        renderer.setSize(this.sphere.getBoundingClientRect().width, this.sphere.getBoundingClientRect().height);
        renderer.setClearColor(0x000000, 0); // Прозорий фон
        this.sphere.appendChild(renderer.domElement);

        // renderer.domElement.setAttribute('data-s3d-audio-guide-repeat', 'true');

        if (window.screen.width > 1024) {
            renderer.domElement.addEventListener('mouseenter', () => {
                if (this.sphereSpeed == this.sphere_timings.on) return;
                this.sphereSpeed = this.sphere_timings.hover; // Set hover speed
            }, false);
            renderer.domElement.addEventListener('mouseleave', () => {
                if (this.sphereSpeed == this.sphere_timings.on) return;
                this.sphereSpeed = this.sphere_timings.off; // Reset speed on mouse leave
            })
        }


        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3(this.sphere.getBoundingClientRect().width, this.sphere.getBoundingClientRect().height, 1) }
        };

        const fragmentShader = this.fragmentShader;

        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        // Create a plane that fills the screen
        const geometry = new THREE.PlaneGeometry(2, 2);

        const svgMaterial = new THREE.MeshBasicMaterial({
            // map: new THREE.TextureLoader().load(`%3Csvg xmlns='http://www.w3.org/2000/svg' width='800px' height='800px' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12 19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C7 18.1193 8.11929 17 9.5 17C10.8807 17 12 18.1193 12 19.5Z' stroke='%231C274C' stroke-width='1.5'/%3E%3Cpath d='M22 17.5C22 18.8807 20.8807 20 19.5 20C18.1193 20 17 18.8807 17 17.5C17 16.1193 18.1193 15 19.5 15C20.8807 15 22 16.1193 22 17.5Z' stroke='%231C274C' stroke-width='1.5'/%3E%3Cpath d='M22 8L12 12' stroke='%231C274C' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M14.4556 5.15803L14.7452 5.84987L14.4556 5.15803ZM16.4556 4.32094L16.1661 3.62909L16.4556 4.32094ZM21.1081 3.34059L20.6925 3.96496L20.6925 3.96496L21.1081 3.34059ZM21.25 12.0004C21.25 12.4146 21.5858 12.7504 22 12.7504C22.4142 12.7504 22.75 12.4146 22.75 12.0004H21.25ZM12.75 19.0004V8.84787H11.25V19.0004H12.75ZM14.7452 5.84987L16.7452 5.01278L16.1661 3.62909L14.1661 4.46618L14.7452 5.84987ZM22.75 8.01078C22.75 6.67666 22.752 5.59091 22.6304 4.76937C22.5067 3.93328 22.2308 3.18689 21.5236 2.71622L20.6925 3.96496C20.8772 4.08787 21.0473 4.31771 21.1466 4.98889C21.248 5.67462 21.25 6.62717 21.25 8.01078H22.75ZM16.7452 5.01278C18.0215 4.47858 18.901 4.11263 19.5727 3.94145C20.2302 3.77391 20.5079 3.84204 20.6925 3.96496L21.5236 2.71622C20.8164 2.24554 20.0213 2.2792 19.2023 2.48791C18.3975 2.69298 17.3967 3.114 16.1661 3.62909L16.7452 5.01278ZM12.75 8.84787C12.75 8.18634 12.751 7.74991 12.7875 7.41416C12.822 7.09662 12.8823 6.94006 12.9594 6.8243L11.7106 5.99325C11.4527 6.38089 11.3455 6.79864 11.2963 7.25218C11.249 7.68752 11.25 8.21893 11.25 8.84787H12.75ZM14.1661 4.46618C13.5859 4.70901 13.0953 4.91324 12.712 5.12494C12.3126 5.34549 11.9686 5.60562 11.7106 5.99325L12.9594 6.8243C13.0364 6.70855 13.1575 6.59242 13.4371 6.438C13.7328 6.27473 14.135 6.10528 14.7452 5.84987L14.1661 4.46618ZM22.75 12.0004V8.01078H21.25V12.0004H22.75Z' fill='%231C274C'/%3E%3Cpath d='M7 11V6.5V2' stroke='%231C274C' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='4.5' cy='10.5' r='2.5' stroke='%231C274C' stroke-width='1.5'/%3E%3Cpath d='M10 5C8.75736 5 7 4.07107 7 2' stroke='%231C274C' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E`),
            map: new THREE.TextureLoader().load(`/wp-content/themes/3d/assets/s3d/images/music-notes-svgrepo-com.svg`),
            transparent: true,

            anisotropy: renderer.capabilities.getMaxAnisotropy(),
            
        });
        const material = svgMaterial;
        // const material = new THREE.ShaderMaterial({
        //     fragmentShader,
        //     vertexShader,
        //     uniforms,
        //     transparent: true, // <-- обов'язково!
        // });
        

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        const that = this;

        // Animation loop
        function animate(time) {
            that.requestAnimationFrame = requestAnimationFrame(animate);
            if (!that.sphereAnimation) return; // Stop animation if sphereAnimation is false
            uniforms.iTime.value = time * that.sphereSpeed; // Convert to seconds
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            renderer.setSize(this.sphere.getBoundingClientRect().width, this.sphere.getBoundingClientRect().height);
            uniforms.iResolution.value.set(this.sphere.getBoundingClientRect().width, this.sphere.getBoundingClientRect().height, 1);
        });

        animate(0);
    }

    get fragmentShader() {
        return `
            #define TAU 6.28318530718
            
            uniform float iTime;
            uniform vec3 iResolution;

            float rand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 p) {
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;    
            }

            float fbm(vec2 p, int octaves) {
                float s = 0.0;
                float m = 0.0;
                float a = 0.5;
                
                if (octaves >= 1) {
                    s += a * noise(p);
                    m += a;
                    a *= 0.5;
                    p *= 2.0;
                }
                
                if (octaves >= 2) {
                    s += a * noise(p);
                    m += a;
                    a *= 0.5;
                    p *= 2.0;
                }
                
                if (octaves >= 3) {
                    s += a * noise(p);
                    m += a;
                    a *= 0.5;
                    p *= 2.0;
                }
                
                if (octaves >= 4) {
                    s += a * noise(p);
                    m += a;
                    a *= 0.5;
                    p *= 2.0;
                }
                return s / m;
            }

            vec3 pal(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
                return a + b * cos(TAU * (c * t + d));
            }

            float luma(vec3 color) {
                return dot(color, vec3(0.299, 0.587, 0.114));
            }

            void mainImage(out vec4 fragColor, in vec2 fragCoord) {
                float min_res = min(iResolution.x, iResolution.y);
                vec2 uv = (fragCoord * 2.0 - iResolution.xy) / min_res * 1.5;
                float t = iTime;
                float l = dot(uv, uv);
                if (l > 2.5) {
                    fragColor = vec4(1.0, 0.0, 0.0, 0.0); // прозорий
                    return;
                }
                float sm = smoothstep(1.02, 0.98, l);
                float d = sm * l * l * l * 2.0;
                vec3 norm = normalize(vec3(uv.x, uv.y, .7 - d));
                float nx = fbm(uv * 2.0 + t * 0.4 + 25.69, 4);
                float ny = fbm(uv * 2.0 + t * 0.4 + 86.31, 4);
                float n = fbm(uv * 3.0 + 2.0 * vec2(nx, ny), 3);
                vec3 col = vec3(n * 0.5 + 0.25);
                float a = atan(uv.y, uv.x) / TAU + t * 0.1;
                col *= pal(a, vec3(0.3),vec3(0.5, 0.5, 0.5),vec3(1),vec3(0.0,0.8,0.8));
                col *= 2.0;  
                vec3 cd = abs(col);
                vec3 c = col * d;
                c += (c * 0.5 + vec3(1.0) - luma(c)) * vec3(max(0.0, pow(dot(norm, vec3(0, 0, -1)), 5.0) * 3.0));
                float g = 1.5 * smoothstep(0.6, 1.0, fbm(norm.xy * 3.0 / (1.0 + norm.z), 2)) * d;
                c += g;
                col = c + col * pow((1.0 - smoothstep(1.0, 0.98, l) - pow(max(0.0, length(uv) - 1.0), 0.2)) * 2.0, 4.0);
                float f = fbm(normalize(uv) * 2. + t, 2) + 0.1;
                uv *= f + 0.1;
                uv *= 0.5;
                l = dot(uv, uv);
                vec3 ins = normalize(cd) + 0.1;
                float ind = 0.2 + pow(smoothstep(0.0, 1.5, sqrt(l)) * 48.0, 0.25);
                ind *= ind * ind * ind;
                ind = 1.0 / ind;
                ins *= ind;
                col += ins * ins * sm * smoothstep(0.7, 1.0, ind);
                col += abs(norm) * (1.0 - d) * sm * 0.25;
                fragColor = vec4(col, 1.0);
            }

            void main() {
                mainImage(gl_FragColor, gl_FragCoord.xy);
            }
        `
    }
}


export default AudioAssistant;