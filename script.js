// On importe les questions depuis un autre fichier JavaScript
import { Questions } from "./question.js";

// On sélectionne l'élément HTML où le quiz va s’afficher
const app = document.querySelector("#app");

// On sélectionne le bouton "start"
const startbutton = document.querySelector("#start");

// On écoute l’événement de clic sur le bouton "start" pour démarrer le quiz
startbutton.addEventListener("click", startQuiz);

// Fonction principale qui démarre le quiz
function startQuiz(event) {
  event.stopPropagation(); // Empêche la propagation de l'événement au parent

  let currentQuestion = 0; // Index de la question en cours
  let score = 0; // Score initial du joueur

  // Fonction pour nettoyer le contenu de l'élément #app avant chaque nouvelle question
  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove(); // Supprime tous les enfants de #app
    }
    // Ajoute une barre de progression mise à jour
    const progressBar = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progressBar);
  }

  // Fonction qui affiche une question donnée par son index
  function displayQuestion(index) {
    clean(); // Nettoie l’interface pour afficher la nouvelle question

    const question = Questions[index]; // Récupère l’objet question à cet index

    if (!question) {
      displayFinishMessage(); // Si plus de question, on affiche le message final
      return;
    }

    // Création et affichage du titre (la question)
    const title = getTitleElement(question.question);
    app.appendChild(title);

    // Création et affichage des réponses
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    // Création du bouton de soumission
    const submitButton = getSubmitButton();

    // Quand on clique sur "Submit", on vérifie la réponse
    submitButton.addEventListener("click", submit);

    // On ajoute le bouton à l’interface
    app.appendChild(submitButton);
  }

  // Fonction affichant le message final quand le quiz est terminé
  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = `Quiz finished! Your score is ${score} out of ${Questions.length}`;
    app.appendChild(h1);
  }

  // Fonction qui gère la soumission de la réponse
  function submit() {
    const selectedAnswer = document.querySelector("input[name='answer']:checked"); // réponse cochée

    const value = selectedAnswer.value; // texte de la réponse choisie

    const question = Questions[currentQuestion]; // question actuelle

    const isCorrect = value === question.correct; // vérifie si la réponse est correcte

    if (isCorrect) {
      score++; // Incrémente le score si c'est correct
    }

    // Affiche un retour visuel (rouge ou vert)
    showFeedback(isCorrect, question.correct, value);

    // Passe à la question suivante après 1 seconde
    setTimeout(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    }, 1000);
  }

  // Fonction qui crée les réponses sous forme de boutons radio
  function createAnswers(answers) {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers"); // Pour le style

    for (const answer of answers) {
      const label = getAnswerElement(answer); // Crée un label + input
      answersDiv.appendChild(label);
    }

    return answersDiv;
  }

  // Affiche la première question
  displayQuestion(currentQuestion);
}

// Crée un élément <h3> pour afficher une question
function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

// Formate une chaîne de caractères en identifiant CSS-safe
function formatId(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")          // remplace les espaces par des tirets
    .replace(/[^a-z0-9\-]/g, "");  // supprime tous les caractères spéciaux
}

// Crée un élément <label> contenant un input radio pour une réponse
function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;

  const input = document.createElement("input");

  const id = formatId(text); // On génère un ID propre
  input.id = id;
  label.htmlFor = id;

  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);

  // On met l'input à l'intérieur du label
  label.appendChild(input);

  return label;
}

// Crée un bouton "Submit"
function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  app.appendChild(submitButton); // Il est aussi retourné et réutilisé
  return submitButton;
}

// Fonction pour afficher le retour visuel après une réponse
function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct); // ID de la bonne réponse
  const correctElement = document.querySelector(`label[for="${correctAnswerId}"]`);

  const selectedAnswerId = formatId(answer); // ID de la réponse choisie
  const selectedElement = document.querySelector(`label[for="${selectedAnswerId}"]`);

  if (isCorrect) {
    selectedElement.classList.add("correct"); // Bonne réponse => vert
  } else {
    selectedElement.classList.add("incorrect"); // Mauvaise réponse => rouge
    correctElement.classList.add("correct");    // Met aussi la bonne réponse en vert
  }
}

// Crée une barre de progression HTML
function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);   // nombre total de questions
  progress.setAttribute("value", value); // question actuelle
  return progress;
}
