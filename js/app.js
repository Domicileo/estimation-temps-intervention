
document.addEventListener("DOMContentLoaded", () => {
  const defaultPieces = [
    { nom: "Salon", surface: 25, duree: 38 },
    { nom: "Cuisine", surface: 10, duree: 45 },
    { nom: "Salle de bain", surface: 6.5, duree: 43 },
    { nom: "Entrée", surface: 6.5, duree: 8 }
  ];

  let pieces = JSON.parse(localStorage.getItem("pieces"));
  if (!pieces || pieces.length === 0) {
    pieces = defaultPieces;
    localStorage.setItem("pieces", JSON.stringify(pieces));
  }

  const coefCourant = parseFloat(localStorage.getItem("coefCourant")) || 1.10;
  const coefApprofondi = parseFloat(localStorage.getItem("coefApprofondi")) || 1.20;

  const selectPiece = document.getElementById("select-piece");
  const quantiteInput = document.getElementById("quantite");
  const entretienSelect = document.getElementById("entretien");
  const resultatDiv = document.getElementById("resultat");

  let estimationTotale = 0;

  function chargerPieces() {
    selectPiece.innerHTML = "";
    pieces.forEach(piece => {
      const option = document.createElement("option");
      option.value = JSON.stringify(piece);
      option.textContent = `${piece.nom} (${piece.duree} min)`;
      selectPiece.appendChild(option);
    });
  }

  function getCoefficient(entretien) {
    switch (entretien) {
      case "courant": return coefCourant;
      case "approfondi": return coefApprofondi;
      default: return 1;
    }
  }

  function ajouterIntervention() {
    if (!selectPiece.value) return;
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

  window.ajouterIntervention = ajouterIntervention;
  chargerPieces();
});
