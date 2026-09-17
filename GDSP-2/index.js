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

