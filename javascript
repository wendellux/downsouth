// Global state management
const glitchState = {
  timers: [],
  hiddenElements: {},
  capturedElements: {}
};

$(document).on(':passagestart', function() {
  // Set up glitches and persistent elements
  setupRandomGlitches();
  setupPersistentElements();
});

// Function to set up the random glitches
function setupRandomGlitches() {
  // Clear existing glitch timers to prevent duplicates
  glitchState.timers.forEach(timer => clearTimeout(timer));
  glitchState.timers = [];
  
  // Set up random minor glitches (less frequent)
  for (let i = 0; i < 5; i++) {
    // Random timing between 18-26 seconds
    const glitchTime = Math.random() * 8000 + 18000;
    const timer = setTimeout(() => {
      triggerMinorGlitch();
      // Schedule the next glitch
      setupRandomGlitches();
    }, glitchTime);
    glitchState.timers.push(timer);
  }
  
  // Set up random major blackout glitches (even less frequent)
  const blackoutTime = Math.random() * 40000 + 30000; // 30-70 seconds
  const blackoutTimer = setTimeout(triggerBlackoutGlitch, blackoutTime);
  glitchState.timers.push(blackoutTimer);
}

// Function to trigger minor glitches
function triggerMinorGlitch() {
  // Pick a random glitch type from 0-6
  const glitchType = Math.floor(Math.random() * 7);
  
  // Apply different effects based on random selection
  switch(glitchType) {
    case 0: // Color shift
      createTemporaryOverlay({
        'background-color': 'rgba(255, 0, 255, 0.2)',
        'mix-blend-mode': 'exclusion'
      }, 200);
      break;
      
    case 1: // Horizontal shift
      animateStory([
        { transform: 'translateX(5px)', duration: 100 },
        { transform: 'translateX(-8px)', duration: 100 },
        { transform: 'translateX(0)', duration: 100 }
      ]);
      break;
      
    case 2: // Text garble
      garbleText();
      break;
      
    case 3: // Scan lines
      createTemporaryOverlay({
        'background': 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.2) 2px, transparent 2px, transparent 4px)',
        'opacity': '0.7'
      }, 400);
      break;
      
    case 4: // Flicker
      flickerOverlay();
      break;
      
    case 5: // System message
      showSystemMessage();
      break;
      
    case 6: // Digital noise
      createNoiseOverlay();
      break;
  }
}

// Helper function to create temporary overlay with given styles
function createTemporaryOverlay(styles, duration) {
  const glitchElement = $('<div id="minor-glitch"></div>').css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'pointer-events': 'none',
    'z-index': '9000',
    ...styles
  });
  
  $('body').append(glitchElement);
  setTimeout(() => glitchElement.remove(), duration);
}

// Helper function to animate the story element
function animateStory(steps) {
  const story = $('#story');
  let delay = 0;
  
  steps.forEach(step => {
    setTimeout(() => {
      story.css({
        'transform': step.transform,
        'transition': 'transform 0.05s'
      });
    }, delay);
    delay += step.duration;
  });
}

// Function to garble text
function garbleText() {
  const textElements = $('.passage p, .passage span, .passage div:not(.banner-container-1):not(.banner-container-2)');
  const originalTexts = [];
  
  // Store original text content and create garbled versions
  textElements.each(function(index) {
    const $this = $(this);
    originalTexts[index] = $this.html();
    
    // Only garble some text elements (random selection)
    if (Math.random() < 0.3) {
      const garbledText = originalTexts[index].split('').map(char => {
        return Math.random() < 0.1 ? 
          String.fromCharCode(Math.floor(Math.random() * 26) + 97) : char;
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
}

// Function to create flicker effect
function flickerOverlay() {
  const overlay = createTemporaryOverlay({
    'background-color': 'rgba(0, 0, 0, 0.8)'
  }, 200);
  
  setTimeout(() => overlay.css('background-color', 'rgba(0, 0, 0, 0)'), 50);
  setTimeout(() => overlay.css('background-color', 'rgba(0, 0, 0, 0.8)'), 100);
  setTimeout(() => overlay.css('background-color', 'rgba(0, 0, 0, 0)'), 150);
}

// Function to show system message
function showSystemMessage() {
  const messages = [
    "SIGNAL INTERFERENCE DETECTED",
    "RECALIBRATING DIMENSIONAL PARAMETERS",
    "M'RKATH'NEB ENERGY SIGNATURE DETECTED",
    "REALITY ANCHOR DESTABILIZING",
    "EXISTENTIAL KNOT TIGHTENING",
    "DIMENSIONAL BREACH IMMINENT",
    "THE STACKS EXPANDING"
  ];
  
  const overlay = createTemporaryOverlay({
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'color': '#00FFFF',
    'font-family': 'monospace',
    'font-size': '16px',
    'text-shadow': '0 0 5px #00FFFF'
  }, 800);
  
  overlay.text(messages[Math.floor(Math.random() * messages.length)]);
}

// Function to create digital noise overlay
function createNoiseOverlay() {
  const noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
  const ctx = noiseCanvas.getContext('2d');
  
  // Create digital noise more efficiently
  const imageData = ctx.createImageData(noiseCanvas.width, noiseCanvas.height);
  const data = imageData.data;
  const length = data.length;
  
  for (let i = 0; i < length; i += 4) {
    const value = Math.random() < 0.1 ? 255 : 0;
    data[i] = Math.random() < 0.2 ? 0 : value;     // R
    data[i+1] = Math.random() < 0.2 ? 255 : value; // G
    data[i+2] = Math.random() < 0.2 ? 255 : 0;     // B
    data[i+3] = Math.random() < 0.3 ? 100 : 20;    // A
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  createTemporaryOverlay({
    'background-image': 'url(' + noiseCanvas.toDataURL() + ')',
    'opacity': '0.3',
    'mix-blend-mode': 'overlay'
  }, 300);
}

// Function to trigger major blackout glitch with sequence
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
  
  // Blackout sequence with messages
  const sequence = [
    { time: 50, action: () => blackout.css('opacity', '1') },
    { time: 500, action: () => blackout.text('SIGNAL LOST') },
    { time: 1500, action: () => blackout.text('') },
    { time: 4000, action: () => blackout.text('ATTEMPTING TO RECONNECT...') },
    { time: 5500, action: () => blackout.text('DIMENSIONAL ALIGNMENT FAILED') },
    { time: 7000, action: () => blackout.text('RECALIBRATING REALITY PARAMETERS') },
    { time: 8500, action: () => {
      blackout.css({
        'background': 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.97) 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)',
        'color': '#00FFFF'
      });
      blackout.text('SIGNAL INTERFERENCE DETECTED');
    }},
    { time: 10000, action: () => blackout.text('CONNECTION REESTABLISHED') },
    { time: 11000, action: () => {
      blackout.css({
        'opacity': '0',
        'transition': 'opacity 1s'
      });
      setTimeout(() => blackout.remove(), 1000);
      
      // Schedule next blackout
      const nextBlackout = Math.random() * 40000 + 30000; // 30-70 seconds
      const timer = setTimeout(triggerBlackoutGlitch, nextBlackout);
      glitchState.timers.push(timer);
    }}
  ];
  
  // Execute sequence
  sequence.forEach(step => {
    setTimeout(step.action, step.time);
  });
}

// Function to set up persistent elements
function setupPersistentElements() {
  createAuthorButton();
  createBanners();
}

// Helper function to create author's note button
function createAuthorButton() {
  if ($('#author-note-button').length === 0) {
    const authorButton = $('<div id="author-note-button">Author\'s Note</div>').css({
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
    
    // Add click event
    authorButton.click(() => Engine.play('Author\'s Note'));
    
    $('body').append(authorButton);
  }
}

// Helper function to create banners
function createBanners() {
  if ($('.banner-container-1').length === 0) {
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

// Banner update functions
window.updateBanner1 = function(newText) {
  $('.banner-text-1').text(newText);
};

window.updateBanner2 = function(newText) {
  $('.banner-text-2').text(newText);
};

// Manual blackout trigger
window.triggerBlackout = triggerBlackoutGlitch;

// Macro definitions - consolidated with ES6 template functions
// Define a helper function to create macros
function createTextEffectMacro(name, className, extraProcessing = null) {
  Macro.add(name, {
    tags: null,
    handler: function() {
      const content = this.payload[0].contents;
      const $wrapper = $(document.createElement('span'));
      
      $wrapper.addClass(`glitch-text ${className}`);
      
      if (extraProcessing) {
        extraProcessing($wrapper, content);
      } else {
        $wrapper.wiki(content);
      }
      
      $wrapper.appendTo(this.output);
    }
  });
}

// Create basic text effect macros
createTextEffectMacro('twitch', 'twitch');
createTextEffectMacro('distort', 'distort');
createTextEffectMacro('decay', 'decay');
createTextEffectMacro('warp', 'warp');
createTextEffectMacro('corrupt', 'corrupt', ($wrapper, content) => {
  $wrapper.attr('data-text', content);
  $wrapper.wiki(content);
});
createTextEffectMacro('malfunction', 'malfunction');
createTextEffectMacro('static', 'static-text', ($wrapper, content) => {
  $wrapper.attr('data-text', content);
  $wrapper.wiki(content);
});

// Letter animation macros
function createLetterAnimationMacro(name, containerClass, letterClass) {
  Macro.add(name, {
    tags: null,
    handler: function() {
      const content = this.payload[0].contents;
      const letters = content.split('');
      
      const $wrapper = $(document.createElement('span'));
      $wrapper.addClass(containerClass);
      
      letters.forEach((letter, index) => {
        if (letter === ' ') {
          $wrapper.append(' ');
        } else {
          const $letter = $(document.createElement('span'));
          $letter.addClass(letterClass);
          
          // Calculate delay based on position
          const delay = (index % 6) * 0.5;
          $letter.css('animation-delay', delay + 's');
          
          $letter.text(letter);
          $wrapper.append($letter);
        }
      });
      
      $wrapper.appendTo(this.output);
    }
  });
}

// Create letter animation macros
createLetterAnimationMacro('triquetra', 'triquetra-container', 'triquetra-letter');
createLetterAnimationMacro('loopy', 'loopy-container', 'loopy-letter');

// ASCII Triquetra fallback macro
Macro.add('asciitriquetra', {
  tags: null,
  handler: function() {
    const word = this.payload[0].contents.trim();
    const $wrapper = $(document.createElement('pre'));
    $wrapper.addClass('ascii-triquetra');
    
    // Create ASCII art pattern more efficiently using template literal
    const asciiArt = `
      ${word}${word}${word}
    ${word}         ${word}
  ${word}             ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
${word}                 ${word}
  ${word}             ${word}
    ${word}         ${word}
      ${word}${word}${word}
    `;
    
    $wrapper.text(asciiArt);
    $wrapper.appendTo(this.output);
  }
});

// Flash text macro with options
Macro.add('flash', {
  tags: null,
  handler: function() {
    const content = this.payload[0].contents;
    const type = this.args.length > 0 ? this.args[0] : "simple";
    
    const $wrapper = $(document.createElement('span'));
    
    // Map type to class
    const typeToClass = {
      "color": 'colored-flash',
      "glitch": 'glitch-flash',
      "mrkath": 'mrkath-flash',
      "simple": 'flash-text'
    };
    
    $wrapper.addClass(typeToClass[type] || 'flash-text');
    $wrapper.wiki(content);
    $wrapper.appendTo(this.output);
  }
});

// Random flashing text function - optimized to reduce repetition
function createRandomFlashingText(elementSelector, options = {}) {
  const settings = {
    baseColor: "#00FF00",
    flashColors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0000"],
    minInterval: 100,
    maxInterval: 3000,
    flashDuration: 100,
    glitchProbability: 0.3,
    transformProbability: 0.2,
    ...options
  };
  
  const element = document.querySelector(elementSelector);
  if (!element) return;
  
  // Set initial style
  element.style.color = settings.baseColor;
  element.style.transition = `color ${settings.flashDuration/2}ms ease`;
  
  // Flash effect function
  function createFlash() {
    // Get random properties
    const randomColor = settings.flashColors[Math.floor(Math.random() * settings.flashColors.length)];
    const useGlitch = Math.random() < settings.glitchProbability;
    const useTransform = Math.random() < settings.transformProbability;
    
    // Apply flash styles
    const styles = {
      color: randomColor,
      textShadow: "none",
      transform: "none"
    };
    
    if (useGlitch) {
      const offsetX = Math.floor(Math.random() * 5) - 2;
      const offsetY = Math.floor(Math.random() * 5) - 2;
      styles.textShadow = `${offsetX}px ${offsetY}px 5px ${randomColor}`;
    }
    
    if (useTransform) {
      const scale = 0.9 + Math.random() * 0.2;
      const rotate = Math.floor(Math.random() * 3) - 1;
      const translateX = Math.floor(Math.random() * 7) - 3;
      styles.transform = `scale(${scale}) rotate(${rotate}deg) translateX(${translateX}px)`;
    }
    
    // Apply styles
    Object.assign(element.style, styles);
    
    // Reset after duration
    setTimeout(() => {
      element.style.color = settings.baseColor;
      element.style.textShadow = "none";
      element.style.transform = "none";
    }, settings.flashDuration);
    
    // Schedule next flash
    const nextInterval = Math.floor(Math.random() * (settings.maxInterval - settings.minInterval)) + settings.minInterval;
    setTimeout(createFlash, nextInterval);
  }
  
  // Start flashing
  createFlash();
}

// Random flash macro
Macro.add('randomflash', {
  tags: null,
  handler: function() {
    const content = this.payload[0].contents;
    const uniqueId = `random-flash-${Math.floor(Math.random() * 10000)}`;
    
    const $wrapper = $(document.createElement('span'));
    $wrapper.attr('id', uniqueId);
    $wrapper.wiki(content);
    $wrapper.appendTo(this.output);
    
    // Process options
    const options = {};
    if (this.args.length > 0) {
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
    
    // Apply effect
    createRandomFlashingText(`#${uniqueId}`, options);
  }
});

// Time-sensitive content system
$(document).on(':passagerender', function() {
  // Create flash overlay if needed
  if ($('#time-sensitive-flash-overlay').length === 0) {
    $('body').append('<div id="time-sensitive-flash-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #FF0000; opacity: 0; pointer-events: none; z-index: 9999;"></div>');
  }
  
  // Process time-sensitive elements
  setTimeout(function() {
    $('.time-sensitive').each(function() {
      const $element = $(this);
      
      // Get time limit with fallback
      const timeLimit = parseInt($element.attr('data-time-limit')) || 10;
      
      // Generate unique ID if needed
      const uniqueId = $element.attr('id') || 'time-sensitive-' + Math.floor(Math.random() * 10000);
      $element.attr('id', uniqueId);
      
      // Apply baseline styling
      $element.css({
        'position': 'relative',
        'border': '1px solid #00FF00',
        'box-shadow': '0 0 5px #00FF00',
        'padding': '.5px 10px 5px 10px',
        'margin': '5px 0',
        'cursor': 'pointer',
        'background-color': 'rgba(0, 20, 0, 0.2)',
        'line-height': '1.5'
      });
      
      // Check if already processed
      if (glitchState.hiddenElements && glitchState.hiddenElements[uniqueId]) {
        $element.css('display', 'none');
        return;
      }
      
      // Check if already captured
      if (glitchState.capturedElements && glitchState.capturedElements[uniqueId]) {
        $element.css({
          'border': 'none',
          'box-shadow': 'none',
          'cursor': 'auto',
          'background-color': 'transparent',
          'padding': 'inherit'
        });
        return;
      }
      
      // Start countdown
      let timeLeft = timeLimit;
      const interval = setInterval(function() {
        timeLeft--;
        
        // Update visual indicator
        const urgencyFactor = 1 - (timeLeft / timeLimit);
        const r = Math.floor(255 * urgencyFactor);
        const g = Math.floor(255 * (1 - urgencyFactor));
        $element.css({
          'border-color': `rgb(${r}, ${g}, 0)`,
          'box-shadow': `0 0 ${5 + (urgencyFactor * 10)}px rgb(${r}, ${g}, 0)`
        });
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          triggerDisappearanceSequence($element, uniqueId);
        }
      }, 1000);
      
      // Handle clicks to preserve content
      $element.on('click', function() {
        clearInterval(interval);
        preserveElement($element, uniqueId);
      });
    });
  }, 100);
});

// Helper function for time-sensitive content disappearance
function triggerDisappearanceSequence($element, uniqueId) {
  const $flashOverlay = $('#time-sensitive-flash-overlay');
  
  // Flash sequence
  const flashSequence = [
    { time: 0, action: () => $flashOverlay.css({ 'opacity': '0.8', 'transition': 'opacity 50ms ease' }) },
    { time: 150, action: () => $flashOverlay.css({ 'opacity': '0', 'transition': 'opacity 50ms ease' }) },
    { time: 300, action: () => $flashOverlay.css({ 'opacity': '0.8', 'transition': 'opacity 50ms ease' }) },
    { time: 450, action: () => $flashOverlay.css({ 'opacity': '0', 'transition': 'opacity 50ms ease' }) },
    { time: 600, action: () => $flashOverlay.css({ 'opacity': '0.8', 'transition': 'opacity 50ms ease' }) },
    { time: 750, action: () => $flashOverlay.css({ 'opacity': '0', 'transition': 'opacity 50ms ease' }) },
    { time: 800, action: () => {
      // Glitchy disappearance
      $element.css({
        'transform': 'translateX(5px)',
        'opacity': '0.7'
      });
      
      setTimeout(() => {
        $element.css({ 'transform': 'translateX(-10px)' });
        
        setTimeout(() => {
          $element.css({
            'opacity': '0.3',
            'transform': 'translateX(0)'
          });
          
          setTimeout(() => {
            $element.css('display', 'none');
            // Mark as hidden
            glitchState.hiddenElements[uniqueId] = true;
          }, 200);
        }, 100);
      }, 100);
    }}
  ];
  
  // Execute flash sequence
  flashSequence.forEach(step => {
    setTimeout(step.action, step.time);
  });
}

// Helper function to preserve time-sensitive element
function preserveElement($element, uniqueId) {
  // Acknowledge preservation with visual feedback
  $element.css({
    'border-color': '#00FFFF',
    'box-shadow': '0 0 15px #00FFFF'
  });
  
  // Flash effect for confirmation
  $element.css('background-color', 'rgba(0, 255, 255, 0.3)');
  setTimeout(() => {
    $element.css('background-color', 'rgba(0, 20, 0, 0.2)');
  }, 300);
  
  // Gradually normalize appearance
  setTimeout(() => {
    $element.css({
      'transition': 'all 1.5s ease',
      'border': 'none',
      'box-shadow': 'none',
      'background-color': 'transparent',
      'padding': 'inherit'
    });
  }, 1000);
  
  $element.off('click');
  
  // Mark as preserved
  glitchState.capturedElements[uniqueId] = true;
}

// =============================================
// OPTIMIZED ACHIEVEMENTS SYSTEM FOR TWINE
// =============================================

// Centralized state management
const achievementSystem = {
  // Configuration
  config: {
    notificationDuration: 5000,
    animationSpeed: 300,
    checkDelay: 200
  },
  
  // DOM element cache
  elements: {
    button: null,
    panel: null,
    backdrop: null
  },
  
  // Initialize the achievements system
  init() {
    // Only initialize once
    if (this.initialized) return;
    
    // Set up state if it doesn't exist
    if (!State.variables.achievements) {
      State.variables.achievements = {
        earned: {},
        displayed: {},
        total: 0,
        totalPossible: achievementsList.length
      };
    }
    
    // Create UI elements with slight delay to not block rendering
    setTimeout(() => {
      this.createAchievementsButton();
      this.checkCurrentPassage();
    }, 300);
    
    // Add passage navigation listeners
    $(document).on(':passageend', () => {
      setTimeout(() => this.checkCurrentPassage(), this.config.checkDelay);
    });
    
    this.initialized = true;
  },
  
  // Create the achievements button
  createAchievementsButton() {
    if ($('#achievements-button').length > 0) return;
    
    const button = $('<div id="achievements-button">Achievements</div>').css({
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
    
    // Add hover effects
    button.hover(
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
    
    // Add click handler
    button.click(() => this.showAchievementsPanel());
    
    // Add to body
    $('body').append(button);
    this.elements.button = button;
  },
  
  // Check for unlockable achievements
  checkCurrentPassage() {
    if (!achievementsList) return;
    
    // Ensure state is properly initialized
    if (!State.variables.achievements) {
      State.variables.achievements = {
        earned: {},
        displayed: {},
        total: 0,
        totalPossible: achievementsList.length
      };
    }
    
    // Make sure the total possible is current
    State.variables.achievements.totalPossible = achievementsList.length;
    
    // Check each achievement
    achievementsList.forEach(achievement => {
      if (achievement.check()) {
        this.unlockAchievement(
          achievement.id,
          achievement.title,
          achievement.description,
          achievement.secret || false
        );
      }
    });
  },
  
  // Unlock an achievement
  unlockAchievement(id, title, description, secret = false) {
    // Guard clause for invalid state
    if (!State.variables.achievements) return false;
    
    // Only proceed if not already earned
    if (!State.variables.achievements.earned[id]) {
      // Record achievement data
      State.variables.achievements.earned[id] = {
        id,
        title,
        description,
        secret,
        timestamp: new Date().toISOString()
      };
      
      // Increment counter
      State.variables.achievements.total++;
      
      // Show notification if not already displayed
      if (!State.variables.achievements.displayed[id]) {
        this.showNotification(id, title, description);
        State.variables.achievements.displayed[id] = true;
      }
      
      return true;
    }
    
    return false;
  },
  
  // Show achievement notification
  showNotification(id, title, description) {
    // Create notification element
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
      'border-radius': '5px',
      'transition': 'all 0.3s ease'
    });
    
    // Add content
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
    
    // Add to page
    $('body').append(notification);
    
    // Animate in
    setTimeout(() => {
      notification.css({
        'opacity': '1',
        'transform': 'translateX(0)'
      });
    }, 50);
    
    // Animate out and remove
    setTimeout(() => {
      notification.css({
        'opacity': '0',
        'transform': 'translateX(50px)'
      });
      setTimeout(() => notification.remove(), 500);
    }, this.config.notificationDuration);
  },
  
  // Show the achievements panel
  showAchievementsPanel() {
    // Create backdrop with animation
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
      'transition': `opacity ${this.config.animationSpeed}ms ease`
    });
    
    // Create panel with animation
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
      'transition': `transform ${this.config.animationSpeed}ms ease`,
      'position': 'relative'
    });
    
    // Add header with title and progress
    panel.append(`
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #00FFFF; padding-bottom: 10px;">
        <h2 style="color: #FF00FF; margin: 0;">AZURE COVE ACHIEVEMENTS</h2>
        <div style="color: #00FFFF; margin-top: 5px;">
          ${State.variables.achievements.total} / ${State.variables.achievements.totalPossible} Discovered
        </div>
      </div>
    `);
    
    // Create achievement grid
    const list = this.buildAchievementsList();
    panel.append(list);
    
    // Add close button
    const closeButton = this.createCloseButton(() => {
      panel.css('transform', 'scale(0.9)');
      backdrop.css('opacity', '0');
      
      setTimeout(() => backdrop.remove(), this.config.animationSpeed);
    });
    
    // Assemble panel
    panel.append(closeButton);
    backdrop.append(panel);
    $('body').append(backdrop);
    
    // Animate in
    setTimeout(() => {
      backdrop.css('opacity', '1');
      panel.css('transform', 'scale(1)');
    }, 10);
    
    // Cache references
    this.elements.panel = panel;
    this.elements.backdrop = backdrop;
  },
  
  // Build the achievements list UI
  buildAchievementsList() {
    const list = $('<div id="achievements-list"></div>').css({
      'display': 'grid',
      'grid-template-columns': 'repeat(auto-fill, minmax(250px, 1fr))',
      'gap': '15px'
    });
    
    achievementsList.forEach(achievement => {
      const earned = State.variables.achievements.earned[achievement.id];
      const isSecret = achievement.secret && !earned;
      
      // Create achievement item
      const achievementItem = $('<div class="achievement-item"></div>').css({
        'border': earned ? '2px solid #00FF00' : '2px solid #333333',
        'padding': '10px',
        'border-radius': '5px',
        'background-color': earned ? 'rgba(0, 255, 0, 0.1)' : 'rgba(50, 50, 50, 0.3)',
        'transition': 'all 0.3s',
        'position': 'relative',
        'overflow': 'hidden'
      });
      
      // Add hover effect for earned achievements
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
      
      // Add secret pattern overlay if needed
      if (isSecret) {
        achievementItem.append(`
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(45deg, rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3) 10px, rgba(40, 40, 40, 0.3) 10px, rgba(40, 40, 40, 0.3) 20px); z-index: 0;"></div>
        `);
      }
      
      // Add achievement content
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
    
    return list;
  },
  
  // Create a standardized close button
  createCloseButton(onClickCallback) {
    const closeButton = $('<div class="close-button"></div>').css({
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
    
    // Add hover effects
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
    
    // Add click handler
    closeButton.click(onClickCallback);
    
    return closeButton;
  }
};

// Define achievements list
const achievementsList = [
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
      return ["See what Dick and Chuck are doing", 
             "Dick ponders", 
             "Dick freaks, and so Chuck freaks", 
             "The boys jump"].includes(State.passage);
    }
  },
  {
    id: "dreamwalker",
    title: "Dreamwalker",
    description: "Explored the dreams of Shellhaven",
    check: function() {
      return ["Alice's Wet Nightmares", 
             "Wendel's Dream Journal"].includes(State.passage);
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

// Export public methods to window for external access
window.unlockAchievement = function(id, title, description, secret = false) {
  return achievementSystem.unlockAchievement(id, title, description, secret);
};

window.showAchievementsPanel = function() {
  achievementSystem.showAchievementsPanel();
};

window.checkAchievements = function() {
  achievementSystem.checkCurrentPassage();
};

// Create Twine macros for achievement functions
Macro.add('checkAchievements', {
  handler: function() {
    achievementSystem.checkCurrentPassage();
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
    
    achievementSystem.unlockAchievement(id, title, description, secret);
  }
});

// Initialize the achievement system when document is ready
$(document).ready(function() {
  achievementSystem.init();
});

//Sound engine with play button, required for playing sound on some browsers
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

// =========================================
// OPTIMIZED TWINE SPECIAL EFFECTS SYSTEM
// =========================================

// Create a namespace to avoid global pollution
const TwineEffects = {
  // Configuration for diamond effect
  diamondConfig: {
    size: 100,
    animationDuration: 1500,
    shineSize: 150,
    shineInDuration: 300,
    shineOutDuration: 1000,
    cleanupDelay: 500
  },
  
  // Reference cache for DOM elements
  elements: {},
  
  // Initialize all effects
  init() {
    this.initDiamondEffect();
    this.initPathCompletion();
    
    // Attach to Twine events
    $(document).on(':passagerender', () => {
      this.setupZureClickHandlers();
      this.processCompletedPaths();
    });
  },
  
  // Diamond effect initialization
  initDiamondEffect() {
    // Only initialize once
    if ($('#zure-diamond').length > 0) return;
    
    // Create diamond elements
    const diamond = $('<div id="zure-diamond"></div>');
    const diamondSides = $('<div id="zure-diamond-sides"></div>');
    
    // Style main diamond
    diamond.css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'width': `${this.diamondConfig.size}px`,
      'height': `${this.diamondConfig.size}px`,
      'transform': 'translate(-50%, -50%) scale(0)',
      'z-index': '9999',
      'opacity': '0',
      'pointer-events': 'none',
      'transition': 'transform 0.5s, opacity 0.5s',
      'transform-style': 'preserve-3d',
      'perspective': '800px'
    });
    
    // Style diamond sides
    diamondSides.css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'width': `${this.diamondConfig.size}px`,
      'height': `${this.diamondConfig.size}px`,
      'transform': 'translate(-50%, -50%) rotateY(90deg) scale(0)',
      'z-index': '9998',
      'opacity': '0',
      'pointer-events': 'none',
      'transition': 'transform 0.5s, opacity 0.5s',
      'transform-style': 'preserve-3d'
    });
    
    // Add the side face
    const diamondSide = $('<div class="diamond-side"></div>').css({
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%',
      'background': 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(200,200,255,0.4))',
      'transform-style': 'preserve-3d'
    });
    
    // Add diamond animation keyframes if not already present
    if (!document.getElementById('diamond-animations')) {
      const styleSheet = $('<style id="diamond-animations"></style>');
      styleSheet.html(`
        @keyframes zure-diamond-spin {
          from { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          to { transform: translate(-50%, -50%) scale(1) rotate(360deg); }
        }
        @keyframes zure-diamond-sides-spin {
          from { transform: translate(-50%, -50%) rotateY(90deg) scale(1) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotateY(90deg) scale(1) rotate(360deg); }
        }
      `);
      $('head').append(styleSheet);
    }
    
    // Assemble and add to document
    diamondSides.append(diamondSide);
    $('body').append(diamond);
    $('body').append(diamondSides);
    
    // Cache references
    this.elements.diamond = diamond;
    this.elements.diamondSides = diamondSides;
  },
  
  // Show the diamond effect
  showDiamond() {
    const { diamond, diamondSides } = this.elements;
    const config = this.diamondConfig;
    
    // Show diamond
    diamond.css({
      'opacity': '1',
      'transform': 'translate(-50%, -50%) scale(1)',
      'animation': `zure-diamond-spin ${config.animationDuration}ms linear`
    });
    
    // Show diamond sides
    diamondSides.css({
      'opacity': '1',
      'transform': 'translate(-50%, -50%) rotateY(90deg) scale(1)',
      'animation': `zure-diamond-sides-spin ${config.animationDuration}ms linear`
    });
    
    // Create shine effect
    const shine = $('<div id="zure-shine"></div>').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'width': `${config.shineSize}px`,
      'height': `${config.shineSize}px`,
      'background': 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
      'transform': 'translate(-50%, -50%)',
      'z-index': '9997',
      'opacity': '0',
      'pointer-events': 'none'
    });
    
    $('body').append(shine);
    
    // Animate shine
    shine.animate(
      { opacity: 0.7 }, 
      config.shineInDuration
    ).animate(
      { opacity: 0 }, 
      config.shineOutDuration, 
      function() { $(this).remove(); }
    );
    
    // Hide diamond after animation
    setTimeout(() => {
      diamond.css({
        'opacity': '0',
        'transform': 'translate(-50%, -50%) scale(0)'
      });
      
      diamondSides.css({
        'opacity': '0',
        'transform': 'translate(-50%, -50%) rotateY(90deg) scale(0)'
      });
      
      // Remove animation after it's done
      setTimeout(() => {
        diamond.css('animation', 'none');
        diamondSides.css('animation', 'none');
      }, config.cleanupDelay);
    }, config.animationDuration);
  },
  
  // Set up click handlers for Zure mentions
  setupZureClickHandlers() {
    // Use text content contains selector to find mentions of Zure
    $('span, p, div').contents().filter(function() {
      return this.nodeType === 3 && this.nodeValue.includes('Zure');
    }).parent().css('cursor', 'pointer').off('click.zure').on('click.zure', () => {
      this.showDiamond();
    });
  },
  
  // Path completion system initialization
  initPathCompletion() {
    // Initialize the store if needed
    if (!State.variables.completedPaths) {
      State.variables.completedPaths = [];
    }
  },
  
  // Mark a path as completed
  markPathCompleted(pathName) {
    // Initialize if needed
    if (!State.variables.completedPaths) {
      State.variables.completedPaths = [];
    }
    
    // Add path if it's not already in the list
    if (!State.variables.completedPaths.includes(pathName)) {
      State.variables.completedPaths.push(pathName);
    }
  },
  
  // Process completed paths and remove corresponding links
  processCompletedPaths() {
    if (!State.variables.completedPaths || State.variables.completedPaths.length === 0) {
      return;
    }
    
    // Use requestAnimationFrame for better performance timing
    requestAnimationFrame(() => {
      // Create a Set for faster lookups
      const completedPathsSet = new Set(
        State.variables.completedPaths.map(path => path.trim())
      );
      
      // Find links to remove
      $('a').each(function() {
        const $link = $(this);
        let linkText = $link.text().trim();
        
        // Check the link's own text
        if (completedPathsSet.has(linkText)) {
          $link.remove();
          return;
        }
        
        // Check child elements if needed
        $link.find('*').each(function() {
          const childText = $(this).text().trim();
          if (completedPathsSet.has(childText)) {
            $link.remove();
            return false; // Break the inner loop
          }
        });
      });
      
      // Optional debug logging when testing
      if (State.variables.debugMode) {
        console.log("Paths marked as completed:", State.variables.completedPaths);
        console.log("Links on page:", $('a').map(function() { return $(this).text().trim(); }).get());
      }
    });
  }
};

// Expose public methods to window for Twine compatibility
window.showZureDiamond = function() {
  TwineEffects.showDiamond();
};

window.markPathCompleted = function(pathName) {
  TwineEffects.markPathCompleted(pathName);
};

// Initialize the effects system when document is ready
$(document).ready(function() {
  TwineEffects.init();
});

// =========================================
// OPTIMIZED TWINE MACROS AND UI COMPONENTS
// =========================================

// Define a namespace to prevent global scope pollution
const TwineMacros = {
  // Configuration
  config: {
    footnote: {
      glitchProbability: 0.2
    },
    letter: {
      animationSpeed: 300,
      modalBgColor: 'rgba(0, 0, 0, 0.7)',
      parchmentColor: '#f8f0d8',
      textColor: '#3a2e1f',
      buttonColor: 'rgba(170, 140, 100, 0.2)',
      buttonHoverColor: 'rgba(170, 140, 100, 0.5)'
    }
  },
  
  // Cache for DOM elements and styles
  cache: {
    letterStyles: null,
    parchmentTexture: null,
    noisePattern: null
  },
  
  // Initialize macros and components
  init() {
    // Apply passage padding
    this.initPassageStyling();
    
    // Create CSS for various components
    this.createComponentStyles();
    
    // Register Twine macros
    this.registerMacros();
    
    // Register event handlers
    this.registerEventHandlers();
  },
  
  // Set up passage styling
  initPassageStyling() {
    $(document).on(':passagerender', () => {
      $('.passage').css('padding-top', '2em');
    });
    
    // Setup passage header processing
    Config.passages.onProcess = (passage) => {
      // Avoid infinite recursion
      if (passage.title !== "PassageHeader") {
        return Story.get("PassageHeader").processText() + passage.text;
      }
      return passage.text;
    };
  },
  
  // Create component styles
  createComponentStyles() {
    // Create style element if it doesn't exist
    if (!document.getElementById('twine-macro-styles')) {
      const styleElement = $('<style id="twine-macro-styles"></style>');
      
      // Add styles for tooltips
      const tooltipStyles = `
        .tooltip {
          position: relative;
          display: inline-block;
          border-bottom: 1px dotted #00FFFF;
          color: #00FFFF;
          cursor: pointer;
        }
        
        .tooltiptext {
          visibility: hidden;
          width: 240px;
          background-color: rgba(0, 10, 30, 0.9);
          color: #fff;
          text-align: center;
          border: 1px solid #00FFFF;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -120px;
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          transform: translateY(10px);
          font-size: 0.9em;
        }
        
        .tooltiptext.below {
          bottom: auto;
          top: 125%;
          transform: translateY(-10px);
        }
        
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Lux text effect */
        .lux-text {
          position: relative;
          display: block;
          text-align: right;
          color: #e0c9b5;
          text-shadow: 0 0 5px #f8d191, 0 0 10px #b18c65;
          font-family: 'Times New Roman', serif;
          font-style: italic;
          letter-spacing: 0.5px;
          font-size: 1.05em;
          line-height: 1.4;
          padding: 10px 5px;
        }
        
        .lux-text::after {
          content: attr(data-text);
          position: absolute;
          top: 9px;
          right: 8px;
          color: rgba(177, 140, 101, 0.3);
          z-index: -1;
          text-shadow: none;
        }
        
        /* Letter link styles */
        .letter-link {
          color: #00FFFF;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px dotted #00FFFF;
          padding: 2px 5px;
          margin: 0 5px;
          display: inline-block;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .letter-link:hover {
          color: #FF00FF;
          background-color: #00004B;
          text-decoration: none;
          transform: scale(1.05);
        }
      `;
      
      styleElement.html(tooltipStyles);
      $('head').append(styleElement);
    }
    
    // Cache frequently used styles and patterns
    this.cache.parchmentTexture = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;
    
    this.cache.noisePattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`;
  },
  
  // Register all macros
  registerMacros() {
    // Register footnote macro
    Macro.add('footnote', {
    tags: null,
    handler: function() {
        // Error was here - 'this' context wasn't being preserved correctly
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

  // Add the lux macro
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
    
    // Register letter macro
    Macro.add('letter', {
      tags: null,
      handler: function() {
        const content = this.payload[0].contents;
        
        // Create a link that will show the letter when clicked
        const $link = $(document.createElement('a'));
        $link.addClass('letter-link');
        $link.html("[Read Letter]");
        
        // Add click functionality
        $link.on('click', () => {
          TwineMacros.showLetter(content);
        });
        
        // Append to output
        $link.appendTo(this.output);
      }
    });
  },
  
  // Register event handlers
  registerEventHandlers() {
    // Any global event handlers would go here
  },
  
  // Footnote macro handler
  handleFootnote(context) {
    if (context.args.length < 1) {
      return context.error('The <<footnote>> macro requires a term argument');
    }
    
    const term = context.args[0];
    const definition = context.payload[0].contents;
    
    // Create the footnote element
    const $footnote = $(document.createElement('span'));
    $footnote.addClass('tooltip');
    $footnote.text(term);
    
    // Create the tooltip text
    const $tooltipText = $(document.createElement('span'));
    $tooltipText.addClass('tooltiptext');
    $tooltipText.wiki(definition);
    
    // Add random glitch effect occasionally
    if (Math.random() < this.config.footnote.glitchProbability) {
      $tooltipText.addClass('glitch-text');
    }
    
    // Add positioning logic using a more efficient approach
    $footnote.on('mouseenter', function() {
      const rect = this.getBoundingClientRect();
      const tooltipHeight = $tooltipText.outerHeight();
      
      // Toggle the below class based on available space
      $tooltipText.toggleClass('below', rect.top < tooltipHeight + 50);
    });
    
    // Append the tooltip to the footnote
    $footnote.append($tooltipText);
    
    // Append the footnote to the output
    $footnote.appendTo(context.output);
  },
  
  // Show letter modal
  showLetter(letterContent) {
    const config = this.config.letter;
    
    // Create modal container
    const modal = $('<div id="letter-modal"></div>').css({
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%',
      'background-color': config.modalBgColor,
      'z-index': '9000',
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'opacity': '0',
      'transition': `opacity ${config.animationSpeed}ms ease`
    });
    
    // Create letter container
    const letterContainer = $('<div class="letter-container"></div>').css({
      'width': '80%',
      'max-width': '600px',
      'max-height': '80vh',
      'overflow-y': 'auto',
      'background-color': config.parchmentColor,
      'background-image': this.cache.parchmentTexture,
      'color': config.textColor,
      'padding': '40px',
      'font-family': 'Brush Script MT',
      'font-size': '18px',
      'line-height': '1.6',
      'text-align': 'left',
      'border': '15px solid transparent',
      'border-image': `${this.cache.noisePattern} 30 stretch`,
      'box-shadow': '0 0 30px rgba(0, 0, 0, 0.7)',
      'position': 'relative',
      'transform': 'scale(0.9)',
      'transition': `transform ${config.animationSpeed}ms ease`,
      'white-space': 'pre-wrap'
    });
    
    // Create close button
    const closeButton = $('<div class="letter-close">×</div>').css({
      'position': 'absolute',
      'top': '10px',
      'right': '10px',
      'width': '30px',
      'height': '30px',
      'background-color': config.buttonColor,
      'color': config.textColor,
      'border-radius': '50%',
      'font-family': 'sans-serif',
      'font-size': '24px',
      'line-height': '28px',
      'text-align': 'center',
      'cursor': 'pointer',
      'transition': 'all 0.3s'
    });
    
    // Add hover effect
    closeButton.hover(
      function() { $(this).css('background-color', config.buttonHoverColor); },
      function() { $(this).css('background-color', config.buttonColor); }
    );
    
    // Add click handler
    closeButton.on('click', function() {
      modal.css('opacity', '0');
      letterContainer.css('transform', 'scale(0.9)');
      setTimeout(() => modal.remove(), config.animationSpeed);
    });
    
    // Add parchment texture and torn edges
    const textureOverlay = $('<div></div>').css({
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0',
      'pointer-events': 'none',
      'background-image': 'repeating-linear-gradient(rgba(204, 182, 159, 0.05) 0px, rgba(204, 182, 159, 0.05) 1px, transparent 1px, transparent 2px)',
      'z-index': '-1'
    });
    
    const edgesOverlay = $('<div></div>').css({
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0',
      'pointer-events': 'none',
      'background-image': 'radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.1) 0%, transparent 70%), radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.1) 0%, transparent 70%)',
      'opacity': '0.7',
      'z-index': '-1'
    });
    
    // Create content container with preserved line breaks
    const contentContainer = $('<div></div>');
    contentContainer.wiki(letterContent);
    
    // Assemble the letter
    letterContainer.append(contentContainer);
    letterContainer.append(textureOverlay);
    letterContainer.append(edgesOverlay);
    letterContainer.append(closeButton);
    modal.append(letterContainer);
    
    // Add to the page
    $('body').append(modal);
    
    // Animate in using requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      modal.css('opacity', '1');
      letterContainer.css('transform', 'scale(1)');
    });
  }
};

// Export needed functions to window
window.showLetter = function(letterContent) {
  TwineMacros.showLetter(letterContent);
};

// Initialize when document is ready
$(document).ready(function() {
  TwineMacros.init();
});

// ================================================
// OPTIMIZED DEATH SYSTEM FOR TWINE
// ================================================

// Create a namespace to contain all death-related functionality
const DeathSystem = {
  // Configuration
  config: {
    defaultMessage: "FATAL ERROR",
    defaultDelay: 2000,
    effectDuration: 5000,
    deathPassage: "Death",
    glitchInterval: 120,
    cleanupDelay: 500
  },
  
  // State tracking
  state: {
    deathTriggered: false,
    effectInterval: null
  },
  
  // Content arrays
  content: {
    // Main death messages
    glitchMessages: [
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
    ],
    
    // Subtext messages
    subtextMessages: [
      'it sees you', 
      'saving brain state', 
      'extracting memory', 
      'eyes open in the dark', 
      'nowhere to hide'
    ]
  },
  
  // Effect definitions
  effects: [
    {fn: 'flashBackground', weight: 3},
    {fn: 'shakeText', weight: 3},
    {fn: 'changeMessage', weight: 2},
    {fn: 'addGlitchLine', weight: 4}, 
    {fn: 'addStaticNoise', weight: 2},
    {fn: 'flashSubtext', weight: 1}
  ],
  
  // Element references
  elements: {
    overlay: null,
    text: null
  },
  
  // Initialize the death system
  init() {
    // Register the death macro
    this.registerMacro();
    
    // Export functions to window for Twine compatibility
    window.playerDeath = (message, delayBeforeGlitch) => this.triggerDeath(message, delayBeforeGlitch);
  },
  
  // Register the death macro
  registerMacro() {
    Macro.add('death', {
      handler: function() {
        // Check for arguments: first is message, second is optional delay in milliseconds
        const message = this.args.length > 0 ? this.args[0] : DeathSystem.config.defaultMessage;
        const delay = this.args.length > 1 ? Number(this.args[1]) : 8000; // Default 8 second delay
        
        // Schedule death with the requested delay
        window.setTimeout(() => {
          DeathSystem.triggerDeath(message, 0); // 0 delay since we already delayed
        }, delay);
      }
    });
  },
  
  // Main entry point for death sequence
  triggerDeath(message, delayBeforeGlitch = this.config.defaultDelay) {
    // Prevent multiple death triggers
    if (this.state.deathTriggered) {
      return;
    }
    
    // Set the flag to prevent multiple calls
    this.state.deathTriggered = true;
    
    // Schedule the glitch effect to start after the delay
    window.setTimeout(() => this.startGlitchEffect(message), delayBeforeGlitch);
  },
  
  // Start the glitch effect sequence
  startGlitchEffect(message) {
    // Create and set up the overlay
    this.createOverlay(message);
    
    // Try to play a glitch sound
    this.playGlitchSound();
    
    // Start the effect sequence
    this.runEffectSequence();
    
    // Schedule the end of the sequence
    setTimeout(() => this.endDeathSequence(), this.config.effectDuration);
  },
  
  // Create the visual overlay for death effect
  createOverlay(message) {
    // Create a full-screen glitch overlay
    const overlay = document.createElement('div');
    overlay.id = 'glitch-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: '#000033',
      zIndex: '9999',
      overflow: 'hidden'
    });
    
    // Add glitch text in the center
    const text = document.createElement('h1');
    text.id = 'glitch-text';
    Object.assign(text.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#FF0000',
      fontSize: '4em',
      whiteSpace: 'nowrap',
      textShadow: '0 0 10px #FF0000'
    });
    text.textContent = message || this.config.defaultMessage;
    
    // Add it to the page
    overlay.appendChild(text);
    document.body.appendChild(overlay);
    
    // Store references
    this.elements.overlay = overlay;
    this.elements.text = text;
  },
  
  // Attempt to play the glitch sound
  playGlitchSound() {
    try {
      const audio = new Audio();
      audio.src = "https://static.wixstatic.com/mp3/f3adad_9ee367356f6d486083459f5f6d7dfa91.wav";
      audio.volume = 0.5;
      audio.play();
    } catch (error) {
      console.error("Audio couldn't play, continuing without sound");
    }
  },
  
  // Run the sequence of visual effects
  runEffectSequence() {
    // Create a weighted array of effects for selection
    const weightedEffects = [];
    
    // Build the weighted effect array
    this.effects.forEach(effect => {
      for (let i = 0; i < effect.weight; i++) {
        weightedEffects.push(effect.fn);
      }
    });
    
    // Start the effect interval
    this.state.effectInterval = setInterval(() => {
      // Run 1-4 random effects
      const numEffects = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numEffects; i++) {
        const randomIndex = Math.floor(Math.random() * weightedEffects.length);
        const effectName = weightedEffects[randomIndex];
        this[effectName]();
      }
    }, this.config.glitchInterval);
  },
  
  // End the death sequence
  endDeathSequence() {
    // Clean up interval
    clearInterval(this.state.effectInterval);
    
    // Update death counter
    this.updateDeathCounter();
    
    // Clean up overlay after a short delay
    setTimeout(() => {
      if (document.body.contains(this.elements.overlay)) {
        document.body.removeChild(this.elements.overlay);
      }
      
      // Navigate to death passage
      Engine.play(this.config.deathPassage);
      
      // Reset state for future deaths
      this.state.deathTriggered = false;
    }, this.config.cleanupDelay);
  },
  
  // Update the death counter in State variables
  updateDeathCounter() {
    // Initialize death count if it doesn't exist
    if (typeof State.variables.deathCount === 'undefined') {
      State.variables.deathCount = 0;
    }
    
    // Increment the counter
    State.variables.deathCount += 1;
    
    // Set flag that player has died
    State.variables.hasPlayerDied = true;
  },
  
  // ---- VISUAL EFFECTS ----
  
  // Flash the background with random colors
  flashBackground() {
    const overlay = this.elements.overlay;
    
    // Random background color
    overlay.style.backgroundColor = `rgb(${Math.random()*255}, ${Math.random()*50}, ${Math.random()*100})`;
    
    // Random chance for a more dramatic flash
    if (Math.random() < 0.3) {
      overlay.style.backgroundImage = `radial-gradient(circle, rgba(255,0,0,0.7) ${Math.random()*30}%, rgba(0,0,0,0.8) ${Math.random()*70 + 30}%)`;
    }
    
    // Reset after a short delay
    setTimeout(() => {
      overlay.style.backgroundColor = '#000033';
      overlay.style.backgroundImage = 'none';
    }, 100);
  },
  
  // Shake and distort the text
  shakeText() {
    const text = this.elements.text;
    
    // Random distortion values
    const skewX = Math.random() * 20 - 10;
    const skewY = Math.random() * 20 - 10;
    const scale = 0.8 + Math.random() * 0.5;
    
    // Apply distortion
    text.style.transform = `translate(${-50 + (Math.random()*20-10)}%, ${-50 + (Math.random()*20-10)}%) skew(${skewX}deg, ${skewY}deg) scale(${scale})`;
    text.style.color = Math.random() > 0.5 ? '#FF00FF' : '#00FFFF';
    text.style.letterSpacing = `${Math.random() * 10 - 5}px`;
    
    // Reset after a short delay
    setTimeout(() => {
      text.style.transform = 'translate(-50%, -50%)';
      text.style.color = '#FF0000';
      text.style.letterSpacing = 'normal';
    }, 150);
  },
  
  // Change the displayed message
  changeMessage() {
    const text = this.elements.text;
    
    // Random message from the array
    text.textContent = this.content.glitchMessages[
      Math.floor(Math.random() * this.content.glitchMessages.length)
    ];
    
    // Random chance to show backwards text
    if (Math.random() < 0.2) {
      text.style.transform += ' scaleX(-1)';
      setTimeout(() => {
        text.style.transform = 'translate(-50%, -50%)';
      }, 200);
    }
  },
  
  // Add horizontal static lines
  addGlitchLine() {
    const overlay = this.elements.overlay;
    
    // Random line properties
    const lineHeight = Math.floor(Math.random() * 5) + 1;
    const yPos = Math.floor(Math.random() * 100);
    
    // Create line element
    const line = document.createElement('div');
    Object.assign(line.style, {
      position: 'absolute',
      left: '0',
      top: `${yPos}%`,
      width: '100%',
      height: `${lineHeight}px`,
      backgroundColor: Math.random() > 0.5 ? '#FFFFFF' : '#00FFFF',
      opacity: '0.7',
      zIndex: '10000'
    });
    
    // Add and remove after delay
    overlay.appendChild(line);
    setTimeout(() => {
      overlay.removeChild(line);
    }, 200);
  },
  
  // Add static noise effect
  addStaticNoise() {
    const overlay = this.elements.overlay;
    
    // Create noise element
    const noise = document.createElement('div');
    Object.assign(noise.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      opacity: '0.1',
      pointerEvents: 'none'
    });
    
    // Create a stippled effect for "static"
    let stipple = '';
    for (let i = 0; i < 200; i++) {
      const size = Math.floor(Math.random() * 3) + 1;
      stipple += `${Math.random() * 100}% ${Math.random() * 100}% 0 ${size}px #FFFFFF, `;
    }
    stipple = stipple.slice(0, -2); // Remove trailing comma and space
    
    noise.style.boxShadow = stipple;
    overlay.appendChild(noise);
    
    // Remove after delay
    setTimeout(() => {
      overlay.removeChild(noise);
    }, 150);
  },
  
  // Flash subtext at the bottom
  flashSubtext() {
    const overlay = this.elements.overlay;
    
    // Create subtext element
    const subtext = document.createElement('div');
    subtext.textContent = this.content.subtextMessages[
      Math.floor(Math.random() * this.content.subtextMessages.length)
    ];
    
    // Style the subtext
    Object.assign(subtext.style, {
      position: 'absolute',
      bottom: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#FF0000',
      fontSize: '1.2em',
      fontFamily: 'monospace',
      opacity: '0',
      transition: 'opacity 0.1s'
    });
    
    // Add and animate
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
};

// Initialize the death system
$(document).ready(function() {
  DeathSystem.init();
});

