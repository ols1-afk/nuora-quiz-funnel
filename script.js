// Nuora Quiz Funnel - JavaScript
// Quiz state management and routing logic

const quizState = {
    currentStep: 'step1',
    selectedPath: null, // 'A' or 'B'
    pathScores: { A: 0, B: 0 },
    answers: {},
    stepHistory: []
};

// Chart.js instances storage
const charts = {};

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
    setupEventListeners();
    updateProgress();
});

function initializeQuiz() {
    // Show first step
    showStep('step1');
}

function setupEventListeners() {
    // Single-select option buttons (auto-advance)
    document.querySelectorAll('.single-select .option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleSingleSelect(e.target);
        });
    });

    // Multi-select option buttons
    document.querySelectorAll('.multi-select .option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleMultiSelect(e.target);
        });
    });

    // Continue buttons
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = e.target.getAttribute('data-next');
            if (nextStep) {
                navigateToStep(nextStep);
            } else {
                handleContinueButton(e.target);
            }
        });
    });

    // Step 2 Continue - Special handling for path routing
    const step2Continue = document.getElementById('step2Continue');
    if (step2Continue) {
        step2Continue.addEventListener('click', () => {
            routeToPath();
        });
    }
}

function handleSingleSelect(button) {
    // Remove selection from siblings
    const container = button.closest('.options-container');
    container.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Select current button
    button.classList.add('selected');

    // Store answer
    const currentStep = document.querySelector('.quiz-step.active').id;
    quizState.answers[currentStep] = button.getAttribute('data-value');

    // Auto-advance after short delay
    const nextStep = button.getAttribute('data-next');
    setTimeout(() => {
        navigateToStep(nextStep);
    }, 300);
}

function handleMultiSelect(button) {
    // Toggle selection
    button.classList.toggle('selected');

    // Update continue button state
    const currentStep = document.querySelector('.quiz-step.active').id;
    const container = button.closest('.quiz-step');
    const continueBtn = container.querySelector('.continue-btn');
    const selectedButtons = container.querySelectorAll('.option-btn.selected');

    if (continueBtn) {
        continueBtn.disabled = selectedButtons.length === 0;
    }

    // Store answers for step 2 (path routing)
    if (currentStep === 'step2') {
        updatePathScores();
    }

    // Store other multi-select answers
    const selectedValues = Array.from(selectedButtons).map(btn =>
        btn.getAttribute('data-value')
    );
    quizState.answers[currentStep] = selectedValues;
}

function updatePathScores() {
    // Reset scores
    quizState.pathScores = { A: 0, B: 0 };

    // Count selected options by path
    const step2 = document.getElementById('step2');
    const selectedButtons = step2.querySelectorAll('.option-btn.selected');

    selectedButtons.forEach(btn => {
        const path = btn.getAttribute('data-path');
        if (path === 'A') {
            quizState.pathScores.A++;
        } else if (path === 'B') {
            quizState.pathScores.B++;
        }
    });
}

function routeToPath() {
    // Determine which path to take based on scores
    if (quizState.pathScores.A > quizState.pathScores.B) {
        quizState.selectedPath = 'A';
        navigateToStep('step3a');
    } else if (quizState.pathScores.B > quizState.pathScores.A) {
        quizState.selectedPath = 'B';
        navigateToStep('step3b');
    } else {
        // If tied, default to Path A (Step 7 would break tie in real implementation)
        quizState.selectedPath = 'A';
        navigateToStep('step3a');
    }
}

function handleContinueButton(button) {
    // Get current step
    const currentStepElement = document.querySelector('.quiz-step.active');
    const currentStep = currentStepElement.id;

    // Get selected values for multi-select questions
    const selectedButtons = currentStepElement.querySelectorAll('.option-btn.selected');
    const selectedValues = Array.from(selectedButtons).map(btn =>
        btn.getAttribute('data-value')
    );
    quizState.answers[currentStep] = selectedValues;

    // Find next step based on current step
    const nextStepMap = {
        'step4a': 'step4a-stats',
        'step5a': 'step5a-proof',
        'step6a': 'step7a',
        'step7a-achievability': 'step8a',
        'step4b': 'step4b-stats',
        'step5b': 'step5b-proof',
        'step6b': 'step7b',
        'step7b-achievability': 'step8b'
    };

    const nextStep = nextStepMap[currentStep];
    if (nextStep) {
        navigateToStep(nextStep);
    }
}

function navigateToStep(stepId) {
    // Store current step in history
    quizState.stepHistory.push(quizState.currentStep);

    // Hide current step
    const currentStep = document.querySelector('.quiz-step.active');
    if (currentStep) {
        currentStep.classList.remove('active');
    }

    // Show next step
    const nextStep = document.getElementById(stepId);
    if (nextStep) {
        nextStep.classList.add('active');
        quizState.currentStep = stepId;

        // Update progress bar
        updateProgress();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Initialize charts if needed
        initializeChartsForStep(stepId);

        // Handle loading screens
        if (stepId === 'loadingA' || stepId === 'loadingB') {
            startLoadingAnimation(stepId);
        }
    }
}

function showStep(stepId) {
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('active');
        quizState.currentStep = stepId;
    }
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');

    // Define step progression (approximate percentages)
    const progressMap = {
        'step1': 5,
        'step2': 15,
        'step3a': 25, 'step3b': 25,
        'step4a': 35, 'step4b': 35,
        'step4a-stats': 40, 'step4b-stats': 40,
        'step5a': 50, 'step5b': 50,
        'step5a-proof': 55, 'step5b-proof': 55,
        'step6a': 65, 'step6b': 65,
        'step7a': 75, 'step7b': 75,
        'step7a-achievability': 80, 'step7b-achievability': 80,
        'step8a': 90, 'step8b': 90,
        'loadingA': 95, 'loadingB': 95,
        'resultsA': 100, 'resultsB': 100
    };

    const progress = progressMap[quizState.currentStep] || 0;
    progressBar.style.width = progress + '%';
}

function startLoadingAnimation(stepId) {
    const isPathA = stepId === 'loadingA';
    const loadingBar = document.getElementById(isPathA ? 'loadingBarA' : 'loadingBarB');
    const loadingText = document.getElementById(isPathA ? 'loadingTextA' : 'loadingTextB');

    const loadingSteps = [
        { progress: 33, text: 'Matching responses to research...' },
        { progress: 66, text: 'Reviewing clinical data...' },
        { progress: 100, text: 'Building personalized recommendation...' }
    ];

    let currentLoadingStep = 0;

    const loadingInterval = setInterval(() => {
        if (currentLoadingStep < loadingSteps.length) {
            const step = loadingSteps[currentLoadingStep];
            loadingBar.style.width = step.progress + '%';
            loadingText.textContent = step.text;
            currentLoadingStep++;
        } else {
            clearInterval(loadingInterval);
            // Navigate to results page after loading completes
            setTimeout(() => {
                navigateToStep(isPathA ? 'resultsA' : 'resultsB');
            }, 500);
        }
    }, 1200);
}

function initializeChartsForStep(stepId) {
    // Initialize charts based on which step is being shown
    switch(stepId) {
        case 'step5a-proof':
            createComparisonChart('chartPathA1', '#FAC515');
            break;
        case 'step7a-achievability':
            createTimelineChart('chartPathA2', '#FAC515', 'Freshness with vs without Nuora');
            break;
        case 'resultsA':
            createResultsChart('chartResultsA', '#FAC515', 'Your Freshness Journey',
                ['Day 1', 'Week 1', 'Week 2', 'Week 3+'],
                ['Start', 'Odor fades', 'Balance holds', 'New normal']);
            break;
        case 'step5b-proof':
            createComparisonChart('chartPathB1', '#5DADE2');
            break;
        case 'step7b-achievability':
            createTimelineChart('chartPathB2', '#5DADE2', 'Natural moisture with vs without Nuora');
            break;
        case 'resultsB':
            createResultsChart('chartResultsB', '#5DADE2', 'Your Moisture Journey',
                ['Week 1', 'Week 3', 'Week 6+'],
                ['Environment resets', 'Comfort returns', 'Natural moisture']);
            break;
    }
}

function createComparisonChart(canvasId, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || charts[canvasId]) return;

    const ctx = canvas.getContext('2d');
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Conventional Treatments', 'Nuora'],
            datasets: [{
                label: 'Effectiveness',
                data: [1, 4.5],
                backgroundColor: ['#E0E0E0', color],
                borderColor: ['#BDBDBD', color],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + 'x effectiveness';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            return value + 'x';
                        }
                    },
                    grid: {
                        color: '#F5F5F5'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createTimelineChart(canvasId, color, title) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || charts[canvasId]) return;

    const ctx = canvas.getContext('2d');
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Now', 'Week 1', 'Week 2', 'Week 3', 'Month 1'],
            datasets: [
                {
                    label: 'Without Nuora',
                    data: [50, 45, 40, 35, 30],
                    borderColor: '#BDBDBD',
                    backgroundColor: 'rgba(189, 189, 189, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#BDBDBD'
                },
                {
                    label: 'With Nuora',
                    data: [50, 65, 80, 90, 95],
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: color,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                            weight: 600
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 700
                    },
                    padding: {
                        bottom: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#F5F5F5'
                    },
                    ticks: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createResultsChart(canvasId, color, title, labels, milestones) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || charts[canvasId]) return;

    const ctx = canvas.getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}05`);

    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Progress',
                data: labels.map((_, i) => (i + 1) * (100 / labels.length)),
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 4,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18,
                        weight: 700
                    },
                    padding: {
                        bottom: 30
                    },
                    color: '#713B12'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return milestones[context.dataIndex];
                        }
                    },
                    backgroundColor: color,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 600
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#F5F5F5'
                    },
                    ticks: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 600
                        },
                        color: '#713B12'
                    }
                }
            }
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Allow Enter key to activate focused button
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('option-btn') ||
            activeElement.classList.contains('continue-btn')) {
            activeElement.click();
        }
    }
});

// Add accessibility support
document.querySelectorAll('.option-btn, .continue-btn').forEach(btn => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
});

console.log('Nuora Quiz Funnel initialized successfully!');
