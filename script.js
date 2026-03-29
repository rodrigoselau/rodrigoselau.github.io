document.addEventListener('DOMContentLoaded', () => {
    // === Core UI Logic ===
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // === Network Background Animation ===
    const createNetworkBg = () => {
        const bg = document.getElementById('network-bg');
        if (!bg) return;

        const canvas = document.createElement('canvas');
        bg.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height, points = [];
        const numPoints = 60;
        const maxDist = 150;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const initPoints = () => {
            points = [];
            for (let i = 0; i < numPoints; i++) {
                points.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = '#38bdf8';
            ctx.fillStyle = '#38bdf8';

            points.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.globalAlpha = 1 - (dist / maxDist);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        initPoints();
        animate();
    };

    // === Terminal Simulation ===
    const terminalLines = [
        { type: 'cmd', text: 'ssh rodrigo@backbone-core-01' },
        { type: 'out', text: 'Connecting to backbone-core-01... Authenticated.' },
        { type: 'cmd', text: 'show ip bgp summary' },
        { type: 'out', text: 'BGP router identifier 10.0.0.1, local AS number 65001' },
        { type: 'out', text: 'Neighbor V AS MsgRcvd MsgSent TblVer InQ OutQ Up/Down State' },
        { type: 'out', text: '172.16.1.1 4 65002 1284 1302 45 0 0 14w3d Established' },
        { type: 'cmd', text: 'ansible-playbook deploy_ospf.yml' },
        { type: 'out', text: 'PLAY [Configure OSPF on Edge Routers] *****************' },
        { type: 'out', text: 'TASK [Gathering Facts] ********************************' },
        { type: 'out', text: 'ok: [edge-01], ok: [edge-02]' },
        { type: 'out', text: 'changed: [edge-01] => { "changed": true, "msg": "OSPF Area 0 configured" }' },
        { type: 'cmd', text: 'ping 8.8.8.8 -c 4' },
        { type: 'out', text: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.4 ms' },
        { type: 'out', text: '64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=11.9 ms' },
        { type: 'cmd', text: 'clear' }
    ];

    const runTerminal = async () => {
        const container = document.getElementById('terminal-content');
        if (!container) return;

        let lineIdx = 0;

        const typeLine = async (line) => {
            const div = document.createElement('div');
            div.className = 'terminal-line';

            if (line.type === 'cmd') {
                const prefix = document.createElement('span');
                prefix.className = 'cmd-prefix';
                prefix.textContent = 'rodrigo@network:~$';
                div.appendChild(prefix);

                const cmdSpan = document.createElement('span');
                cmdSpan.className = 'cmd-text';
                div.appendChild(cmdSpan);
                container.appendChild(div);

                for (let char of line.text) {
                    cmdSpan.textContent += char;
                    await new Promise(r => setTimeout(r, 40 + Math.random() * 40));
                }
            } else {
                const outSpan = document.createElement('span');
                outSpan.className = 'cmd-output';
                outSpan.textContent = line.text;
                div.appendChild(outSpan);
                container.appendChild(div);
            }

            container.parentElement.scrollTop = container.parentElement.scrollHeight;
            await new Promise(r => setTimeout(r, 600));
        };

        while (true) {
            const line = terminalLines[lineIdx];
            if (line.text === 'clear') {
                await new Promise(r => setTimeout(r, 2000));
                container.innerHTML = '';
            } else {
                await typeLine(line);
            }
            lineIdx = (lineIdx + 1) % terminalLines.length;
        }
    };

    // === Scroll Reveal ===
    const reveal = () => {
        const revealElements = document.querySelectorAll('.section, .project-card, .skill-category, .experience-item');
        revealElements.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 100;

            if (revealTop < windowHeight - revealPoint) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize
    createNetworkBg();
    runTerminal();

    // Setup reveal initial state
    document.querySelectorAll('.section, .project-card, .skill-category, .experience-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    window.addEventListener('scroll', reveal);
    reveal();
});
