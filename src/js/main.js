window.addEventListener('DOMContentLoaded', () => {
	'use strict'

	const start = document.querySelector('.start'),
		car = document.querySelector('.car'),
		gameArea = document.querySelector('.game-area'),
		enemy = document.querySelector('.enemy'),
		modalGame = document.querySelector('.modal__game'),
		myscore = document.querySelector('#myscore'),
		modalAgain = document.querySelector('.modal__again');

	let line;
	let carImg;
	let flag;

	const settings = {
		start: false,
		speed: 4,
		carSpeed: 4,
		score: 0,
		traffic: 5,
	}

	const growSpeedInterval = () => {

		if (flag) {
			setInterval(() => {
				settings.speed += 2
			}, 10000)
		}
	}

	const run = {
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
	}

	const createCar = () => {
		carImg = document.createElement('img')
		carImg.src = 'img/enemy.png'
		car.appendChild(carImg)
	}

	const createEnemies = () => {

		for (let i = 0; i <= settings.traffic; i++) {

			const enemyImg = document.createElement('img');

			const randomCar = parseInt((Math.random() * (8 - 1)) + 1),
				randomLeft = parseInt(Math.random() * ((gameArea.offsetWidth - enemy.offsetWidth) - 1) + 1);

			enemyImg.src = 'img/Cars/enemy' + randomCar + '.png';
			enemyImg.top = -100 * settings.traffic * (i + 1);

			enemyImg.style.left = randomLeft + 'px';
			enemyImg.style.top = enemyImg.top + 'px';
			enemy.appendChild(enemyImg)

		}
	}

	const runEnemies = () => {

		document.querySelectorAll('.enemy img').forEach(item => {
			item.top += settings.speed / 2;
			item.style.top = item.top + 'px';

			if (item.top > gameArea.offsetHeight) {
				item.top = - settings.traffic * 300;
				const randomLeft = parseInt(Math.random() * ((gameArea.offsetWidth - enemy.offsetWidth) - 1) + 1);
				item.style.left = randomLeft + 'px';
			}
		})

		if (!flag) return

		requestAnimationFrame(runEnemies)
	}

	const createLines = () => {

		for (let i = 0; i < 20; i++) {
			line = document.createElement('div')
			line.classList.add('line')
			line.y = i * 100;
			line.style.top = line.y + 'px'
			gameArea.appendChild(line)
		}
	}

	const runLines = () => {
		document.querySelectorAll('.line').forEach(item => {
			item.y += settings.speed;
			item.style.top = item.y + 'px';

			if (item.y > gameArea.clientHeight) {
				item.y = -100
			}
		})

		if (!flag) return

		requestAnimationFrame(runLines)
	}

	function startGame() {

		start.remove()

		settings.start = true
		settings.x = car.offsetLeft
		settings.y = car.offsetTop
		settings.score = 0

		flag = true

		createCar()
		gameStart()
		createLines()
		runLines()
		createEnemies()
		runEnemies()
		growSpeedInterval()

	}

	function gameStart() {

		if (settings.start) {

			if (run.ArrowUp && settings.y > 0 && flag) {
				settings.y -= settings.carSpeed
			} else if (run.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight) && flag) {
				settings.y += settings.carSpeed
			} else if (run.ArrowLeft && settings.x > 0 && flag) {
				settings.x -= settings.carSpeed
			} else if (run.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth) && flag) {
				settings.x += settings.carSpeed
			}

			car.style.top = settings.y + 'px';
			car.style.left = settings.x + 'px';

			if (flag) {
				settings.score++;
			}

			myscore.textContent = settings.score;

			const imgClientRect = document.querySelector('.car img').getBoundingClientRect()

			document.querySelectorAll('.enemy img').forEach(item => {
				const itemClientRect = item.getBoundingClientRect();
				if (parseInt(itemClientRect.bottom) >= parseInt(imgClientRect.top)
					&& parseInt(itemClientRect.right) >= parseInt(imgClientRect.left)
					&& parseInt(itemClientRect.left) <= parseInt(imgClientRect.right)
					&& parseInt(itemClientRect.top) <= parseInt(imgClientRect.bottom)) {
					flag = false;
					modalGame.style.transform = `scale(1)`;
					settings.speed = 4;
					modalAgain.style.display = 'block';
				}
			})

			requestAnimationFrame(gameStart)
		}
	}

	const tryAgain = () => {
		flag = true
		settings.score = 0
		document.querySelectorAll('.enemy img').forEach(item => item.remove())
		document.querySelectorAll('.line').forEach(item => item.remove())
		carImg.remove()
		settings.y = gameArea.offsetHeight - (car.offsetHeight + 10)
		settings.x = 225

		modalGame.style.transform = `scale(0)`
		modalAgain.style.display = 'none'

		createCar()
		createLines()
		runLines()
		createEnemies()
		runEnemies()
		growSpeedInterval()
	}

	start.addEventListener('click', startGame);

	modalAgain.addEventListener('click', tryAgain)

	document.addEventListener('keydown', (e) => {
		e.preventDefault()
		run[e.key] = true;
	})

	document.addEventListener('keyup', (e) => {
		e.preventDefault()
		run[e.key] = false;
	})
})