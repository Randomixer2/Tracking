const students = [];

document.getElementById('submit').addEventListener('click', () => {
    const studentName = document.getElementById('studentName').value.trim();
    const subject = document.getElementById('subject').value;
    const score = parseInt(document.getElementById('score').value);
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = ''; // Clear previous error message

    if (!studentName || !subject || isNaN(score)) {
        errorMessage.textContent = "Please fill in all fields correctly.";
        return;
    }

    const existingStudent = students.find(student => student.name === studentName);
    
    if (existingStudent) {
        // Add or update score for the subject
        existingStudent.scores[subject].push(score);
    } else {
        // Initialize scores object for new student
        const scores = {};
        scores[subject] = [score];
        students.push({
            name: studentName,
            scores: scores
        });
    }

    displayPerformanceSummary();
    clearInputs();
});

document.getElementById('clear').addEventListener('click', () => {
    students.length = 0; // Clear all student data
    displayPerformanceSummary();
});

document.getElementById('search').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    displayPerformanceSummary(query);
});

function displayPerformanceSummary(searchQuery = '') {
    const summaryDiv = document.getElementById('performance-summary');
    summaryDiv.innerHTML = '';

    const filteredStudents = students.filter(student => student.name.toLowerCase().includes(searchQuery));

    if (filteredStudents.length === 0) {
        summaryDiv.innerHTML = '<p>No students found.</p>';
        return;
    }

    filteredStudents.forEach(student => {
        const totalScores = [];
        const scoreItems = Object.keys(student.scores).map(subject => {
            const scores = student.scores[subject];
            const totalScore = scores.reduce((a, b) => a + b, 0);
            totalScores.push(totalScore);
            const averageScore = (totalScore / scores.length).toFixed(2);
            const performanceRating = generatePerformanceRating(averageScore);
            const progressBarWidth = (averageScore / 100) * 100; // Convert to percentage
            
            return `
                <div class="subject-history">
                    <div class="subject-title">${subject}</div>
                    <p>Scores: ${scores.join(', ')}</p>
                    <p>Average Score: ${averageScore}</p>
                    <p>Performance Rating: ${performanceRating}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progressBarWidth}%;"></div>
                    </div>
                </div>
            `;
        }).join('');

        const overallAverage = (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(2);

        summaryDiv.innerHTML += `
            <div class="summary-item">
                <h3>${student.name} (Avg: ${overallAverage})</h3>
                ${scoreItems}
                <button class="history-button" onclick="showHistory('${student.name}')">View History</button>
            </div>
        `;
    });
}

function showHistory(studentName) {
    const student = students.find(s => s.name === studentName);
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '';

    if (student) {
        Object.keys(student.scores).forEach(subject => {
            const scores = student.scores[subject];
            historyContent.innerHTML += `
                <div class="subject-history">
                    <div class="subject-title">${subject}</div>
                    <p>Scores: ${scores.join(', ')}</p>
                </div>
            `;
        });
    }

    document.getElementById('history-section').classList.remove('hidden');
}

document.getElementById('close-history').addEventListener('click', () => {
    document.getElementById('history-section').classList.add('hidden');
});

function generatePerformanceRating(averageScore) {
    if (averageScore >= 90) {
        return "Excellent";
    } else if (averageScore >= 75) {
        return "Good";
    } else if (averageScore >= 50) {
        return "Average";
    } else {
        return "Needs Improvement";
    }
}

function clearInputs() {
    document.getElementById('studentName').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('score').value = '';
}
