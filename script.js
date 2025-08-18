

  function hidePreloader() {
    document.getElementById("preloader").style.display = "none";
  }

  // Optional: show preloader briefly on menu click
  const navLinks = document.querySelectorAll('nav a'); // ('nav a') change to a.

  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Only show if navigating to a section (not just hash)
      if (this.getAttribute('href').startsWith('#')) {
        document.getElementById("preloader").style.display = "flex";
        setTimeout(() => {
          document.getElementById("preloader").style.display = "none";
        }, 800); // short fake load
      }
    });
  });

// loderrrrrrrrrrrrrrr

//navigation active design

  document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar-links a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
      const linkPage = link.getAttribute("href");
      
      // Match current page with link
      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });
  });


//HAMBURGER SETUP
const hamburger = document.getElementById('hamburger');
const mobilenav = document.getElementById('mobile-navbar');

hamburger.addEventListener('click',() => {

    mobilenav.classList.toggle('open');
    hamburger.classList.toggle('open');
});
document.addEventListener('click', function (event) {
    const isClickInsideMenu = mobilenav.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
        mobilenav.classList.remove('open');
        hamburger.classList.remove('open');
    }
});



 const space = document.getElementById('space');

    // Possible star colors
    const colors = ['#ffffff', '#ffd27f', '#a1caff', '#ff9eff', '#ffffa1'];

      for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';

      // Random color
      star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Random float direction
      const dx = (Math.random() * 10 - 5).toFixed(2) + 'px'; 
      const dy = (Math.random() * 10 - 5).toFixed(2) + 'px';
      star.style.setProperty('--dx', dx);
      star.style.setProperty('--dy', dy);

      // Slower animations
      const twinkleDuration = (Math.random() * 2 + 3).toFixed(1);  // 3s to 5s
      const floatDuration = (Math.random() * 20 + 20).toFixed(1);  // 20s to 40s
      star.style.animationDuration = `${twinkleDuration}s, ${floatDuration}s`;

      space.appendChild(star);
    }


    //SWIPE UP DESIGN
         // Select all sections with the class "section"
    const sections = document.querySelectorAll('.swipeup');

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'visible' class when the section is in view
                entry.target.classList.add('visible');
                
                // Once the section is in view, disconnect the observer from this element
                observer.unobserve(entry.target);  // Stop observing this element after it's in view
            }
        });
    }, { threshold: 0.5 });  // Trigger callback when 50% of the section is visible

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });


    
    // REVIEW HORIZONTAL SCROLL   

     window.addEventListener('load', () => {
      const container = document.getElementById('scrollContainer');
      const images = container.querySelectorAll('.review-image');
      const imageWidth = images[0].offsetWidth + 16; // 1rem gap = 16px
      let scrollPosition = 0;
      let intervalId;

      function autoScroll() {
        scrollPosition += imageWidth;

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });

        const resetThreshold = (images.length / 2) * imageWidth;
        if (scrollPosition + imageWidth >= resetThreshold) {
          setTimeout(() => {
            container.scrollTo({ left: 0, behavior: 'auto' });
            scrollPosition = 0;
          }, 300);
        }
      }

      function startScrolling() {
        intervalId = setInterval(autoScroll, 4000);
      }

      function stopScrolling() {
        clearInterval(intervalId);
      }

      //  Start scrolling
      startScrolling();

      //  Pause on hover (desktop)
      container.addEventListener('mouseenter', stopScrolling);
      container.addEventListener('mouseleave', startScrolling);

      //  Pause on touch (mobile)
      container.addEventListener('touchstart', stopScrolling, { passive: true });
      container.addEventListener('touchend', startScrolling);
    });


//SMOOTH SCROLL

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});


//FORM SUBMISSION

document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // stop default form redirect

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    let res = await fetch("https://arora-backend.onrender.com/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if(res.ok){
      window.location.href = "signup_successfull.html";
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});
