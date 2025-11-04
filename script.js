document.addEventListener('DOMContentLoaded', (event) => {
    const checkboxes = document.querySelectorAll('.slot-checkbox');
    const resetButtons = document.querySelectorAll('.reset-btn');
    
    // लोकल स्टोरेज से प्रगति लोड करें
    function loadProgress() {
        checkboxes.forEach(checkbox => {
            const isChecked = localStorage.getItem(checkbox.id);
            const dayCard = checkbox.closest('.single-day'); // केवल सिंगल डे कार्ड को देखें
            
            if (isChecked === 'true') {
                checkbox.checked = true;
                checkbox.disabled = true; // लॉक: दोबारा चेक नहीं कर सकते
            } else {
                checkbox.checked = false;
                checkbox.disabled = false;
            }
            
            // दिन की कंप्लीशन स्थिति को अपडेट करें (केवल यदि यह एक ट्रैकिंग कार्ड है)
            if (dayCard) {
                updateDayCompletion(dayCard);
            }
        });
    }

    // दिन की कंप्लीशन स्थिति और प्रोग्रेस रिपोर्ट को अपडेट करने का फंक्शन
    function updateDayCompletion(dayCard) {
        if (!dayCard) return;

        // उस दिन के सभी चेकबॉक्स को चुनें
        const dayCheckboxes = dayCard.querySelectorAll('.slot-checkbox');
        
        // पूरे हुए सेशन और कुल सेशन की गिनती करें
        const totalSlots = dayCheckboxes.length;
        const completedSlots = Array.from(dayCheckboxes).filter(cb => cb.checked).length;
        
        const progressReportElement = dayCard.querySelector('.progress-report');
        
        if (progressReportElement) {
            // प्रोग्रेस रिपोर्ट टेक्स्ट सेट करें
            if (completedSlots === totalSlots) {
                progressReportElement.textContent = '✅ DONE';
            } else {
                progressReportElement.textContent = `${completedSlots}/${totalSlots} Completed`;
            }
        }

        // यदि सभी पूरे हो गए हैं, तो कार्ड को 'day-completed' क्लास दें
        if (completedSlots === totalSlots) {
            dayCard.classList.add('day-completed');
        } else {
            dayCard.classList.remove('day-completed');
        }
    }

    // चेकबॉक्स स्थिति बदलने पर प्रगति को सहेजें
    function saveProgress(event) {
        const checkbox = event.target;
        const dayCard = checkbox.closest('.single-day'); // केवल सिंगल डे कार्ड को देखें

        // अगर चेक किया गया है, तो इसे लोकल स्टोरेज में सेव करें और लॉक करें
        if (checkbox.checked) {
            localStorage.setItem(checkbox.id, 'true');
            checkbox.disabled = true; // लॉक!
        } 
        
        // दिन की कंप्लीशन स्थिति को अपडेट करें
        if (dayCard) {
            updateDayCompletion(dayCard);
        }
    }
    

    // रीसेट बटन के क्लिक पर दिन की प्रगति रीसेट करें
    function resetDay(event) {
        const dayId = event.target.dataset.dayId;
        const dayCard = document.querySelector(`.day-card[data-day="${dayId}"]`);
        
        if (confirm(`क्या आप Day ${dayId} की पूरी प्रगति रीसेट करना चाहते हैं?`)) {
            const dayCheckboxes = dayCard.querySelectorAll('.slot-checkbox');
            dayCheckboxes.forEach(checkbox => {
                localStorage.removeItem(checkbox.id); 
                checkbox.checked = false;
                checkbox.disabled = false;
            });

            // रीसेट के बाद स्थिति और रिपोर्ट अपडेट करें
            dayCard.classList.remove('day-completed');
            if (dayCard) {
                updateDayCompletion(dayCard);
            }
            alert(`Day ${dayId} की प्रगति रीसेट कर दी गई है!`);
        }
    }

    // इवेंट लिसनर जोड़ें
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveProgress);
    });

    resetButtons.forEach(button => {
        button.addEventListener('click', resetDay);
    });

    // पेज लोड होने पर प्रगति लोड करें
    loadProgress();
});
