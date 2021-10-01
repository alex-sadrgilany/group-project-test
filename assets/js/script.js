var currentDiceRoll;

var currentPokeId;

var userPokeObj = {
    health: 100,
    attack: 20,
    effective: 40,
    noteffective: 5
}

var enemyPokeObj = {
    health: 100,
    attack: 20,
    effective: 40,
    noteffective: 5
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    var pokeName = $("#poke-input").val().trim();

    // make sure the user entered something
    if (pokeName) {
        fetchPokemon(pokeName);
        fetchOpponent("d151");
        $("#poke-input").val("");
        $(".battle").show();
    }
    else {
        // enter alert substitute if user doesn't enter anything
    }
}

var fetchPokemon = function(poke) {

    var apiUrl = "https://pokeapi.co/api/v2/pokemon/" + poke;

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var currentPokeId = data.id;
                    displayPokemon(data);
                    console.log(currentPokeId);
                })
            }
            else {
                // alert replacement
            }
        })
}

var displayPokemon = function(pokeData) {

    $(".poke").empty();

    var userPoke = pokeData.name;
    var frontSprite = pokeData.sprites.front_shiny;
    var backSprite = pokeData.sprites.back_shiny;

    userPokeObj.front = frontSprite;
    userPokeObj.back = backSprite;

    var pokeHeader = $("<h2></h2>");
    pokeHeader.text(userPoke);
    $(".poke").append(pokeHeader);

    var newImgEl = $("<img/>");
    newImgEl.attr("src", frontSprite);
    $(".poke").append(newImgEl);
}

var fetchOpponent = function(dice) {

    var sides = dice;
    var apiUrl = "http://roll.diceapi.com/json/" + sides;

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var result = data.dice[0].value;
                    
                    var newUrl = "https://pokeapi.co/api/v2/pokemon/" + result;

                    if (result === currentPokeId) {
                        console.log("test");
                        fetchOpponent(dice);
                    }
                    else {
                        fetch(newUrl).then(function(response) {
                            if (response.ok) {
                                response.json().then(function(data2) {
                                    displayOpponent(data2);
                                })
                            }
                            else {
                                // alert replacement
                            }
                        })
                    }
                })
            }
            else {
                // alert replacement here
            }
        })

}

var displayOpponent = function(pokeData) {

    $(".opponent").empty();

    var opponentPoke = pokeData.name;
    var frontSprite = pokeData.sprites.front_shiny;
    var backSprite = pokeData.sprites.back_shiny;

    enemyPokeObj.front = frontSprite;
    enemyPokeObj.back = backSprite;

    var pokeHeader = $("<h2></h2>");
    pokeHeader.text(opponentPoke);
    $(".opponent").append(pokeHeader);

    var newImgEl = $("<img/>");
    newImgEl.attr("src", frontSprite);
    $(".opponent").append(newImgEl);
}

var userAttack = function(dice) {
    
    var sides = dice;
    var apiUrl = "http://roll.diceapi.com/json/" + sides;

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var result = data.dice[0].value;
                    
                    // dice rolls for different attacks
                    if (result === 1) {
                        // miss attack
                        enemyAttack("d4");
                    }
                    else if (result === 2) {
                        // regular attack
                        enemyPokeObj.health -= userPokeObj.attack;
                        console.log(enemyPokeObj.health);
                        checkHealth();
                        enemyAttack("d4");
                    }
                    else if (result === 3) {
                        // super effective attack
                        enemyPokeObj.health -= userPokeObj.effective;
                        console.log(enemyPokeObj.health);
                        checkHealth();
                        enemyAttack("d4");
                    }
                    else if (result === 4) {
                        // not very effective attack
                        enemyPokeObj.health -= userPokeObj.noteffective;
                        console.log(enemyPokeObj.health);
                        checkHealth();
                        enemyAttack("d4");
                    }
                })
            }
            else {
                // alert replacement here
            }
        })
}

var enemyAttack = function(dice) {

    var sides = dice;
    var apiUrl = "http://roll.diceapi.com/json/" + sides;

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var result = data.dice[0].value;
                    
                    // dice rolls for different attacks
                    if (result === 1) {
                        // miss attack
                    }
                    else if (result === 2) {
                        // regular attack
                        userPokeObj.health -= enemyPokeObj.attack;
                        console.log(enemyPokeObj.health);
                        checkHealth();
                    }
                    else if (result === 3) {
                        // super effective attack
                        userPokeObj.health -= enemyPokeObj.effective;
                        console.log(enemyPokeObj.health);
                        checkHealth();
                    }
                    else if (result === 4) {
                        // not very effective attack
                        userPokeObj.health -= enemyPokeObj.noteffective;
                        console.log(enemyPokeObj.health);
                        checkHealth();
                    }
                })
            }
            else {
                // alert replacement here
            }
        })
}

var checkHealth = function() {
    
    if (userPokeObj.health <= 0 || enemyPokeObj.health <= 0) {
        //game over screen
    }
}

var fightSequenece = function() {
    checkHealth();
    userAttack("d4");
}

$("#poke-form").on("submit", formSubmitHandler);

$("#attack").on("click", fightSequenece);