// scripts.js
function showSection(sectionId) {
    // Hide all sections
    let sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    let selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';

    // Update the active link in the navbar
    setActiveLink(sectionId);

    // If just work, hide films and commercial
    if (sectionId === 'work') {
        document.getElementById('films-section').style.display = 'none';
        document.getElementById('commercial-section').style.display = 'none';
        document.getElementById('work-section').style.display = 'block';
    }

}

function setActiveLink(activeId) {
    // Remove 'active' class from all nav links
    var navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function(link) {
        link.classList.remove('active');
    });

    // Add 'active' class to the corresponding link
    var activeLink = document.querySelector('nav a[href="#' + activeId + '"]');
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function toggleWorkSection(section) {
    // Ensure the work section is visible
    showSection('work');

    // Show or hide films and commercial sections based on the clicked box
    if (section === 'films') {
        document.getElementById('films-section').style.display = 'block';
        document.getElementById('commercial-section').style.display = 'none';
        document.getElementById('work-section').style.display = 'none';
    } else if (section === 'commercial') {
        document.getElementById('films-section').style.display = 'none';
        document.getElementById('commercial-section').style.display = 'block';
        document.getElementById('work-section').style.display = 'none';
    }

}

// Show the home section by default
document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
});

// Add click event listeners to nav links
document.querySelectorAll('nav a').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        var sectionId = this.getAttribute('href').substring(1); // Get the section ID from the href
        showSection(sectionId); // Show the selected section
    });
});

document.querySelectorAll('.work-container').forEach(container => {
    const video = container.querySelector('video');
    const playButton = container.querySelector('.play-button');
    const thumbnail = container.querySelector('.thumbnail');
    
    if (!video || !playButton) {
        return;
    }

    let hasPlayed = false;

    // Function to capture a frame from the video and display it as a thumbnail
    function captureThumbnail() {
        video.currentTime = 1.5; // Set to the time you want to capture (e.g., 2 seconds)
        video.addEventListener('seeked', function captureFrame() {
            const canvas = container.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            video.removeEventListener('seeked', captureFrame);
            video.currentTime = 0; // Reset video to start
        });
    }

    container.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playButton.style.display = 'none';
            if (thumbnail) {
                thumbnail.style.display = 'none'; 
            }
            hasPlayed = true; 
        } else {
            video.pause();
            playButton.style.display = 'block';
            if (thumbnail && !hasPlayed) {
                thumbnail.style.display = 'block'; 
            }
        }
    });

    video.addEventListener('play', () => {
        playButton.style.display = 'none';
        if (thumbnail && !hasPlayed) {
            thumbnail.style.display = 'none'; 
        }
        hasPlayed = true; 
    });

    video.addEventListener('pause', () => {
        playButton.style.display = 'block';
        if (thumbnail && !hasPlayed) {
            thumbnail.style.display = 'block'; 
        }
    });

    if (thumbnail) {
        // Capture thumbnail once the video metadata is loaded
        video.addEventListener('loadedmetadata', captureThumbnail);
    }

    // Ensure the play button is visible if the video is initially paused
    if (video.paused) {
        playButton.style.display = 'block';
        if (thumbnail && !hasPlayed) {
            thumbnail.style.display = 'block'; 
        }
    } else {
        playButton.style.display = 'none';
        if (thumbnail) {
            thumbnail.style.display = 'none'; 
        }
    }
});

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const form = this;
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            form.reset(); // Clear form fields
            alert('Email sent successfully!'); // Alert on success
        } else {
            alert('Failed to send email.'); // Alert on failure
            console.error('Form submission failed.');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});