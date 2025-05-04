// Script to safely remove stray checkmarks from the DOM
(function() {
  // Create a MutationObserver to watch for new SVG elements
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        Array.from(mutation.addedNodes).forEach(function(node) {
          // Check if it's an SVG element
          if (node.nodeName === 'svg') {
            handleSvgNode(node);
          }
        });
      }
    });
  });

  // Function to safely handle SVG nodes
  function handleSvgNode(node) {
    try {
      // Check if it's a stray checkmark
      if (node.classList &&
          (node.classList.contains('lucide-check') ||
           node.getAttribute('data-lucide') === 'check')) {

        // Only remove if not inside a proper component
        if (!node.closest('.checkbox-wrapper') && node.parentNode === document.body) {
          // Use a safer removal approach
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        }
      }
    } catch (e) {
      console.error('Error handling SVG node:', e);
    }
  }

  // Function to remove existing stray checkmarks
  function removeStrayCheckmarks() {
    try {
      // Find all SVG elements directly under body
      const strayCheckmarks = document.querySelectorAll('body > svg');

      // Remove them safely
      strayCheckmarks.forEach(svg => {
        try {
          if ((svg.classList && svg.classList.contains('lucide-check')) ||
              svg.getAttribute('data-lucide') === 'check') {
            if (svg.parentNode) {
              svg.parentNode.removeChild(svg);
            }
          }
        } catch (e) {
          console.error('Error removing SVG:', e);
        }
      });

      // Also look for any checkmarks outside of proper components
      const allCheckmarks = document.querySelectorAll('svg.lucide-check');
      allCheckmarks.forEach(svg => {
        try {
          // If not inside a checkbox wrapper, remove it
          if (!svg.closest('.checkbox-wrapper') && svg.parentNode) {
            svg.parentNode.removeChild(svg);
          }
        } catch (e) {
          console.error('Error removing checkmark:', e);
        }
      });
    } catch (e) {
      console.error('Error in removeStrayCheckmarks:', e);
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      removeStrayCheckmarks();
      startObserving();
    });
  } else {
    removeStrayCheckmarks();
    startObserving();
  }

  // Function to start the observer
  function startObserving() {
    // Start observing the document body for added nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Also run periodically as a fallback
  setInterval(removeStrayCheckmarks, 2000);
})();
