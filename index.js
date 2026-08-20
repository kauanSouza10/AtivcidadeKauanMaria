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

const database = mysql.createConnection({
    ...config,
    database: "alunos_filmes03MB"
});

database.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Conectado ao banco de dados!");
    }
});

app.get("/", (request, response) => {
    response.json({
        mensagem: "API de filmes funcionando!"
    });
});

app.get("/all-filmes", (request, response) => {

    const selectCommand = "SELECT * FROM filmes_KauanMaria";

    database.query(selectCommand, (error, data) => {

        if (error) {
            console.log(error);
        } else {
            response.json(data);
        }

    });

});

app.get("/filmes/:id", (request, response) => {

    const { id } = request.params;

    const selectCommand = `
        SELECT *
        FROM filmes_KauanMaria
        WHERE id = ?
    `;

    database.query(selectCommand, [id], (error, data) => {

        if (error) {
            console.log(error);
        } else {

            if (data.length === 0) {
                response.status(404).json({
                    mensagem: "Filme não encontrado."
                });
            } else {
                response.json(data[0]);
            }

        }

    });

});

app.post("/create-filme", (request, response) => {

    const {
        title,
        genre,
        duration,
        age_rating
    } = request.body;

    const insertCommand = `
        INSERT INTO filmes_KauanMaria
        (title, genre, duration, age_rating)
        VALUES (?, ?, ?, ?)
    `;

    database.query(
        insertCommand,
        [title, genre, duration, age_rating],
        (error, data) => {

            if (error) {
                console.log(error);
            } else {
                response.json({
                    mensagem: "Filme criado com sucesso!",
                    id: data.insertId
                });
            }

        }
    );

});

app.put("/update-filme/:id", async (request, response) => {

    const { id } = request.params;

    const {
        title,
        genre,
        duration,
        age_rating
    } = request.body;

    const selectFilmeCommand = `
        SELECT *
        FROM filmes_KauanMaria
        WHERE id = ?
    `;

    const filme = await database.promise().query(
        selectFilmeCommand,
        [id]
    );

    if (filme[0].length === 0) {
        return response.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    const updateCommand = `
        UPDATE filmes_KauanMaria
        SET title = ?,
            genre = ?,
            duration = ?,
            age_rating = ?
        WHERE id = ?
    `;

    database.query(
        updateCommand,
        [title, genre, duration, age_rating, id],
        (error) => {

            if (error) {
                console.log(error);
            } else {
                response.json({
                    mensagem: "Filme atualizado com sucesso!"
                });
            }

        }
    );

});

app.delete("/delete-filme/:id", (request, response) => {

    const { id } = request.params;

    const deleteCommand = `
        DELETE FROM filmes_KauanMaria
        WHERE id = ?
    `;

    database.query(deleteCommand, [id], (error, data) => {

        if (error) {
            console.log(error);
        } else {

            if (data.affectedRows === 0) {
                response.status(404).json({
                    mensagem: "Filme não encontrado."
                });
            } else {
                response.json({
                    mensagem: "Filme excluído com sucesso!"
                });
            }

        }

    });

});

app.listen(3333, () => {
    console.log("Servidor online");
});