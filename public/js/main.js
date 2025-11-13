document.addEventListener('DOMContentLoaded', () => {
    const gradingForm = document.getElementById('grading-form');
    const essayInput = document.getElementById('essay-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results-container');
    const scoreDisplay = document.getElementById('score-display');
    const feedbackDisplay = document.getElementById('feedback-display');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');

    gradingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const essayText = essayInput.value.trim();
        if (!essayText) {
            displayError('Please enter an essay to grade.');
            return;
        }

        // Reset UI states
        hideAllMessages();
        loadingIndicator.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Grading...';

        try {
            const response = await fetch('/api/grade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ essay: essayText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            displayResults(result);

        } catch (error) {
            console.error('Error:', error);
            displayError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            loadingIndicator.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Grade My Essay';
        }
    });

    function displayResults(data) {
        hideAllMessages();
        scoreDisplay.innerHTML = `${data.score} <span>/ 10</span>`;
        feedbackDisplay.textContent = data.feedback;
        resultsContainer.classList.remove('hidden');
    }

    function displayError(message) {
        hideAllMessages();
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideAllMessages() {
        resultsContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }
});
