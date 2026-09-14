document.addEventListener("DOMContentLoaded", () => {

    /* ============ 1. PRELOADER ============ */
    const preloader = document.getElementById("preloader");
    const loaderProgress = document.getElementById("loaderProgress");
    const loaderPercent = document.getElementById("loaderPercent");
    let progress = 0;
    const loaderInterval = setInterval(() => {
        progress += Math.random() * 18;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loaderInterval);
            setTimeout(() => {
                preloader.classList.add("hidden");
                document.querySelectorAll(".hero .reveal-up").forEach((el, i) => {
                    setTimeout(() => el.classList.add("visible"), i * 140);
                });
            }, 350);
        }
        loaderProgress.style.width = progress + "%";
        loaderPercent.textContent = Math.floor(progress) + "%";
    }, 120);

    /* ============ 2. CUSTOM CURSOR ============ */
    const cursorDot = document.getElementById("cursorDot");
    const cursorRing = document.getElementById("cursorRing");
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top = mouseY + "px";
    });

    (function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + "px";
        cursorRing.style.top = ringY + "px";
        requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll("[data-hover], a, button").forEach(el => {
        el.addEventListener("mouseenter", () => cursorRing.classList.add("hovered"));
        el.addEventListener("mouseleave", () => cursorRing.classList.remove("hovered"));
    });

    /* ============ 3. ADVANCED PARTICLE SYSTEM (mouse reactive) ============ */
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 80;
    let mouse = { x: null, y: null, radius: 160 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseVx = (Math.random() - 0.5) * 0.6;
            this.baseVy = (Math.random() - 0.5) * 0.6;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.vx += (dx / dist) * force * 0.8;
                    this.vy += (dy / dist) * force * 0.8;
                }
            }
            // Ease back to base velocity
            this.vx += (this.baseVx - this.vx) * 0.03;
            this.vy += (this.baseVy - this.vy) * 0.03;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.baseVx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.baseVy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 242, 254, 0.45)";
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist / 130) * 0.6})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animateParticles();

    /* ============ 4. TYPING EFFECT ============ */
    const words = [
        "Software Developer",
        "ICT & Systems Specialist",
        "Rapid Tech Learner",
        "Software Error Fixer"
    ];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const typingEl = document.querySelector(".typing-text");

    function typeLoop() {
        const word = words[wordIndex];
        typingEl.textContent = word.substring(0, charIndex);

        let speed = isDeleting ? 40 : 90;

        if (!isDeleting && charIndex === word.length) {
            speed = 2000; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        } else {
            charIndex += isDeleting ? -1 : 1;
        }
        setTimeout(typeLoop, speed);
    }
    typeLoop();

    /* ============ 5. 3D TILT + GLOW TRACKING ============ */
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;

            card.style.setProperty("--mx", (x / rect.width * 100) + "%");
            card.style.setProperty("--my", (y / rect.height * 100) + "%");
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
        });
    });

    /* ============ 6. MAGNETIC BUTTONS ============ */
    if (window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".magnetic").forEach(el => {
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            el.addEventListener("mouseleave", () => {
                el.style.transform = "translate(0px, 0px)";
                el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
                setTimeout(() => el.style.transition = "", 500);
            });
        });
    }

    /* ============ 7. SCROLL REVEAL ============ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add("visible"), (idx % 4) * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal-up").forEach(el => revealObserver.observe(el));

    /* ============ 8. SCROLL PROGRESS + HEADER + BACK TO TOP ============ */
    const scrollProgress = document.getElementById("scrollProgress");
    const header = document.getElementById("header");
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (scrollTop / docHeight * 100) + "%";

        header.classList.toggle("scrolled", scrollTop > 50);
        // Header auto-hide logic was removed so it stays fixed on top at all times.

        backToTop.classList.toggle("show", scrollTop > 500);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ============ 9. ACTIVE NAV LINK ON SCROLL ============ */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    window.addEventListener("scroll", () => {
        let current = "about";
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    });

    /* ============ 10. MODAL ============ */
    const modal = document.getElementById("infoModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const closeModal = document.querySelector(".close-modal");
    const modalLink = document.getElementById("modalLink");

    document.querySelectorAll(".skill-card, .project-card").forEach(card => {
        card.addEventListener("click", () => {
            modalTitle.textContent = card.dataset.title || "Detail View";
            modalDesc.textContent = card.dataset.desc || "More info coming soon.";
            if (card.dataset.link) {
                modalLink.href = card.dataset.link;
                modalLink.style.display = "inline-flex";
            } else {
                modalLink.style.display = "none";
            }
            modal.classList.add("show");
        });
    });

    document.querySelectorAll(".project-link").forEach(link => {
        link.addEventListener("click", (e) => e.stopPropagation());
    });

    function hideModal() { modal.classList.remove("show"); }
    closeModal.addEventListener("click", hideModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

    /* ============ 11. PROJECT FILTER WITH ANIMATION ============ */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const match = filter === "all" || card.dataset.category === filter;
                if (match) {
                    card.classList.remove("hidden-card");
                    card.style.animation = "none";
                    void card.offsetWidth;
                    card.style.animation = "";
                } else {
                    card.classList.add("hidden-card");
                }
            });
        });
    });

    /* ============ 12. ANIMATED STAT COUNTERS ============ */
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector(".stat-number");
                const target = parseInt(numEl.dataset.target);
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 60));
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(counter); }
                    let suffix = "+";
                    if (target === 100) suffix = "%";
                    if (target === 20) suffix = "K";
                    numEl.textContent = current + suffix;
                }, 25);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll(".stat-item").forEach(el => statObserver.observe(el));

    /* ============ 13. MOBILE NAVBAR ============ */
    const hamburger = document.getElementById("hamburger");
    const navLinksMenu = document.getElementById("navLinks");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        navLinksMenu.classList.toggle("active");
    });
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("open");
            navLinksMenu.classList.remove("active");
        });
    });

    /* ============ 14. CONTACT FORM FEEDBACK ============ */
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector("button[type=submit]");
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = "linear-gradient(45deg, #22c55e, #4ade80)";
        contactForm.reset();
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = "";
        }, 3000);
    });

    /* ============ 15. THEME TOGGLE (Dark / Light) ============ */
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle.querySelector("i");
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    }
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        themeIcon.classList.replace(isLight ? "fa-moon" : "fa-sun", isLight ? "fa-sun" : "fa-moon");
        localStorage.setItem("nexora-theme", isLight ? "light" : "dark");
    });

    /* ============ 16. TERMINAL TYPING ANIMATION ============ */
    const terminalBody = document.getElementById("terminalBody");
    const terminalLines = [
        { type: "cmd", text: "whoami" },
        { type: "ok",  text: "→ Self-Taught Software Engineer | Sri Lanka" },
        { type: "cmd", text: "cat journey.txt" },
        { type: "ok",  text: "→ NVQ-4 → YouTube 20K → Play Store Publisher" },
        { type: "cmd", text: "sudo fix --every-problem --alone" },
        { type: "ok",  text: "→ ✅ Fixed with internet + AI. 0 unsolved." },
    ];

    let termStarted = false;
    const termObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !termStarted) {
            termStarted = true;
            runTerminal(0);
            termObserver.disconnect();
        }
    }, { threshold: 0.4 });
    if (terminalBody) termObserver.observe(terminalBody);

    function runTerminal(idx) {
        if (idx >= terminalLines.length) {
            terminalBody.insertAdjacentHTML("beforeend", '<span class="t-cursor">▊</span>');
            return;
        }
        const line = terminalLines[idx];
        const row = document.createElement("div");
        if (line.type === "cmd") {
            row.innerHTML = '<span class="prompt">$ </span><span class="cmd"></span>';
        } else {
            row.innerHTML = '<span class="ok"></span>';
        }
        terminalBody.appendChild(row);
        const span = row.querySelector(".cmd, .ok");
        let ci = 0;
        const typeChar = () => {
            if (ci < line.text.length) {
                span.textContent += line.text[ci++];
                setTimeout(typeChar, line.type === "cmd" ? 45 : 18);
            } else {
                setTimeout(() => runTerminal(idx + 1), line.type === "cmd" ? 350 : 220);
            }
        };
        typeChar();
    }

    /* ============ 17. CLICK RIPPLE EFFECT ============ */
    window.addEventListener("click", (e) => {
        const ripple = document.createElement("div");
        ripple.className = "ripple";
        const size = 80;
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX + "px";
        ripple.style.top = e.clientY + "px";
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });

    /* ============ 18. SEAMLESS MARQUEE (duplicate track) ============ */
    const marquee = document.getElementById("marquee");
    if (marquee) {
        const track = marquee.querySelector(".marquee-track");
        marquee.appendChild(track.cloneNode(true));
    }

    /* ============ 19. SKILL BARS FILL ON SCROLL ============ */
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                setTimeout(() => {
                    fill.style.width = fill.dataset.level + "%";
                }, 200);
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll(".skill-fill").forEach(el => barObserver.observe(el));

    /* ============ 20. HERO PARALLAX ON MOUSE MOVE ============ */
    const heroSection = document.querySelector(".hero");
    const orbs = document.querySelectorAll(".floating-orb");
    if (window.matchMedia("(hover: hover)").matches) {
        heroSection.addEventListener("mousemove", (e) => {
            const cx = (e.clientX / window.innerWidth - 0.5);
            const cy = (e.clientY / window.innerHeight - 0.5);
            orbs.forEach((orb, i) => {
                const depth = (i + 1) * 18;
                orb.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
            });
        });
    }
});
