$(document).on(':passagestart', function() {
  // Set up random glitches with less frequent, more randomized timing
  setupRandomGlitches();
  
  // Check for and create author's note button and banners if they don't exist
  setupPersistentElements();
 
});

// Function to set up the random glitches
function setupRandomGlitches() {
  // Clear any existing glitch timers to prevent duplicates
  if (window.glitchTimers) {
    window.glitchTimers.forEach(timer => clearTimeout(timer));
  }
  window.glitchTimers = [];
  
  // Set up random minor glitches (less frequent than before)
  for (let i = 0; i < 5; i++) {
    // Random timing between 18-26 seconds for minor glitches (increased from 3-15)
    const glitchTime = Math.random() * 8000 + 18000; // 18-26 seconds
    const timer = setTimeout(() => {
      triggerMinorGlitch();
      // Schedule the next glitch
      setupRandomGlitches();
    }, glitchTime);
    window.glitchTimers.push(timer);
  }
  
  // Set up random major blackout glitches (even less frequent)
  const blackoutTime = Math.random() * 40000 + 30000; // 30-70 seconds (increased from 20-50)
  const blackoutTimer = setTimeout(() => {
    triggerBlackoutGlitch();
  }, blackoutTime);
  window.glitchTimers.push(blackoutTimer);
}

// Function to trigger minor glitches
function triggerMinorGlitch() {
  // Pick a random glitch type
  const glitchType = Math.floor(Math.random() * 7);
  
  // Create a temporary glitch element
  const glitchElement = $('<div id="minor-glitch"></div>').css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'pointer-events': 'none',
    'z-index': '9000'
  });
  
  // Apply different effects based on random selection
  switch(glitchType) {
    case 0: // Color shift
      $('body').append(glitchElement);
      glitchElement.css({
        'background-color': 'rgba(255, 0, 255, 0.2)',
        'mix-blend-mode': 'exclusion'
      });
      setTimeout(() => glitchElement.remove(), 200);
      break;
      
    case 1: // Horizontal shift
      $('#story').css({
        'transform': 'translateX(5px)',
        'transition': 'transform 0.05s'
      });
      setTimeout(() => {
        $('#story').css({
          'transform': 'translateX(-8px)'
        });
        setTimeout(() => {
          $('#story').css({
            'transform': 'translateX(0)'
          });
        }, 100);
      }, 100);
      break;
      
    case 2: // Text garble - FIXED to ensure text returns to normal
      const textElements = $('.passage p, .passage span, .passage div:not(.banner-container-1):not(.banner-container-2)');
      const originalTexts = [];
      
      // Store original text content and create garbled versions
      textElements.each(function(index) {
        const $this = $(this);
        originalTexts[index] = $this.html();
        
        // Only garble some text elements (random selection)
        if (Math.random() < 0.3) {
          const garbledText = originalTexts[index].split('').map(char => {
            if (Math.random() < 0.1) {
              return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            }
            return char;
          }).join('');
          $this.html(garbledText);
        }
      });
      
      // Restore original text after delay
      setTimeout(() => {
        textElements.each(function(index) {
          $(this).html(originalTexts[index]);
        });
      }, 300);
      break;
      
    case 3: // Scan lines
      $('body').append(glitchElement);
      glitchElement.css({
        'background': 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.2) 2px, transparent 2px, transparent 4px)',
        'opacity': '0.7'
      });
      setTimeout(() => glitchElement.remove(), 400);
      break;
      
    case 4: // Flicker
      $('body').append(glitchElement);
      glitchElement.css({
        'background-color': 'rgba(0, 0, 0, 0.8)'
      });
      setTimeout(() => glitchElement.css('background-color', 'rgba(0, 0, 0, 0)'), 50);
      setTimeout(() => glitchElement.css('background-color', 'rgba(0, 0, 0, 0.8)'), 100);
      setTimeout(() => glitchElement.css('background-color', 'rgba(0, 0, 0, 0)'), 150);
      setTimeout(() => glitchElement.remove(), 200);
      break;
      
    case 5: // System message
      $('body').append(glitchElement);
      glitchElement.css({
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'color': '#00FFFF',
        'font-family': 'monospace',
        'font-size': '16px',
        'text-shadow': '0 0 5px #00FFFF'
      });
      
      const messages = [
        "SIGNAL INTERFERENCE DETECTED",
        "RECALIBRATING DIMENSIONAL PARAMETERS",
        "M'RKATH'NEB ENERGY SIGNATURE DETECTED",
        "REALITY ANCHOR DESTABILIZING",
        "EXISTENTIAL KNOT TIGHTENING",
        "DIMENSIONAL BREACH IMMINENT",
        "THE STACKS EXPANDING"
      ];
      
      glitchElement.text(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => glitchElement.remove(), 800);
      break;
      
    case 6: // Digital noise
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = window.innerWidth;
      noiseCanvas.height = window.innerHeight;
      const ctx = noiseCanvas.getContext('2d');
      
      // Create digital noise
      const imageData = ctx.createImageData(noiseCanvas.width, noiseCanvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() < 0.1 ? 255 : 0;
        data[i] = Math.random() < 0.2 ? 0 : value;     // R
        data[i+1] = Math.random() < 0.2 ? 255 : value; // G
        data[i+2] = Math.random() < 0.2 ? 255 : 0;     // B
        data[i+3] = Math.random() < 0.3 ? 100 : 20;    // A
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      $('body').append(glitchElement);
      glitchElement.css({
        'background-image': 'url(' + noiseCanvas.toDataURL() + ')',
        'opacity': '0.3',
        'mix-blend-mode': 'overlay'
      });
      
      setTimeout(() => glitchElement.remove(), 300);
      break;
  }
}

// Function to trigger major blackout glitch
function triggerBlackoutGlitch() {
  // Create blackout overlay
  const blackout = $('<div id="blackout-glitch"></div>').css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'background-color': '#000',
    'z-index': '9999',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'color': '#00FF00',
    'font-family': 'monospace',
    'font-size': '24px',
    'opacity': '0',
    'transition': 'opacity 0.2s',
    'text-align': 'center',
    'pointer-events': 'none'
  });
  
  $('body').append(blackout);
  
  // Sequence of blackout effects
  setTimeout(() => blackout.css('opacity', '1'), 50);  // Fade in
  
  // Short circuit message
  setTimeout(() => blackout.text('SIGNAL LOST'), 500);
  
  // Completely black for a longer period
  setTimeout(() => blackout.text(''), 1500);
  
  // Attempt to reconnect messages
  setTimeout(() => blackout.text('ATTEMPTING TO RECONNECT...'), 4000);
  setTimeout(() => blackout.text('DIMENSIONAL ALIGNMENT FAILED'), 5500);
  setTimeout(() => blackout.text('RECALIBRATING REALITY PARAMETERS'), 7000);
  
  // Show scan line effect
  setTimeout(() => {
    blackout.css({
      'background': 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.97) 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)',
      'color': '#00FFFF'
    });
    blackout.text('SIGNAL INTERFERENCE DETECTED');
  }, 8500);
  
  // Final reconnection
  setTimeout(() => blackout.text('CONNECTION REESTABLISHED'), 10000);
  
  // Fade out and remove
  setTimeout(() => {
    blackout.css({
      'opacity': '0',
      'transition': 'opacity 1s'
    });
    setTimeout(() => blackout.remove(), 1000);
    
    // Schedule next blackout
    const nextBlackout = Math.random() * 40000 + 30000; // 30-70 seconds (increased)
    const timer = setTimeout(triggerBlackoutGlitch, nextBlackout);
    window.glitchTimers.push(timer);
  }, 11000);
}

// Function to set up persistent elements
function setupPersistentElements() {
  // Create author's note button if it doesn't exist
  if ($('#author-note-button').length === 0) {
    let authorButton = $('<div id="author-note-button">Author\'s Note</div>').css({
      'position': 'fixed',
      'bottom': '90px',
      'right': '20px',
      'background-color': '#00FFFF',
      'color': '#000033',
      'padding': '8px 15px',
      'border': '2px solid #FF00FF',
      'border-radius': '5px',
      'font-family': 'Courier New, monospace',
      'font-weight': 'bold',
      'cursor': 'pointer',
      'z-index': '1000',
      'box-shadow': '0 0 10px #00FFFF',
      'transition': 'all 0.3s ease'
    });
    
    // Add hover effect
    authorButton.hover(
      function() {
        $(this).css({
          'background-color': '#FF00FF',
          'color': '#000033',
          'box-shadow': '0 0 15px #FF00FF'
        });
      },
      function() {
        $(this).css({
          'background-color': '#00FFFF',
          'color': '#000033',
          'box-shadow': '0 0 10px #00FFFF'
        });
      }
    );
    
    // Add click event to navigate to Author's Note passage
    authorButton.click(function() {
      Engine.play('Author\'s Note');
    });
    
    // Add to the page
    $('body').append(authorButton);
  }
  
  // Create banners if they don't exist
  if ($('.banner-container-1').length === 0) {
    // Create banner elements
    $('body').append(`
      <div class="banner-container-1">
        <div class="banner-text-1">SYSTEM ALERT: REALITY DISTORTION DETECTED IN AZURE COVE // DIMENSIONAL BREACH IN SECTOR 7G // EXISTENTIAL KNOT ACTIVITY INCREASING // MAUREPAS SECURITY NOTIFIED // THE STACKS EXPANDING // M'RKATH'NEB ENERGY SIGNATURES DETECTED</div>
      </div>

      <div class="banner-container-2">
        <div class="banner-text-2">WELCOME TO SHELLHAVEN // POPULATION: NOWHERE! // TIME DISPLACEMENT WARNING // MULTIPLE DIMENSIONS CONVERGING // PRETERNATURAL AFFAIRS DEPARTMENT INVESTIGATING // HOLYWILDISTS SEEKING OFFERINGS // DEPT. OF CRYPTONOMICS RESEARCH IN PROGRESS</div>
      </div>
    `);
  }
}

// Functions to update banner text during gameplay
window.updateBanner1 = function(newText) {
  $('.banner-text-1').text(newText);
};

window.updateBanner2 = function(newText) {
  $('.banner-text-2').text(newText);
};

// Function to manually trigger a blackout glitch
window.triggerBlackout = function() {
  triggerBlackoutGlitch();
};

// Add these macros to your Story JavaScript

// Basic twitch effect
Macro.add('twitch', {
    tags: null,
    handler: function() {
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('glitch-text twitch');
        $wrapper.wiki(this.payload[0].contents); // Corrected: use .wiki()
        $wrapper.appendTo(this.output);
    }
});

// Distortion effect
Macro.add('distort', {
    tags: null,
    handler: function() {
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('glitch-text distort');
        $wrapper.wiki(this.payload[0].contents); // Corrected: use .wiki()
        $wrapper.appendTo(this.output);
    }
});

// Digital decay effect
Macro.add('decay', {
    tags: null,
    handler: function() {
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('glitch-text decay');
        $wrapper.wiki(this.payload[0].contents); // Corrected: use .wiki()
        $wrapper.appendTo(this.output);
    }
});

// Warping text effect
Macro.add('warp', {
    tags: null,
    handler: function() {
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('glitch-text warp');
        $wrapper.wiki(this.payload[0].contents); // Corrected: use .wiki()
        $wrapper.appendTo(this.output);
    }
});

// Severe corruption effect
Macro.add('corrupt', {
    tags: null,
    handler: function() {
        const content = this.payload[0].contents;
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('glitch-text corrupt');
        $wrapper.attr('data-text', content);
        $wrapper.wiki(content); // Corrected: use .wiki()
        $wrapper.appendTo(this.output);
    }
});

// Complete malfunction (combines multiple effects)
Macro.add('malfunction', {
    tags: null,
    handler: function() {
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('glitch-text malfunction');
        $wrapper.wiki(this.payload[0].contents); // Corrected: use .wiki()
        $wrapper.appendTo(this.output);
    }
});
// Enhanced Static Effect - Add to Story JavaScript

// Static text effect macro
Macro.add('static', {
    tags: null,
    handler: function() {
        // Create the wrapper element
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('static-text');
        
        // Get the content
        const content = this.payload[0].contents;
        
        // Create a data attribute with the original text (for CSS effects)
        $wrapper.attr('data-text', content);
        
        // Add the content
        $wrapper.wiki(content);
        
        // Append to output
        $wrapper.appendTo(this.output);
    }
});
// Triquetra transformation macro
Macro.add('triquetra', {
    tags: null,
    handler: function() {
        // Get the content
        const content = this.payload[0].contents;
        const letters = content.split('');
        
        // Create the wrapper
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('triquetra-container');
        
        // Add each letter as a separate span with different animation delays
        letters.forEach((letter, index) => {
            if (letter === ' ') {
                // Handle spaces
                $wrapper.append(' ');
            } else {
                const $letter = $(document.createElement('span'));
                $letter.addClass('triquetra-letter');
                
                // Calculate delay based on position in word
                const delay = (index % 6) * 0.5; // Cycle through 6 different delays
                $letter.css('animation-delay', delay + 's');
                
                $letter.text(letter);
                $wrapper.append($letter);
            }
        });
        
        // Append to output
        $wrapper.appendTo(this.output);
    }
});
// Loopy transformation macro
Macro.add('loopy', {
    tags: null,
    handler: function() {
        // Get the content
        const content = this.payload[0].contents;
        const letters = content.split('');
        
        // Create the wrapper
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('loopy-container');
        
        // Add each letter as a separate span with different animation delays
        letters.forEach((letter, index) => {
            if (letter === ' ') {
                // Handle spaces
                $wrapper.append(' ');
            } else {
                const $letter = $(document.createElement('span'));
                $letter.addClass('loopy-letter');
                
                // Calculate delay based on position in word
                const delay = (index % 6) * 0.5; // Cycle through 6 different delays
                $letter.css('animation-delay', delay + 's');
                
                $letter.text(letter);
                $wrapper.append($letter);
            }
        });
        
        // Append to output
        $wrapper.appendTo(this.output);
    }
});
// Add this to your Story JavaScript section if SVG doesn't work

// ASCII Triquetra fallback
Macro.add('asciitriquetra', {
    tags: null,
    handler: function() {
        // Get the content
        const word = this.payload[0].contents.trim();
        
        // Create the wrapper
        const $wrapper = $(document.createElement('pre'));
        $wrapper.addClass('ascii-triquetra');
        
        // Create ASCII triquetra with the word
        const asciiArt = `
        ${word}${word}${word}
      ${word}       	${word}
    ${word}          	 ${word}
  ${word}               	${word}
${word}                 	  ${word}
${word}     	 			  ${word}
${word}       		  		  ${word}
${word}                  	  ${word}
${word}                  	  ${word}
${word}                  	  ${word}
${word}       				  ${word}
${word}     				  ${word}
${word}                  	  ${word}
  ${word}              	    ${word}
    ${word}          	 ${word}
      ${word}       	${word}
        ${word}${word}${word}
`;
        
        $wrapper.text(asciiArt);
        
        // Append to output
        $wrapper.appendTo(this.output);
    }
});
// Macro for flashing text effects that can be used in your Twine story
Macro.add('flash', {
    tags: null,
    handler: function() {
        // Get the content and the parameters
        const content = this.payload[0].contents;
        const type = this.args.length > 0 ? this.args[0] : "simple"; // Default to simple flash
        
        // Create the wrapper element
        const $wrapper = $(document.createElement('span'));
        
        // Apply the appropriate class based on type
        switch(type) {
            case "color":
                $wrapper.addClass('colored-flash');
                break;
            case "glitch":
                $wrapper.addClass('glitch-flash');
                break;
            case "mrkath":
                $wrapper.addClass('mrkath-flash');
                break;
            default:
                $wrapper.addClass('flash-text');
        }
        
        // Add the content
        $wrapper.wiki(content);
        
        // Append to output
        $wrapper.appendTo(this.output);
    }
});

// Advanced random flashing text function
// This creates truly randomized, unpredictable flashing effects
// Can be called directly in JavaScript or from a custom macro
function createRandomFlashingText(elementSelector, options = {}) {
    const defaults = {
        baseColor: "#00FF00", // Default green
        flashColors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0000"], // Color options
        minInterval: 100, // Minimum time between flashes (ms)
        maxInterval: 3000, // Maximum time between flashes (ms)
        flashDuration: 100, // How long each flash lasts (ms)
        glitchProbability: 0.3, // Probability of including glitch effects
        transformProbability: 0.2 // Probability of including transform effects
    };
    
    // Merge default options with provided options
    const settings = {...defaults, ...options};
    
    // Find the element
    const element = document.querySelector(elementSelector);
    if (!element) return; // Exit if element not found
    
    // Set initial style
    element.style.color = settings.baseColor;
    element.style.transition = `color ${settings.flashDuration/2}ms ease`;
    
    // Function to create a random flash
    function createFlash() {
        // Random color from options
        const randomColor = settings.flashColors[Math.floor(Math.random() * settings.flashColors.length)];
        
        // Apply the flash
        element.style.color = randomColor;
        
        // Add random glitch effects occasionally
        if (Math.random() < settings.glitchProbability) {
            const offsetX = Math.floor(Math.random() * 5) - 2; // -2 to 2 pixels
            const offsetY = Math.floor(Math.random() * 5) - 2; // -2 to 2 pixels
            element.style.textShadow = `${offsetX}px ${offsetY}px 5px ${randomColor}`;
        } else {
            element.style.textShadow = "none";
        }
        
        // Add random transform effects occasionally
        if (Math.random() < settings.transformProbability) {
            const scale = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
            const rotate = Math.floor(Math.random() * 3) - 1; // -1 to 1 degrees
            const translateX = Math.floor(Math.random() * 7) - 3; // -3 to 3 pixels
            element.style.transform = `scale(${scale}) rotate(${rotate}deg) translateX(${translateX}px)`;
        } else {
            element.style.transform = "none";
        }
        
        // Reset after the flash duration
        setTimeout(() => {
            element.style.color = settings.baseColor;
            element.style.textShadow = "none";
            element.style.transform = "none";
        }, settings.flashDuration);
        
        // Schedule the next flash
        const nextInterval = Math.floor(Math.random() * (settings.maxInterval - settings.minInterval)) + settings.minInterval;
        setTimeout(createFlash, nextInterval);
    }
    
    // Start the flashing
    createFlash();
}

// Twine macro to use the random flashing text function
Macro.add('randomflash', {
    tags: null,
    handler: function() {
        // Get the content
        const content = this.payload[0].contents;
        
        // Create a unique ID for this element
        const uniqueId = `random-flash-${Math.floor(Math.random() * 10000)}`;
        
        // Create the element with the unique ID
        const $wrapper = $(document.createElement('span'));
        $wrapper.attr('id', uniqueId);
        $wrapper.wiki(content);
        
        // Append to output
        $wrapper.appendTo(this.output);
        
        // Get additional parameters if provided
        const options = {};
        if (this.args.length > 0) {
            // Parse parameters - could be colors, intervals, etc.
            if (this.args[0] && typeof this.args[0] === 'string') {
                options.baseColor = this.args[0];
            }
            if (this.args[1] && Array.isArray(this.args[1])) {
                options.flashColors = this.args[1];
            }
            if (this.args[2] && typeof this.args[2] === 'number') {
                options.minInterval = this.args[2];
            }
            if (this.args[3] && typeof this.args[3] === 'number') {
                options.maxInterval = this.args[3];
            }
        }
        
        // Apply the random flashing effect
        createRandomFlashingText(`#${uniqueId}`, options);
    }
});

// Time-sensitive content system with three red flashes
$(document).on(':passagerender', function() {
  // Create the flash overlay element if it doesn't exist
  if ($('#time-sensitive-flash-overlay').length === 0) {
    $('body').append('<div id="time-sensitive-flash-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #FF0000; opacity: 0; pointer-events: none; z-index: 9999;"></div>');
  }
  
  // Find all elements with the time-sensitive class
  setTimeout(function() {
    $('.time-sensitive').each(function() {
      const $element = $(this);
      
      // Get the time limit - either from the data attribute or default to 10 seconds
      let timeLimit = 10;
      if ($element.attr('data-time-limit')) {
        timeLimit = parseInt($element.attr('data-time-limit'));
      }
      
      // Generate a unique ID if none exists
      const uniqueId = $element.attr('id') || 'time-sensitive-' + Math.floor(Math.random() * 10000);
      $element.attr('id', uniqueId);
      
      // Style the element with reduced top padding
      $element.css({
    'position': 'relative',
    'border': '1px solid #00FF00',
    'box-shadow': '0 0 5px #00FF00',
    'padding': '.5px 10px 5px 10px', // Less padding on top, normal on others
    'margin': '5px 0',
    'cursor': 'pointer',
    'background-color': 'rgba(0, 20, 0, 0.2)',
    'line-height': '1.5' // More natural line height for readability
});
      
      // Start the countdown
      let timeLeft = timeLimit;
      const interval = setInterval(function() {
        timeLeft--;
        
        // Visual indicator as time runs out - no text
        const urgencyFactor = 1 - (timeLeft / timeLimit);
        const r = Math.floor(255 * urgencyFactor);
        const g = Math.floor(255 * (1 - urgencyFactor));
        $element.css({
          'border-color': `rgb(${r}, ${g}, 0)`,
          'box-shadow': `0 0 ${5 + (urgencyFactor * 10)}px rgb(${r}, ${g}, 0)`
        });
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          
          // Get the flash overlay
          const $flashOverlay = $('#time-sensitive-flash-overlay');
          
          // Three distinct red flashes
          
          // First flash
          $flashOverlay.css({
            'opacity': '0.8',
            'transition': 'opacity 50ms ease'
          });
          
          // First flash off
          setTimeout(function() {
            $flashOverlay.css({
              'opacity': '0',
              'transition': 'opacity 50ms ease'
            });
          }, 150);
          
          // Second flash
          setTimeout(function() {
            $flashOverlay.css({
              'opacity': '0.8',
              'transition': 'opacity 50ms ease'
            });
          }, 300);
          
          // Second flash off
          setTimeout(function() {
            $flashOverlay.css({
              'opacity': '0',
              'transition': 'opacity 50ms ease'
            });
          }, 450);
          
          // Third flash
          setTimeout(function() {
            $flashOverlay.css({
              'opacity': '0.8',
              'transition': 'opacity 50ms ease'
            });
          }, 600);
          
          // Third flash off
          setTimeout(function() {
            $flashOverlay.css({
              'opacity': '0',
              'transition': 'opacity 50ms ease'
            });
          }, 750);
          
          // After the flashes, hide the element
          setTimeout(function() {
            // Glitchy disappearance effect for the element
            $element.css({
              'transform': 'translateX(5px)',
              'opacity': '0.7'
            });
            
            setTimeout(function() {
              $element.css({
                'transform': 'translateX(-10px)'
              });
              
              setTimeout(function() {
                $element.css({
                  'opacity': '0.3',
                  'transform': 'translateX(0)'
                });
                
                setTimeout(function() {
                  $element.css('display', 'none');
                  // Store that this element has been hidden
                  window.hiddenElements = window.hiddenElements || {};
                  window.hiddenElements[uniqueId] = true;
                }, 200);
              }, 100);
            }, 100);
          }, 800);
        }
      }, 1000);
      
      // Handle clicks to preserve content
      $element.on('click', function() {
        clearInterval(interval);
        $element.css({
          'border-color': '#00FFFF',
          'box-shadow': '0 0 15px #00FFFF'
        });
        
        // Flash effect to confirm preservation
        $element.css('background-color', 'rgba(0, 255, 255, 0.3)');
        setTimeout(function() {
          $element.css('background-color', 'rgba(0, 20, 0, 0.2)');
        }, 300);
        
        setTimeout(function() {
          // Gradually fade out the border and effects
          $element.css({
            'transition': 'all 1.5s ease',
            'border': 'none',
            'box-shadow': 'none',
            'background-color': 'transparent',
            'padding': 'inherit'
          });
        }, 1000);
        
        $element.off('click');
        
        // Store that this element has been preserved
        window.capturedElements = window.capturedElements || {};
        window.capturedElements[uniqueId] = true;
      });
      
      // Check if this should already be hidden
      if (window.hiddenElements && window.hiddenElements[uniqueId]) {
        $element.css('display', 'none');
      }
      
      // Check if this was already captured
      if (window.capturedElements && window.capturedElements[uniqueId]) {
        clearInterval(interval);
        $element.css({
          'border': 'none',
          'box-shadow': 'none',
          'cursor': 'auto',
          'background-color': 'transparent',
          'padding': 'inherit'
        });
      }
    });
  }, 100);
});

// Simple achievement initialization - add this to your Story JavaScript
$(document).ready(function() {
  // Basic setup - don't interfere with page rendering
  if (!State.variables.achievements) {
    State.variables.achievements = {
      earned: {},
      displayed: {},
      total: 0,
      totalPossible: 0
    };
  }
  
  // Add the achievements button
  setTimeout(function() {
    addAchievementsButton();
    checkPageForAchievements();
  }, 500); // Wait for the page to fully render
});

// Simplified unlock achievement function
window.unlockAchievement = function(id, title, description, secret = false) {
  if (!State.variables.achievements) return false;
  
  if (!State.variables.achievements.earned[id]) {
    State.variables.achievements.earned[id] = {
      id: id,
      title: title,
      description: description,
      secret: secret,
      timestamp: new Date().toISOString()
    };
    
    State.variables.achievements.total++;
    
    if (!State.variables.achievements.displayed[id]) {
      showAchievementNotification(id, title, description);
      State.variables.achievements.displayed[id] = true;
    }
    
    return true;
  }
  
  return false;
};

// Show a notification when achievement is unlocked
function showAchievementNotification(id, title, description) {
  const notification = $('<div id="achievement-notification"></div>').css({
    'position': 'fixed',
    'bottom': '150px',
    'right': '20px',
    'background-color': '#000033',
    'color': '#00FF00',
    'border': '3px solid #00FFFF',
    'box-shadow': '0 0 10px #00FFFF',
    'padding': '10px',
    'z-index': '1000',
    'font-family': '"Courier New", monospace',
    'max-width': '300px',
    'opacity': '0',
    'transform': 'translateX(50px)',
    'border-radius': '5px'
  });
  
  notification.html(`
    <div style="display: flex; align-items: center;">
      <div style="margin-right: 10px;">
        <div style="width: 30px; height: 30px; background-color: #00FFFF; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
          <span style="color: #000033; font-weight: bold;">!</span>
        </div>
      </div>
      <div>
        <div style="font-weight: bold; color: #FF00FF; margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Achievement Unlocked</div>
        <div style="color: #00FFFF; margin-bottom: 3px; font-size: 16px;">${title}</div>
        <div style="color: #CCCCCC; font-size: 12px;">${description}</div>
      </div>
    </div>
  `);
  
  $('body').append(notification);
  
  setTimeout(() => {
    notification.css({
      'opacity': '1',
      'transform': 'translateX(0)'
    });
  }, 100);
  
  setTimeout(() => {
    notification.css({
      'opacity': '0',
      'transform': 'translateX(50px)'
    });
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

// Define the achievements
window.achievementsList = [
  {
    id: "first_visit",
    title: "Down South We Go",
    description: "Visited Azure Cove for the first time",
    check: function() {
      return true; // Always unlocks when checked on first visit
    }
  },
  {
    id: "priory_explorer",
    title: "Forbidden Explorer",
    description: "Discovered the secrets of the Priory",
    check: function() {
      return State.passage === "See what Dick and Chuck are doing" ||
             State.passage === "Dick ponders" ||
             State.passage === "Dick freaks, and so Chuck freaks" ||
             State.passage === "The boys jump";
    }
  },
  {
    id: "dreamwalker",
    title: "Dreamwalker",
    description: "Explored the dreams of Shellhaven",
    check: function() {
      return State.passage === "Alice's Wet Nightmares" ||
             State.passage === "Wendel's Dream Journal";
    }
  },
  {
    id: "stacks_survivor",
    title: "Stacks Survivor",
    description: "Entered The Stacks and made it back alive",
    check: function() {
      return State.passage === "This is a little more interesting...";
    }
  },
  {
    id: "master_reader",
    title: "Temporal Reader",
    description: "Saved the content of a time-sensitive passage",
    check: function() {
      return window.capturedElements && Object.keys(window.capturedElements).length > 0;
    }
  },
  {
    id: "book_finder", 
    title: "Arcane Bibliophile",
    description: "Found the odd book before it disappeared",
    check: function() {
      return State.passage === "the odd book";
    }
  },
  {
    id: "moonlight_ritual",
    title: "Moonlight Ritual",
    description: "Participated in a ritual with the Moonlighters",
    secret: true,
    check: function() {
      return State.passage === "walked forward a few feet";
    }
  },
  {
    id: "witness",
    title: "Interdimensional Witness",
    description: "Saw M'RKATH'NEB's true form",
    secret: true,
    check: function() {
      return false; // This would be triggered at a specific story moment
    }
  }
];

// Check achievements on the current page
function checkPageForAchievements() {
  if (!window.achievementsList) return;
  
  if (!State.variables.achievements) {
    State.variables.achievements = {
      earned: {},
      displayed: {},
      total: 0,
      totalPossible: 0
    };
  }
  
  State.variables.achievements.totalPossible = window.achievementsList.length;
  
  window.achievementsList.forEach(achievement => {
    if (achievement.check()) {
      unlockAchievement(
        achievement.id, 
        achievement.title, 
        achievement.description,
        achievement.secret || false
      );
    }
  });
}

// Add the achievements button
function addAchievementsButton() {
  if ($('#achievements-button').length === 0) {
    let achievementsButton = $('<div id="achievements-button">Achievements</div>').css({
      'position': 'fixed',
      'bottom': '90px',
      'left': '20px',
      'background-color': '#00FFFF',
      'color': '#000033',
      'padding': '8px 15px',
      'border': '2px solid #FF00FF',
      'border-radius': '5px',
      'font-family': 'Courier New, monospace',
      'font-weight': 'bold',
      'cursor': 'pointer',
      'z-index': '1000',
      'box-shadow': '0 0 10px #00FFFF',
      'transition': 'all 0.3s ease'
    });
    
    achievementsButton.hover(
      function() {
        $(this).css({
          'background-color': '#FF00FF',
          'color': '#000033',
          'box-shadow': '0 0 15px #FF00FF'
        });
      },
      function() {
        $(this).css({
          'background-color': '#00FFFF',
          'color': '#000033',
          'box-shadow': '0 0 10px #00FFFF'
        });
      }
    );
    
    achievementsButton.click(function() {
      showAchievementsPanel();
    });
    
    $('body').append(achievementsButton);
  }
}

// Show achievements panel
function showAchievementsPanel() {
  const backdrop = $('<div id="achievements-backdrop"></div>').css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'background-color': 'rgba(0, 0, 20, 0.8)',
    'z-index': '9999',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'opacity': '0',
    'transition': 'opacity 0.3s'
  });
  
  const panel = $('<div id="achievements-panel"></div>').css({
    'background-color': '#000033',
    'border': '3px solid #00FFFF',
    'box-shadow': '0 0 20px #00FFFF',
    'width': '80%',
    'max-width': '600px',
    'max-height': '80%',
    'overflow-y': 'auto',
    'padding': '20px',
    'color': '#00FF00',
    'font-family': 'Courier New, monospace',
    'transform': 'scale(0.9)',
    'transition': 'transform 0.3s',
    'position': 'relative'
  });
  
  let headerHtml = `
    <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #00FFFF; padding-bottom: 10px;">
      <h2 style="color: #FF00FF; margin: 0;">AZURE COVE ACHIEVEMENTS</h2>
      <div style="color: #00FFFF; margin-top: 5px;">
        ${State.variables.achievements.total} / ${State.variables.achievements.totalPossible} Discovered
      </div>
    </div>
  `;
  
  panel.append(headerHtml);
  
  const list = $('<div id="achievements-list"></div>').css({
    'display': 'grid',
    'grid-template-columns': 'repeat(auto-fill, minmax(250px, 1fr))',
    'gap': '15px'
  });
  
  window.achievementsList.forEach(achievement => {
    const earned = State.variables.achievements.earned[achievement.id];
    const isSecret = achievement.secret && !earned;
    
    const achievementItem = $('<div class="achievement-item"></div>').css({
      'border': earned ? '2px solid #00FF00' : '2px solid #333333',
      'padding': '10px',
      'border-radius': '5px',
      'background-color': earned ? 'rgba(0, 255, 0, 0.1)' : 'rgba(50, 50, 50, 0.3)',
      'transition': 'all 0.3s',
      'position': 'relative',
      'overflow': 'hidden'
    });
    
    if (earned) {
      achievementItem.hover(
        function() {
          $(this).css({
            'transform': 'scale(1.03)',
            'box-shadow': '0 0 10px #00FF00'
          });
        },
        function() {
          $(this).css({
            'transform': 'scale(1)',
            'box-shadow': 'none'
          });
        }
      );
    }
    
    if (isSecret) {
      achievementItem.append(`
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(45deg, rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3) 10px, rgba(40, 40, 40, 0.3) 10px, rgba(40, 40, 40, 0.3) 20px); z-index: 0;"></div>
      `);
    }
    
    achievementItem.append(`
      <div style="position: relative; z-index: 1;">
        <div style="font-weight: bold; color: ${earned ? '#FF00FF' : '#777777'}; margin-bottom: 5px;">
          ${isSecret ? "???" : achievement.title}
        </div>
        <div style="font-size: 12px; color: ${earned ? '#CCCCCC' : '#555555'};">
          ${isSecret ? "Undiscovered achievement" : achievement.description}
        </div>
        ${earned ? `<div style="font-size: 10px; color: #00FFFF; margin-top: 5px;">Unlocked</div>` : ''}
      </div>
    `);
    
    list.append(achievementItem);
  });
  
  panel.append(list);
  
  const closeButton = $('<div id="close-achievements"></div>').css({
    'position': 'absolute',
    'top': '10px',
    'right': '10px',
    'color': '#FF00FF',
    'font-size': '24px',
    'cursor': 'pointer',
    'width': '30px',
    'height': '30px',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'border': '2px solid #FF00FF',
    'border-radius': '50%',
    'transition': 'all 0.3s'
  }).text('×');
  
  closeButton.hover(
    function() {
      $(this).css({
        'background-color': '#FF00FF',
        'color': '#000033'
      });
    },
    function() {
      $(this).css({
        'background-color': 'transparent',
        'color': '#FF00FF'
      });
    }
  );
  
  closeButton.click(function() {
    panel.css('transform', 'scale(0.9)');
    backdrop.css('opacity', '0');
    
    setTimeout(() => {
      backdrop.remove();
    }, 300);
  });
  
  panel.append(closeButton);
  backdrop.append(panel);
  
  $('body').append(backdrop);
  
  setTimeout(() => {
    backdrop.css('opacity', '1');
    panel.css('transform', 'scale(1)');
  }, 10);
}

// Add macros for achievements
Macro.add('checkAchievements', {
  handler: function() {
    checkPageForAchievements();
  }
});

Macro.add('unlockAchievement', {
  handler: function() {
    if (this.args.length < 3) {
      return this.error('The <<unlockAchievement>> macro requires an id, title, and description');
    }
    
    const id = this.args[0];
    const title = this.args[1];
    const description = this.args[2];
    const secret = this.args.length > 3 ? this.args[3] === true : false;
    
    unlockAchievement(id, title, description, secret);
  }
});

// Run achievements on passage navigation
$(document).on(':passageend', function() {
  setTimeout(function() {
    checkPageForAchievements();
  }, 200);
});

// Death Script
window.playerDied = function(message, deathPassage = "Death", delaySeconds = 8) {
  // Create a subtle visual indication that death is coming
  const warningOverlay = $('<div id="death-warning"></div>').css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'pointer-events': 'none',
    'background-color': 'rgba(255, 0, 0, 0.05)',
    'box-shadow': 'inset 0 0 50px rgba(255, 0, 0, 0.3)',
    'z-index': '9000',
    'opacity': '0',
    'transition': 'opacity 2s'
  });
  
  $('body').append(warningOverlay);
  
  // Fade in the warning
  setTimeout(function() {
    warningOverlay.css('opacity', '1');
  }, 100);
  
  // Show countdown (optional)
  const countdown = $('<div id="death-countdown"></div>').css({
    'position': 'fixed',
    'top': '20px',
    'right': '20px',
    'font-family': 'monospace',
    'font-size': '16px',
    'color': '#FF0000',
    'background-color': 'rgba(0, 0, 0, 0.7)',
    'padding': '5px 10px',
    'border': '1px solid #FF0000',
    'z-index': '9001',
    'text-shadow': '0 0 5px #FF0000'
  });
  
  $('body').append(countdown);
  
  // Update countdown each second
  let timeLeft = delaySeconds;
  countdown.text('Terminal event in: ' + timeLeft);
  
  let countdownInterval = setInterval(function() {
    timeLeft--;
    countdown.text('Terminal event in: ' + timeLeft);
    
    // Increase the red tint as time passes
    warningOverlay.css('background-color', `rgba(255, 0, 0, ${0.05 + ((delaySeconds - timeLeft) / delaySeconds) * 0.1})`);
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
  
  // After the delay, show the full death overlay
  setTimeout(function() {
    // Clear the countdown
    clearInterval(countdownInterval);
    countdown.remove();
    warningOverlay.remove();
    
    // Create death overlay for dramatic effect
    const deathOverlay = $('<div id="death-overlay"></div>').css({
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%',
      'background-color': 'rgba(0, 0, 0, 0.9)',
      'color': '#FF0000',
      'font-family': 'monospace',
      'z-index': '9999',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center',
      'opacity': '0',
      'transition': 'opacity 0.5s'
    });
    
    // Add death message
    const deathMessage = $('<div></div>').css({
      'font-size': '24px',
      'margin-bottom': '30px',
      'text-align': 'center',
      'max-width': '80%',
      'text-shadow': '0 0 10px #FF0000'
    }).html(message || "SYSTEM FAILURE: REALITY ANCHOR LOST");
    
    // Add elements to overlay
    deathOverlay.append(deathMessage);
    
    // Add flickering effect to text
    let flickerInterval = setInterval(function() {
      if (Math.random() < 0.3) {
        deathMessage.css('opacity', Math.random() * 0.5 + 0.5);
      } else {
        deathMessage.css('opacity', 1);
      }
    }, 100);
    
    // Add overlay to body and fade in
    $('body').append(deathOverlay);
    
    // Record death in variables
    State.variables.hasPlayerDied = true;
    State.variables.deathCount = (State.variables.deathCount || 0) + 1;
    
    // Glitch effect while dying (using your existing function)
    if (typeof triggerBlackoutGlitch === 'function') {
      triggerBlackoutGlitch();
    }
    
    // Fade in overlay
    setTimeout(function() {
      deathOverlay.css('opacity', '1');
    }, 100);
    
    // Navigate to death passage after the effect
    setTimeout(function() {
      clearInterval(flickerInterval);
      deathOverlay.css('opacity', '0');
      
      setTimeout(function() {
        deathOverlay.remove();
        Engine.play(deathPassage);
      }, 500);
    }, 3000);
  }, delaySeconds * 1000);
};
postrender['playBackgroundMusic'] = function (content) {
  if (!window.bgMusicInitialized) {
    try {
      let audioElement = document.createElement('audio');
      audioElement.src = 'https://static.wixstatic.com/mp3/f3adad_2ed8cf38f1da4da285ca07e05e3ca363.wav';
      audioElement.id = 'bgMusic';
      audioElement.loop = true;
      
      // Modern browsers require user interaction before audio can play
      // This adds a play button that will appear at the start
      let playButton = document.createElement('button');
      playButton.textContent = 'Play Sound';
      playButton.style.position = 'fixed';
      playButton.style.top = '10px';
      playButton.style.right = '10px';
      playButton.style.zIndex = '1000';
      
      playButton.addEventListener('click', function() {
        audioElement.play();
        this.remove();
      });
      
      document.body.appendChild(audioElement);
      document.body.appendChild(playButton);
      
      window.bgMusicInitialized = true;
    } catch (e) {
      console.error("Audio initialization failed:", e);
    }
  }
};

// Diamond Effect for Zure
$(document).on(':passagerender', function() {
  // Create a diamond element if it doesn't exist
  if ($('#zure-diamond').length === 0) {
    $('body').append('<div id="zure-diamond"></div>');
    $('body').append('<div id="zure-diamond-sides"></div>');
    
    // Style the diamond container
    $('#zure-diamond').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'width': '100px',
      'height': '100px',
      'transform': 'translate(-50%, -50%) scale(0)',
      'z-index': '9999',
      'opacity': '0',
      'pointer-events': 'none',
      'transition': 'transform 0.5s, opacity 0.5s',
      'transform-style': 'preserve-3d',
      'perspective': '800px'
    });
    
    // Add additional sides for 3D effect
    $('#zure-diamond-sides').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'width': '100px',
      'height': '100px',
      'transform': 'translate(-50%, -50%) rotateY(90deg) scale(0)',
      'z-index': '9998',
      'opacity': '0',
      'pointer-events': 'none',
      'transition': 'transform 0.5s, opacity 0.5s',
      'transform-style': 'preserve-3d'
    });
    
    // Add the side faces - same as main diamond but rotated
    $('#zure-diamond-sides').append('<div class="diamond-side"></div>');
    $('.diamond-side').css({
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%',
      'background': 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(200,200,255,0.4))',
      'transform-style': 'preserve-3d'
    });
  }
  
  // Create the trigger function for showing the diamond
  window.showZureDiamond = function() {
    // Show diamond
    $('#zure-diamond, #zure-diamond-sides').css({
      'opacity': '1'
    });
    
    $('#zure-diamond').css({
      'transform': 'translate(-50%, -50%) scale(1)'
    });
    
    $('#zure-diamond-sides').css({
      'transform': 'translate(-50%, -50%) rotateY(90deg) scale(1)'
    });
    
    // Add spinning animation
    $('#zure-diamond').css({
      'animation': 'zure-diamond-spin 1.5s linear'
    });
    
    // Add complementary spinning for sides
    $('#zure-diamond-sides').css({
      'animation': 'zure-diamond-spin 1.5s linear'
    });
    
    // Create shine effect
    $('body').append('<div id="zure-shine"></div>');
    $('#zure-shine').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'width': '150px',
      'height': '150px',
      'background': 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
      'transform': 'translate(-50%, -50%)',
      'z-index': '9997',
      'opacity': '0',
      'pointer-events': 'none'
    });
    
    // Animate shine
    $('#zure-shine').animate({opacity: 0.7}, 300).animate({opacity: 0}, 1000, function() {
      $(this).remove();
    });
    
    // Hide diamond after animation
    setTimeout(function() {
      $('#zure-diamond, #zure-diamond-sides').css({
        'opacity': '0'
      });
      
      $('#zure-diamond').css({
        'transform': 'translate(-50%, -50%) scale(0)'
      });
      
      $('#zure-diamond-sides').css({
        'transform': 'translate(-50%, -50%) rotateY(90deg) scale(0)'
      });
      
      // Remove animation after it's done
      setTimeout(function() {
        $('#zure-diamond, #zure-diamond-sides').css('animation', 'none');
      }, 500);
    }, 1500);
  };
  
  // Auto-detect mentions of Zure in text and attach click handlers
  $('span:contains("Zure"), p:contains("Zure")').each(function() {
    $(this).css('cursor', 'pointer');
    $(this).on('click', function() {
      window.showZureDiamond();
    });
  });
});

// Create a function to mark a path as completed
window.markPathCompleted = function(pathName) {
  // Initialize the array if it doesn't exist
  if (!State.variables.completedPaths) {
    State.variables.completedPaths = [];
  }
  
  // Add the path to the completed list if it's not already there
  if (State.variables.completedPaths.indexOf(pathName) === -1) {
    State.variables.completedPaths.push(pathName);
  }
};
// Add this right after your markPathCompleted function
$(document).on(':passagestart', function() {
  // Check if we need to remove any completed path links
  if (State.variables.completedPaths) {
    // Wait a bit longer for the links to render
    setTimeout(function() {
      State.variables.completedPaths.forEach(function(path) {
        // This handles both regular links and menu items
        $('a').each(function() {
          // More robust text matching
          if ($(this).text().trim() === path.trim()) {
            $(this).remove();
          }
          // Also check inner elements (for links with spans or other elements)
          else if ($(this).find('*').text().trim() === path.trim()) {
            $(this).remove();
          }
        });
      });
      
      // Debug output to help troubleshoot
      console.log("Paths marked as completed:", State.variables.completedPaths);
      console.log("Links on page:", $('a').map(function() { return $(this).text().trim(); }).get());
    }, 300); // Increased timeout
  }
});

// Create a custom footnote/tooltip macro
Macro.add('footnote', {
    tags: null,
    handler: function () {
        if (this.args.length < 1) {
            return this.error('The <<footnote>> macro requires a term argument');
        }
        
        const term = this.args[0];
        const definition = this.payload[0].contents;
        
        // Create the footnote element
        const $footnote = $(document.createElement('span'));
        $footnote.addClass('tooltip');
        $footnote.text(term);
        
        // Create the tooltip text
        const $tooltipText = $(document.createElement('span'));
        $tooltipText.addClass('tooltiptext');
        $tooltipText.wiki(definition);
        
        // Add random glitch effect occasionally
        if (Math.random() < 0.2) {
            $tooltipText.addClass('glitch-text');
        }
        
        // Add positioning logic
        $footnote.on('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            const tooltipHeight = $tooltipText.outerHeight();
            
            // Check if enough space above (at least 50px from top of viewport)
            if (rect.top < tooltipHeight + 50) {
                $tooltipText.addClass('below');
            } else {
                $tooltipText.removeClass('below');
            }
        });
        
        // Append the tooltip to the footnote
        $footnote.append($tooltipText);
        
        // Append the footnote to the output
        $footnote.appendTo(this.output);
    }
});

// Add padding to the top of every passage
$(document).on(':passagerender', function (ev) {
  // Add padding to the passage itself
  $('.passage').css('padding-top', '2em');
});
// Insert PassageHeader at the start of every passage
Config.passages.onProcess = function(p) {
  // Exclude the PassageHeader itself to avoid infinite recursion
  if (p.title !== "PassageHeader") {
    return Story.get("PassageHeader").processText() + p.text;
  }
  return p.text;
};
// Wendel Lux effect - a luxury glitching effect with right alignment
Macro.add('lux', {
    tags: null,
    handler: function() {
        // Get the content
        const content = this.payload[0].contents;
        
        // Create the wrapper element
        const $wrapper = $(document.createElement('span'));
        $wrapper.addClass('lux-text');
        $wrapper.attr('data-text', content);
        
        // Add right alignment
        $wrapper.css('text-align', 'right');
        $wrapper.css('display', 'block'); // Make it a block element so text-align works
        
        // Add the content
        $wrapper.wiki(content);
        
        // Append to output
        $wrapper.appendTo(this.output);
    }
});

// Function to show a letter with line breaks preserved
window.showLetter = function(letterContent) {
  // Create modal container
  const modal = $('<div id="letter-modal"></div>').css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'background-color': 'rgba(0, 0, 0, 0.7)',
    'z-index': '9000',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'opacity': '0',
    'transition': 'opacity 0.3s'
  });
  
  // Create letter container
  const letterContainer = $('<div class="letter-container"></div>').css({
    'width': '80%',
    'max-width': '600px',
    'max-height': '80vh',
    'overflow-y': 'auto',
    'background-color': '#f8f0d8', /* Papyrus color */
    'background-image': 
      'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
    'color': '#3a2e1f', /* Dark brown text */
    'padding': '40px',
    'font-family': 'Brush Script MT',
    'font-size': '18px',
    'line-height': '1.6',
    'text-align': 'left',
    'border': '15px solid transparent',
    'border-image': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.15\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E") 30 stretch',
    'box-shadow': '0 0 30px rgba(0, 0, 0, 0.7)',
    'position': 'relative',
    'transform': 'scale(0.9)',
    'transition': 'transform 0.3s',
    'white-space': 'pre-wrap' /* This preserves line breaks in a more reliable way */
  });
  
  // Create close button
  const closeButton = $('<div class="letter-close">×</div>').css({
    'position': 'absolute',
    'top': '10px',
    'right': '10px',
    'width': '30px',
    'height': '30px',
    'background-color': 'rgba(170, 140, 100, 0.2)',
    'color': '#3a2e1f',
    'border-radius': '50%',
    'font-family': 'sans-serif',
    'font-size': '24px',
    'line-height': '28px',
    'text-align': 'center',
    'cursor': 'pointer',
    'transition': 'all 0.3s'
  });
  
  closeButton.hover(
    function() {
      $(this).css('background-color', 'rgba(170, 140, 100, 0.5)');
    },
    function() {
      $(this).css('background-color', 'rgba(170, 140, 100, 0.2)');
    }
  );
  
  closeButton.on('click', function() {
    modal.css('opacity', '0');
    letterContainer.css('transform', 'scale(0.9)');
    setTimeout(function() {
      modal.remove();
    }, 300);
  });
  
  // Add parchment texture and torn edges
  const textureOverlay = $('<div></div>').css({
    'position': 'absolute',
    'top': '0',
    'left': '0',
    'right': '0',
    'bottom': '0',
    'pointer-events': 'none',
    'background-image': 
      'repeating-linear-gradient(rgba(204, 182, 159, 0.05) 0px, rgba(204, 182, 159, 0.05) 1px, transparent 1px, transparent 2px)',
    'z-index': '-1'
  });
  
  const edgesOverlay = $('<div></div>').css({
    'position': 'absolute',
    'top': '0',
    'left': '0',
    'right': '0',
    'bottom': '0',
    'pointer-events': 'none',
    'background-image': 
      'radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.1) 0%, transparent 70%), ' +
      'radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.1) 0%, transparent 70%)',
    'opacity': '0.7',
    'z-index': '-1'
  });
  
  // Create content container with preserved line breaks
  const contentContainer = $('<div></div>');
  
  // Process the content
  // For Twine compatibility, we'll handle the content in a way that works with the existing macro
  contentContainer.wiki(letterContent);
  
  // Add content to letter container
  letterContainer.append(contentContainer);
  
  // Assemble the letter
  letterContainer.append(textureOverlay);
  letterContainer.append(edgesOverlay);
  letterContainer.append(closeButton);
  modal.append(letterContainer);
  
  // Add to the page
  $('body').append(modal);
  
  // Animate in
  setTimeout(function() {
    modal.css('opacity', '1');
    letterContainer.css('transform', 'scale(1)');
  }, 10);
};

// Letter macro
Macro.add('letter', {
  tags: null,
  handler: function() {
    const content = this.payload[0].contents;
    
    // Create a link that will show the letter when clicked
    const $link = $(document.createElement('a'));
    $link.addClass('letter-link');
    $link.html("[Read Letter]");
    $link.css({
      'color': '#00FFFF',
      'cursor': 'pointer',
      'text-decoration': 'none',
      'border-bottom': '1px dotted #00FFFF',
      'padding': '2px 5px',
      'margin': '0 5px',
      'display': 'inline-block',
      'border-radius': '2px'
    });
    
    // Add hover effect
    $link.hover(
      function() {
        $(this).css({
          'color': '#FF00FF',
          'background-color': '#00004B',
          'text-decoration': 'none',
          'transform': 'scale(1.05)'
        });
      },
      function() {
        $(this).css({
          'color': '#00FFFF',
          'background-color': 'transparent',
          'transform': 'scale(1)'
        });
      }
    );
    
    // Add click functionality
    $link.on('click', function() {
      window.showLetter(content);
    });
    
    // Append to output
    $link.appendTo(this.output);
  }
});

// Add this to your JavaScript section or a StoryInit passage

// Global death function with glitch effect
window.playerDeath = function(message, delayBeforeGlitch = 2000) {
  console.log(`Death triggered. Will start glitch effect in ${delayBeforeGlitch}ms`);
  
  // Create a flag to track if the death has been triggered
  if (window._deathTriggered) {
    console.log("Death already triggered, ignoring duplicate call");
    return; // Prevent multiple death triggers
  }
  
  // Set the flag to prevent multiple calls
  window._deathTriggered = true;
  
  // This is the actual function that starts the glitch effect
  // It will only be called after the delay
  function startGlitchEffect() {
    console.log("Starting glitch effect now");
    
    // Create a full-screen glitch overlay
    const overlay = document.createElement('div');
    overlay.id = 'glitch-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#000033';
    overlay.style.zIndex = '9999';
    overlay.style.overflow = 'hidden';
    
    // Add glitch text in the center
    const text = document.createElement('h1');
    text.id = 'glitch-text';
    text.style.position = 'absolute';
    text.style.top = '50%';
    text.style.left = '50%';
    text.style.transform = 'translate(-50%, -50%)';
    text.style.color = '#FF0000';
    text.style.fontSize = '4em';
    text.style.whiteSpace = 'nowrap';
    text.style.textShadow = '0 0 10px #FF0000';
    text.textContent = message || 'FATAL ERROR';
    
    // Add it to the page
    overlay.appendChild(text);
    document.body.appendChild(overlay);
    
    // Try to play a glitch sound if needed (optional)
    try {
      const audio = new Audio();
      audio.src = "https://static.wixstatic.com/mp3/f3adad_9ee367356f6d486083459f5f6d7dfa91.wav";
      audio.volume = 0.5;
      audio.play();
    } catch (error) {
      console.error("Audio couldn't play, continuing without sound");
    }
    
    // Array of glitch messages
    const glitchMessages = [
      'CONSUMED', 
      'SYSTEM FAILURE', 
      'FATAL ERROR', 
      'BREACH DETECTED', 
      'SHUTDOWN',
      'HELP ME',
      'THEY\'RE COMING',
      'DON\'T LOOK',
      'REALITY FRACTURE',
      'THE WALLS BLEED'
    ];
    
    // Enhanced glitch effects
    function flashBackground() {
      // More intense color flashes with patterns
      overlay.style.backgroundColor = `rgb(${Math.random()*255}, ${Math.random()*50}, ${Math.random()*100})`;
      
      // Random chance for a more dramatic flash
      if (Math.random() < 0.3) {
        overlay.style.backgroundImage = `radial-gradient(circle, rgba(255,0,0,0.7) ${Math.random()*30}%, rgba(0,0,0,0.8) ${Math.random()*70 + 30}%)`;
      }
      
      setTimeout(() => {
        overlay.style.backgroundColor = '#000033';
        overlay.style.backgroundImage = 'none';
      }, 100);
    }
    
    function shakeText() {
      // More extreme text distortions
      const skewX = Math.random() * 20 - 10;
      const skewY = Math.random() * 20 - 10;
      const scale = 0.8 + Math.random() * 0.5;
      
      text.style.transform = `translate(${-50 + (Math.random()*20-10)}%, ${-50 + (Math.random()*20-10)}%) skew(${skewX}deg, ${skewY}deg) scale(${scale})`;
      text.style.color = Math.random() > 0.5 ? '#FF00FF' : '#00FFFF';
      text.style.letterSpacing = `${Math.random() * 10 - 5}px`;
      
      setTimeout(() => {
        text.style.transform = 'translate(-50%, -50%)';
        text.style.color = '#FF0000';
        text.style.letterSpacing = 'normal';
      }, 150);
    }
    
    function changeMessage() {
      text.textContent = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
      // Random chance to show backwards text
      if (Math.random() < 0.2) {
        text.style.transform += ' scaleX(-1)';
        setTimeout(() => {
          text.style.transform = 'translate(-50%, -50%)';
        }, 200);
      }
    }
    
    function addGlitchLine() {
      // Create horizontal static lines
      const lineHeight = Math.floor(Math.random() * 5) + 1;
      const yPos = Math.floor(Math.random() * 100);
      
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.left = '0';
      line.style.top = `${yPos}%`;
      line.style.width = '100%';
      line.style.height = `${lineHeight}px`;
      line.style.backgroundColor = Math.random() > 0.5 ? '#FFFFFF' : '#00FFFF';
      line.style.opacity = '0.7';
      line.style.zIndex = '10000';
      
      overlay.appendChild(line);
      
      setTimeout(() => {
        overlay.removeChild(line);
      }, 200);
    }
    
    function addStaticNoise() {
      // Add static noise overlay
      const noise = document.createElement('div');
      noise.style.position = 'absolute';
      noise.style.top = '0';
      noise.style.left = '0';
      noise.style.width = '100%';
      noise.style.height = '100%';
      noise.style.backgroundColor = 'transparent';
      noise.style.opacity = '0.1';
      noise.style.pointerEvents = 'none';
      
      // Create a stippled effect for "static"
      let stipple = '';
      for (let i = 0; i < 200; i++) {
        const size = Math.floor(Math.random() * 3) + 1;
        stipple += `${Math.random() * 100}% ${Math.random() * 100}% 0 ${size}px #FFFFFF, `;
      }
      stipple = stipple.slice(0, -2); // Remove trailing comma and space
      
      noise.style.boxShadow = stipple;
      overlay.appendChild(noise);
      
      setTimeout(() => {
        overlay.removeChild(noise);
      }, 150);
    }
    
    function flashSubtext() {
      // Create brief flashes of text at the bottom of the screen
      const subtext = document.createElement('div');
      const messages = [
        'it sees you', 
        'saving brain state', 
        'extracting memory', 
        'eyes open in the dark', 
        'nowhere to hide'
      ];
      
      subtext.textContent = messages[Math.floor(Math.random() * messages.length)];
      subtext.style.position = 'absolute';
      subtext.style.bottom = '10%';
      subtext.style.left = '50%';
      subtext.style.transform = 'translateX(-50%)';
      subtext.style.color = '#FF0000';
      subtext.style.fontSize = '1.2em';
      subtext.style.fontFamily = 'monospace';
      subtext.style.opacity = '0';
      subtext.style.transition = 'opacity 0.1s';
      
      overlay.appendChild(subtext);
      
      setTimeout(() => {
        subtext.style.opacity = '0.8';
        setTimeout(() => {
          subtext.style.opacity = '0';
          setTimeout(() => {
            overlay.removeChild(subtext);
          }, 100);
        }, 200);
      }, 20);
    }
    
    // Run effects at random intervals with more variety
    const effects = [
      {fn: flashBackground, weight: 3},
      {fn: shakeText, weight: 3},
      {fn: changeMessage, weight: 2},
      {fn: addGlitchLine, weight: 4}, 
      {fn: addStaticNoise, weight: 2},
      {fn: flashSubtext, weight: 1}
    ];
    
    let effectInterval = setInterval(() => {
      // Create a weighted selection system
      const weightedEffects = [];
      for (const effect of effects) {
        for (let i = 0; i < effect.weight; i++) {
          weightedEffects.push(effect.fn);
        }
      }
      
      // Run 1-4 random effects
      const numEffects = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numEffects; i++) {
        const randomIndex = Math.floor(Math.random() * weightedEffects.length);
        const randomEffect = weightedEffects[randomIndex];
        randomEffect();
      }
    }, 120);
    
    // After 5 seconds, navigate to the death passage
    setTimeout(() => {
      clearInterval(effectInterval);
      
      // Clean up our overlay after a short delay
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        
        // Reset the death trigger flag so death can happen again in future
        window._deathTriggered = false;
        
        // Navigate to your death passage
        Engine.play("Death"); // Change this to your actual death passage name
      }, 500);
    }, 5000);
  }
  
  // Use a visible banner to debug the delay if needed
  // Uncomment these lines to see when the delay is happening
  /*
  const debugBanner = document.createElement('div');
  debugBanner.style.position = 'fixed';
  debugBanner.style.top = '10px';
  debugBanner.style.left = '10px';
  debugBanner.style.backgroundColor = 'yellow';
  debugBanner.style.color = 'black';
  debugBanner.style.padding = '5px';
  debugBanner.style.zIndex = '10000';
  debugBanner.textContent = `Death triggered, glitch starting in ${delayBeforeGlitch/1000} seconds...`;
  document.body.appendChild(debugBanner);
  */
  
  // Schedule the glitch effect to start after the delay
  console.log(`Scheduling glitch effect to start in ${delayBeforeGlitch}ms`);
  window.setTimeout(startGlitchEffect, delayBeforeGlitch);
};

// You can also create a custom macro to trigger it
Macro.add('death', {
  handler: function() {
    // Check for arguments: first is message, second is optional delay in milliseconds
    const message = this.args.length > 0 ? this.args[0] : "FATAL ERROR";
    const delay = this.args.length > 1 ? Number(this.args[1]) : 8000; // Default 8 second delay
    
    // Add debug output that will appear in browser console
    console.log(`Death macro called: Message="${message}", Delay=${delay}ms`);
    
    // This will explicitly not run the death function now, but schedule it with a delay
    window.setTimeout(function() {
      console.log(`Delay timer finished, now calling playerDeath`);
      window.playerDeath(message, 0); // 0 delay on the inner call, since we already delayed
    }, delay);
  }
});
