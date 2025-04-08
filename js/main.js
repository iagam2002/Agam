/*----------------------------------------------
*
* [Main Scripts]
*
* Theme    : Relome - Personal Portfolio WordPress Theme
* Version  : 1.0
* Author   : Themeland
* Support  : hridoy1272@gmail.com
* 
----------------------------------------------*/

/*----------------------------------------------

[ALL CONTENTS]

1. Preloader
2. Cursor
3. Responsive Menu
4. Navigation
5. Scroll To Top
6. GSAP Smooth Scroll
7. Shape Animation
8. Dark Toggle with Reveal Text

----------------------------------------------*/

(function ($) {
	"use strict";

	$(document).ready(function () {

		/*----------------------------------------------
		1. Preloader
		----------------------------------------------*/
		const svg = document.getElementById("loader");
		const tl = gsap.timeline();
		const startShape = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
		const endShape = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

		tl.to(".loader-container .loaded", {
			delay: 1.2,
			y: -50,
			opacity: 0,
			duration: 0.6,
		}).to(svg, {
			duration: 0.6,
			attr: { d: startShape },
			ease: "power1.easeIn",
		}).to(svg, {
			duration: 0.6,
			attr: { d: endShape },
			ease: "power1.easeOut",
		}).to(".relome-preloader", {
			y: -1000,
			duration: 0.8,
		}).to(".relome-preloader", {
			zIndex: -1,
			display: "none",
		});

		/*----------------------------------------------
		2. Cursor
		----------------------------------------------*/
		const cursor = document.getElementById('cursor');
		const hoverElements = document.querySelectorAll('a');
		const animateCursor = (props) => {
			if (cursor) {
				gsap.to(cursor, {
					...props,
					duration: 0.3,
					ease: props.ease || 'power2.out'
				});
			}
		};

		// Update cursor position on mouse move
		document.addEventListener('mousemove', (e) => {
			animateCursor({ x: e.clientX, y: e.clientY, opacity: 1 });
		});

		// Add hover effects for specified elements
		const addHoverEffects = (element) => {
			element.addEventListener('mouseenter', () => {
				cursor?.classList.add('hovered');
				animateCursor({ scale: 2, opacity: 0, ease: 0.1 });
			});
			element.addEventListener('mouseleave', () => {
				cursor?.classList.remove('hovered');
				animateCursor({ scale: 1, opacity: 1 });
			});
		};
		hoverElements.forEach(addHoverEffects);

		/*----------------------------------------------
		3. Responsive Menu
		----------------------------------------------*/
		function navResponsive() {
			let navbar = $('.navbar .items');
			let menu = $('#menu .items');
			menu.html('');
			navbar.clone().appendTo(menu);
			$('.menu .icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-down');
		}
		navResponsive();

		$(window).on('resize', navResponsive);

		// Add a class for dropdowns based on the number of child items
		$('.menu .dropdown-menu').each(function () {
			var children = $(this).children('.dropdown').length;
			$(this).addClass('children-' + children);
		});

		// Add 'prevent' class to nav items with dropdowns
		$('.menu .nav-item.dropdown').each(function () {
			var children = $(this).children('.nav-link');
			children.addClass('prevent');
		});

		// Toggle dropdown menu and rotate icon-arrow-down
		$(document).on('click', '#menu .nav-item .nav-link', function (event) {
			if ($(this).hasClass('prevent')) {
				event.preventDefault();
			}

			var nav_link = $(this);
			var parentNav = nav_link.closest('.nav-item');
			var currentDropdown = nav_link.next('.dropdown-menu');
			var arrowIcon = nav_link.find('.icon-arrow-down');

			parentNav.siblings().find('.dropdown-menu.show').slideUp(300).removeClass('show');
			parentNav.siblings().find('.icon-arrow-down').removeClass('rotate-arrow');
			currentDropdown.slideToggle(300).toggleClass('show');
			arrowIcon.toggleClass('rotate-arrow');

			if (nav_link.hasClass('smooth-anchor')) {
				$('#menu').modal('hide');
			}
		});

		/*----------------------------------------------
		4. Navigation
		----------------------------------------------*/
		var position = $(window).scrollTop();
		var toTop = $('#scroll-to-top');
		var navbar = $('header .navbar');

		toTop.hide();

		$(window).on('scroll', function () {
			let scroll = $(window).scrollTop();
			if (!navbar.hasClass('relative')) {
				if (scroll > position) {
					if (window.screen.width >= 767) {
						navbar.fadeOut('fast');
					} else {
						navbar.addClass('navbar-sticky');
					}
					toTop.fadeOut('fast');
				} else {
					if (position < 76) {
						navbar.slideDown('fast').removeClass('navbar-sticky');
					} else {
						navbar.slideDown('fast').addClass('navbar-sticky');
					}
					if (position > 1023 && window.screen.width >= 767) {
						toTop.fadeIn('fast');
					} else {
						toTop.fadeOut('fast');
					}
				}
				position = scroll;
			}
		});

		$('.nav-link').each(function () {
			let href = $(this).attr('href');

			if (href && href.length > 1 && href.indexOf('#') != -1) {
				$(this).addClass('smooth-anchor');
			}
		});

		$(document).on('click', '.smooth-anchor', function (event) {
			let href = $(this).attr('href');
		
			if (typeof href === 'string' && href.startsWith('#')) {
				let target = $(href);
				event.preventDefault();
		
				if (target.length) {
					// Scroll to the section on the current page
					$('html, body').animate({
						scrollTop: target.offset().top
					}, 500, function() {
						// Update URL hash after scrolling
						history.replaceState(null, null, href);
					});
				} else {
					// Redirect to homepage with the anchor if not on homepage
					if (!$('body').hasClass('home')) {
						window.location.href = relome_vars.homeUrl + href;
					}
				}
			}
		});

		$(document).on('click', 'a[href="#"]', function (event) {
			event.preventDefault();
		});

		$('.dropdown-menu').each(function () {
			let dropdown = $(this);

			dropdown.hover(function () {
				dropdown.parent().find('.nav-link').first().addClass('active');
			}, function () {
				dropdown.parent().find('.nav-link').first().removeClass('active');
			});
		});

		/*----------------------------------------------
		5. Scroll To Top
		----------------------------------------------*/
		var progressPath = document.querySelector('.scroll-to-top path');

		if (!progressPath) {
			return;
		}

		var pathLength = progressPath.getTotalLength();

		progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
		progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		progressPath.style.strokeDashoffset = pathLength;
		progressPath.getBoundingClientRect();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

		var updateProgress = function () {
			var scroll = $(window).scrollTop();
			var height = $(document).height() - $(window).height();
			var progress = pathLength - (scroll * pathLength / height);
			progressPath.style.strokeDashoffset = progress;
		};

		updateProgress();

		$(window).on('scroll', function () {
			updateProgress();

			// Scroll-to-Top visibility toggle
			var offset = 50;

			if ($(this).scrollTop() > offset) {
				$('.scroll-to-top').addClass('active-progress');
			} else {
				$('.scroll-to-top').removeClass('active-progress');
			}
		});

		$('.scroll-to-top').on('click', function (event) {
			event.preventDefault();

			$('html, body').animate({
				scrollTop: 0
			}, 550);
		});

		/*----------------------------------------------
		6. GSAP Smooth Scroll
		----------------------------------------------*/
		const lenis = new Lenis();
		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		/*----------------------------------------------
		7. Shape Animation
		----------------------------------------------*/
		$('.elementor-shape svg').each(function () {
			const shapeDivider = $(this);

			gsap.to(shapeDivider, {
				height: "0px",
				ease: "power1.out",
				scrollTrigger: {
					trigger: ".tl-shape-animation",
					start: "top 80%",
					end: "bottom top",
					scrub: true
				}
			});
		});

		/*----------------------------------------------
		8. Dark Toggle with Reveal Text
		----------------------------------------------*/
		function updateThemeOnHtmlEl({ theme }) {
			const html = document.querySelector("html");

			// Temporarily disable transitions
			html.classList.add("no-transition");

			// Change the theme
			html.setAttribute("data-theme", theme);

			// Remove the no-transition class after a short delay
			setTimeout(() => {
				html.classList.remove("no-transition");
			}, 100); // Adjust the timeout as needed

			// Refresh GSAP animations after theme change
			refreshGSAPAnimations();
		}

		// Function to calculate the theme setting based on local storage or system preference
		function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
			if (localStorageTheme !== null) {
				return localStorageTheme;
			}

			if (systemSettingDark.matches) {
				return "dark";
			}

			return "light";
		}

		// Function to update the theme toggle anchor element
		function updateAnchor({ anchorEl, isDark }) {
			// Check if anchorEl exists
			if (!anchorEl) return; // If anchorEl is null, exit the function early

			// Ensure the <span> element exists before accessing it
			const icon = anchorEl.querySelector("span");

			// Proceed only if the <span> element exists
			if (icon) {
				const newIcon = isDark ? "light_mode" : "dark_mode"; // Use the appropriate icon for dark/light mode
				icon.innerText = newIcon; // Change the icon text

				// Update aria-label for accessibility
				const newCta = isDark ? "Change to light theme" : "Change to dark theme";
				anchorEl.setAttribute("aria-label", newCta);
			}
		}

		// Function to refresh GSAP animations
		function refreshGSAPAnimations() {
			const splitTypes = document.querySelectorAll(".reveal-text");
			const rootStyles = getComputedStyle(document.documentElement);
			const html = document.querySelector("html");

			let primaryColor = rootStyles.getPropertyValue('--primary-t-color').trim();
			let secondaryColor = rootStyles.getPropertyValue('--primary-t-color-2').trim();

			// Check for dark theme
			if (html.getAttribute('data-theme') === 'dark') {
				primaryColor = rootStyles.getPropertyValue('--secondary-t-color').trim();
				secondaryColor = rootStyles.getPropertyValue('--secondary-t-color-2').trim();
			}

			splitTypes.forEach((char) => {
				const text = new SplitType(char, { types: 'words, chars' });

				// Kill any previous animations before reinitializing
				gsap.killTweensOf(text.chars);

				gsap.fromTo(text.chars,
					{ color: secondaryColor }, // Initial color from SCSS variable
					{
						color: primaryColor, // Target color from SCSS variable
						scrollTrigger: {
							trigger: char,
							start: 'top 80%',
							end: 'top 20%',
							scrub: true,
							markers: false
						},
						stagger: 0.1,
					}
				);
			});
		}

		// Theme toggle logic
		const anchor = document.querySelector("[data-theme-toggle]");
		const localStorageTheme = localStorage.getItem("theme");
		const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

		let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

		// Set the initial anchor icon and theme
		updateAnchor({ anchorEl: anchor, isDark: currentThemeSetting === "dark" });
		updateThemeOnHtmlEl({ theme: currentThemeSetting });

		if (anchor) {
			anchor.addEventListener("click", (event) => {
				event.preventDefault(); // Prevent the default anchor behavior

				const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

				localStorage.setItem("theme", newTheme);
				updateAnchor({ anchorEl: anchor, isDark: newTheme === "dark" });
				updateThemeOnHtmlEl({ theme: newTheme });

				currentThemeSetting = newTheme;
			});
		}
	});

}(jQuery));