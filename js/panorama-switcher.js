// Panorama Switcher - Simple iframe switcher for panorama embeds
document.addEventListener('DOMContentLoaded', () => {
    // Panorama locations with their embedded URLs
    const panoramas = {
        'aktorovyy-zal': {
            name: 'Актовый зал',
            url: 'https://panoraven.com/en/embed/uJp1ZVNWCc'
        },
        'ino-centre': {
            name: 'INO центр',
            url: 'https://panoraven.com/en/embed/QcAfg1ZCkz'
        }
    };

    const buttons = document.querySelectorAll('.btn-panorama');
    const panoramaIframe = document.getElementById('panorama-iframe');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const location = e.target.dataset.location;
            const panorama = panoramas[location];

            if (panorama) {
                // Update active button
                buttons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Update iframe source
                panoramaIframe.src = panorama.url;
            }
        });
    });
});

