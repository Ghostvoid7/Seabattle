const user_battlefield = document.querySelector('.user-battle-field')
const user_login = document.querySelector('.user-login')
const second_user_login = document.querySelector('.opponent-login')

const response_coordinates_x = {
    'A': 0,
    'B': 25,
    'C': 50,
    'D': 75,
    'E': 100,
    'F': 125,
    'G': 150,
    'H': 175,
    'I': 200,
    'J': 225
}

let preLoadedImages = {
    'position1': [],
    'position2': [],
    'position3': [],
    'position4': []
}

let imageFileNames = [
    '../../static/Right/ship-1.png', '../../static/Right/ship-2.png', '../../static/Right/ship-3.png', '../../static/Right/ship-4.png',
    '../../static/Down/ship-1.png', '../../static/Down/ship-2.png', '../../static/Down/ship-3.png', '../../static/Down/ship-4.png',
    '../../static/Left/ship-1.png', '../../static/Left/ship-2.png', '../../static/Left/ship-3.png', '../../static/Left/ship-4.png',
    '../../static/Up/ship-1.png', '../../static/Up/ship-2.png', '../../static/Up/ship-3.png', '../../static/Up/ship-4.png'
]

for (let i = 0; i < imageFileNames.length; i++) {
    let img = new Image();
    img.src = imageFileNames[i];
    let category = 'position' + (Math.floor(i / 4) + 1)
    preLoadedImages[category].push(img);
};

let player_login = sessionStorage.getItem('login')
user_login.textContent = player_login

let opponent_login = sessionStorage.getItem('opponent')
second_user_login.textContent = opponent_login

let json_all_coordinates = sessionStorage.getItem('all_coordinates')
let all_coordinates = JSON.parse(json_all_coordinates)

for (let ship = 0; ship < all_coordinates.length; ship++) {
    let coordinates_ship = all_coordinates[ship]
    let ship_type = coordinates_ship['ship_type']
    let position = coordinates_ship['position']
    let start_coordinate = coordinates_ship['start_coordinate']
    let user_ship = document.createElement('img')
    user_ship.classList.add('ship')
    user_ship.style.position = 'absolute'
    user_ship.src = preLoadedImages['position' + position][Number(ship_type) - 1].src
    console.log(preLoadedImages)
    switch (Number(position)) {
        case 1:
            user_ship.style.left = response_coordinates_x[start_coordinate[0]] - (Number(ship_type) - 1) * 25 + 'px'
            if (start_coordinate.length === 3) {
                user_ship.style.top = (Number(start_coordinate[1] + start_coordinate[2]) - 1) * 25 + 'px'
            }
            else {
                user_ship.style.top = (Number(start_coordinate[1]) - 1) * 25 + 'px'
            }
            break
        case 2:
            user_ship.style.left = response_coordinates_x[start_coordinate[0]]  + 'px'
            if (start_coordinate.length === 3) {
                user_ship.style.top = ((Number(start_coordinate[1] + start_coordinate[2]) - 1) * 25) - (Number(ship_type) - 1) * 25 + 'px'
            }
            else {
                user_ship.style.top = ((Number(start_coordinate[1]) - 1) * 25) - (Number(ship_type) - 1) * 25 + 'px'
            }
            break
        case 3:
            user_ship.style.left = response_coordinates_x[start_coordinate[0]]  + 'px'
            if (start_coordinate.length === 3) {
                user_ship.style.top = ((Number(start_coordinate[1] + start_coordinate[2]) - 1) * 25)  + 'px'
            }
            else {
                user_ship.style.top = ((Number(start_coordinate[1]) - 1) * 25) + 'px'
            }
            break
        case 4:
            user_ship.style.left = response_coordinates_x[start_coordinate[0]]  + 'px'
            if (start_coordinate.length === 3) {
                user_ship.style.top = ((Number(start_coordinate[1] + start_coordinate[2]) - 1) * 25)  + 'px'
            }
            else {
                user_ship.style.top = ((Number(start_coordinate[1]) - 1) * 25) + 'px'
            }
            break
    }
    user_battlefield.append(user_ship)
}







































