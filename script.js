'use strict';

/////////////////////////////////////
//- Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

/////////////////////////////////////
//- Simple scrolling for learn-more btn

const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

learnMoreBtn.addEventListener('click', () => {
  // Modern school
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////
//- Page navigation

// 1. Add event listener to common parent element
const navLinks = document.querySelector('.nav__links');

navLinks.addEventListener('click', e => {
  e.preventDefault();

  // 2. Determine what element originated the event
  const hrefLink = e.target.getAttribute('href');

  // 3. Matching strategy
  if (hrefLink) {
    // OR if(e.target.classList.contains('nav__link'))
    const toSection = document.querySelector(hrefLink);
    toSection.scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////
//- Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content ');

tabsContainer.addEventListener('click', e => {
  e.preventDefault();

  // Select tabButton
  const tabClicked = e.target.closest('.operations__tab');

  // Stop event outof tabClicked
  if (!tabClicked) return;

  // Remove active
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );

  // Activate clickedTab and its content
  tabClicked.classList.add('operations__tab--active');
  const openedTabNum = tabClicked.dataset.tab;
  document
    .querySelector(`.operations__content--${openedTabNum}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////
//- Menu fade animation

const nav = document.querySelector('.nav');

// Mouseover and Mouseout function
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkHovered = e.target;
    const links = linkHovered.closest('.nav').querySelectorAll('.nav__link');

    const navImg = linkHovered.closest('.nav').querySelector('img');

    links.forEach(link => {
      if (link !== linkHovered) link.style.opacity = this;
    });
    navImg.style.opacity = this;
  }
};

// Passing arguments into handlers
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1.0));

/////////////////////////////////////
//- Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(
  entries => {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);

headerObserver.observe(header);

/////////////////////////////////////
//- Reveal Section

const allSections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    const entry = entries[0];

    // Guard clause
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  },

  {
    root: null,
    threshold: 0.15,
  }
);

// Hide all section
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////
//- Lazy loading images

const lazyImgs = document.querySelectorAll('img[data-src]');

const lazyLoad = new IntersectionObserver(
  // Lazy loading function
  (entries, observer) => {
    const [entry] = entries;

    // Guard clause
    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  },

  // Lazy loading object options
  {
    root: null,
    threshold: 0.5,
    rootMargin: '-100px',
  }
);

lazyImgs.forEach(img => lazyLoad.observe(img));

/////////////////////////////////////
//- Slider

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left ');
const btnRight = document.querySelector('.slider__btn--right ');
const dotsContainer = document.querySelector('.dots');
const btnAutoSlide = document.querySelector('.btn__auto');

let curSlide = 0;
const maxSlide = slides.length - 1;

// Create dots
slides.forEach((slide, i) => {
  dotsContainer.insertAdjacentHTML(
    'beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`
  );
});

// Active dot
const activateDot = slide => {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// Move
const goToSlide = curSlide => {
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
};
// Base case
goToSlide(0);
activateDot(0);

// Next slide
const nextSlide = () => {
  curSlide === maxSlide ? (curSlide = 0) : curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};

// Go forward
btnRight.addEventListener('click', nextSlide);

// Previous slide
const prevSlide = () => {
  curSlide === 0 ? (curSlide = maxSlide) : curSlide--;

  goToSlide(curSlide);
  activateDot(curSlide);
};

// Go backward
btnLeft.addEventListener('click', prevSlide);

// Handle moves using "Arrow keys"
document.addEventListener('keydown', e => {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

// Handle move using "dots"
dotsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    // const slide = e.target.dataset.slide;
    const { slide } = e.target.dataset;

    goToSlide(slide);
    activateDot(slide);
  }
});

// Auto function
const autoSlide = () => nextSlide();
// Handle auto slide
btnAutoSlide.addEventListener('click', () => {
  setInterval(autoSlide, 1500);
});
