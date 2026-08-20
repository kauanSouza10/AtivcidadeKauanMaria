async function buscarFilmes() {
    // através do acesso a rota GET, trazer os filmes e mostrar na tela
    const resposta = await fetch("https://ativcidade-kauan-maria.vercel.app/");
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