// Wave Background
const canvas = document.getElementById('bg-wave');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
window.addEventListener('resize',()=>{width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;});

const waves=[
  {y:height*0.5,length:0.015,amplitude:30,speed:0.02,phase:0,color:'rgba(74,144,226,0.2)'},
  {y:height*0.55,length:0.02,amplitude:20,speed:0.015,phase:0,color:'rgba(74,144,226,0.15)'},
  {y:height*0.6,length:0.01,amplitude:40,speed:0.01,phase:0,color:'rgba(74,144,226,0.1)'}
];
function drawWaves(){
  ctx.clearRect(0,0,width,height);
  waves.forEach(wave=>{
    wave.phase+=wave.speed;
    ctx.beginPath();
    ctx.moveTo(0,wave.y);
    for(let x=0;x<width;x++){ctx.lineTo(x,wave.y+Math.sin(x*wave.length+wave.phase)*wave.amplitude);}
    ctx.lineTo(width,height);ctx.lineTo(0,height);ctx.closePath();
    ctx.fillStyle=wave.color;ctx.fill();
  });
  requestAnimationFrame(drawWaves);
}
drawWaves();

// Reveal animations for all sections
const reveals=document.querySelectorAll('.section-title,.education-card,.experience-card,.project-card,.skill-card,.contact-form,.about-content');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.2});
reveals.forEach(el=>observer.observe(el));

// Animate skill bars (linear and radial)
const skills=document.querySelectorAll('.skill-card');
const skillObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      // Linear bars (legacy)
      const linearBar = entry.target.querySelector('.progress-fill');
      if(linearBar){
        const container = entry.target.querySelector('.progress-bar');
        const value = container ? (container.getAttribute('data-value') || 0) : 0;
        linearBar.style.width = value + '%';
      }

      // Radial bars
      const radialFill = entry.target.querySelector('.radial-fill');
      if(radialFill){
        const value = Number(entry.target.getAttribute('data-value') || entry.target.dataset.value || 0);
        const r = parseFloat(radialFill.getAttribute('r')) || 48;
        const circumference = 2 * Math.PI * r;
        radialFill.style.strokeDasharray = `${circumference} ${circumference}`;
        // start hidden
        radialFill.style.strokeDashoffset = circumference;
        // trigger transition to target offset
        const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100);
        // force reflow then set offset to animate
        radialFill.getBoundingClientRect();
        radialFill.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.2,.9,.2,1)';
        radialFill.style.strokeDashoffset = offset;

        // animate numeric counter inside
        const numEl = entry.target.querySelector('.radial-number');
        if(numEl){
          const duration = 1100;
          const start = 0;
          const end = Math.round(value);
          const startTime = performance.now();
          function tick(now){
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(start + (end - start) * progress);
            numEl.textContent = current;
            if(progress < 1) requestAnimationFrame(tick);
            else numEl.textContent = end;
          }
          requestAnimationFrame(tick);
        }
      }

      skillObserver.unobserve(entry.target);
    }
  });
},{threshold:0.25});
skills.forEach(s=>skillObserver.observe(s));

// Mobile menu toggle
const menuBtn=document.getElementById('menu-toggle');
const navLinks=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>{navLinks.classList.toggle('open');});
