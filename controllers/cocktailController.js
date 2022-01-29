const db = require("../lib/db.js");

exports.create = (req, res, next) => {
    var ice = req.body.ice;
    var crushed_ice = req.body.crushed_ice;
    var name = req.body.name;
    var description = req.body.description;
    var ingredients = [req.body.ingredients];

    //überprüfen das die var nur 0 oder 1 sind
    ice = ice === 1 ? 1 : 0;
    if (crushed_ice != 1) crushed_ice = 0;

    name = db.escape(name);
    description = db.escape(description);
    ice = db.escape(ice);
    crushed_ice = db.escape(crushed_ice);

    const query = `INSERT INTO cocktails (id, name, description, ice, crushed_ice) VALUES (NULL, ${name}, ${description}, ${ice}, ${crushed_ice})`;

    db.query(query)
        .then((result_cocktail) => {
            GetIngredients(ingredients, result_cocktail, returnIngredients);
        })
        .catch((err) => res.status(400).send({ msg: err }));

    const returnIngredients = (recipes, result_cocktail) => {
        return res.status(201).send({
            msg: "Cocktail erstellt",
            cocktail: {
                id: result_cocktail.insertId,
                ice: ice,
                crushed_ice: crushed_ice,
                name: req.body.name,
                ingredients: recipes,
            },
        });
    };

    const GetIngredients = (ingredients, result_cocktail, returnIngredients) => {
        const recipes = [];
        const ingredientsCount = ingredients.length;
        ingredients[0].forEach((ingredient, i) => {
            (Number.isInteger(ingredient["unit_id"]) && Number.isInteger(ingredient["ingredient_id"]))
                .then(() => {
                    const cocktail_id = result_cocktail.insertId;
                    const unit_id = db.escape(ingredient["unit_id"]);
                    const ingredient_id = db.escape(ingredient["ingredient_id"]);
                    const amount = db.escape(ingredient["amount"]);

                    const query = `INSERT INTO recipes (id, cocktail_id, ingredient_id, amount, unit_id) SELECT NULL, ${cocktail_id}, ${ingredient_id}, ${amount}, ${unit_id}`;

                    db.query(query)
                        .then((result_recipe) => {
                            recipes.push(GetIngredients(ingredients, result_recipe));

                            if (i === ingredientsCount) {
                                returnIngredients(recipes, result_cocktail);
                            }
                        })
                        .catch((err) => res.status(400).send({ msg: err }));
                })
                .catch(() =>
                    res.status(400).send({
                        msg: "Fehlerhafte Eingabe",
                    })
                );
        });
    };
};
