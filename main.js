// Say It App Website - Main JavaScript File
// Interactive components and animations

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeWorldMap();
    initializeVoiceDemo();
    initializeTestimonialCarousel();
    initializeScrollAnimations();
    initializeCounters();
    initializeLanguageSelector();
});

// Animation initialization using Anime.js
function initializeAnimations() {
    // Hero typewriter effect
    if (document.querySelector('.hero-title')) {
        const typed = new Typed('.hero-title', {
            strings: ['See Through Sound', 'Listen to the World Around You', 'Accessibility for Everyone'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }

    // Floating particles background
    initializeParticles();
}

// Particle system for hero background
function initializeParticles() {
    if (typeof p5 !== 'undefined' && document.getElementById('particles-canvas')) {
        new p5(function(p) {
            let particles = [];
            
            p.setup = function() {
                const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                canvas.parent('particles-canvas');
                
                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        size: p.random(2, 6),
                        speedX: p.random(-0.5, 0.5),
                        speedY: p.random(-0.5, 0.5),
                        opacity: p.random(0.3, 0.8)
                    });
                }
            };
            
            p.draw = function() {
                p.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                    
                    // Draw particle
                    p.fill(255, 255, 255, particle.opacity * 255);
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, particle.size);
                });
                
                // Draw connections
                particles.forEach((particle, i) => {
                    particles.slice(i + 1).forEach(other => {
                        const distance = p.dist(particle.x, particle.y, other.x, other.y);
                        if (distance < 100) {
                            p.stroke(255, 255, 255, (1 - distance / 100) * 50);
                            p.strokeWeight(1);
                            p.line(particle.x, particle.y, other.x, other.y);
                        }
                    });
                });
            };
            
            p.windowResized = function() {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
        });
    }
}

// World map initialization with user distribution
function initializeWorldMap() {
    if (typeof echarts !== 'undefined' && document.getElementById('world-map')) {
        const mapChart = echarts.init(document.getElementById('world-map'));
        
        // Country data scaled to exactly 40,000 users
        const countryData = [
            {name: 'Egypt', value: 9856},
            {name: 'Saudi Arabia', value: 5339},
            {name: 'United Arab Emirates', value: 3942},
            {name: 'United States', value: 3450},
            {name: 'United Kingdom', value: 3121},
            {name: 'Canada', value: 2382},
            {name: 'Germany', value: 1971},
            {name: 'France', value: 1725},
            {name: 'Australia', value: 1478},
            {name: 'Jordan', value: 1314},
            {name: 'Lebanon', value: 1150},
            {name: 'India', value: 986},
            {name: 'Netherlands', value: 821},
            {name: 'Sweden', value: 657},
            {name: 'Norway', value: 575},
            {name: 'Kuwait', value: 493},
            {name: 'Qatar', value: 411},
            {name: 'Bahrain', value: 329}
        ];
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.value) {
                        const percentage = ((params.value / 40000) * 100).toFixed(1);
                        return `${params.name}<br/>Users: ${params.value.toLocaleString()}<br/>Percentage: ${percentage}%`;
                    }
                    return `${params.name}<br/>No data available`;
                }
            },
            visualMap: {
                min: 0,
                max: 10000, // Adjusted max for the new data
                left: 'center', // Centered for mobile
                top: 'bottom',
                orient: 'horizontal', // Horizontal for mobile
                text: ['High', 'Low'],
                calculable: true,
                inRange: {
                    color: ['#e6f7ff', '#1890ff', '#0050b3']
                },
                textStyle: {
                    color: '#2d3748'
                },
                itemWidth: 15, // Thinner slider
                itemHeight: 80 // Shorter slider
            },
            series: [{
                name: 'Say It Users',
                type: 'map',
                map: 'world',
                roam: true,
                data: countryData,
                emphasis: {
                    label: {
                        show: true,
                        color: '#fff'
                    },
                    itemStyle: {
                        areaColor: '#ff6b6b'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 0.5
                },
                zoom: 1.2, // Default zoom
                scaleLimit: { // Limit zoom for mobile
                    min: 1,
                    max: 10
                }
            }]
        };
        
        // Load world map
        fetch('https://cdn.jsdelivr.net/npm/echarts@5.4.3/map/world.json')
            .then(response => response.json())
            .then(worldJson => {
                echarts.registerMap('world', worldJson);
                mapChart.setOption(option);
            })
            .catch(() => {
                // Fallback: create a simple chart if map fails to load
                const fallbackOption = {
                    title: {
                        text: 'Global User Distribution',
                        left: 'center',
                        textStyle: { color: '#2d3748' }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} users ({d}%)'
                    },
                    series: [{
                        type: 'pie',
                        radius: '70%',
                        data: countryData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                mapChart.setOption(fallbackOption);
            });
        
        // Resize chart on window resize
        window.addEventListener('resize', () => {
            mapChart.resize();
        });
    }
}

// Voice customization demo
function initializeVoiceDemo() {
    const speedSlider = document.getElementById('speed-slider');
    const pitchSlider = document.getElementById('pitch-slider');
    const playButton = document.getElementById('play-demo');
    const waveformCanvas = document.getElementById('waveform-canvas');
    
    if (speedSlider && pitchSlider && playButton) {
        let utterance = null;
        
        playButton.addEventListener('click', function() {
            const text = "Hello! This is Say It, your accessibility companion. Experience the power of instant text-to-speech conversion.";
            const speed = parseFloat(speedSlider.value);
            const pitch = parseFloat(pitchSlider.value);
            
            if (utterance) {
                speechSynthesis.cancel();
            }
            
            utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = speed;
            utterance.pitch = pitch;
            utterance.volume = 0.8;
            
            speechSynthesis.speak(utterance);
            
            // Visual feedback
            playButton.innerHTML = '<i class="fas fa-pause"></i> Playing...';
            playButton.disabled = true;
            
            utterance.onend = function() {
                playButton.innerHTML = '<i class="fas fa-play"></i> Play Demo';
                playButton.disabled = false;
            };
        });
        
        // Update display values
        speedSlider.addEventListener('input', function() {
            document.getElementById('speed-value').textContent = this.value + 'x';
        });
        
        pitchSlider.addEventListener('input', function() {
            document.getElementById('pitch-value').textContent = this.value;
        });
    }
    
    // Waveform visualization
    if (waveformCanvas && typeof p5 !== 'undefined') {
        new p5(function(p) {
            let waves = [];
            
            p.setup = function() {
                const canvas = p.createCanvas(300, 100);
                canvas.parent('waveform-canvas');
                
                // Initialize wave data
                for (let i = 0; i < 50; i++) {
                    waves.push(p.random(20, 80));
                }
            };
            
            p.draw = function() {
                p.background(247, 250, 252);
                p.stroke(255, 107, 107);
                p.strokeWeight(2);
                p.noFill();
                
                p.beginShape();
                for (let i = 0; i < waves.length; i++) {
                    const x = p.map(i, 0, waves.length - 1, 0, p.width);
                    const y = p.height / 2 + p.sin(p.frameCount * 0.05 + i * 0.1) * waves[i] / 2;
                    p.vertex(x, y);
                    
                    // Update wave data
                    waves[i] += p.random(-1, 1);
                    waves[i] = p.constrain(waves[i], 10, 90);
                }
                p.endShape();
            };
        });
    }
}

// Testimonial carousel
function initializeTestimonialCarousel() {
    if (typeof Splide !== 'undefined' && document.querySelector('.testimonial-carousel')) {
        new Splide('.testimonial-carousel', {
            type: 'loop',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            gap: '2rem',
            breakpoints: {
                768: {
                    arrows: false
                }
            }
        }).mount();
    }
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation if it's a counter element
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .counter').forEach(el => {
        observer.observe(el);
    });
}

// Animated counters
function initializeCounters() {
    // Counters will be triggered by scroll animation
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Language selector
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    const languageOptions = document.getElementById('language-options');
    
    if (languageSelector && languageOptions) {
        languageSelector.addEventListener('click', function() {
            languageOptions.classList.toggle('hidden');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(event) {
            if (!languageSelector.contains(event.target)) {
                languageOptions.classList.add('hidden');
            }
        });
        
        // Language selection
        languageOptions.addEventListener('click', function(event) {
            if (event.target.classList.contains('language-option')) {
                const language = event.target.dataset.language;
                const flag = event.target.dataset.flag;
                
                // Update selector
                languageSelector.querySelector('.selected-flag').textContent = flag;
                languageSelector.querySelector('.selected-language').textContent = language;
                
                // Hide options
                languageOptions.classList.add('hidden');
                
                // Play sample audio if available
                if ('speechSynthesis' in window) {
                    const sampleText = event.target.dataset.sample || "Hello! This is a sample text in your selected language.";
                    const utterance = new SpeechSynthesisUtterance(sampleText);
                    utterance.lang = event.target.dataset.lang || 'en-US';
                    utterance.rate = 0.8;
                    speechSynthesis.speak(utterance);
                }
            }
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm`;
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="flex-1">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}



// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

/* ===== NEW DOWNLOAD LOGIC ===== */
function showDownloadToast() {
  const toast = document.createElement('div');
  toast.className = 'download-toast';
  toast.innerHTML = `
    <div class="spinner"></div>
    <div>
      <div class="font-semibold">Download will begin shortly…</div>
    </div>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

function startDownload() {
  showDownloadToast();
  const link = document.createElement('a');
  link.href = 'https://github.com/oPains/Say-It/releases/download/V1.0.0/SayIt.apk  ';
  link.download = 'SayIt.apk';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener('click', e => {
  if (e.target.closest('.download-btn')) {
    e.preventDefault();
    startDownload();
  }
});
// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
}
