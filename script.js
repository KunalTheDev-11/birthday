// Birthday Challenge Game Script
class BirthdayChallenge {
    constructor() {
        this.challengesCompleted = 0;
        this.totalChallenges = 5;
        this.currentChallengeIndex = 0;
        this.challenges = [
            this.createChallenge1(),
            this.createChallenge2(),
            this.createChallenge3(),
            this.createChallenge4(),
            this.createChallenge5()
        ];
        this.rewardMessage = "You've earned a special day off! I'll handle all chores tomorrow and we'll go out for your favorite coffee and dessert. Love you to the moon and back! ☕💖";
        this.rewardImage = "https://i.imgur.com/5Z7vQyL.png"; // A nice coffee/cake image

        this.init();
    }

    init() {
        this.loadChallenge(0);
        this.updateProgress();

        // Add confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        document.body.appendChild(confettiContainer);

        // Add restart button event listener
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }

    createChallenge1() {
        return {
            id: 1,
            title: "Birthday Word Scramble",
            description: "Unscramble the letters to find a sweet treat we love to share:",
            puzzle: "KCAE",
            hint: "It's what we're celebrating today!",
            answer: "CAKE",
            feedback: "Perfect! Just like the cake we'll share today.",
            type: "word-scramble"
        };
    }

    createChallenge2() {
        return {
            id: 2,
            title: "Memory Match",
            description: "Remember this sequence of hearts and click them in the same order:",
            puzzle: [2, 0, 3, 1], // Indices of hearts to click
            hint: "Think of the order: ❤️💛💙💚",
            answer: [2, 0, 3, 1],
            feedback: "Excellent memory! Just like how you remember everyone's special days.",
            type: "memory-game"
        };
    }

    createChallenge3() {
        return {
            id: 3,
            title: "Birthday Number Puzzle",
            description: "Find the missing number in this sequence that represents our special moments together:",
            puzzle: "3, 7, 11, ?, 19, 23",
            hint: "Think about how we celebrate - it's a steady rhythm!",
            answer: 15,
            feedback: "Perfect! Just like our traditions - every 4 years we add another special memory.",
            type: "number-sequence"
        };
    }

    createChallenge4() {
        return {
            id: 4,
            title: "Emoji Code",
            description: "Decode this emoji message to find your favorite flower:",
            puzzle: "🌷🌸🌹🌺🌻",
            hint: "Which one do I always bring you on Mother's Day?",
            answer: "🌷", // Tulip
            feedback: "Yes! Tulips - just like the ones I bring you every spring.",
            type: "emoji-picker"
        };
    }

    createChallenge5() {
        return {
            id: 5,
            title: "Final Combination",
            description: "Use the clues from all previous challenges to unlock your reward:",
            puzzle: "Take the first letter of each answer and rearrange:",
            hint: "C _ _ _ _ (Think: What we do when we're together and happy)",
            answer: "CHUCKLE", // Or we could make it "LAUGH" or "SMILE"
            feedback: "That's right! Our laughter and smiles are the best gift.",
            type: "combination"
        };
    }

    loadChallenge(index) {
        const challengesSection = document.getElementById('challenges');
        challengesSection.innerHTML = '';

        if (index >= this.challenges.length) {
            this.showReward();
            return;
        }

        const challenge = this.challenges[index];
        const challengeElement = document.createElement('div');
        challengeElement.className = 'challenge-card';
        challengeElement.innerHTML = `
            <h3>${challenge.title}</h3>
            <p>${challenge.description}</p>
            <div class="challenge-puzzle" id="puzzle-${challenge.id}"></div>
            <div class="challenge-input">
                <input type="text" id="input-${challenge.id}" placeholder="Your answer...">
                <button id="submit-${challenge.id}">Submit</button>
            </div>
            <div class="feedback" id="feedback-${challenge.id}"></div>
        `;

        challengesSection.appendChild(challengeElement);

        // Initialize the specific challenge type
        this.initChallengeUI(challenge);

        // Add event listener
        document.getElementById(`submit-${challenge.id}`).addEventListener('click', () => {
            this.checkAnswer(challenge);
        });

        // Allow Enter key to submit
        document.getElementById(`input-${challenge.id}`).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer(challenge);
            }
        });
    }

    initChallengeUI(challenge) {
        const puzzleDiv = document.getElementById(`puzzle-${challenge.id}`);

        switch (challenge.type) {
            case "word-scramble":
                puzzleDiv.innerHTML = `<strong>${challenge.puzzle}</strong>`;
                break;

            case "number-sequence":
                puzzleDiv.innerHTML = `<strong>${challenge.puzzle}</strong>`;
                break;

            case "memory-game":
                puzzleDiv.innerHTML = `
                    <div class="memory-hearts">
                        <div class="heart" data-index="0">❤️</div>
                        <div class="heart" data-index="1">💛</div>
                        <div class="heart" data-index="2">💙</div>
                        <div class="heart" data-index="3">💚</div>
                    </div>
                    <p class="memory-instructions">Click the hearts in the correct order</p>
                    <div class="memory-sequence" id="memory-sequence"></div>
                `;

                this.sequence = [];
                this.expectedSequence = [...challenge.puzzle];
                this.maxSequenceLength = challenge.puzzle.length;

                document.querySelectorAll('.heart').forEach(heart => {
                    heart.addEventListener('click', (e) => {
                        const index = parseInt(e.target.dataset.index);
                        this.sequence.push(index);

                        // Show visual feedback
                        e.target.style.transform = 'scale(1.3)';
                        setTimeout(() => {
                            e.target.style.transform = 'scale(1)';
                        }, 200);

                        // Add to sequence display
                        const sequenceDiv = document.getElementById('memory-sequence');
                        const dot = document.createElement('div');
                        dot.className = 'memory-dot';
                        dot.innerHTML = ['❤️', '💛', '💙', '💚'][index];
                        sequenceDiv.appendChild(dot);

                        // Check if sequence is complete
                        if (this.sequence.length === this.maxSequenceLength) {
                            setTimeout(() => {
                                this.checkMemorySequence();
                            }, 500);
                        }
                    });
                });
                break;

            case "emoji-picker":
                puzzleDiv.innerHTML = `
                    <div class="emoji-options">
                        ${challenge.puzzle.split('').map(emoji =>
                            `<div class="emoji-option" data-emoji="${emoji}">${emoji}</div>`
                        ).join('')}
                    </div>
                `;

                document.querySelectorAll('.emoji-option').forEach(option => {
                    option.addEventListener('click', () => {
                        // Remove selection from all
                        document.querySelectorAll('.emoji-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });

                        // Add selection to clicked
                        option.classList.add('selected');

                        // Auto-submit
                        document.getElementById(`input-${challenge.id}`).value = option.dataset.emoji;
                        this.checkAnswer(challenge);
                    });
                });
                break;

            default:
                puzzleDiv.innerHTML = `<strong>${challenge.puzzle}</strong>`;
                break;
        }
    }

    checkAnswer(challenge) {
        const input = document.getElementById(`input-${challenge.id}`);
        const feedback = document.getElementById(`feedback-${challenge.id}`);
        const userAnswer = input.value.trim();

        let isCorrect = false;

        switch (challenge.type) {
            case "word-scramble":
                isCorrect = userAnswer.toUpperCase() === challenge.answer.toUpperCase();
                break;

            case "number-sequence":
                isCorrect = !isNaN(userAnswer) && parseInt(userAnswer) === challenge.answer;
                break;

            case "math-puzzle":
                // For demo purposes, we'll accept any number or check against a reasonable answer
                isCorrect = !isNaN(userAnswer) && parseInt(userAnswer) === challenge.answer;
                break;

            case "emoji-picker":
                isCorrect = userAnswer === challenge.answer;
                break;

            case "combination":
                isCorrect = userAnswer.toLowerCase() === challenge.answer.toLowerCase();
                break;

            default:
                isCorrect = userAnswer.toLowerCase() === challenge.answer.toLowerCase();
                break;
        }

        if (isCorrect) {
            feedback.textContent = challenge.feedback;
            feedback.className = 'feedback correct';
            feedback.style.display = 'block';
            input.disabled = true;

            // Pulse the button briefly
            const btn = document.getElementById(`submit-${challenge.id}`);
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 2000);

            // Mark challenge as complete and load next
            setTimeout(() => {
                this.challengesCompleted++;
                this.updateProgress();
                this.currentChallengeIndex++;
                if (this.currentChallengeIndex < this.challenges.length) {
                    this.loadChallenge(this.currentChallengeIndex);
                } else {
                    this.showReward();
                }
            }, 1500);
        } else {
            feedback.textContent = "Try again! " + (challenge.hint ? `Hint: ${challenge.hint}` : "");
            feedback.className = 'feedback incorrect';
            feedback.style.display = 'block';
            input.value = '';
            input.focus();
        }
    }

    checkMemorySequence() {
        const feedback = document.getElementById('feedback-2');
        const input = document.getElementById('input-2');

        if (JSON.stringify(this.sequence) === JSON.stringify(this.expectedSequence)) {
            feedback.textContent = this.challenges[2].feedback;
            feedback.className = 'feedback correct';
            feedback.style.display = 'block';
            input.disabled = true;

            setTimeout(() => {
                this.challengesCompleted++;
                this.updateProgress();
                this.currentChallengeIndex++;
                if (this.currentChallengeIndex < this.challenges.length) {
                    this.loadChallenge(this.currentChallengeIndex);
                } else {
                    this.showReward();
                }
            }, 1500);
        } else {
            feedback.textContent = "Not quite right! Try remembering the sequence again.";
            feedback.className = 'feedback incorrect';
            feedback.style.display = 'block';
            this.sequence = [];
            document.getElementById('memory-sequence').innerHTML = '';

            // Shake the hearts briefly
            document.querySelectorAll('.heart').forEach(heart => {
                heart.style.animation = 'shake 0.5s';
                setTimeout(() => heart.style.animation = '', 500);
            });
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        const percentage = (this.challengesCompleted / this.totalChallenges) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Challenges completed: ${this.challengesCompleted}/${this.totalChallenges}`;

        // Change color based on progress
        if (percentage >= 80) {
            progressFill.style.background = 'linear-gradient(to right, #ff9ff3, #feca57)';
        } else if (percentage >= 60) {
            progressFill.style.background = 'linear-gradient(to right, #4cc9f0, #48cae4)';
        } else if (percentage >= 40) {
            progressFill.style.background = 'linear-gradient(to right, #a8edea, #fed6e3)';
        } else {
            progressFill.style.background = 'linear-gradient(to right, #ff9a9e, #fad0c4)';
        }
    }

    showReward() {
        document.getElementById('challenges').style.display = 'none';
        document.getElementById('reward-section').classList.remove('hidden');

        const rewardContent = document.getElementById('reward-content');
        rewardContent.innerHTML = `
            <div id="reward-message">${this.rewardMessage}</div>
            <img id="reward-image" src="${this.rewardImage}" alt="Birthday reward">
        `;

        // Add confetti effect
        this.createConfetti();

        // Play celebratory sound if possible
        this.playCelebrationSound();
    }

    createConfetti() {
        const container = document.getElementById('confetti-container');
        const colors = ['#ff9a9e', '#fad0c4', '#feca57', '#ff6b6b', '#4cc9f0', '#48cae4'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.borderRadius = '50%';
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetti);
        }
    }

    playCelebrationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio might not be supported or allowed, silently fail
            console.log("Audio playback not available:", e);
        }
    }

    restartGame() {
        // Reset all game state
        this.challengesCompleted = 0;
        this.currentChallengeIndex = 0;
        this.sequence = [];

        // Hide reward section, show challenges
        document.getElementById('reward-section').classList.add('hidden');
        document.getElementById('challenges').style.display = 'block';

        // Reset progress
        this.updateProgress();

        // Clear any existing confetti
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = '';

        // Reload first challenge
        this.loadChallenge(0);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayChallenge();
});