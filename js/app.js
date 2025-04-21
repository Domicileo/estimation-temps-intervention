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

    const btnSuppr = document.createElement("button");
    btnSuppr.textContent = "❌";
    btnSuppr.onclick = () => {
      container.removeChild(ligne);
      calculer();
    };

    [select, inputQte].forEach(el => el.addEventListener("change", calculer));
    ligne.append(select, inputQte, btnSuppr);
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
      totalMin += piece.duree * qte * coeff;
      totalSurface += piece.surface * qte;
    });

    document.getElementById("total-temps").textContent = formatMinutes(totalMin);
    document.getElementById("total-surface").textContent = `${totalSurface.toFixed(1)} m²`;
  }

  window.ajouterPiece = ajouterPiece;
  
function exporterPDF() {
  const nom = document.getElementById("nom").value || "Nom";
  const prenom = document.getElementById("prenom").value || "Prénom";
  const entretien = document.getElementById("entretien").value;

  let doc = new window.jspdf.jsPDF();
  doc.setFontSize(16);
  doc.text(`Estimation d'intervention`, 10, 20);
  doc.setFontSize(12);
  doc.text(`Client : ${prenom} ${nom}`, 10, 30);
  doc.text(`Niveau d'entretien : ${entretien}`, 10, 40);

  let y = 50;
  doc.text('Pièces :', 10, y);
  y += 10;

  let totalMin = 0;
  let totalSurface = 0;
  const coeff = entretien === 'courant' ? 1.10 : entretien === 'approfondi' ? 1.20 : 1;

  document.querySelectorAll(".piece-ligne").forEach((ligne, i) => {
    const piece = JSON.parse(ligne.children[0].value);
    const qte = parseInt(ligne.children[1].value);
    const duree = piece.duree * qte * coeff;
    const surface = piece.surface * qte;
    totalMin += duree;
    totalSurface += surface;
    doc.text(`- ${piece.nom} x${qte} : ${Math.round(duree)} min, ${surface.toFixed(1)} m²`, 10, y);
    y += 8;
  });

  y += 10;
  const heures = Math.floor(totalMin / 60);
  const minutes = Math.round(totalMin % 60);
  doc.text(`Temps total : ${heures} h ${minutes} min`, 10, y);
  y += 8;
  doc.text(`Surface totale : ${totalSurface.toFixed(1)} m²`, 10, y);

  doc.save(`estimation_${prenom}_${nom}.pdf`);
}


  entretienSelect.addEventListener("change", calculer);
  ajouterPiece();
});
