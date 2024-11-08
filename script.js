document.querySelectorAll(".faq-grid-question").forEach((question) => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;

        question.classList.toggle('active');

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});