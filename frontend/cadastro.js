const API = "https://ativcidade-kauan-maria-j56l.vercel.app";

async function cadastrarFilme() {

    const title = document.querySelector("#title").value;
    const genre = document.querySelector("#genre").value;
    const duration = document.querySelector("#duration").value;
    const age_rating = document.querySelector("#age_rating").value;

    if (!title || !genre || !duration || !age_rating) {
        document.querySelector("#mensagem").textContent =
            "Preencha todos os campos!";
        return;
    }

    const resposta = await fetch(`${API}/create-filme`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            genre: genre,
            duration: Number(duration),
            age_rating: age_rating
        })
    });

    if (resposta.ok) {

        alert(`Filme "${title}" cadastrado com sucesso!`);

        window.location.href = "index.html";

    } else {

        document.querySelector("#mensagem").textContent =
            "Erro ao cadastrar o filme!";
    }
}