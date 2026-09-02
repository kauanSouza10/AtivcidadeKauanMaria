const API = "https://ativcidade-kauan-maria-j56l.vercel.app";

async function buscarFilmes() {

    const resposta = await fetch(`${API}/all-filmes`);

    const filmes = await resposta.json();

    const sectionFilmes = document.querySelector(".filmes");

    sectionFilmes.innerHTML = "";

    filmes.forEach((filme) => {

        sectionFilmes.innerHTML += `
            <div class="filme">

                <h2>${filme.title}</h2>

                <p>
                    <strong>ID:</strong> ${filme.id}
                </p>

                <p>
                    <strong>Gênero:</strong> ${filme.genre}
                </p>

                <p>
                    <strong>Duração:</strong> ${filme.duration} minutos
                </p>

                <p>
                    <strong>Classificação indicativa:</strong>
                    ${filme.age_rating}
                </p>

                <button onclick="apagarFilme(${filme.id}, '${filme.title.replace(/'/g, "\\'")}')">
                    Apagar filme
                </button>

            </div>
        `;
    });
}


async function apagarFilme(id, titulo) {

    const confirmar = confirm(
        `Deseja apagar o filme "${titulo}"?`
    );

    if (!confirmar) {
        return;
    }

    const resposta = await fetch(
        `${API}/delete-filme/${id}`,
        {
            method: "DELETE"
        }
    );

    if (resposta.ok) {

        buscarFilmes();

    } else {

        alert("Erro ao apagar o filme!");

    }
}


buscarFilmes();