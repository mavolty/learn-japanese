/* ===================================================================
   Reusable lesson widgets. Linked by every lesson.
   Two zero-config behaviours, wired up on DOMContentLoaded:

   1. .quiz  — multiple-choice recall with instant feedback + score.
       <div class="quiz" data-good="Tepat!" data-bad="Belum, coba lagi.">
         <div class="quiz-q" data-answer="a">
           <div class="prompt">...</div>
           <div class="quiz-choices">
             <button data-choice="a">a</button> ...
           </div>
           <div class="quiz-fb"></div>
         </div>
       </div>

   2. .flip  — click-to-reveal self-test card.
       <div class="flip"><span class="face-front">あ</span>
                         <span class="face-back">a</span></div>
   =================================================================== */

(function () {
  "use strict";

  function initQuiz(quiz) {
    var questions = quiz.querySelectorAll(".quiz-q");
    var goodMsg = quiz.getAttribute("data-good") || "Betul!";
    var badMsg = quiz.getAttribute("data-bad") || "Hampir! Itu jawaban lain.";
    var total = questions.length;
    var answered = 0, correct = 0;

    var score = document.createElement("div");
    score.className = "quiz-score";
    score.textContent = "Skor: 0 / " + total;
    quiz.appendChild(score);

    questions.forEach(function (q) {
      var answer = q.getAttribute("data-answer");
      var fb = q.querySelector(".quiz-fb");
      var buttons = q.querySelectorAll(".quiz-choices button");
      var locked = false;

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (locked) return;
          locked = true;
          var choice = btn.getAttribute("data-choice");
          var isRight = choice === answer;

          buttons.forEach(function (b) {
            b.disabled = true;
            if (b.getAttribute("data-choice") === answer) b.classList.add("is-correct");
          });
          if (!isRight) btn.classList.add("is-wrong");

          if (fb) {
            fb.textContent = isRight ? goodMsg : badMsg + " (jawabannya disorot hijau)";
            fb.className = "quiz-fb " + (isRight ? "good" : "bad");
          }

          answered++;
          if (isRight) correct++;
          score.textContent = "Skor: " + correct + " / " + total;
          if (answered === total) {
            score.textContent += correct === total
              ? "  — sempurna! 🎌"
              : "  — ulangi yang merah ya.";
          }
        });
      });
    });
  }

  function initFlip(card) {
    card.addEventListener("click", function () {
      card.classList.toggle("revealed");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz").forEach(initQuiz);
    document.querySelectorAll(".flip").forEach(initFlip);
  });
})();
