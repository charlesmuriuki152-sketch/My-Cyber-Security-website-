// ======================================
// PROJECT AEGIS v2
// CERTIFICATE ENGINE
// ======================================

async function loadCertificates() {

    try {

        const response = await fetch(
            "certificates/certificates.json"
        );

        const certificates = await response.json();

        const container = document.getElementById(
            "certificates-container"
        );

        certificates.forEach(cert => {

            const card = document.createElement("div");

            card.className = "certificate-card";

            card.innerHTML = `

                <h3>${cert.name}</h3>

                <p>
                <strong>Issuer:</strong>
                ${cert.issuer}
                </p>

                <p>
                <strong>Year:</strong>
                ${cert.year}
                </p>

                <p>
                <strong>Skills:</strong>
                ${cert.skills.join(", ")}
                </p>

                <a href="${cert.certificate}">
                View Certificate
                </a>

                <a href="${cert.github}" target="_blank">
                View GitHub
                </a>

            `;

            container.appendChild(card);

        });

    } catch(error) {

        console.error(
            "AEGIS Certificate Engine Error:",
            error
        );

    }

}


loadCertificates();
