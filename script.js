//Třída1 - pamatující pozici hráče, informací o levelu/smrtech/souřadnic

class Player {
	#x;
	#y;
	#level;
	#deaths;
	#level_deaths;
	#deaths_total;

	constructor() {
		this.#level = 1;
		this.#x = 2;
		this.#y = 2;
		this.#deaths = 0;
		this.#level_deaths = 0;
		this.#deaths_total = localStorage.getItem("minefield-escape-total-deaths");

	}

//zjištování XY polohy hráče při potřebě
	get_x() {
		return this.#x;
	}

	get_y() {
		return this.#y;
	}

	
//definice funkcí pro jiné třídy
	set_x(x) {
		this.#x = x;
	}

	set_y(y) {
		this.#y = y;
	}

	get_level() {
		return this.#level;
	}

	get_deaths() {
		return this.#deaths;
	}

	get_level_deaths() {
		return this.#level_deaths;
	}

	die() {
		this.#deaths++;
		this.#level_deaths++;
		this.#deaths_total++;
		localStorage.setItem("minefield-escape-total-deaths", this.#deaths_total);
	}

	// výpočty pro nový level
	levelup() {
		this.#level++; 
		this.#x = this.#level + 1; //střed
		this.#y = this.#x; //(jelikož je pole čtverec)
		this.#level_deaths = 0; //zatím jsme v tomto novém levelu neumřeli
	}
}



//Třída 2 - aktualizující vykreslování plochy

class Renderer {
	constructor() {}

	//level splněn/game over => mažou se veškerá grafika
	full_render(player, grid, gameover) {
		let gamediv = document.getElementById("game");
		gamediv.innerHTML = "";
		let table = document.createElement("table");
		let size = 3 + player.get_level() * 2; //formula nové velikosti pole
		
		
		for(let i = 0; i < size; i++) {
			let el = document.createElement("tr");  //pro každý i se tvoří řádek html tabulky
			for(let j = 0; j < size; j++) {
			
				let tile = document.createElement("td"); //pro každý j se tvoří buňka řádku tabulky
				tile.setAttribute("id", "x_" + j + "y_" + i); //registrování html id políček
				
				if(gameover == true && grid[j][i] == true) {
					tile.innerHTML = "<img src='mine.png'>"; //obrázek miny
					
				} else if(j == player.get_x() && i == player.get_y()) { 
					tile.innerHTML = "<img src='player.png'>"; //obrazek panáčka
				}
				el.appendChild(tile); //vkládá vytvořený td do tr
			}
			table.appendChild(el); //vkládá tr do tabulky
		}
		
		gamediv.appendChild(table); //vloží table do divu

		//načtení zobrazení statistiky napravo nahoře
		let aside = document.getElementById("aside");
		aside.innerHTML = "<b>Level: <b>" + player.get_level() + "<br>";
		aside.innerHTML += "<b>Deaths: <b>" + player.get_deaths() + "<br>";
		aside.innerHTML += "<b>Deaths this level: <b>" + player.get_level_deaths() + "<br><br>";
		aside.innerHTML += "<b>Top level reached: <b>" + localStorage.getItem("minefield-escape-hiscore") + "<br><br>";
		aside.innerHTML += "<b>Total deaths: <b>" + localStorage.getItem("minefield-escape-total-deaths") + "<br><br>";
		aside.innerHTML += `<button id="hardmode-btn" onclick="toggleHardmode(this)">Hardmode</button>`;
	}

	//rendruje jenom hrace
	render(player) {
		let size = 3 + player.get_level() * 2;

		//OPTIMALIZACE - renderuje jenom 3x3 kolem hráče
		for(let i = player.get_x() - 1; i < player.get_x() + 2; i++) {
			for(let j = player.get_y() - 1; j < player.get_y() + 2; j++) {
				if(i >= 0 && j >= 0 && i < size && j < size) { //identifikuje políčka 3x3 čtverce NEvyčuhující z gridu
					document.getElementById("x_" + i + "y_" + j).innerHTML = ""; 
				 }
			}
		}
		document.getElementById("x_" + player.get_x() + "y_" + player.get_y()).innerHTML = "<img src='player.png'>"; //vyrendrování panáčka na nové souřadnici
	}
}


//Třída 3 - reprezentující logiku herního pole

class GameField {
	#grid; //proměnná držící dvourozměrné pole plochy
	#player; //instance třídy Player
	#renderer; //instance třídy Renderer
	#game_over; //bool
	#high_score; //int
	#deaths_total; //counter
	#death_memorizer; //memory

	constructor(p, r) {
		this.#player = p;
		this.#renderer = r;
		this.#game_over = false;
		this.#high_score = localStorage.getItem("minefield-escape-hiscore");
		this.#deaths_total = localStorage.getItem("minefield-escape-total-deaths");

		if(this.#high_score == null) {
			this.#high_score = 1;
			localStorage.setItem("minefield-escape-hiscore", 1);
			localStorage.setItem("minefield-escape-total-deaths", 0);
		}
		this.#generate_board(1); //volá vykreslení vždy při novém levelu
	}

	//generuje level
	#generate_board(level) {
		let size = 3 + 2 * level; //formula pro získání velikosti o +1 do každé strany
		this.#grid = Array(size).fill().map(() => Array(size));  //tvorba dvourozměrného pole, má velikost formuly ^
		//cyklus jako ukazatel
		for(let i = 0; i < size; i++) {
			for(let j = 0; j < size; j++) {
				this.#grid[i][j] = true; //hodi minu na každé políčko gridu
			}
		}
		
		//uloží kde je stred pole
		let cur_x = (size - 1) / 2;
		let cur_y = (size - 1) / 2;
		
		//ODKLÍZEČ MIN MAIN CESTY dokud ^ souřadnice nejsou na hraně pole, opakuje:
		while(cur_x != (size - 1) && cur_y != (size - 1) && cur_x != 0 && cur_y != 0) {
			this.#grid[cur_x][cur_y] = false; //odstrani minu na daném políčku
			let move = Math.random(); //podle náhodnosti:
			if(move < 0.25) cur_x--; //doleva
			else if(move < 0.5) cur_x++; //doprava
			else if(move < 0.75) cur_y--; //nahoru
			else cur_y++; //dolu
		}
		this.#grid[cur_x][cur_y] = false; //generace vychodu
		
		//projede grid a odstrani 50% zbývajících min (mimo cestu)
		if (hardmodeEnabled == true) {
			for(let i = 0; i < size; i++) {
				for(let j = 0; j < size; j++) {
					if(this.#grid[i][j]) {
						if(Math.random() < 0.5) this.#grid[i][j] = false;
					}
				}
			}
		}
	}

	//rendruje momentální pozici hráče
	render() {
		this.#renderer.render(this.#player);
	}

	render_gameover() {
		this.#renderer.full_render(this.#player, this.#grid, true);
	}

	render_newgame() {
		this.#renderer.full_render(this.#player, null, false);
	}

	//zajišťuje posouvání hráče
	move(dir) {
		if(this.#game_over) { //game over -> resetpozice hráče
			this.#player.set_x(1 + this.#player.get_level());
			this.#player.set_y(1 + this.#player.get_level());
			this.render_newgame();
			this.#game_over = false; //začne novou hru po prohrání
			return;
		}
		let win = false;
		
		
		//řešení pohybu + deklarace zón kde hrac vyhrává
		switch(dir) {
		
			case "left":
				if(this.#player.get_x() > 0) this.#player.set_x(this.#player.get_x() - 1);
				else win = true;
				break;
			case "right":
				if(this.#player.get_x() < (2 + 2 * this.#player.get_level())) this.#player.set_x(this.#player.get_x() + 1);
				else win = true;
				break;
			case "up":
				if(this.#player.get_y() > 0) this.#player.set_y(this.#player.get_y() - 1);
				else win = true;
				break;
			case "down":
				if(this.#player.get_y() < (2 + 2 * this.#player.get_level())) this.#player.set_y(this.#player.get_y() + 1);
				else win = true;
				break;
		}
		
		
		if(this.#grid[this.#player.get_x()][this.#player.get_y()] == true) { //porovnává jestli na pozici hrace je mina, ci nikoliv
			this.#game_over = true; //když ano, rip
			this.#player.die();
			this.render_gameover();
			alert("Game Over!");
		} 
		
		else { //mina na políčku momentálního pohybu není
			if(win == true) {
				alert("You Win!");
				this.#player.levelup();
				if(this.#player.get_level() > this.#high_score) {
					this.#high_score++;
					localStorage.setItem("minefield-escape-hiscore", this.#high_score); //po výhře s nejvyšším score se nejvyšší skore zapise do local storage
				}
				
				this.#generate_board(this.#player.get_level());
				this.render_newgame(); //render nové hry/levelu
				
			} else this.render(); //vyrendruje se kde teď player je (99% času)
		}
	}
}


// globální proměnná - sledování
let hardmodeEnabled = true; 

// hardmode
function toggleHardmode(button) {
hardmodeEnabled = !hardmodeEnabled;
}


//při zahájení hry/načtení stránky:
let p = new Player();
let r = new Renderer();
let g = new GameField(p, r);
g.render_newgame();

//kontrola pomocí šipek
let b = document.getElementById("body");
b.addEventListener('keydown', (event) => {
	const key = event.key;
	switch(key) {
		case "ArrowRight": g.move("right"); break;
		case "ArrowLeft": g.move("left"); break;
		case "ArrowUp": g.move("up"); break;
		case "ArrowDown": g.move("down"); break;
	}
});
