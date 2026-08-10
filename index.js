import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const config = {
    host: "benserverplex.ddns.net",
    port: 3306,
    user: "alunos",
    password: "senhaAlunos"
};

const conexaoInicial = mysql.createConnection(config);

conexaoInicial.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao MySQL:", erro);
        return;
    }

    console.log("Conectado ao MySQL!");

    conexaoInicial.query(
        "CREATE DATABASE IF NOT EXISTS alunos_filmes03MB",
        (erro) => {
            if (erro) {
                console.error("Erro ao criar banco:", erro);
                return;
            }

            console.log("Banco alunos_filmes03MB pronto!");

            conexaoInicial.end();

            iniciarAplicacao();
        }
    );
});

function iniciarAplicacao() {

    const db = mysql.createConnection({
        host: "benserverplex.ddns.net",
        port: 3306,
        user: "alunos",
        password: "senhaAlunos",
        database: "alunos_filmes03MB"
    });

    db.connect((erro) => {
        if (erro) {
            console.error("Erro ao conectar ao banco:", erro);
            return;
        }

        console.log("Conectado ao banco alunos_filmes03MB!");

        criarTabela();
    });

    function criarTabela() {

        const sql = `
            CREATE TABLE IF NOT EXISTS filmes_KauanMaria (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                title VARCHAR(255) NOT NULL,
                genre VARCHAR(100) NOT NULL,
                duration INT NOT NULL,
                age_rating VARCHAR(20) NOT NULL
            )
        `;

        db.query(sql, (erro) => {
            if (erro) {
                console.error("Erro ao criar tabela:", erro);
                return;
            }

            console.log("Tabela filmes_KauanMaria pronta!");

            inserirFilmes();
        });
    }

    function inserirFilmes() {

        const verificar = `
            SELECT COUNT(*) AS total
            FROM filmes_KauanMaria
        `;

        db.query(verificar, (erro, resultado) => {

            if (erro) {
                console.error("Erro ao verificar filmes:", erro);
                return;
            }

            if (resultado[0].total === 0) {

                const filmes = [
                    ["Vingadores: Ultimato", "Ação", 181, "12 anos"],
                    ["Titanic", "Romance", 195, "12 anos"],
                    ["Avatar", "Ficção Científica", 162, "12 anos"],
                    ["Jurassic Park", "Aventura", 127, "12 anos"],
                    ["Toy Story", "Animação", 81, "Livre"],
                    ["O Rei Leão", "Animação", 88, "Livre"],
                    ["Homem-Aranha", "Ação", 121, "12 anos"],
                    ["Batman Begins", "Ação", 140, "12 anos"],
                    ["Shrek", "Comédia", 90, "Livre"],
                    ["Frozen", "Animação", 102, "Livre"],
                    ["Harry Potter e a Pedra Filosofal", "Fantasia", 152, "Livre"],
                    ["Interestelar", "Ficção Científica", 169, "10 anos"]
                ];

                const sql = `
                    INSERT INTO filmes_KauanMaria
                    (title, genre, duration, age_rating)
                    VALUES ?
                `;

                db.query(sql, [filmes], (erro) => {

                    if (erro) {
                        console.error("Erro ao inserir filmes:", erro);
                        return;
                    }

                    console.log("12 filmes cadastrados com sucesso!");
                });

            } else {
                console.log("Os filmes já estão cadastrados.");
            }
        });
    }

    app.get("/", (request, response) => {
        response.json({
            mensagem: "API de filmes funcionando!"
        });
    });

    app.get("/filmes", (request, response) => {

        const sql = `
            SELECT *
            FROM filmes_KauanMaria
            ORDER BY id
        `;

        db.query(sql, (erro, resultado) => {

            if (erro) {
                return response.status(500).json({
                    erro: erro.message
                });
            }

            response.json(resultado);
        });
    });

    app.get("/filmes/:id", (request, response) => {

        const id = request.params.id;

        const sql = `
            SELECT *
            FROM filmes_KauanMaria
            WHERE id = ?
        `;

        db.query(sql, [id], (erro, resultado) => {

            if (erro) {
                return response.status(500).json({
                    erro: erro.message
                });
            }

            if (resultado.length === 0) {
                return response.status(404).json({
                    mensagem: "Filme não encontrado."
                });
            }

            response.json(resultado[0]);
        });
    });

    app.post("/filmes", (request, response) => {

        const {
            title,
            genre,
            duration,
            age_rating
        } = request.body;

        if (!title || !genre || !duration || !age_rating) {
            return response.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }

        const sql = `
            INSERT INTO filmes_KauanMaria
            (title, genre, duration, age_rating)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [title, genre, duration, age_rating],
            (erro, resultado) => {

                if (erro) {
                    return response.status(500).json({
                        erro: erro.message
                    });
                }

                response.status(201).json({
                    mensagem: "Filme adicionado com sucesso!",
                    id: resultado.insertId
                });
            }
        );
    });

    app.put("/filmes/:id", (request, response) => {

        const id = request.params.id;

        const {
            title,
            genre,
            duration,
            age_rating
        } = request.body;

        if (!title || !genre || !duration || !age_rating) {
            return response.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }

        const sql = `
            UPDATE filmes_KauanMaria
            SET title = ?,
                genre = ?,
                duration = ?,
                age_rating = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [title, genre, duration, age_rating, id],
            (erro, resultado) => {

                if (erro) {
                    return response.status(500).json({
                        erro: erro.message
                    });
                }

                if (resultado.affectedRows === 0) {
                    return response.status(404).json({
                        mensagem: "Filme não encontrado."
                    });
                }

                response.json({
                    mensagem: "Filme atualizado com sucesso!"
                });
            }
        );
    });

    app.delete("/filmes/:id", (request, response) => {

        const id = request.params.id;

        const sql = `
            DELETE FROM filmes_KauanMaria
            WHERE id = ?
        `;

        db.query(sql, [id], (erro, resultado) => {

            if (erro) {
                return response.status(500).json({
                    erro: erro.message
                });
            }

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    mensagem: "Filme não encontrado."
                });
            }

            response.json({
                mensagem: "Filme excluído com sucesso!"
            });
        });
    });

    app.listen(3333, () => {
        console.log("Servidor online na porta 3333");
    });
}