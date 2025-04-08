/*----------------------------------------------
*
* [Main Scripts]
*
* Description: This file contains the primary JavaScript functionality for the TL Addons plugin.
* Author: Themeland
* Author URI: https://theme-land.com
* Version: 1.0.0
* Text Domain: tl-addons
* 
----------------------------------------------*/

/*----------------------------------------------

[ALL CONTENTS]

1. Progress Bar
2. Interactive
3. Magnetic Button
4. Shuffle
5. counterUp
6. AOS
7. Dynamic Text
8. Slider
9. Compare
10. Parallax
11. Tabs
12. Image Marquee

----------------------------------------------*/

/*----------------------------------------------
1. Progress Bar
----------------------------------------------*/
(function ($) {
    'use strict';

    var initializeProgressBar = function($scope) {
        // Select each uninitialized `.pie` element within the current scope
        $scope.find('.pie').each(function() {
            var $pieElement = $(this);

            // Check if the element is already initialized
            if (!$pieElement.data('initialized')) {
                // Create a new Intersection Observer
                var observer = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            // Initialize CircularProgressBar with options from data attribute
                            const circle = new CircularProgressBar("pie");
                            circle.initial($pieElement[0]);

                            // Mark as initialized to prevent duplicate SVGs
                            $pieElement.data('initialized', true);

                            // Stop observing once the element is initialized
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.5 // Trigger when 50% of the element is in view
                });

                // Start observing the progress bar element
                observer.observe($pieElement[0]);
            }
        });
    };

    var showProgress = function($scope) {
        // Select each progress bar within the current scope
        $scope.find('.progress-bar').each(function() {
            const progressBar = $(this)[0];
            const value = progressBar.dataset.progress;  // Read the dynamic value

            // Create an Intersection Observer for progress bar animation
            var observer = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        progressBar.style.opacity = 1;
                        progressBar.style.width = value;  // Animate the width based on the value
                        progressBar.querySelector('span').textContent = value;  // Update the text content
                        observer.unobserve(entry.target); // Stop observing after animation starts
                    }
                });
            }, {
                threshold: 0.5 // Trigger when 50% of the element is in view
            });

            // Start observing the progress bar element
            observer.observe(progressBar);
        });
    };

    // Initialize both pie chart and progress bar when Elementor frontend is ready
    $(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/progress-bar.default', function($scope) {
            initializeProgressBar($scope);
            showProgress($scope);
        });
    });

})(jQuery);

/*----------------------------------------------
2. Interactive
----------------------------------------------*/
(function ($) {
    'use strict';

    var InteractivePortfolio = function ($scope, $) {
        // Select the widget scope
        var moving = $scope.find('.interactive');

        if (moving.length) {

            // Check if .interactive-link exists; if not, append it
            if (!$('.interactive-link').length) {
                $('body').append('<div class="interactive-link"></div>');
            }

            var move = $('.interactive-link');
            var list = $scope.find('.portfolio-item');

            list.on('mouseenter', function (event) {
                var element = $(this);

                if (!element.hasClass('active')) {
                    list.removeClass('active');
                    element.addClass('active');
                    move.addClass('active');

                    var containerContent = element.find('.card-content').html();
                    if (containerContent) {
                        move.html(containerContent);
                    } else {
                        console.log("No content found in .card-content");
                    }

                    move.css({
                        left: (event.clientX + 15) + 'px',
                        top: (event.clientY + 15) + 'px'
                    });
                }
            }).on('mouseleave', function () {
                list.removeClass('active');
                move.removeClass('active');
                move.empty();
            }).on('mousemove', function (event) {
                move.css({
                    left: (event.clientX + 15) + 'px',
                    top: (event.clientY + 15) + 'px'
                });
            });
        }
    };

    // Initialize on Elementor frontend load
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tl-portfolio.default', InteractivePortfolio);
    });

}(jQuery));

/*----------------------------------------------
3. Magnetic Button
----------------------------------------------*/
(function ($) {

    'use strict';

	$('.magnetic-button')
	.on('mouseenter', function(e) {
		var parentOffset = $(this).offset(),
			relX = e.pageX - parentOffset.left,
			relY = e.pageY - parentOffset.top;
		$(this).find('span').css({top:relY, left:relX})
	})
	.on('mouseout', function(e) {
		var parentOffset = $(this).offset(),
			relX = e.pageX - parentOffset.left,
			relY = e.pageY - parentOffset.top;
		$(this).find('span').css({top:relY, left:relX})
	});

}(jQuery));

/*----------------------------------------------
4. Shuffle
----------------------------------------------*/
(function ($) {
    'use strict';

    $(window).on('elementor/frontend/init', function () {
        // Hook into Elementor's frontend rendering for 'tl-portfolio' widget
        elementorFrontend.hooks.addAction('frontend/element_ready/tl-portfolio.default', function ($scope) {
            if ($scope.find('.filter-items').length) {
                $scope.find('.portfolio').each(function (index) {
                    var count = index + 1;

                    // Update class names dynamically
                    $(this).find('.filter-items').removeClass('filter-items').addClass('filter-items-' + count);
                    $(this).find('.filter-item').removeClass('filter-item').addClass('filter-item-' + count);
                    $(this).find('.filter-btn').removeClass('filter-btn').addClass('filter-btn-' + count);

                    // Initialize Shuffle.js
                    var Shuffle = window.Shuffle;
                    var Filter = new Shuffle(document.querySelector('.filter-items-' + count), {
                        itemSelector: '.filter-item-' + count,
                        buffer: 1,
                    });

                    // Handle filter button changes
                    $scope.find('.filter-btn-' + count).on('change', function (e) {
                        var input = e.currentTarget;

                        if (input.checked) {
                            Filter.filter(input.value);
                        }
                    });
                });
            }
        });
    });
}(jQuery));

/*----------------------------------------------
5. counterUp
----------------------------------------------*/
(function($) {
	'use strict';

	// Function to animate the counter when in view
	function animateCounter($counter) {
		var startValue = $counter.data('start') || 0;
		var endValue = $counter.data('end') || 100;
		var duration = $counter.data('duration') || 2000;
		var separator = $counter.data('separator');

		$counter.numerator({
			easing: 'linear',
			duration: duration,
			delimiter: separator,
			fromValue: startValue,
			toValue: endValue
		});
	}

	// Intersection Observer to watch for when the counter comes into view
	var observer = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				// Animate the counter and unobserve it after triggering once
				var $counter = $(entry.target);
				animateCounter($counter);
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.5 }); // Adjust threshold as needed

	$(window).on('elementor/frontend/init', function() {
		// Initialize when the tl-counter widget is ready
		elementorFrontend.hooks.addAction('frontend/element_ready/tl-counter.default', function($scope) {
			$scope.find('.counter-number').each(function() {
				observer.observe(this); // Attach observer to each counter
			});
		});
	});

}(jQuery));

/*----------------------------------------------
6. AOS
----------------------------------------------*/
(function ($) {
    'use strict';

    // Function to initialize AOS
    const initializeAOS = function() {
        if (typeof AOS !== 'undefined') {  // Check if AOS is loaded
            AOS.init({
                once: false, // Optional: Run animation only once
				duration: 600,
            });
            AOS.refresh();
        } else {
            console.warn("AOS library not loaded.");
        }
    };

    // Load AOS when Elementor frontend initializes
    $(window).on('elementor/frontend/init', function() {
        initializeAOS();

        // Reinitialize AOS on every widget load to keep it active
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function() {
            initializeAOS();
        });
    });

}(jQuery));

/*----------------------------------------------
7. Dynamic Text
----------------------------------------------*/
(function ($) {
    'use strict';

    var initDynamicText = function ($scope) {
        $scope.find('.tl-widget.dynamic-text').each(function () {
            var $dynamicTextElement = $(this);

            // Get the options from the data attribute
            var options = JSON.parse($dynamicTextElement.attr('data-dynamic-text-options'));

            // Create the Typed instance with dynamic options for this specific element
            new Typed($dynamicTextElement.find('.dynamic')[0], {
                strings: options.strings,
                typeSpeed: options.typeSpeed,
                backSpeed: options.backSpeed,
                backDelay: options.backDelay,
                loop: options.loop,
            });
        });
    };

    // Initialize the widget on both frontend and editor
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tl-dynamic-text.default', initDynamicText);
    });
}(jQuery));

/*----------------------------------------------
8. Slider
----------------------------------------------*/
(function ($) {
    'use strict';

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
            var $carousel = $scope.find('.slider');
            if (!$carousel.length) {
                return; // Exit if no carousel is found
            }

            var settings = $carousel.data('settings');
            if (!settings) {
                console.error('Carousel settings not found!', $carousel);
                return;
            }

            // Generate unique ID for each carousel instance
            var uniqueId = 'slider-' + Math.random().toString(36).substr(2, 9);
            $carousel.addClass(uniqueId);

            // Define unique navigation and pagination selectors
            var navPrevClass = uniqueId + '-prev';
            var navNextClass = uniqueId + '-next';
            var paginationClass = uniqueId + '-pagination';

            // Add unique classes to navigation and pagination elements
            $carousel.find('.swiper-button-prev').addClass(navPrevClass);
            $carousel.find('.swiper-button-next').addClass(navNextClass);
            $carousel.find('.swiper-pagination').addClass(paginationClass);

            // Configure navigation settings
            var navigation = settings.navigation || 'arrows_dots';
            var paginationType = settings.pagination_type || 'dots';

            var navigationSettings = {};
            if (navigation === 'arrows_dots') {
                navigationSettings = {
                    navigation: {
                        nextEl: '.' + navNextClass,
                        prevEl: '.' + navPrevClass,
                    },
                    pagination: {
                        el: '.' + paginationClass,
                        clickable: true,
                    },
                };
            } else if (navigation === 'arrows') {
                navigationSettings = {
                    navigation: {
                        nextEl: '.' + navNextClass,
                        prevEl: '.' + navPrevClass,
                    },
                };
            } else if (navigation === 'dots') {
                navigationSettings = {
                    pagination: {
                        el: '.' + paginationClass,
                        clickable: true,
                    },
                };
            }

            // Add default pagination handling
            if (paginationType === 'dots') {
                navigationSettings.pagination = {
                    el: '.' + paginationClass,
                    clickable: true,
                };
            } else if (paginationType === 'number') {
                navigationSettings.pagination = {
                    el: '.' + paginationClass,
                    type: "fraction",
                };
            }

            // Initialize Swiper with settings
            var midSlider = new Swiper($carousel[0], {
                autoplay: settings.autoplay === 'yes' ? {
                    delay: settings.autoplay_speed,
                    pauseOnMouseEnter: settings.pause_on_hover === 'yes',
                    disableOnInteraction: settings.pause_on_interaction === 'yes',
                } : false,
                loop: settings.infinite === 'yes',
                autoHeight: settings.autoheight === 'yes',
                speed: settings.speed,
                slidesPerView: settings.slides_to_show_mobile,
                slidesPerGroup: settings.slides_to_scroll,
                spaceBetween: 20,
                breakpoints: {
                    768: {
                        slidesPerView: settings.slides_to_show_tablet,
                        slidesPerGroup: settings.slides_to_scroll,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: settings.slides_to_show,
                        slidesPerGroup: settings.slides_to_scroll,
                        spaceBetween: 40,
                    },
                },
                ...navigationSettings,
            });

			midSlider.on('slideChangeTransitionStart', function () {
				$('.carousel-image.animated img').removeClass('animated zoomIn').css('opacity', '0');
			});

			midSlider.on('slideChangeTransitionEnd', function () {
				$('.carousel-image.animated img').addClass('animated zoomIn').css('opacity', '1');
			});

            // Add padding-bottom if swiper-pagination or nav bottom exists
            if ($carousel.find('.swiper-pagination, .nav-bottom').length) {
                $carousel.css('padding-bottom', 'calc(50px + (3.5rem / 2))');
            }
        });
    });
}(jQuery));

/*----------------------------------------------
9. Compare
----------------------------------------------*/
(function ($) {
    'use strict';

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/compare.default', function ($scope) {
            var $container = $scope.find('.compare-container');

            // Get settings from data attributes
            var defaultOffsetPct = parseFloat($container.data('offset-pct')) || 0.5;
            var orientation = $container.data('orientation') || 'horizontal';
            var beforeLabel = $container.data('before-label') || '';
            var afterLabel = $container.data('after-label') || '';
            var noOverlay = $container.attr('data-no-overlay') === 'true';

            // Initialize the compare slider
            $container.compare({
                default_offset_pct: defaultOffsetPct,
                orientation: orientation,
                before_label: beforeLabel,
                after_label: afterLabel,
                no_overlay: noOverlay
            });

            // Custom handle
            $container.each(function () {
                var $handle = $(this).find('.compare-handle');
                $handle.empty();
                $handle.append('<button aria-label="Drag the handle" class="compare-button"><span class="icon material-symbols-outlined">code</span></button>');
            });
        });
    });

}(jQuery));

/*----------------------------------------------
10. Parallax
----------------------------------------------*/
(function ($) {
    "use strict";

    function initParallax(element) {
        element.parallax({
            speed: 0.9,
        });
    }

    function destroyParallax(element) {
        element.parallax('destroy'); // Ensure to destroy any existing parallax instance on this element
    }

    function observeClassChanges() {
        // Set up a MutationObserver to detect class changes
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    const target = $(mutation.target);

                    if (target.hasClass('parallax')) {
                        initParallax(target);
                    } else {
                        destroyParallax(target); // Stop the parallax effect when class is removed
                    }
                }
            });
        });

        // Observe each element for class changes
        $('.elementor-element').each(function () {
            observer.observe(this, { attributes: true });
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function () {
            observeClassChanges();
        });
    });

}(jQuery));

/*----------------------------------------------
11. Tabs
----------------------------------------------*/
(function ($) {
    "use strict";

    // Function to initialize glider and scrolling functionality
    const initializeTabs = function ($scope) {
        const tabsContainer = $scope.find(".nav-tabs")[0];
        const glider = $scope.find(".glider")[0];
        const tabItems = $scope.find(".nav-link");
        const isVertical = $scope.hasClass("vertical");

        // Exit if essential elements are missing
        if (!tabsContainer || !glider || tabItems.length === 0) {
            console.warn("Tabs: Essential elements missing.");
            return;
        }

        // Function to update glider position and size dynamically
        function updateGlider(tab) {
            const tabDimension = isVertical ? tab.offsetHeight : tab.offsetWidth;
            const tabPosition = isVertical ? tab.offsetTop : tab.offsetLeft;

            // Apply dimension and position to glider
            if (isVertical) {
                glider.style.height = `${tabDimension}px`;
                glider.style.width = ''; // Clear width for vertical
                glider.style.transform = `translateY(${tabPosition}px)`;
            } else {
                glider.style.width = `${tabDimension}px`;
                glider.style.height = ''; // Clear height for horizontal
                glider.style.transform = `translateX(${tabPosition}px)`;
            }
        }

        // Initialize glider position for the active tab on page load
        const activeTab = tabsContainer.querySelector(".nav-link.active");
        if (activeTab) {
            updateGlider(activeTab);
        } else {
            console.warn("Tabs: No active tab found.");
        }

        // Update glider position on tab click
        tabItems.each(function () {
            $(this).on("click", function () {
                // Update active class
                tabItems.removeClass("active");
                $(this).addClass("active");

                // Update glider position
                updateGlider(this);

                // Scroll the container to bring the clicked tab into view
                const container = this.closest('.nav-tabs'); // The scrollable container
                const containerRect = container.getBoundingClientRect();
                const tabRect = this.getBoundingClientRect();

                // If the tab is outside the container's visible area, scroll to it
                if (tabRect.right > containerRect.right || tabRect.left < containerRect.left) {
                    container.scrollTo({
                        left: container.scrollLeft + (tabRect.left - containerRect.left),
                        behavior: 'smooth' // Smooth scrolling
                    });
                }
            });
        });
    };

    // Elementor frontend hook
    jQuery(window).on('elementor/frontend/init', function () {
        // For Elementor tl-tabs widget
        elementorFrontend.hooks.addAction('frontend/element_ready/tl-tabs.default', function ($scope) {
            initializeTabs($scope.find(".tl-widget.tabs"));
        });

        // For WooCommerce global tabs
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
            // Check if WooCommerce tabs are present
            const wooTabs = $scope.find(".woocommerce-tabs");
            if (wooTabs.length > 0) {
                initializeTabs(wooTabs);
            }
        });
    });

    // WooCommerce document ready hook (in case WooCommerce tabs are loaded outside Elementor)
    $(document).ready(function () {
        const wooTabs = $(".woocommerce-tabs");
        if (wooTabs.length > 0) {
            wooTabs.each(function () {
                initializeTabs($(this));
            });
        }
    });

})(jQuery);

/*----------------------------------------------
12. Image Marquee
----------------------------------------------*/
(function ($) {
    "use strict";

    $(window).on('elementor/frontend/init', function () {

        // Use the elementorFrontend.hooks to ensure the widget is fully loaded before applying the script
        elementorFrontend.hooks.addAction('frontend/element_ready/tl-image-marquee.default', function () {

            // Get the marquee wrapper for your widget
            const marqueeWrapper = document.querySelector('.tl-widget.image-marquee ul');
            
            if (!marqueeWrapper) return; // Exit if the element is not found

            const marqueeItems = Array.from(marqueeWrapper.children);
            const gap = parseFloat(getComputedStyle(marqueeWrapper).gap); // Get the gap value

            const items = marqueeWrapper.querySelectorAll('.item');

            // GSAP horizontal loop
            function horizontalLoop(items, config) {
                items = gsap.utils.toArray(items);
                config = config || {};
                let tl = gsap.timeline({
                    repeat: -1, // Repeat forever (infinite loop)
                    paused: false, // Start the animation immediately
                    defaults: { ease: "none" },
                });

                let length = items.length,
                    startX = items[0].offsetLeft,
                    widths = [],
                    xPercents = [],
                    pixelsPerSecond = (config.speed || 1) * 100,
                    totalWidth, curX, distanceToStart, distanceToLoop, item, i;

                gsap.set(items, { // Convert "x" to "xPercent" for responsiveness
                    xPercent: (i, el) => {
                        let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                        xPercents[i] = parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent");
                        return xPercents[i];
                    }
                });

                gsap.set(items, { x: 0 });

                // Calculate total width for loop, including gap adjustment
                totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + gap;

                // Create the animation timeline for seamless horizontal loop
                for (i = 0; i < length; i++) {
                    item = items[i];
                    curX = xPercents[i] / 100 * widths[i];
                    distanceToStart = item.offsetLeft + curX - startX;
                    distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
                    tl.to(item, { xPercent: (curX - distanceToLoop) / widths[i] * 100, duration: distanceToLoop / pixelsPerSecond }, 0)
                      .fromTo(item, { xPercent: (curX - distanceToLoop + totalWidth) / widths[i] * 100 }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond);
                }

                // Pre-render for performance
                tl.progress(1, true).progress(0, true);

                return tl;
            }

            // Start the infinite loop animation
            horizontalLoop(items, { speed: 1 });
        });
    });

})(jQuery);