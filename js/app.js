
document.addEventListener("DOMContentLoaded", () => {
  const defaultPieces = [
    { nom: "Chambre", surface: 12, duree: 50 },
    { nom: "Salon / Séjour", surface: 25, duree: 41 },
    { nom: "Salle de bain", surface: 6.5, duree: 47 },
    { nom: "Cuisine", surface: 10, duree: 45 },
    { nom: "Entrée", surface: 6.5, duree: 8 }
  ];
  let pieces = JSON.parse(localStorage.getItem("pieces")) || defaultPieces;
  let coefCourant = parseFloat(localStorage.getItem("coefCourant")) || 1.10;
  let coefApprofondi = parseFloat(localStorage.getItem("coefApprofondi")) || 1.20;

  const container = document.getElementById("pieces-container");
  const entretienSelect = document.getElementById("entretien");

  function getCoefficient(niveau) {
    switch (niveau) {
      case "courant": return coefCourant;
      case "approfondi": return coefApprofondi;
      default: return 1;
    }
  }

  function ajouterPiece() {
    const ligne = document.createElement("div");
    ligne.className = "piece-ligne";

    const select = document.createElement("select");
    pieces.forEach(p => {
      const opt = document.createElement("option");
      opt.value = JSON.stringify(p);
      opt.textContent = `${p.nom}`;
      select.appendChild(opt);
    });

    const inputQte = document.createElement("input");
    inputQte.type = "number";
    inputQte.min = "1";
    inputQte.value = "1";

    const timeLabel = document.createElement("span");
    timeLabel.className = "duree-piece";

    const btnSuppr = document.createElement("button");
    btnSuppr.textContent = "❌";
    btnSuppr.onclick = () => {
      container.removeChild(ligne);
      calculer();
    };

    [select, inputQte].forEach(el => el.addEventListener("change", calculer));
    ligne.append(select, inputQte, timeLabel, btnSuppr);
    container.appendChild(ligne);
    calculer();
  }

  function formatMinutes(min) {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return `${h} h ${m.toString().padStart(2, '0')} min`;
  }

  function calculer() {
    let totalMin = 0;
    let totalSurface = 0;
    const coeff = getCoefficient(entretienSelect.value);

    document.querySelectorAll(".piece-ligne").forEach(ligne => {
      const piece = JSON.parse(ligne.children[0].value);
      const qte = parseInt(ligne.children[1].value);
      const timeLabel = ligne.querySelector(".duree-piece");

      const singleTime = piece.duree * coeff;
      const h = Math.floor(singleTime / 60);
      const m = Math.round(singleTime % 60);
      if (timeLabel) timeLabel.textContent = `(${h} h ${m.toString().padStart(2, '0')} min/pièce)`;

      totalMin += piece.duree * qte * coeff;
      totalSurface += piece.surface * qte;
    });

    document.getElementById("total-temps").textContent = formatMinutes(totalMin);
    document.getElementById("total-surface").textContent = `${totalSurface.toFixed(1)} m²`;
  }

  window.ajouterPiece = ajouterPiece;
  entretienSelect.addEventListener("change", calculer);
  ajouterPiece();
});
