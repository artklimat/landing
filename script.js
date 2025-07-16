function hideScrollDuringFadeIn() {
  document.body.style.overflowY = 'hidden';
  setTimeout(() => {
    document.body.style.overflowY = '';
  }, 800); 
}


document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (
    link &&
    link.href &&
    link.target !== '_blank' &&
    !link.href.startsWith('javascript:') &&
    !link.href.startsWith('#') &&
    link.origin === window.location.origin
  ) {
    e.preventDefault();
    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location = link.href;
    }, 700); 
  }
});

function fadeScrollInit() {
  const fadeEls = document.querySelectorAll('.fade-scroll');
  function onScroll() {
    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll(); 
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fadeScrollInit);
} else {
  fadeScrollInit();
}

function setFadeDelays() {
  const groups = [
    '.work-grid .work-card',
    '.advantages-wrapper .advantage',
    '.portfolio-row .portfolio-item',
    '.portfolio-grid .portfolio-item',
    '.reviews-slider .review-card',
    '.consult-form-block'
  ];
  groups.forEach(selector => {
    const cards = document.querySelectorAll(selector);
    cards.forEach((el, i) => {
      el.style.setProperty('--fade-delay', (i * 0.15) + 's');
    });
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setFadeDelays);
} else {
  setFadeDelays();
}

const consultForm = document.querySelector('.consult-form');
if (consultForm) {
  consultForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());
    fetch(form.action, {
      method: 'POST',
      body: JSON.stringify(jsonData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        form.reset();
        alert('Спасибо! Ваша заявка отправлена.');
      } else {
        alert(data.error || 'Ошибка отправки. Попробуйте позже.');
      }
    })
    .catch(() => {
      alert('Ошибка отправки. Попробуйте позже.');
    });
  });
}

const phoneInput = document.querySelector('.consult-form input[name="phone"]');
if (phoneInput) {
  phoneInput.addEventListener('focus', function() {
    if (!this.value) this.value = '+7';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.menu-burger');
  const navLinksMobile = document.querySelector('.nav-links-mobile');
  if (burger && navLinksMobile) {
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinksMobile.classList.toggle('open');
      burger.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!burger.contains(e.target) && !navLinksMobile.contains(e.target)) {
        navLinksMobile.classList.remove('open');
        burger.classList.remove('open');
      }
    });
    
    const mobileLinks = navLinksMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        navLinksMobile.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modal = document.getElementById('portfolioModal');
  const modalImg = document.getElementById('modalImg');
  const modalClose = document.getElementById('modalClose');

  portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img.port-img');
      if (img) {
        modal.classList.add('active');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      }
    });
  });
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modal.classList.remove('active');
      modalImg.src = '';
    });
  }
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        modalImg.src = '';
      }
    });
  }



  const reviews = [
    {
      stars: 5,
      avatar: 'E',
      name: 'Екатерина',
      text: 'Устанавливали кондиционер на даче — всё чётко, быстро и без грязи. Рекомендую!',
      color: 'linear-gradient(180deg, #8AFF66 0%, #1EFF00 100%)'
    },
    {
      stars: 5,
      avatar: 'C',
      name: 'Светлана',
      text: 'Очень довольна работой! Всё объяснили, помогли выбрать.',
      color: 'linear-gradient(180deg, #FF8F66 0%, #FF3300 100%)' 

    },
    {
      stars: 5,
      avatar: 'Д',
      name: 'Дмитрий',
      text: 'Приехали в день обращения, всё объяснили, помогли выбрать. Сервис на уровне!',
      color: 'linear-gradient(180deg, #668AFF 0%, #0004FF 100%)'

    }
  ];

  let currentReview = 0;
  const reviewCard = document.getElementById('reviewCard');
  const reviewPrev = document.getElementById('reviewPrev');
  const reviewNext = document.getElementById('reviewNext');
  const leftBtn = document.querySelector('.slider-arrow.left');
  const rightBtn = document.querySelector('.slider-arrow.right');
  const slider = document.querySelector('.reviews-slider');

  function cardHTML(r) {
    let stars = '';
    for (let i = 0; i < r.stars; i++) {
      stars += '<img src="assets/Star 3.png" alt="star" class="star-img">';
    }
    return `
      <div class="review-stars">${stars}</div>
      <div class="review-user">
        <span class="review-avatar" style="background: ${r.color}; color: #1E1E1E;">${r.avatar}</span>
        <span class="review-name"><b>${r.name}</b></span>
      </div>
      <div class="review-text">${r.text}</div>
    `;
  }

  function renderReview(idx) {
    const prevIdx = (idx - 1 + reviews.length) % reviews.length;
    const nextIdx = (idx + 1) % reviews.length;

    reviewPrev.innerHTML = cardHTML(reviews[prevIdx]);
    reviewCard.innerHTML = cardHTML(reviews[idx]);
    reviewNext.innerHTML = cardHTML(reviews[nextIdx]);
  }

  function animate(direction) {
    slider.classList.add('animating-' + direction);
    setTimeout(() => {
      if (direction === 'left') {
        currentReview = (currentReview + 1) % reviews.length;
      } else {
        currentReview = (currentReview - 1 + reviews.length) % reviews.length;
      }
      renderReview(currentReview);
      slider.classList.remove('animating-' + direction);
    }, 500);
  }

  leftBtn.onclick = () => animate('right');
  rightBtn.onclick = () => animate('left');
  renderReview(currentReview);

 
}); 
