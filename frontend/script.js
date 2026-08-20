async function buscarFilmes() {
    const resposta = await fetch("https://ativcidade-kauan-maria.vercel.app/all-filmes");

    const filmes = await resposta.json();

    const sectionFilmes = document.querySelector(".filmes");

    filmes.forEach((filme) => {
        sectionFilmes.innerHTML += `
            <div>
                <h2>${filme.title}</h2>
                <p><strong>Gênero:</strong> ${filme.genre}</p>
                <p><strong>Duração:</strong> ${filme.duration} minutos</p>
                <p><strong>Classificação indicativa:</strong> ${filme.age_rating}</p>
            </div>
        `;
    });
}

buscarFilmes();