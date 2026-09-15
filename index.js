const pages = [
	'Esta es la primera página. ¡Bienvenido!',
	'Esta es la segunda página. Sigue adelante para ver más.',
	'Esta es la tercera y última página. Has llegado al final.'
];

let current = 0;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageText = document.getElementById('pageText');
const pageIndicator = document.getElementById('pageIndicator');
const pageContent = document.getElementById('pageContent');

function setContent(){
	pageText.textContent = pages[current];
	pageIndicator.textContent = `Página ${current+1} de ${pages.length}`;
}

function updateUI(){
	setContent();
	prevBtn.disabled = (current === 0);
	nextBtn.disabled = (current === pages.length - 1);
}

function animateTo(newIndex){
	if(newIndex === current) return;
	if(newIndex < 0 || newIndex >= pages.length) return;

	// start fade out
	pageContent.classList.remove('fade-in');
	pageContent.classList.add('fade-out');
	// temporarily disable buttons while animating
	prevBtn.disabled = true; nextBtn.disabled = true;

	setTimeout(()=>{
		current = newIndex;
		setContent();

		// fade in
		pageContent.classList.remove('fade-out');
		pageContent.classList.add('fade-in');

		// restore buttons based on position
		setTimeout(()=>{
			updateUI();
		}, 260);
	}, 240);
}

prevBtn.addEventListener('click', ()=>animateTo(current-1));
nextBtn.addEventListener('click', ()=>animateTo(current+1));

// Inicializa la UI
updateUI();

// --- Botón 'Ir arriba' ---
const toTopBtn = document.getElementById('toTop');

function checkToTop(){
	if(!toTopBtn) return;
	if(window.scrollY > 240){
		toTopBtn.classList.add('show');
	} else {
		toTopBtn.classList.remove('show');
	}
}

if(toTopBtn){
	toTopBtn.addEventListener('click', ()=>{
		window.scrollTo({top:0, behavior:'smooth'});
		toTopBtn.blur();
	});

	// Show/hide on scroll
	window.addEventListener('scroll', checkToTop, {passive:true});
	// initial state
	checkToTop();
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

function closeMobileNav(){
	if(primaryNav.classList.contains('mobile-open')){
		primaryNav.classList.remove('mobile-open');
		navToggle.setAttribute('aria-expanded','false');
	}
}

navToggle.addEventListener('click', ()=>{
	const isOpen = primaryNav.classList.toggle('mobile-open');
	navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav on resize to larger screens
window.addEventListener('resize', ()=>{
	if(window.innerWidth > 640) closeMobileNav();
});

// Close nav when a nav link is clicked (mobile)
primaryNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
	if(window.innerWidth <= 640) closeMobileNav();
}));

// Theme toggle (claro / oscuro)
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme){
	const root = document.documentElement;
	if(theme === 'dark'){
		root.classList.add('dark');
		themeToggle.textContent = '☀️';
		themeToggle.setAttribute('aria-pressed','true');
	} else {
		root.classList.remove('dark');
		themeToggle.textContent = '🌙';
		themeToggle.setAttribute('aria-pressed','false');
	}
	try{ localStorage.setItem('theme', theme); }catch(e){}
}

if(themeToggle){
	// initialize from saved preference or OS preference
	const saved = (function(){ try{ return localStorage.getItem('theme') }catch(e){return null}})();
	if(saved){ applyTheme(saved); }
	else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ applyTheme('dark'); }
	else { applyTheme('light'); }

	themeToggle.addEventListener('click', ()=>{
		const isDark = document.documentElement.classList.contains('dark');
		applyTheme(isDark ? 'light' : 'dark');
		themeToggle.blur();
	});
}

