// ===== Global variables =====
let modal = null;

// ===== Wait for DOM to be ready =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // ===== Navigation & Mobile Menu =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Modal Management =====
    modal = document.getElementById('experimentModal');
    const closeModal = document.querySelector('.close-modal');
    const experimentCards = document.querySelectorAll('.experiment-card');

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) {
                modal.style.display = 'none';
            }
            stopAllAnimations();
        });
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                stopAllAnimations();
            }
        });
    }

    // Handle clicks on experiment cards and buttons
    experimentCards.forEach(card => {
        // Click on the card itself
        card.addEventListener('click', (e) => {
            // Only trigger if not clicking on the button
            if (!e.target.classList.contains('card-btn') && !e.target.closest('.card-btn')) {
                const experimentType = card.getAttribute('data-experiment');
                if (experimentType) {
                    openExperiment(experimentType);
                }
            }
        });
        
        // Also handle button clicks directly
        const cardBtn = card.querySelector('.card-btn');
        if (cardBtn) {
            cardBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click from firing
                e.preventDefault();
                const experimentType = card.getAttribute('data-experiment');
                if (experimentType) {
                    openExperiment(experimentType);
                }
            });
        }
    });
}

// ===== Scroll Functions =====
function scrollToExperiments() {
    document.getElementById('experiments').scrollIntoView({
        behavior: 'smooth'
    });
}

function showAbout() {
    document.getElementById('about').scrollIntoView({
        behavior: 'smooth'
    });
}

function openExperiment(type) {
    if (!modal) {
        modal = document.getElementById('experimentModal');
    }
    if (modal) {
        modal.style.display = 'block';
    }
    const container = document.getElementById('experimentContainer');
    if (!container) {
        console.error('Experiment container not found');
        return;
    }
    
    switch(type) {
        case 'gravity':
            container.innerHTML = createGravityExperiment();
            initGravityExperiment();
            break;
        case 'pendulum':
            container.innerHTML = createPendulumExperiment();
            initPendulumExperiment();
            break;
        case 'wave':
            container.innerHTML = createWaveExperiment();
            initWaveExperiment();
            break;
        case 'circuit':
            container.innerHTML = createCircuitExperiment();
            initCircuitExperiment();
            break;
        case 'reaction':
            container.innerHTML = createReactionExperiment();
            initReactionExperiment();
            break;
        case 'molecules':
            container.innerHTML = createMoleculesExperiment();
            initMoleculesExperiment();
            break;
        case 'states':
            container.innerHTML = createStatesExperiment();
            initStatesExperiment();
            break;
        case 'ph':
            container.innerHTML = createPHExperiment();
            initPHExperiment();
            break;
        case 'refraction':
            container.innerHTML = createRefractionExperiment();
            initRefractionExperiment();
            break;
        case 'magnetic':
            container.innerHTML = createMagneticExperiment();
            initMagneticExperiment();
            break;
        case 'sound':
            container.innerHTML = createSoundExperiment();
            initSoundExperiment();
            break;
        case 'projectile':
            container.innerHTML = createProjectileExperiment();
            initProjectileExperiment();
            break;
        case 'friction':
            container.innerHTML = createFrictionExperiment();
            initFrictionExperiment();
            break;
        case 'periodic':
            container.innerHTML = createPeriodicExperiment();
            initPeriodicExperiment();
            break;
        case 'optics':
            container.innerHTML = createOpticsExperiment();
            initOpticsExperiment();
            break;
    }
}

let animationFrames = [];

function stopAllAnimations() {
    animationFrames.forEach(id => cancelAnimationFrame(id));
    animationFrames = [];
}

// ===== Gravity & Motion Experiment =====
function createGravityExperiment() {
    return `
        <div class="experiment-header">
            <h2>Gravity & Motion</h2>
            <p>Adjust the height and mass to see how objects fall under gravity</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Gravity</strong> is the force that attracts objects toward the Earth. According to <strong>Galileo's law of free fall</strong>, all objects fall at the same acceleration (9.8 m/s²) regardless of their mass, when air resistance is negligible. The final velocity of a falling object depends on the height from which it falls: <strong>v = √(2gh)</strong>, where g is gravitational acceleration and h is height. The time of fall is calculated as: <strong>t = √(2h/g)</strong>.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Height: <span id="gravity-height-value">100</span>m</label>
                <input type="range" id="gravity-height" min="50" max="300" value="100">
            </div>
            <div class="control-group">
                <label>Mass: <span id="gravity-mass-value">1</span>kg</label>
                <input type="range" id="gravity-mass" min="1" max="10" value="1">
            </div>
            <button class="control-btn" id="gravity-start">Drop Object</button>
            <button class="control-btn" id="gravity-reset">Reset</button>
        </div>
        <div class="experiment-canvas" id="gravity-canvas"></div>
        <div id="gravity-info" style="text-align: center; color: var(--text-secondary); margin-top: 1rem;"></div>
    `;
}

function initGravityExperiment() {
    const canvas = document.getElementById('gravity-canvas');
    const heightSlider = document.getElementById('gravity-height');
    const massSlider = document.getElementById('gravity-mass');
    const heightValue = document.getElementById('gravity-height-value');
    const massValue = document.getElementById('gravity-mass-value');
    const startBtn = document.getElementById('gravity-start');
    const resetBtn = document.getElementById('gravity-reset');
    const infoDiv = document.getElementById('gravity-info');
    
    let animationId = null;
    let isRunning = false;
    let ball = null;
    
    heightSlider.addEventListener('input', (e) => {
        heightValue.textContent = e.target.value;
        if (!isRunning) {
            drawScene();
        }
    });
    
    massSlider.addEventListener('input', (e) => {
        massValue.textContent = e.target.value;
    });
    
    function drawScene() {
        canvas.innerHTML = '';
        const height = parseInt(heightSlider.value);
        const ground = canvas.offsetHeight - 50;
        const startY = (height / 300) * (canvas.offsetHeight - 100);
        
        // Draw ground
        const groundEl = document.createElement('div');
        groundEl.style.position = 'absolute';
        groundEl.style.bottom = '0';
        groundEl.style.left = '0';
        groundEl.style.width = '100%';
        groundEl.style.height = '50px';
        groundEl.style.background = 'linear-gradient(to top, #065f46, #10b981)';
        canvas.appendChild(groundEl);
        
        // Draw ball
        if (!isRunning) {
            ball = document.createElement('div');
            ball.style.position = 'absolute';
            ball.style.left = '50%';
            ball.style.top = startY + 'px';
            ball.style.width = '30px';
            ball.style.height = '30px';
            ball.style.background = 'radial-gradient(circle, #fbbf24, #f59e0b)';
            ball.style.borderRadius = '50%';
            ball.style.transform = 'translateX(-50%)';
            ball.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            canvas.appendChild(ball);
        }
    }
    
    startBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        
        const height = parseInt(heightSlider.value);
        const mass = parseInt(massSlider.value);
        const ground = canvas.offsetHeight - 50;
        const startY = (height / 300) * (canvas.offsetHeight - 100);
        
        canvas.innerHTML = '';
        drawScene();
        
        ball = document.createElement('div');
        ball.style.position = 'absolute';
        ball.style.left = '50%';
        ball.style.top = startY + 'px';
        ball.style.width = (30 + mass * 3) + 'px';
        ball.style.height = (30 + mass * 3) + 'px';
        ball.style.background = 'radial-gradient(circle, #fbbf24, #f59e0b)';
        ball.style.borderRadius = '50%';
        ball.style.transform = 'translateX(-50%)';
        ball.style.transition = 'none';
        ball.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        canvas.appendChild(ball);
        
        let y = startY;
        let velocity = 0;
        const gravity = 9.8;
        const timeStep = 0.016;
        let time = 0;
        
        function animate() {
            time += timeStep;
            velocity += gravity * 10;
            y += velocity * timeStep;
            
            // Add rotation effect
            const rotation = time * 5;
            ball.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
            
            // Add scale effect on impact
            if (y + 30 + mass * 3 >= ground - 5) {
                const impactScale = 1 + Math.sin(time * 50) * 0.2;
                ball.style.transform = `translateX(-50%) scale(${impactScale})`;
            }
            
            if (y + 30 + mass * 3 >= ground) {
                y = ground - 30 - mass * 3;
                const finalVelocity = Math.sqrt(2 * gravity * 10 * (startY / 10));
                const finalTime = Math.sqrt(2 * (startY / 10) / (gravity / 10));
                
                // Add impact particles
                for (let i = 0; i < 10; i++) {
                    const particle = document.createElement('div');
                    particle.style.position = 'absolute';
                    particle.style.left = '50%';
                    particle.style.top = (ground - 20) + 'px';
                    particle.style.width = '6px';
                    particle.style.height = '6px';
                    particle.style.background = '#fbbf24';
                    particle.style.borderRadius = '50%';
                    particle.style.transform = 'translateX(-50%)';
                    particle.style.transition = 'all 0.5s ease-out';
                    canvas.appendChild(particle);
                    
                    setTimeout(() => {
                        const angle = (i / 10) * Math.PI * 2;
                        const distance = 50;
                        particle.style.left = (canvas.offsetWidth / 2 + Math.cos(angle) * distance) + 'px';
                        particle.style.top = (ground - 20 - Math.sin(angle) * distance) + 'px';
                        particle.style.opacity = '0';
                        setTimeout(() => particle.remove(), 500);
                    }, 10);
                }
                
                infoDiv.innerHTML = `
                    <strong>Results:</strong><br>
                    Final Velocity: ${finalVelocity.toFixed(2)} m/s<br>
                    Time of Fall: ${finalTime.toFixed(2)} seconds<br>
                    Distance: ${height}m
                `;
                isRunning = false;
                startBtn.disabled = false;
                return;
            }
            
            ball.style.top = y + 'px';
            animationId = requestAnimationFrame(animate);
            animationFrames.push(animationId);
        }
        
        animate();
    });
    
    resetBtn.addEventListener('click', () => {
        if (animationId) cancelAnimationFrame(animationId);
        isRunning = false;
        startBtn.disabled = false;
        infoDiv.innerHTML = '';
        drawScene();
    });
    
    drawScene();
}

// ===== Pendulum Experiment =====
function createPendulumExperiment() {
    return `
        <div class="experiment-header">
            <h2>Pendulum Motion</h2>
            <p>Observe the oscillation of a simple pendulum</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p>A <strong>simple pendulum</strong> consists of a mass suspended from a fixed point. The period (time for one complete swing) depends only on the length of the string and gravitational acceleration: <strong>T = 2π√(L/g)</strong>, where L is length and g is gravity. The period is independent of the mass and amplitude (for small angles). This is called <strong>simple harmonic motion</strong> - the restoring force is proportional to the displacement.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Length: <span id="pendulum-length-value">100</span>cm</label>
                <input type="range" id="pendulum-length" min="50" max="200" value="100">
            </div>
            <div class="control-group">
                <label>Angle: <span id="pendulum-angle-value">30</span>°</label>
                <input type="range" id="pendulum-angle" min="10" max="60" value="30">
            </div>
            <button class="control-btn" id="pendulum-start">Start</button>
            <button class="control-btn" id="pendulum-stop">Stop</button>
        </div>
        <div class="experiment-canvas" id="pendulum-canvas"></div>
    `;
}

function initPendulumExperiment() {
    const canvas = document.getElementById('pendulum-canvas');
    const lengthSlider = document.getElementById('pendulum-length');
    const angleSlider = document.getElementById('pendulum-angle');
    const lengthValue = document.getElementById('pendulum-length-value');
    const angleValue = document.getElementById('pendulum-angle-value');
    const startBtn = document.getElementById('pendulum-start');
    const stopBtn = document.getElementById('pendulum-stop');
    
    let animationId = null;
    let isRunning = false;
    let angle = 30;
    
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
        if (!isRunning) drawPendulum();
    });
    
    angleSlider.addEventListener('input', (e) => {
        angleValue.textContent = e.target.value;
        if (!isRunning) {
            angle = parseInt(e.target.value) * Math.PI / 180;
            drawPendulum();
        }
    });
    
    function drawPendulum() {
        canvas.innerHTML = '';
        const centerX = canvas.offsetWidth / 2;
        const centerY = 50;
        const length = parseInt(lengthSlider.value) * 2;
        const currentAngle = angle;
        
        const endX = centerX + length * Math.sin(currentAngle);
        const endY = centerY + length * Math.cos(currentAngle);
        
        // Draw string
        const string = document.createElement('div');
        string.style.position = 'absolute';
        string.style.left = centerX + 'px';
        string.style.top = centerY + 'px';
        string.style.width = '2px';
        string.style.height = length + 'px';
        string.style.background = '#94a3b8';
        string.style.transformOrigin = 'top center';
        string.style.transform = `rotate(${currentAngle * 180 / Math.PI}deg)`;
        canvas.appendChild(string);
        
        // Draw bob
        const bob = document.createElement('div');
        bob.style.position = 'absolute';
        bob.style.left = (endX - 15) + 'px';
        bob.style.top = (endY - 15) + 'px';
        bob.style.width = '30px';
        bob.style.height = '30px';
        bob.style.background = 'radial-gradient(circle, #6366f1, #4f46e5)';
        bob.style.borderRadius = '50%';
        bob.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        canvas.appendChild(bob);
    }
    
    startBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        angle = parseInt(angleSlider.value) * Math.PI / 180;
        const length = parseInt(lengthSlider.value);
        const g = 9.8;
        const L = length / 100;
        const period = 2 * Math.PI * Math.sqrt(L / g);
        let angularVelocity = 0;
        let time = 0;
        
        function animate() {
            time += 0.016;
            const damping = 0.998;
            angularVelocity -= (g / L) * Math.sin(angle) * 0.016;
            angle += angularVelocity * 0.016;
            angularVelocity *= damping;
            
            drawPendulum();
            animationId = requestAnimationFrame(animate);
            animationFrames.push(animationId);
        }
        
        animate();
    });
    
    stopBtn.addEventListener('click', () => {
        if (animationId) cancelAnimationFrame(animationId);
        isRunning = false;
    });
    
    drawPendulum();
}

// ===== Wave Motion Experiment =====
function createWaveExperiment() {
    return `
        <div class="experiment-header">
            <h2>Wave Motion</h2>
            <p>Visualize wave propagation and interference</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Waves</strong> are disturbances that transfer energy without transferring matter. Wave properties include: <strong>frequency</strong> (oscillations per second), <strong>amplitude</strong> (maximum displacement), and <strong>wavelength</strong> (distance between peaks). <strong>Wave interference</strong> occurs when two waves meet - they can constructively interfere (add up) or destructively interfere (cancel out). The wave equation is: <strong>v = fλ</strong>, where v is velocity, f is frequency, and λ is wavelength.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Frequency: <span id="wave-freq-value">1</span> Hz</label>
                <input type="range" id="wave-freq" min="0.5" max="3" step="0.1" value="1">
            </div>
            <div class="control-group">
                <label>Amplitude: <span id="wave-amp-value">50</span></label>
                <input type="range" id="wave-amp" min="20" max="100" value="50">
            </div>
            <button class="control-btn" id="wave-start">Start</button>
            <button class="control-btn" id="wave-stop">Stop</button>
        </div>
        <canvas id="wave-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
    `;
}

function initWaveExperiment() {
    const canvas = document.getElementById('wave-canvas');
    const ctx = canvas.getContext('2d');
    const freqSlider = document.getElementById('wave-freq');
    const ampSlider = document.getElementById('wave-amp');
    const freqValue = document.getElementById('wave-freq-value');
    const ampValue = document.getElementById('wave-amp-value');
    const startBtn = document.getElementById('wave-start');
    const stopBtn = document.getElementById('wave-stop');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let animationId = null;
    let isRunning = false;
    let time = 0;
    
    freqSlider.addEventListener('input', (e) => {
        freqValue.textContent = parseFloat(e.target.value).toFixed(1);
    });
    
    ampSlider.addEventListener('input', (e) => {
        ampValue.textContent = e.target.value;
    });
    
    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const frequency = parseFloat(freqSlider.value);
        const amplitude = parseInt(ampSlider.value);
        const centerY = canvas.height / 2;
        
        for (let x = 0; x < canvas.width; x++) {
            const y = centerY + amplitude * Math.sin((x / 50) + time * frequency * 2);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw interference pattern
        ctx.strokeStyle = '#ec4899';
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = centerY + amplitude * Math.sin((x / 50) + time * frequency * 2 + Math.PI);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    startBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        
        function animate() {
            time += 0.016;
            drawWave();
            animationId = requestAnimationFrame(animate);
            animationFrames.push(animationId);
        }
        
        animate();
    });
    
    stopBtn.addEventListener('click', () => {
        if (animationId) cancelAnimationFrame(animationId);
        isRunning = false;
    });
    
    drawWave();
}

// ===== Electric Circuit Experiment =====
function createCircuitExperiment() {
    return `
        <div class="experiment-header">
            <h2>Electric Circuit</h2>
            <p>Build and test electrical circuits</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p>An <strong>electric circuit</strong> is a closed path through which electrons flow. <strong>Ohm's Law</strong> states: <strong>V = I × R</strong>, where V is voltage (volts), I is current (amperes), and R is resistance (ohms). Voltage is the "push" that drives current, resistance opposes it. <strong>Power</strong> consumed is: <strong>P = V × I = I²R</strong>. In a simple circuit, current flows from the positive terminal of a battery through the circuit and back to the negative terminal.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Voltage: <span id="circuit-voltage-value">9</span>V</label>
                <input type="range" id="circuit-voltage" min="1" max="12" value="9">
            </div>
            <div class="control-group">
                <label>Resistance: <span id="circuit-resistance-value">10</span>Ω</label>
                <input type="range" id="circuit-resistance" min="5" max="50" value="10">
            </div>
            <button class="control-btn" id="circuit-calculate">Calculate</button>
        </div>
        <div class="experiment-canvas" id="circuit-canvas"></div>
        <div id="circuit-info" style="text-align: center; margin-top: 1rem; padding: 1rem; background: var(--card-bg); border-radius: 10px;"></div>
    `;
}

function initCircuitExperiment() {
    const canvas = document.getElementById('circuit-canvas');
    const voltageSlider = document.getElementById('circuit-voltage');
    const resistanceSlider = document.getElementById('circuit-resistance');
    const voltageValue = document.getElementById('circuit-voltage-value');
    const resistanceValue = document.getElementById('circuit-resistance-value');
    const calculateBtn = document.getElementById('circuit-calculate');
    const infoDiv = document.getElementById('circuit-info');
    
    voltageSlider.addEventListener('input', (e) => {
        voltageValue.textContent = e.target.value;
        drawCircuit();
    });
    
    resistanceSlider.addEventListener('input', (e) => {
        resistanceValue.textContent = e.target.value;
        drawCircuit();
    });
    
    calculateBtn.addEventListener('click', () => {
        const voltage = parseFloat(voltageSlider.value);
        const resistance = parseFloat(resistanceSlider.value);
        const current = voltage / resistance;
        const power = voltage * current;
        
        infoDiv.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Circuit Analysis</h3>
            <p style="color: var(--text-secondary); margin: 0.3rem 0;">
                <strong>Current (I):</strong> ${current.toFixed(2)} A<br>
                <strong>Power (P):</strong> ${power.toFixed(2)} W<br>
                <strong style="color: var(--success-color);">Ohm's Law: V = I × R</strong>
            </p>
        `;
    });
    
    function drawCircuit() {
        canvas.innerHTML = '';
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        
        // Battery
        const battery = document.createElement('div');
        battery.style.position = 'absolute';
        battery.style.left = (centerX - 100) + 'px';
        battery.style.top = (centerY - 25) + 'px';
        battery.style.width = '50px';
        battery.style.height = '50px';
        battery.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
        battery.style.borderRadius = '5px';
        battery.style.border = '3px solid #78350f';
        battery.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        canvas.appendChild(battery);
        
        // Resistor
        const resistor = document.createElement('div');
        resistor.style.position = 'absolute';
        resistor.style.left = (centerX + 50) + 'px';
        resistor.style.top = (centerY - 15) + 'px';
        resistor.style.width = '80px';
        resistor.style.height = '30px';
        resistor.style.background = 'linear-gradient(135deg, #8b5cf6, #6366f1)';
        resistor.style.borderRadius = '5px';
        resistor.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        canvas.appendChild(resistor);
        
        // Wires
        const wire1 = document.createElement('div');
        wire1.style.position = 'absolute';
        wire1.style.left = (centerX - 50) + 'px';
        wire1.style.top = centerY + 'px';
        wire1.style.width = '100px';
        wire1.style.height = '4px';
        wire1.style.background = '#fbbf24';
        canvas.appendChild(wire1);
        
        const wire2 = document.createElement('div');
        wire2.style.position = 'absolute';
        wire2.style.left = (centerX + 130) + 'px';
        wire2.style.top = centerY + 'px';
        wire2.style.width = '100px';
        wire2.style.height = '4px';
        wire2.style.background = '#fbbf24';
        canvas.appendChild(wire2);
        
        // Animated electrons
        let electronX = centerX - 50;
        const electronInterval = setInterval(() => {
            const electron = document.createElement('div');
            electron.style.position = 'absolute';
            electron.style.left = electronX + 'px';
            electron.style.top = centerY + 'px';
            electron.style.width = '8px';
            electron.style.height = '8px';
            electron.style.background = '#10b981';
            electron.style.borderRadius = '50%';
            electron.style.boxShadow = '0 0 10px #10b981';
            electron.style.transition = 'left 2s linear';
            canvas.appendChild(electron);
            
            setTimeout(() => {
                electron.style.left = (centerX + 230) + 'px';
                setTimeout(() => electron.remove(), 2000);
            }, 10);
        }, 500);
        
        // Store interval for cleanup
        canvas.dataset.interval = electronInterval;
    }
    
    drawCircuit();
}

// ===== Chemical Reaction Experiment =====
function createReactionExperiment() {
    return `
        <div class="experiment-header">
            <h2>Chemical Reactions</h2>
            <p>Observe colorful chemical reactions</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p>A <strong>chemical reaction</strong> occurs when substances (reactants) transform into new substances (products). Types include: <strong>Acid-Base</strong> (neutralization), <strong>Precipitation</strong> (formation of solid from solution), and <strong>Oxidation-Reduction</strong> (transfer of electrons). Reactions are balanced using the <strong>Law of Conservation of Mass</strong> - atoms are neither created nor destroyed. Energy changes (exothermic or endothermic) often accompany reactions.</p>
        </div>
        <div class="controls">
            <select id="reaction-type" class="control-group" style="padding: 0.8rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color);">
                <option value="acid-base">Acid-Base Reaction</option>
                <option value="precipitation">Precipitation</option>
                <option value="oxidation">Oxidation</option>
            </select>
            <button class="control-btn" id="reaction-start">Start Reaction</button>
            <button class="control-btn" id="reaction-reset">Reset</button>
        </div>
        <div class="experiment-canvas" id="reaction-canvas"></div>
    `;
}

function initReactionExperiment() {
    const canvas = document.getElementById('reaction-canvas');
    const reactionType = document.getElementById('reaction-type');
    const startBtn = document.getElementById('reaction-start');
    const resetBtn = document.getElementById('reaction-reset');
    
    function drawReaction(type) {
        canvas.innerHTML = '';
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        
        // Beaker
        const beaker = document.createElement('div');
        beaker.style.position = 'absolute';
        beaker.style.left = (centerX - 75) + 'px';
        beaker.style.top = (centerY - 50) + 'px';
        beaker.style.width = '150px';
        beaker.style.height = '200px';
        beaker.style.border = '4px solid #94a3b8';
        beaker.style.borderBottom = 'none';
        beaker.style.borderRadius = '10px 10px 0 0';
        beaker.style.background = 'transparent';
        canvas.appendChild(beaker);
        
        let liquidColor = '#3b82f6';
        let reactionColor = '#10b981';
        
        if (type === 'acid-base') {
            liquidColor = '#f59e0b';
            reactionColor = '#ef4444';
        } else if (type === 'precipitation') {
            liquidColor = '#6366f1';
            reactionColor = '#fbbf24';
        } else if (type === 'oxidation') {
            liquidColor = '#8b5cf6';
            reactionColor = '#ec4899';
        }
        
        // Liquid
        const liquid = document.createElement('div');
        liquid.style.position = 'absolute';
        liquid.style.left = (centerX - 71) + 'px';
        liquid.style.top = (centerY + 100) + 'px';
        liquid.style.width = '142px';
        liquid.style.height = '100px';
        liquid.style.background = liquidColor;
        liquid.style.borderRadius = '0 0 6px 6px';
        liquid.style.opacity = '0.8';
        canvas.appendChild(liquid);
        
        // Animated reaction particles
        let particleCount = 0;
        const particleInterval = setInterval(() => {
            if (particleCount >= 50) {
                clearInterval(particleInterval);
                return;
            }
            
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                const startX = centerX - 50 + Math.random() * 100;
                const startY = centerY + 100;
                const endX = centerX - 100 + Math.random() * 200;
                const endY = centerY - 50 + Math.random() * 100;
                
                particle.style.position = 'absolute';
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                particle.style.width = (6 + Math.random() * 4) + 'px';
                particle.style.height = particle.style.width;
                particle.style.background = reactionColor;
                particle.style.borderRadius = '50%';
                particle.style.boxShadow = `0 0 15px ${reactionColor}`;
                particle.style.transition = 'all 1s ease-out';
                particle.style.opacity = '0';
                canvas.appendChild(particle);
                
                setTimeout(() => {
                    particle.style.opacity = '1';
                    particle.style.left = endX + 'px';
                    particle.style.top = endY + 'px';
                    particle.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        particle.style.opacity = '0';
                        particle.style.transform = 'scale(0.5)';
                        setTimeout(() => particle.remove(), 500);
                    }, 800);
                }, 10);
            }
            particleCount++;
        }, 100);
        
        // Add CSS animation if not already added
        if (!document.getElementById('reaction-animations')) {
            const style = document.createElement('style');
            style.id = 'reaction-animations';
            style.textContent = `
                @keyframes bubble {
                    0% { transform: translateY(0) scale(1); opacity: 0.8; }
                    50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
                    100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    startBtn.addEventListener('click', () => {
        drawReaction(reactionType.value);
    });
    
    resetBtn.addEventListener('click', () => {
        canvas.innerHTML = '';
    });
    
    drawReaction(reactionType.value);
}

// ===== Molecular Structure Experiment =====
function createMoleculesExperiment() {
    return `
        <div class="experiment-header">
            <h2>Molecular Structure</h2>
            <p>Explore 3D molecular models</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Molecules</strong> are groups of atoms bonded together. The 3D structure determines properties. <strong>Covalent bonds</strong> share electrons between atoms. <strong>Water (H₂O)</strong> has a bent shape with 104.5° angle. <strong>Carbon dioxide (CO₂)</strong> is linear. <strong>Methane (CH₄)</strong> is tetrahedral. <strong>Ammonia (NH₃)</strong> is pyramidal. The <strong>VSEPR theory</strong> explains molecular geometry based on electron pair repulsion.</p>
        </div>
        <div class="controls">
            <select id="molecule-type" class="control-group" style="padding: 0.8rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color);">
                <option value="water">Water (H₂O)</option>
                <option value="co2">Carbon Dioxide (CO₂)</option>
                <option value="methane">Methane (CH₄)</option>
                <option value="ammonia">Ammonia (NH₃)</option>
            </select>
            <button class="control-btn" id="molecule-rotate">Rotate</button>
        </div>
        <canvas id="molecule-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
    `;
}

function initMoleculesExperiment() {
    const canvas = document.getElementById('molecule-canvas');
    const ctx = canvas.getContext('2d');
    const moleculeType = document.getElementById('molecule-type');
    const rotateBtn = document.getElementById('molecule-rotate');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let rotation = 0;
    let isRotating = false;
    let animationId = null;
    
    const molecules = {
        water: {
            center: { x: 0, y: 0, z: 0 },
            atoms: [
                { type: 'O', x: 0, y: 0, z: 0, color: '#ef4444' },
                { type: 'H', x: -0.76, y: 0.5, z: 0, color: '#94a3b8' },
                { type: 'H', x: 0.76, y: 0.5, z: 0, color: '#94a3b8' }
            ]
        },
        co2: {
            center: { x: 0, y: 0, z: 0 },
            atoms: [
                { type: 'C', x: 0, y: 0, z: 0, color: '#334155' },
                { type: 'O', x: -1.16, y: 0, z: 0, color: '#ef4444' },
                { type: 'O', x: 1.16, y: 0, z: 0, color: '#ef4444' }
            ]
        },
        methane: {
            center: { x: 0, y: 0, z: 0 },
            atoms: [
                { type: 'C', x: 0, y: 0, z: 0, color: '#334155' },
                { type: 'H', x: 1.09, y: 0, z: 0, color: '#94a3b8' },
                { type: 'H', x: -1.09, y: 0, z: 0, color: '#94a3b8' },
                { type: 'H', x: 0, y: 1.09, z: 0, color: '#94a3b8' },
                { type: 'H', x: 0, y: -1.09, z: 0, color: '#94a3b8' }
            ]
        },
        ammonia: {
            center: { x: 0, y: 0, z: 0 },
            atoms: [
                { type: 'N', x: 0, y: 0, z: 0, color: '#6366f1' },
                { type: 'H', x: 1.01, y: 0.58, z: 0, color: '#94a3b8' },
                { type: 'H', x: -1.01, y: 0.58, z: 0, color: '#94a3b8' },
                { type: 'H', x: 0, y: -1.01, z: 0, color: '#94a3b8' }
            ]
        }
    };
    
    function drawMolecule(type) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const molecule = molecules[type];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;
        
        // Draw bonds
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        for (let i = 0; i < molecule.atoms.length; i++) {
            for (let j = i + 1; j < molecule.atoms.length; j++) {
                const a1 = molecule.atoms[i];
                const a2 = molecule.atoms[j];
                const dist = Math.sqrt(
                    Math.pow(a2.x - a1.x, 2) +
                    Math.pow(a2.y - a1.y, 2) +
                    Math.pow(a2.z - a1.z, 2)
                );
                if (dist < 1.5) {
                    const x1 = centerX + (a1.x * Math.cos(rotation) - a1.z * Math.sin(rotation)) * scale;
                    const y1 = centerY + a1.y * scale;
                    const x2 = centerX + (a2.x * Math.cos(rotation) - a2.z * Math.sin(rotation)) * scale;
                    const y2 = centerY + a2.y * scale;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            }
        }
        
        // Draw atoms
        molecule.atoms.forEach(atom => {
            const x = centerX + (atom.x * Math.cos(rotation) - atom.z * Math.sin(rotation)) * scale;
            const y = centerY + atom.y * scale;
            const radius = atom.type === 'C' || atom.type === 'O' || atom.type === 'N' ? 20 : 15;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = atom.color;
            ctx.fill();
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(atom.type, x, y);
        });
    }
    
    moleculeType.addEventListener('change', () => {
        drawMolecule(moleculeType.value);
    });
    
    rotateBtn.addEventListener('click', () => {
        if (isRotating) {
            if (animationId) cancelAnimationFrame(animationId);
            isRotating = false;
        } else {
            isRotating = true;
            function animate() {
                rotation += 0.02;
                drawMolecule(moleculeType.value);
                animationId = requestAnimationFrame(animate);
                animationFrames.push(animationId);
            }
            animate();
        }
    });
    
    drawMolecule(moleculeType.value);
}

// ===== States of Matter Experiment =====
function createStatesExperiment() {
    return `
        <div class="experiment-header">
            <h2>States of Matter</h2>
            <p>See how matter changes states with temperature</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p>Matter exists in three states: <strong>Solid</strong> (particles tightly packed, fixed shape), <strong>Liquid</strong> (particles move freely, takes container shape), and <strong>Gas</strong> (particles far apart, fills container). Temperature affects particle motion. At <strong>0°C</strong>, water freezes (solid). At <strong>100°C</strong>, water boils (gas). The <strong>kinetic molecular theory</strong> explains these states - higher temperature means more particle motion and energy.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Temperature: <span id="temp-value">0</span>°C</label>
                <input type="range" id="temperature" min="-50" max="150" value="0">
            </div>
            <button class="control-btn" id="temp-animate">Animate</button>
        </div>
        <div class="experiment-canvas" id="states-canvas"></div>
        <div id="states-info" style="text-align: center; margin-top: 1rem; color: var(--text-secondary);"></div>
    `;
}

function initStatesExperiment() {
    const canvas = document.getElementById('states-canvas');
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temp-value');
    const animateBtn = document.getElementById('temp-animate');
    const infoDiv = document.getElementById('states-info');
    
    let animationId = null;
    let isAnimating = false;
    
    tempSlider.addEventListener('input', (e) => {
        tempValue.textContent = e.target.value;
        drawState(parseInt(e.target.value));
    });
    
    function drawState(temp) {
        canvas.innerHTML = '';
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        
        let state = 'solid';
        let color = '#3b82f6';
        let particleCount = 20;
        let speed = 1;
        
        if (temp < 0) {
            state = 'Solid';
            color = '#3b82f6';
            particleCount = 20;
            speed = 0.5;
        } else if (temp < 100) {
            state = 'Liquid';
            color = '#60a5fa';
            particleCount = 40;
            speed = 2;
        } else {
            state = 'Gas';
            color = '#fbbf24';
            particleCount = 60;
            speed = 5;
        }
        
        infoDiv.innerHTML = `<strong>State:</strong> ${state} | <strong>Temperature:</strong> ${temp}°C`;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = temp < 0 ? 8 : temp < 100 ? 6 : 4;
            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            if (isAnimating) {
                const startX = Math.random() * canvas.offsetWidth;
                const startY = Math.random() * canvas.offsetHeight;
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                
                const moveX = (Math.random() - 0.5) * speed;
                const moveY = (Math.random() - 0.5) * speed;
                
                let x = startX;
                let y = startY;
                
                function animateParticle() {
                    x += moveX;
                    y += moveY;
                    
                    if (x < 0 || x > canvas.offsetWidth) moveX *= -1;
                    if (y < 0 || y > canvas.offsetHeight) moveY *= -1;
                    
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                }
                
                setInterval(animateParticle, 50);
            } else {
                particle.style.left = (centerX - 100 + Math.random() * 200) + 'px';
                particle.style.top = (centerY - 100 + Math.random() * 200) + 'px';
            }
            
            canvas.appendChild(particle);
        }
    }
    
    animateBtn.addEventListener('click', () => {
        isAnimating = !isAnimating;
        drawState(parseInt(tempSlider.value));
    });
    
    drawState(0);
}

// ===== pH Scale Experiment =====
function createPHExperiment() {
    return `
        <div class="experiment-header">
            <h2>pH Scale</h2>
            <p>Test acidity and alkalinity of different substances</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p>The <strong>pH scale</strong> measures acidity or alkalinity from 0-14. <strong>pH = -log[H⁺]</strong>, where [H⁺] is hydrogen ion concentration. <strong>pH < 7</strong> is acidic (more H⁺ ions), <strong>pH = 7</strong> is neutral (equal H⁺ and OH⁻), <strong>pH > 7</strong> is basic/alkaline (more OH⁻ ions). Each unit represents a 10-fold change. <strong>Acids</strong> donate H⁺, <strong>bases</strong> accept H⁺ or donate OH⁻. Universal indicator shows different colors at different pH values.</p>
        </div>
        <div class="controls">
            <select id="ph-substance" class="control-group" style="padding: 0.8rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color);">
                <option value="0">Battery Acid (pH 0)</option>
                <option value="2">Lemon Juice (pH 2)</option>
                <option value="4">Tomato Juice (pH 4)</option>
                <option value="6">Coffee (pH 6)</option>
                <option value="7">Pure Water (pH 7)</option>
                <option value="8">Sea Water (pH 8)</option>
                <option value="10">Soap (pH 10)</option>
                <option value="12">Bleach (pH 12)</option>
                <option value="14">Sodium Hydroxide (pH 14)</option>
            </select>
            <button class="control-btn" id="ph-test">Test pH</button>
        </div>
        <div class="experiment-canvas" id="ph-canvas"></div>
        <div id="ph-info" style="text-align: center; margin-top: 1rem; padding: 1rem; background: var(--card-bg); border-radius: 10px;"></div>
    `;
}

function initPHExperiment() {
    const canvas = document.getElementById('ph-canvas');
    const phSubstance = document.getElementById('ph-substance');
    const testBtn = document.getElementById('ph-test');
    const infoDiv = document.getElementById('ph-info');
    
    const phColors = {
        0: '#8b0000', 1: '#a00000', 2: '#c00000', 3: '#e00000',
        4: '#ff0000', 5: '#ff4000', 6: '#ff8000', 7: '#ffff00',
        8: '#80ff00', 9: '#40ff00', 10: '#00ff00', 11: '#00ff40',
        12: '#00ff80', 13: '#00ffc0', 14: '#00ffff'
    };
    
    function getPHColor(ph) {
        return phColors[Math.round(ph)] || '#ffff00';
    }
    
    function drawPHScale(ph, showIndicator = false) {
        canvas.innerHTML = '';
        const scaleWidth = canvas.offsetWidth - 100;
        const scaleHeight = 60;
        const startX = 50;
        const startY = (canvas.offsetHeight - scaleHeight) / 2;
        
        // Draw pH scale
        for (let i = 0; i <= 14; i++) {
            const x = startX + (i / 14) * scaleWidth;
            const color = getPHColor(i);
            const segment = document.createElement('div');
            segment.style.position = 'absolute';
            segment.style.left = x + 'px';
            segment.style.top = startY + 'px';
            segment.style.width = (scaleWidth / 14) + 'px';
            segment.style.height = scaleHeight + 'px';
            segment.style.background = color;
            segment.style.borderRight = i < 14 ? '1px solid #1e293b' : 'none';
            canvas.appendChild(segment);
            
            // Labels
            if (i % 2 === 0) {
                const label = document.createElement('div');
                label.style.position = 'absolute';
                label.style.left = (x + scaleWidth / 28) + 'px';
                label.style.top = (startY + scaleHeight + 10) + 'px';
                label.style.color = '#cbd5e1';
                label.style.fontSize = '12px';
                label.style.fontWeight = '600';
                label.textContent = i;
                canvas.appendChild(label);
            }
        }
        
        // Only show indicator when showIndicator is true
        if (showIndicator) {
            const indicatorX = startX + (ph / 14) * scaleWidth;
            const indicator = document.createElement('div');
            indicator.style.position = 'absolute';
            indicator.style.left = (indicatorX - 10) + 'px';
            indicator.style.top = (startY - 20) + 'px';
            indicator.style.width = '20px';
            indicator.style.height = '20px';
            indicator.style.background = getPHColor(ph);
            indicator.style.borderRadius = '50%';
            indicator.style.border = '3px solid #ffffff';
            indicator.style.boxShadow = '0 0 20px ' + getPHColor(ph);
            indicator.style.animation = 'pulse 1s ease-in-out infinite';
            canvas.appendChild(indicator);
        }
    }
    
    // Don't show indicator when selecting substance
    phSubstance.addEventListener('change', () => {
        // Just update the scale without indicator
        drawPHScale(7, false);
        infoDiv.innerHTML = '';
    });
    
    testBtn.addEventListener('click', () => {
        const ph = parseInt(phSubstance.value);
        drawPHScale(ph, true); // Show indicator when testing
        
        let description = '';
        if (ph < 7) {
            description = 'Acidic';
        } else if (ph === 7) {
            description = 'Neutral';
        } else {
            description = 'Basic/Alkaline';
        }
        
        infoDiv.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">pH: ${ph}</h3>
            <p style="color: var(--text-secondary); margin: 0.3rem 0;">
                <strong>Type:</strong> ${description}<br>
                <strong>Color:</strong> <span style="color: ${getPHColor(ph)};">●</span>
            </p>
        `;
    });
    
    drawPHScale(7, false); // Initial draw without indicator
}

// ===== Light Refraction Experiment =====
function createRefractionExperiment() {
    return `
        <div class="experiment-header">
            <h2>Light Refraction</h2>
            <p>See how light bends through different materials</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Refraction</strong> occurs when light passes from one medium to another and changes speed, causing it to bend. <strong>Snell's Law</strong> describes this: <strong>n₁sin(θ₁) = n₂sin(θ₂)</strong>, where n is the refractive index and θ is the angle. The refractive index measures how much light slows down in a material. Higher index means more bending. This is why objects appear shifted when viewed through water - light bends at the water-air interface!</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Angle of Incidence: <span id="refraction-angle-value">45</span>°</label>
                <input type="range" id="refraction-angle" min="0" max="80" value="45">
            </div>
            <div class="control-group">
                <label>Material: <span id="refraction-material-value">Water</span></label>
                <select id="refraction-material" style="padding: 0.5rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color); width: 100%;">
                    <option value="1.33">Water (n=1.33)</option>
                    <option value="1.5">Glass (n=1.5)</option>
                    <option value="2.42">Diamond (n=2.42)</option>
                    <option value="1.0">Air (n=1.0)</option>
                </select>
            </div>
            <button class="control-btn" id="refraction-shoot">Shoot Light</button>
        </div>
        <canvas id="refraction-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
    `;
}

function initRefractionExperiment() {
    const canvas = document.getElementById('refraction-canvas');
    const ctx = canvas.getContext('2d');
    const angleSlider = document.getElementById('refraction-angle');
    const materialSelect = document.getElementById('refraction-material');
    const angleValue = document.getElementById('refraction-angle-value');
    const materialValue = document.getElementById('refraction-material-value');
    const shootBtn = document.getElementById('refraction-shoot');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let animationId = null;
    
    angleSlider.addEventListener('input', (e) => {
        angleValue.textContent = e.target.value;
        drawRefraction();
    });
    
    materialSelect.addEventListener('change', (e) => {
        const materialNames = {
            '1.33': 'Water',
            '1.5': 'Glass',
            '2.42': 'Diamond',
            '1.0': 'Air'
        };
        materialValue.textContent = materialNames[e.target.value] || 'Water';
        drawRefraction();
    });
    
    function drawRefraction() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const interfaceY = centerY;
        const n1 = 1.0; // Air
        const n2 = parseFloat(materialSelect.value);
        const angleIncident = parseFloat(angleSlider.value) * Math.PI / 180;
        
        // Draw interface
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, interfaceY);
        ctx.lineTo(canvas.width, interfaceY);
        ctx.stroke();
        
        // Draw light source (on the left side)
        const lightSourceX = 50;
        const lightSourceY = centerY;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(lightSourceX, lightSourceY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fbbf24';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw incident ray from light source
        const rayLength = 200;
        const startX = lightSourceX;
        const startY = lightSourceY;
        
        // Calculate where ray hits interface
        const rayDistance = centerX - startX;
        const rayEndY = startY - Math.tan(angleIncident) * rayDistance;
        
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(centerX, rayEndY);
        ctx.stroke();
        
        // Draw arrow on incident ray
        ctx.fillStyle = '#fbbf24';
        const arrowAngle = Math.atan2(rayEndY - startY, centerX - startX);
        const arrowX = centerX - 15 * Math.cos(arrowAngle);
        const arrowY = rayEndY - 15 * Math.sin(arrowAngle);
        ctx.beginPath();
        ctx.moveTo(arrowX - 8 * Math.cos(arrowAngle - Math.PI / 6), arrowY - 8 * Math.sin(arrowAngle - Math.PI / 6));
        ctx.lineTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 8 * Math.cos(arrowAngle + Math.PI / 6), arrowY - 8 * Math.sin(arrowAngle + Math.PI / 6));
        ctx.fill();
        
        // Calculate refracted angle using Snell's law
        const actualAngle = Math.atan2(startY - rayEndY, centerX - startX);
        const sinRefracted = (n1 / n2) * Math.sin(actualAngle);
        const angleRefracted = Math.asin(Math.min(1, Math.abs(sinRefracted)));
        
        // Draw refracted ray (going down into material)
        const refractedRayLength = rayLength;
        const refractedEndX = centerX + refractedRayLength * Math.cos(angleRefracted);
        const refractedEndY = rayEndY + refractedRayLength * Math.sin(angleRefracted);
        
        ctx.strokeStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(centerX, rayEndY);
        ctx.lineTo(refractedEndX, refractedEndY);
        ctx.stroke();
        
        // Draw arrow on refracted ray
        ctx.fillStyle = '#ec4899';
        const refractedArrowAngle = Math.atan2(refractedEndY - rayEndY, refractedEndX - centerX);
        const refractedArrowX = refractedEndX - 15 * Math.cos(refractedArrowAngle);
        const refractedArrowY = refractedEndY - 15 * Math.sin(refractedArrowAngle);
        ctx.beginPath();
        ctx.moveTo(refractedArrowX - 8 * Math.cos(refractedArrowAngle - Math.PI / 6), refractedArrowY - 8 * Math.sin(refractedArrowAngle - Math.PI / 6));
        ctx.lineTo(refractedArrowX, refractedArrowY);
        ctx.lineTo(refractedArrowX - 8 * Math.cos(refractedArrowAngle + Math.PI / 6), refractedArrowY - 8 * Math.sin(refractedArrowAngle + Math.PI / 6));
        ctx.fill();
        
        // Draw normal line
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, rayEndY - 100);
        ctx.lineTo(centerX, rayEndY + 100);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Labels
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px Poppins';
        ctx.fillText('Light Source', startX - 40, startY - 20);
        ctx.fillText('Incident Ray', centerX - 80, rayEndY - 30);
        ctx.fillText('Refracted Ray', refractedEndX + 10, refractedEndY);
        ctx.fillText('Air (n=1.0)', centerX - 200, centerY - 50);
        ctx.fillText(`Material (n=${n2})`, centerX - 200, centerY + 50);
    }
    
    shootBtn.addEventListener('click', () => {
        if (animationId) cancelAnimationFrame(animationId);
        let frame = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRefraction();
            // Add animated light particles
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const lightSourceX = 50;
            const lightSourceY = centerY;
            const angleIncident = parseFloat(angleSlider.value) * Math.PI / 180;
            const n2 = parseFloat(materialSelect.value);
            
            // Calculate ray path
            const rayDistance = centerX - lightSourceX;
            const rayEndY = lightSourceY - Math.tan(angleIncident) * rayDistance;
            const actualAngle = Math.atan2(lightSourceY - rayEndY, centerX - lightSourceX);
            const sinRefracted = (1.0 / n2) * Math.sin(actualAngle);
            const angleRefracted = Math.asin(Math.min(1, Math.abs(sinRefracted)));
            
            for (let i = 0; i < 5; i++) {
                const progress = (frame + i * 10) % 400 / 400;
                if (progress < 0.5) {
                    // Incident ray particles from light source
                    const x = lightSourceX + (centerX - lightSourceX) * progress * 2;
                    const y = lightSourceY - Math.tan(angleIncident) * (x - lightSourceX);
                    ctx.fillStyle = '#fbbf24';
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Refracted ray particles
                    const refractedProgress = (progress - 0.5) * 2;
                    const x = centerX + refractedProgress * 200 * Math.cos(angleRefracted);
                    const y = rayEndY + refractedProgress * 200 * Math.sin(angleRefracted);
                    ctx.fillStyle = '#ec4899';
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            frame++;
            animationId = requestAnimationFrame(animate);
            animationFrames.push(animationId);
        }
        animate();
    });
    
    drawRefraction();
}

// ===== Magnetic Field Experiment =====
function createMagneticExperiment() {
    return `
        <div class="experiment-header">
            <h2>Magnetic Field</h2>
            <p>Visualize magnetic field lines and interactions</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Magnetic fields</strong> are regions around magnets where magnetic forces act. Field lines show the direction of force - they emerge from the <strong>north pole</strong> and enter the <strong>south pole</strong>. Like poles repel, opposite poles attract. The field strength decreases with distance. <strong>Magnetic field lines</strong> never cross and form closed loops. Moving charges create magnetic fields, and changing magnetic fields can induce electric currents (electromagnetic induction).</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Magnet Type</label>
                <select id="magnetic-type" style="padding: 0.5rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color); width: 100%;">
                    <option value="single">Single Magnet</option>
                    <option value="north-north">North-North (Repel)</option>
                    <option value="south-south">South-South (Repel)</option>
                    <option value="attract">North-South (Attract)</option>
                </select>
            </div>
            <button class="control-btn" id="magnetic-animate">Animate Field</button>
        </div>
        <canvas id="magnetic-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
    `;
}

function initMagneticExperiment() {
    const canvas = document.getElementById('magnetic-canvas');
    const ctx = canvas.getContext('2d');
    const typeSelect = document.getElementById('magnetic-type');
    const animateBtn = document.getElementById('magnetic-animate');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let animationId = null;
    let isAnimating = false;
    let time = 0;
    
    function drawMagneticField(type) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        if (type === 'single') {
            // Single magnet
            const magnetWidth = 80;
            const magnetHeight = 40;
            
            // Draw magnet
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(centerX - magnetWidth/2, centerY - magnetHeight/2, magnetWidth, magnetHeight);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(centerX - magnetWidth/2, centerY - magnetHeight/2, magnetWidth, magnetHeight);
            
            // N and S labels
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('N', centerX - 20, centerY + 5);
            ctx.fillText('S', centerX + 20, centerY + 5);
            
            // Draw field lines
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const startX = centerX + Math.cos(angle) * 30;
                const startY = centerY + Math.sin(angle) * 30;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                
                let x = startX;
                let y = startY;
                for (let step = 0; step < 100; step++) {
                    const dx = centerX - x;
                    const dy = centerY - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = 100 / (dist * dist);
                    x += (dx / dist) * force * 0.5;
                    y += (dy / dist) * force * 0.5;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        } else if (type === 'north-north' || type === 'south-south') {
            // Repelling magnets
            const magnet1X = centerX - 150;
            const magnet2X = centerX + 150;
            const magnetY = centerY;
            
            // Draw magnets
            ctx.fillStyle = type === 'north-north' ? '#ef4444' : '#3b82f6';
            ctx.fillRect(magnet1X - 40, magnetY - 20, 80, 40);
            ctx.fillRect(magnet2X - 40, magnetY - 20, 80, 40);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(magnet1X - 40, magnetY - 20, 80, 40);
            ctx.strokeRect(magnet2X - 40, magnetY - 20, 80, 40);
            
            // Field lines showing repulsion
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI;
                ctx.beginPath();
                ctx.moveTo(magnet1X + 40, magnetY);
                ctx.quadraticCurveTo(centerX, magnetY - 100, magnet2X - 40, magnetY);
                ctx.stroke();
            }
        } else {
            // Attracting magnets
            const magnet1X = centerX - 150;
            const magnet2X = centerX + 150;
            const magnetY = centerY;
            
            // Draw magnets
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(magnet1X - 40, magnetY - 20, 80, 40);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(magnet2X - 40, magnetY - 20, 80, 40);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(magnet1X - 40, magnetY - 20, 80, 40);
            ctx.strokeRect(magnet2X - 40, magnetY - 20, 80, 40);
            
            // Field lines showing attraction
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI;
                ctx.beginPath();
                ctx.moveTo(magnet1X + 40, magnetY);
                ctx.quadraticCurveTo(centerX, magnetY + 100, magnet2X - 40, magnetY);
                ctx.stroke();
            }
        }
    }
    
    typeSelect.addEventListener('change', () => {
        drawMagneticField(typeSelect.value);
    });
    
    animateBtn.addEventListener('click', () => {
        isAnimating = !isAnimating;
        if (isAnimating) {
            function animate() {
                time += 0.02;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawMagneticField(typeSelect.value);
                
                // Animated field particles
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                for (let i = 0; i < 30; i++) {
                    const angle = (i / 30) * Math.PI * 2 + time;
                    const radius = 50 + Math.sin(time * 2 + i) * 20;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    ctx.fillStyle = '#60a5fa';
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                animationId = requestAnimationFrame(animate);
                animationFrames.push(animationId);
            }
            animate();
        } else {
            if (animationId) cancelAnimationFrame(animationId);
            drawMagneticField(typeSelect.value);
        }
    });
    
    drawMagneticField(typeSelect.value);
}

// ===== Sound Waves Experiment =====
function createSoundExperiment() {
    return `
        <div class="experiment-header">
            <h2>Sound Waves</h2>
            <p>Explore sound propagation and frequency</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Sound</strong> is a longitudinal wave that travels through a medium (air, water, solid). It consists of <strong>compressions</strong> (high pressure) and <strong>rarefactions</strong> (low pressure). <strong>Frequency</strong> (Hz) determines pitch - higher frequency = higher pitch. <strong>Amplitude</strong> determines volume. Sound speed depends on medium: ~343 m/s in air, ~1500 m/s in water. The human ear detects 20-20,000 Hz. <strong>Doppler effect</strong> changes frequency when source moves relative to observer.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Frequency: <span id="sound-freq-value">440</span> Hz</label>
                <input type="range" id="sound-freq" min="100" max="1000" value="440">
            </div>
            <div class="control-group">
                <label>Amplitude: <span id="sound-amp-value">50</span>%</label>
                <input type="range" id="sound-amp" min="10" max="100" value="50">
            </div>
            <button class="control-btn" id="sound-play">Play Sound</button>
            <button class="control-btn" id="sound-stop">Stop</button>
        </div>
        <canvas id="sound-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
    `;
}

function initSoundExperiment() {
    const canvas = document.getElementById('sound-canvas');
    const ctx = canvas.getContext('2d');
    const freqSlider = document.getElementById('sound-freq');
    const ampSlider = document.getElementById('sound-amp');
    const freqValue = document.getElementById('sound-freq-value');
    const ampValue = document.getElementById('sound-amp-value');
    const playBtn = document.getElementById('sound-play');
    const stopBtn = document.getElementById('sound-stop');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let animationId = null;
    let isPlaying = false;
    let time = 0;
    
    freqSlider.addEventListener('input', (e) => {
        freqValue.textContent = e.target.value;
    });
    
    ampSlider.addEventListener('input', (e) => {
        ampValue.textContent = e.target.value;
    });
    
    function drawSoundWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerY = canvas.height / 2;
        const frequency = parseFloat(freqSlider.value);
        const amplitude = parseInt(ampSlider.value);
        
        // Draw speaker
        ctx.fillStyle = '#334155';
        ctx.fillRect(50, centerY - 30, 40, 60);
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(50, centerY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw wave
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 100; x < canvas.width; x++) {
            const waveY = centerY + Math.sin((x / 50 + time * frequency / 10) * Math.PI) * amplitude;
            if (x === 100) {
                ctx.moveTo(x, waveY);
            } else {
                ctx.lineTo(x, waveY);
            }
        }
        ctx.stroke();
        
        // Draw compression zones
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        for (let i = 0; i < 10; i++) {
            const x = 100 + i * 80 + Math.sin(time * frequency / 10) * 20;
            const width = 40;
            const height = amplitude * 2;
            ctx.fillRect(x, centerY - height/2, width, height);
        }
        
        // Draw rarefaction zones
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
        for (let i = 0; i < 10; i++) {
            const x = 120 + i * 80 + Math.sin(time * frequency / 10) * 20;
            const width = 40;
            const height = amplitude;
            ctx.fillRect(x, centerY - height/2, width, height);
        }
    }
    
    playBtn.addEventListener('click', () => {
        isPlaying = true;
        function animate() {
            time += 0.016;
            drawSoundWave();
            animationId = requestAnimationFrame(animate);
            animationFrames.push(animationId);
        }
        animate();
    });
    
    stopBtn.addEventListener('click', () => {
        isPlaying = false;
        if (animationId) cancelAnimationFrame(animationId);
        time = 0;
        drawSoundWave();
    });
    
    drawSoundWave();
}

// ===== Projectile Motion Experiment =====
function createProjectileExperiment() {
    return `
        <div class="experiment-header">
            <h2>Projectile Motion</h2>
            <p>Study the trajectory of launched objects</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Projectile motion</strong> follows a parabolic path under gravity. The horizontal and vertical motions are independent. Horizontal velocity (vₓ) remains constant, while vertical velocity (vᵧ) changes due to gravity. Equations: <strong>x = vₓt</strong>, <strong>y = vᵧ₀t - ½gt²</strong>. Maximum height: <strong>h = vᵧ₀²/(2g)</strong>. Range: <strong>R = v₀²sin(2θ)/g</strong>, where θ is launch angle. The optimal angle for maximum range is 45° (ignoring air resistance).</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Launch Angle: <span id="projectile-angle-value">45</span>°</label>
                <input type="range" id="projectile-angle" min="10" max="80" value="45">
            </div>
            <div class="control-group">
                <label>Initial Velocity: <span id="projectile-velocity-value">50</span> m/s</label>
                <input type="range" id="projectile-velocity" min="20" max="100" value="50">
            </div>
            <button class="control-btn" id="projectile-launch">Launch</button>
            <button class="control-btn" id="projectile-reset">Reset</button>
        </div>
        <canvas id="projectile-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
        <div id="projectile-info" style="text-align: center; margin-top: 1rem; color: var(--text-secondary);"></div>
    `;
}

function initProjectileExperiment() {
    const canvas = document.getElementById('projectile-canvas');
    const ctx = canvas.getContext('2d');
    const angleSlider = document.getElementById('projectile-angle');
    const velocitySlider = document.getElementById('projectile-velocity');
    const angleValue = document.getElementById('projectile-angle-value');
    const velocityValue = document.getElementById('projectile-velocity-value');
    const launchBtn = document.getElementById('projectile-launch');
    const resetBtn = document.getElementById('projectile-reset');
    const infoDiv = document.getElementById('projectile-info');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let animationId = null;
    let isRunning = false;
    let trajectory = [];
    
    angleSlider.addEventListener('input', (e) => {
        angleValue.textContent = e.target.value;
    });
    
    velocitySlider.addEventListener('input', (e) => {
        velocityValue.textContent = e.target.value;
    });
    
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        
        // Draw launcher
        const launcherX = 50;
        const launcherY = canvas.height - 100;
        const angle = parseFloat(angleSlider.value) * Math.PI / 180;
        
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(launcherX, launcherY);
        ctx.lineTo(launcherX + Math.cos(angle) * 30, launcherY - Math.sin(angle) * 30);
        ctx.stroke();
        
        // Draw cannon
        ctx.fillStyle = '#334155';
        ctx.fillRect(launcherX - 10, launcherY - 10, 20, 20);
    }
    
    launchBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        trajectory = [];
        
        const angle = parseFloat(angleSlider.value) * Math.PI / 180;
        const v0 = parseFloat(velocitySlider.value);
        const vx = v0 * Math.cos(angle);
        const vy0 = v0 * Math.sin(angle);
        const g = 9.8;
        
        let x = 50;
        let y = canvas.height - 100;
        let vy = vy0;
        let t = 0;
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawScene();
            
            t += 0.016;
            x = 50 + vx * t * 10;
            y = canvas.height - 100 - (vy0 * t * 10 - 0.5 * g * t * t * 100);
            vy = vy0 - g * t;
            
            trajectory.push({x, y});
            
            // Draw trajectory
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (trajectory.length > 1) {
                ctx.moveTo(trajectory[0].x, trajectory[0].y);
                for (let i = 1; i < trajectory.length; i++) {
                    ctx.lineTo(trajectory[i].x, trajectory[i].y);
                }
            }
            ctx.stroke();
            
            // Draw projectile
            if (y < canvas.height - 50) {
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.fill();
                
                animationId = requestAnimationFrame(animate);
                animationFrames.push(animationId);
            } else {
                // Calculate results
                const maxHeight = (vy0 * vy0) / (2 * g);
                const range = (v0 * v0 * Math.sin(2 * angle)) / g;
                const flightTime = (2 * vy0) / g;
                
                infoDiv.innerHTML = `
                    <strong>Results:</strong><br>
                    Maximum Height: ${maxHeight.toFixed(2)} m<br>
                    Range: ${range.toFixed(2)} m<br>
                    Flight Time: ${flightTime.toFixed(2)} s
                `;
                isRunning = false;
            }
        }
        
        animate();
    });
    
    resetBtn.addEventListener('click', () => {
        if (animationId) cancelAnimationFrame(animationId);
        isRunning = false;
        trajectory = [];
        infoDiv.innerHTML = '';
        drawScene();
    });
    
    drawScene();
}

// ===== Friction Experiment =====
function createFrictionExperiment() {
    return `
        <div class="experiment-header">
            <h2>Friction</h2>
            <p>Investigate how friction affects motion</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Friction</strong> opposes motion between surfaces. <strong>Static friction</strong> prevents motion (f ≤ μₛN), while <strong>kinetic friction</strong> acts during motion (f = μₖN). μ is the coefficient of friction, N is normal force. Friction depends on surface materials and roughness. Higher friction = more force needed to move objects. It converts kinetic energy to heat. In this experiment, observe how different surfaces affect how objects slide - smooth surfaces have less friction, rough surfaces have more!</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Surface Type</label>
                <select id="friction-surface" style="padding: 0.5rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color); width: 100%;">
                    <option value="0.1">Ice (μ=0.1)</option>
                    <option value="0.3">Wood (μ=0.3)</option>
                    <option value="0.6">Concrete (μ=0.6)</option>
                    <option value="0.9">Rubber (μ=0.9)</option>
                </select>
            </div>
            <div class="control-group">
                <label>Mass: <span id="friction-mass-value">5</span> kg</label>
                <input type="range" id="friction-mass" min="1" max="10" value="5">
            </div>
            <button class="control-btn" id="friction-push">Push Object</button>
            <button class="control-btn" id="friction-reset">Reset</button>
        </div>
        <div class="experiment-canvas" id="friction-canvas"></div>
        <div id="friction-info" style="text-align: center; margin-top: 1rem; color: var(--text-secondary);"></div>
    `;
}

function initFrictionExperiment() {
    const canvas = document.getElementById('friction-canvas');
    const surfaceSelect = document.getElementById('friction-surface');
    const massSlider = document.getElementById('friction-mass');
    const massValue = document.getElementById('friction-mass-value');
    const pushBtn = document.getElementById('friction-push');
    const resetBtn = document.getElementById('friction-reset');
    const infoDiv = document.getElementById('friction-info');
    
    let animationId = null;
    let isRunning = false;
    let box = null;
    
    massSlider.addEventListener('input', (e) => {
        massValue.textContent = e.target.value;
        if (!isRunning) drawScene();
    });
    
    function drawScene() {
        canvas.innerHTML = '';
        const mu = parseFloat(surfaceSelect.value);
        const mass = parseFloat(massSlider.value);
        const g = 9.8;
        const frictionForce = mu * mass * g;
        
        // Draw surface
        const surface = document.createElement('div');
        surface.style.position = 'absolute';
        surface.style.bottom = '0';
        surface.style.left = '0';
        surface.style.width = '100%';
        surface.style.height = '60px';
        
        let surfaceColor = '#94a3b8';
        if (mu === 0.1) surfaceColor = '#e0f2fe';
        else if (mu === 0.3) surfaceColor = '#78716c';
        else if (mu === 0.6) surfaceColor = '#57534e';
        else surfaceColor = '#1c1917';
        
        surface.style.background = `linear-gradient(to top, ${surfaceColor}, ${surfaceColor}dd)`;
        canvas.appendChild(surface);
        
        // Draw surface label
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.bottom = '10px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.color = '#cbd5e1';
        label.style.fontSize = '14px';
        label.style.fontWeight = '600';
        label.textContent = `μ = ${mu} | Friction Force = ${frictionForce.toFixed(1)}N`;
        canvas.appendChild(label);
        
        // Draw box
        if (!isRunning) {
            box = document.createElement('div');
            box.style.position = 'absolute';
            box.style.left = '50px';
            box.style.bottom = '60px';
            box.style.width = (40 + mass * 5) + 'px';
            box.style.height = (40 + mass * 5) + 'px';
            box.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
            box.style.borderRadius = '5px';
            box.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            box.style.transition = 'left 0.1s linear';
            canvas.appendChild(box);
        }
    }
    
    pushBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        
        const mu = parseFloat(surfaceSelect.value);
        const mass = parseFloat(massSlider.value);
        const g = 9.8;
        const frictionForce = mu * mass * g;
        const pushForce = 100;
        const netForce = pushForce - frictionForce;
        const acceleration = netForce / mass;
        
        canvas.innerHTML = '';
        drawScene();
        
        box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.left = '50px';
        box.style.bottom = '60px';
        box.style.width = (40 + mass * 5) + 'px';
        box.style.height = (40 + mass * 5) + 'px';
        box.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        box.style.borderRadius = '5px';
        box.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        canvas.appendChild(box);
        
        let x = 50;
        let velocity = 0;
        const maxX = canvas.offsetWidth - 100;
        
        function animate() {
            if (netForce > 0 && x < maxX) {
                velocity += acceleration * 0.1;
                x += velocity * 0.1;
                box.style.left = x + 'px';
                animationId = requestAnimationFrame(animate);
                animationFrames.push(animationId);
            } else {
                infoDiv.innerHTML = `
                    <strong>Results:</strong><br>
                    Friction Force: ${frictionForce.toFixed(1)} N<br>
                    Net Force: ${netForce.toFixed(1)} N<br>
                    Acceleration: ${acceleration.toFixed(2)} m/s²<br>
                    Final Velocity: ${velocity.toFixed(2)} m/s
                `;
                isRunning = false;
            }
        }
        
        animate();
    });
    
    resetBtn.addEventListener('click', () => {
        if (animationId) cancelAnimationFrame(animationId);
        isRunning = false;
        infoDiv.innerHTML = '';
        drawScene();
    });
    
    surfaceSelect.addEventListener('change', () => {
        if (!isRunning) drawScene();
    });
    
    drawScene();
}

// ===== Periodic Table Experiment =====
function createPeriodicExperiment() {
    return `
        <div class="experiment-header">
            <h2>Periodic Table</h2>
            <p>Explore elements and their properties</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p>The <strong>Periodic Table</strong> organizes elements by atomic number (protons). Elements in the same <strong>group</strong> (column) have similar properties and valence electrons. Elements in the same <strong>period</strong> (row) have the same number of electron shells. Trends include: <strong>Atomic radius</strong> decreases left to right, increases top to bottom. <strong>Ionization energy</strong> increases left to right. <strong>Electronegativity</strong> increases left to right. The table shows <strong>metals</strong> (left), <strong>nonmetals</strong> (right), and <strong>metalloids</strong> (diagonal line).</p>
        </div>
        <div class="controls">
            <select id="periodic-element" style="padding: 0.8rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color); width: 100%; margin-bottom: 1rem;">
                <option value="H">Hydrogen (H)</option>
                <option value="He">Helium (He)</option>
                <option value="Li">Lithium (Li)</option>
                <option value="C">Carbon (C)</option>
                <option value="N">Nitrogen (N)</option>
                <option value="O">Oxygen (O)</option>
                <option value="Na">Sodium (Na)</option>
                <option value="Fe">Iron (Fe)</option>
                <option value="Cu">Copper (Cu)</option>
                <option value="Au">Gold (Au)</option>
            </select>
            <button class="control-btn" id="periodic-show">Show Element</button>
        </div>
        <div class="experiment-canvas" id="periodic-canvas"></div>
        <div id="periodic-info" style="text-align: center; margin-top: 1rem; padding: 1rem; background: var(--card-bg); border-radius: 10px;"></div>
    `;
}

function initPeriodicExperiment() {
    const canvas = document.getElementById('periodic-canvas');
    const elementSelect = document.getElementById('periodic-element');
    const showBtn = document.getElementById('periodic-show');
    const infoDiv = document.getElementById('periodic-info');
    
    const elements = {
        'H': { name: 'Hydrogen', number: 1, mass: '1.008', type: 'Nonmetal', color: '#fbbf24' },
        'He': { name: 'Helium', number: 2, mass: '4.003', type: 'Noble Gas', color: '#60a5fa' },
        'Li': { name: 'Lithium', number: 3, mass: '6.941', type: 'Alkali Metal', color: '#ef4444' },
        'C': { name: 'Carbon', number: 6, mass: '12.011', type: 'Nonmetal', color: '#fbbf24' },
        'N': { name: 'Nitrogen', number: 7, mass: '14.007', type: 'Nonmetal', color: '#fbbf24' },
        'O': { name: 'Oxygen', number: 8, mass: '15.999', type: 'Nonmetal', color: '#fbbf24' },
        'Na': { name: 'Sodium', number: 11, mass: '22.990', type: 'Alkali Metal', color: '#ef4444' },
        'Fe': { name: 'Iron', number: 26, mass: '55.845', type: 'Transition Metal', color: '#8b5cf6' },
        'Cu': { name: 'Copper', number: 29, mass: '63.546', type: 'Transition Metal', color: '#8b5cf6' },
        'Au': { name: 'Gold', number: 79, mass: '196.967', type: 'Transition Metal', color: '#8b5cf6' }
    };
    
    function drawElement(symbol) {
        canvas.innerHTML = '';
        const element = elements[symbol];
        
        // Draw element box
        const box = document.createElement('div');
        box.style.position = 'relative';
        box.style.width = '200px';
        box.style.height = '250px';
        box.style.margin = '0 auto';
        box.style.background = `linear-gradient(135deg, ${element.color}, ${element.color}dd)`;
        box.style.borderRadius = '15px';
        box.style.border = '3px solid #ffffff';
        box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        box.style.padding = '1.5rem';
        box.style.textAlign = 'center';
        box.style.color = '#ffffff';
        
        // Atomic number
        const number = document.createElement('div');
        number.style.fontSize = '1.2rem';
        number.style.fontWeight = '600';
        number.style.marginBottom = '0.5rem';
        number.textContent = element.number;
        box.appendChild(number);
        
        // Symbol
        const sym = document.createElement('div');
        sym.style.fontSize = '3rem';
        sym.style.fontWeight = '800';
        sym.style.marginBottom = '0.5rem';
        sym.textContent = symbol;
        box.appendChild(sym);
        
        // Name
        const name = document.createElement('div');
        name.style.fontSize = '1rem';
        name.style.marginBottom = '0.5rem';
        name.textContent = element.name;
        box.appendChild(name);
        
        // Mass
        const mass = document.createElement('div');
        mass.style.fontSize = '0.9rem';
        mass.textContent = element.mass;
        box.appendChild(mass);
        
        canvas.appendChild(box);
        
        infoDiv.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">${element.name}</h3>
            <p style="color: var(--text-secondary); margin: 0.3rem 0;">
                <strong>Atomic Number:</strong> ${element.number}<br>
                <strong>Atomic Mass:</strong> ${element.mass} u<br>
                <strong>Type:</strong> ${element.type}<br>
                <strong>Symbol:</strong> ${symbol}
            </p>
        `;
    }
    
    showBtn.addEventListener('click', () => {
        drawElement(elementSelect.value);
    });
    
    drawElement(elementSelect.value);
}

// ===== Optics & Lenses Experiment =====
function createOpticsExperiment() {
    return `
        <div class="experiment-header">
            <h2>Optics & Lenses</h2>
            <p>See how light focuses through lenses</p>
        </div>
        <div class="experiment-explanation">
            <h3>📚 Explanation</h3>
            <p><strong>Lenses</strong> bend light using refraction. <strong>Convex lenses</strong> (converging) focus parallel light to a focal point. <strong>Concave lenses</strong> (diverging) spread light. The <strong>lens equation</strong> is: <strong>1/f = 1/dₒ + 1/dᵢ</strong>, where f is focal length, dₒ is object distance, dᵢ is image distance. <strong>Magnification</strong> = -dᵢ/dₒ. Real images form on the opposite side, virtual images on the same side. Convex lenses can create enlarged, reduced, or inverted images depending on object position.</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Lens Type</label>
                <select id="optics-lens" style="padding: 0.5rem; border-radius: 10px; background: var(--card-bg); color: var(--text-primary); border: 2px solid var(--primary-color); width: 100%;">
                    <option value="convex">Convex (Converging)</option>
                    <option value="concave">Concave (Diverging)</option>
                </select>
            </div>
            <div class="control-group">
                <label>Object Distance: <span id="optics-distance-value">100</span> cm</label>
                <input type="range" id="optics-distance" min="50" max="200" value="100">
            </div>
            <button class="control-btn" id="optics-trace">Trace Rays</button>
        </div>
        <canvas id="optics-canvas" class="experiment-canvas" style="padding: 0;"></canvas>
        <div id="optics-info" style="text-align: center; margin-top: 1rem; color: var(--text-secondary);"></div>
    `;
}

function initOpticsExperiment() {
    const canvas = document.getElementById('optics-canvas');
    const ctx = canvas.getContext('2d');
    const lensSelect = document.getElementById('optics-lens');
    const distanceSlider = document.getElementById('optics-distance');
    const distanceValue = document.getElementById('optics-distance-value');
    const traceBtn = document.getElementById('optics-trace');
    const infoDiv = document.getElementById('optics-info');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    distanceSlider.addEventListener('input', (e) => {
        distanceValue.textContent = e.target.value;
        drawOptics();
    });
    
    lensSelect.addEventListener('change', () => {
        drawOptics();
    });
    
    function drawOptics() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const focalLength = 80;
        const objectDistance = parseFloat(distanceSlider.value);
        const isConvex = lensSelect.value === 'convex';
        
        // Draw object (arrow)
        const objectX = centerX - objectDistance;
        const objectHeight = 60;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(objectX, centerY);
        ctx.lineTo(objectX, centerY - objectHeight);
        ctx.lineTo(objectX - 10, centerY - objectHeight + 10);
        ctx.moveTo(objectX, centerY - objectHeight);
        ctx.lineTo(objectX + 10, centerY - objectHeight + 10);
        ctx.stroke();
        
        // Draw lens
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 5;
        if (isConvex) {
            ctx.beginPath();
            ctx.arc(centerX, centerY - 150, 150, 0.3, Math.PI - 0.3);
            ctx.arc(centerX, centerY + 150, 150, Math.PI + 0.3, -0.3);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(centerX - 150, centerY - 150, 150, 0.3, Math.PI - 0.3);
            ctx.arc(centerX + 150, centerY + 150, 150, Math.PI + 0.3, -0.3);
            ctx.stroke();
        }
        
        // Draw optical axis
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw focal points
        const f1X = centerX - focalLength;
        const f2X = centerX + focalLength;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(f1X, centerY, 5, 0, Math.PI * 2);
        ctx.arc(f2X, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Calculate image position
        let imageDistance, imageHeight, magnification;
        if (isConvex) {
            imageDistance = 1 / (1/focalLength - 1/objectDistance);
            magnification = -imageDistance / objectDistance;
            imageHeight = objectHeight * magnification;
        } else {
            imageDistance = 1 / (1/-focalLength - 1/objectDistance);
            magnification = -imageDistance / objectDistance;
            imageHeight = objectHeight * Math.abs(magnification);
        }
        
        // Draw image
        const imageX = centerX + imageDistance;
        if (imageX > centerX && imageX < canvas.width) {
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(imageX, centerY);
            ctx.lineTo(imageX, centerY - imageHeight);
            ctx.lineTo(imageX - 10, centerY - imageHeight + 10);
            ctx.moveTo(imageX, centerY - imageHeight);
            ctx.lineTo(imageX + 10, centerY - imageHeight + 10);
            ctx.stroke();
        }
        
        // Draw ray traces
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        
        // Ray 1: Parallel to axis, through focal point
        ctx.beginPath();
        ctx.moveTo(objectX, centerY - objectHeight);
        ctx.lineTo(centerX, centerY - objectHeight);
        if (isConvex) {
            ctx.lineTo(centerX + (imageX - centerX), centerY - imageHeight);
        } else {
            ctx.lineTo(centerX + 100, centerY - objectHeight - 50);
        }
        ctx.stroke();
        
        // Ray 2: Through center (no refraction)
        ctx.beginPath();
        ctx.moveTo(objectX, centerY - objectHeight);
        if (isConvex) {
            ctx.lineTo(centerX, centerY);
            ctx.lineTo(imageX, centerY - imageHeight);
        } else {
            ctx.lineTo(centerX, centerY);
            ctx.lineTo(centerX + 100, centerY - objectHeight + 30);
        }
        ctx.stroke();
        
        // Ray 3: Through near focal point, parallel to axis
        ctx.beginPath();
        ctx.moveTo(objectX, centerY - objectHeight);
        ctx.lineTo(f1X, centerY);
        ctx.lineTo(centerX, centerY);
        if (isConvex) {
            ctx.lineTo(imageX, centerY - imageHeight);
        } else {
            ctx.lineTo(centerX + 100, centerY - objectHeight);
        }
        ctx.stroke();
        
        infoDiv.innerHTML = `
            <strong>Image Properties:</strong><br>
            Image Distance: ${imageDistance.toFixed(1)} cm<br>
            Magnification: ${magnification.toFixed(2)}x<br>
            Image Type: ${imageDistance > 0 ? 'Real' : 'Virtual'}
        `;
    }
    
    traceBtn.addEventListener('click', () => {
        drawOptics();
    });
    
    drawOptics();
}

// Initialize scroll effects on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll effects
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        }
    });
});

