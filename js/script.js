document.addEventListener("DOMContentLoaded", () => {
    // Navbar Hide & Show on Scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector("#navbar");
    const menuToggle = document.querySelector("#menu-toggle");
    const dropdownMenu = document.querySelector("#dropdown-menu");

    if (navbar) {
        window.addEventListener("scroll", () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                navbar.classList.add("hide"); // Hide on scroll down
            } else {
                navbar.classList.remove("hide"); // Show on scroll up
            }
            lastScrollTop = scrollTop;
        });
    }

    // Toggle Dropdown Menu on Click
    menuToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll("#dropdown-menu ul li a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
                dropdownMenu.classList.remove("active"); // Close menu after clicking a link
            }
        });
    });

    // Close dropdown menu when clicking outside
    document.addEventListener("click", (event) => {
        if (!menuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // Detect when the "How It Works" section is visible
    const steps = document.querySelectorAll("#how-it-works .step");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.3 });

    steps.forEach(step => observer.observe(step));
});
