// Récupération des données personnalisées
const pieces = JSON.parse(localStorage.getItem("pieces")) || [];
const coefCourant = parseFloat(localStorage.getItem("coefCourant")) || 1.10;
const coefApprofondi = parseFloat(localStorage.getItem("coefApprofondi")) || 1.20;

const selectPiece = document.getElementById("select-piece");
const quantiteInput = document.getElementById("quantite");
const entretienSelect = document.getElementById("entretien");
const resultatDiv = document.getElementById("resultat");

let estimationTotale = 0;

// Remplir la liste déroulante avec les pièces
function chargerPieces() {
  pieces.forEach(piece => {
    const option = document.createElement("option");
    option.value = JSON.stringify(piece);
    option.textContent = `${piece.nom} (${piece.duree} min)`;
    selectPiece.appendChild(option);
  });
}

// Calcul du coefficient
function getCoefficient(entretien) {
  switch (entretien) {
    case "courant": return coefCourant;
    case "approfondi": return coefApprofondi;
    default: return 1;
  }
}

// Ajouter une intervention à l’estimation
function ajouterIntervention() {
  const piece = JSON.parse(selectPiece.value);
  const quantite = parseInt(quantiteInput.value);
  const entretien = entretienSelect.value;

  const coeff = getCoefficient(entretien);
  const temps = piece.duree * quantite * coeff;

  estimationTotale += temps;
  afficherResultat();
}

function afficherResultat() {
  resultatDiv.textContent = `Temps total estimé : ${Math.round(estimationTotale)} minutes.`;
}

// Initialisation
chargerPieces();