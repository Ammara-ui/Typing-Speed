let targetText = "";
let startTime;

// Fetch exercise on page load
async function loadExercise() {
    const response = await fetch('/get_exercise');
    const data = await response.json();
    targetText = data.text;
    document.getElementById('exercise').textContent = targetText;
    startTime = new Date();
    Prism.highlightElement(document.getElementById('exercise'));
}

document.getElementById('submitBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('typingArea').value;
    const timeTaken = (new Date() - startTime) / 1000; // seconds

    const response = await fetch('/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput, target_text: targetText, time_taken: timeTaken })
    });

    const result = await response.json();
    document.getElementById('accuracy').textContent = result.accuracy.toFixed(2);
    document.getElementById('wpm').textContent = result.wpm.toFixed(2);
    document.getElementById('errors').textContent = result.errors;
});

// Handle Tab and Shift+Tab to insert spaces for indentation
document.getElementById('typingArea').addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault();  // Prevent the default tab behavior

        // Insert 4 spaces (or any number you want) at the cursor position
        const cursorPos = this.selectionStart;
        const textBefore = this.value.substring(0, cursorPos);
        const textAfter = this.value.substring(cursorPos);
        const spaces = '    '; // 4 spaces

        // Insert spaces based on whether Shift is held down or not
        if (event.shiftKey) {
            // Handle Shift+Tab (remove indentation)
            const lines = textBefore.split('\n');
            const lastLine = lines[lines.length - 1];
            if (lastLine.startsWith('    ')) {
                lines[lines.length - 1] = lastLine.substring(4); // Remove 4 spaces
            }
            this.value = lines.join('\n') + textAfter;
        } else {
            // Insert spaces for normal Tab
            this.value = textBefore + spaces + textAfter;
        }

        // Move the cursor to the end of the inserted spaces
        this.selectionStart = this.selectionEnd = cursorPos + spaces.length;
    }
});

loadExercise();