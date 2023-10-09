const user_ships = document.querySelectorAll('.ship');
const container = document.querySelector('.container');
const battlefield = document.querySelector('.battle-field');
const delete_ships = document.querySelector('.delete-all');
const button_auto = document.querySelector('.click-auto')
const ship_rotate = document.querySelector('.click-rotate')
const button_ready = document.querySelector('.ready')
const allShips = document.querySelector('.ships')
const arrow = document.querySelector('.arrow')
const cross = document.querySelector('.cross')
const user_login = document.querySelector('.user-login')

let myGame = false;
let ship_complete = true
let some_class;
let draggingEnabled = true
let createGame;

const coordinates_x = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'J'
};

user_login.textContent = sessionStorage.getItem('login')

arrow.addEventListener('click', function () {
    console.log(1)
    let xhr = new XMLHttpRequest()

    xhr.open('POST', 'return.php', true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    let jsonData = {
        'yesLogin': 'yes',
        'login': login
    }
    let jsonStr = JSON.stringify(jsonData)

    xhr.send(jsonStr)

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response === 'yes') {
                window.location.href = '../seabattle.php'
            }
        }
        else {
            console.error('Ошибка: ' + xhr.status);
        }
    }
})

cross.addEventListener('click', function () {
    console.log(2)
    let xhr = new XMLHttpRequest()

    xhr.open('POST', 'return.php', true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    let jsonData = {
        'yesLogin': 'no',
        'login': login
    }
    let jsonStr = JSON.stringify(jsonData)

    xhr.send(jsonStr)

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response === 'no') {
                sessionStorage.removeItem('login')
                window.location.href = '../seabattle.php'
            }
        }
        else {
            console.error('Ошибка: ' + xhr.status);
        }
    }
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const customCursor = document.querySelector('.custom-cursor');

for (let ship of user_ships) {
    ship.addEventListener('mousemove', function(event) {
        const shipRect = ship.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect()
        let shiftX = event.pageX - shipRect.left;
        let shiftY = event.pageY - shipRect.top;
        function moveAt(pageX, pageY) {
            let x = pageX - containerRect.left - 1;
            let y = pageY - containerRect.top - 1;
            customCursor.style.visibility = 'visible'
            customCursor.style.left = x + 'px';
            customCursor.style.top = y + 'px';
        }
        moveAt(event.pageX, event.pageY)

    });
    ship.addEventListener('mouseleave', function () {
        customCursor.style.visibility = 'hidden'
    })
}


let preLoadedImages = {
    'position1': [],
    'position2': [],
    'position3': [],
    'position4': []
}

let imageFileNames = [
    '../static/Right/ship-1.png', '../static/Right/ship-2.png', '../static/Right/ship-3.png', '../static/Right/ship-4.png',
    '../static/Down/ship-1.png', '../static/Down/ship-2.png', '../static/Down/ship-3.png', '../static/Down/ship-4.png',
    '../static/Left/ship-1.png', '../static/Left/ship-2.png', '../static/Left/ship-3.png', '../static/Left/ship-4.png',
    '../static/Up/ship-1.png', '../static/Up/ship-2.png', '../static/Up/ship-3.png', '../static/Up/ship-4.png'
]

for (let i = 0; i < imageFileNames.length; i++) {
    let img = new Image();
    img.src = imageFileNames[i];
    let category = 'position' + (Math.floor(i / 4) + 1)
    preLoadedImages[category].push(img);
};

function rotateShip(ship_position, user_ship) {
    if (user_ship.classList.contains('selected')) {
        let regexp = /ship-\d/;
        for (let ship_class of user_ship.classList) {
            if (regexp.test(ship_class)) {
                some_class = ship_class;
            }
        }
        let ship_type = some_class[5];
        let new_position = Number(ship_position) + 1
        if (Number(new_position) > 4) {
            new_position = '1'
        }
        user_ship.setAttribute('data-position', String(new_position))
        switch (Number(new_position)) {
            case 1:
                user_ship.style.left = (Number(user_ship.getAttribute('data-left')) - (Number(ship_type) - 1) * 25) + 'px'
                user_ship.style.top = (Number(user_ship.getAttribute('data-top'))) + 'px'
                user_ship.src = '../static/Right/ship-' + ship_type + '.png'
                let new_shipRect1 = user_ship.getBoundingClientRect()
                user_ship.hidden = true
                for (let a = 0; a <= 2; a++) {
                    for (let b = 0; b <= Number(ship_type) + 1; b++) {
                        let some_x1 = new_shipRect1.left - 12.5 + 25 * b
                        let some_y1 = new_shipRect1.top - 12.5 + 25 * a
                        let checked1 = document.elementFromPoint(some_x1, some_y1)
                        if (checked1.classList.contains('ship')) {
                            user_ship.hidden = false
                            rotateShip((ship_position - 1), user_ship)
                            break
                        }
                        else {
                            if (a === 1 && (b > 0 && b < Number(ship_type) + 1)) {
                                if (!checked1.classList.contains('ceil')) {
                                    user_ship.hidden = false
                                    rotateShip((ship_position - 1), user_ship)
                                    break
                                }
                            }
                            continue
                        }
                    }
                }
                user_ship.hidden = false
                break
            case 2:
                user_ship.style.left = user_ship.getAttribute('data-left') + 'px'
                user_ship.style.top = (Number(user_ship.getAttribute('data-top')) - (Number(ship_type) - 1) * 25) + 'px'
                user_ship.src = '../static/Down/ship-' + ship_type + '.png'
                let new_shipRect2 = user_ship.getBoundingClientRect()
                user_ship.hidden = true
                for (let a = 0; a <= 2; a++) {
                    for (let b = 0; b <= Number(ship_type) + 1; b++) {
                        let some_x2 = new_shipRect2.left - 12.5 + 25 * a
                        let some_y2 = new_shipRect2.top - 12.5 + 25 * b
                        let checked2 = document.elementFromPoint(some_x2, some_y2)
                        if (checked2.classList.contains('ship')) {
                            user_ship.hidden = false
                            rotateShip((ship_position - 1), user_ship)
                            break
                        }
                        else {
                            if (a === 1 && (b > 0 && b < Number(ship_type) + 1)) {
                                if (!checked2.classList.contains('ceil')) {
                                    user_ship.hidden = false
                                    rotateShip((ship_position - 1), user_ship)
                                    break
                                }
                            }
                            continue
                        }
                    }
                }
                user_ship.hidden = false
                break
            case 3:
                user_ship.style.top = user_ship.getAttribute('data-top') + 'px'
                user_ship.style.left = user_ship.getAttribute('data-left') + 'px'
                user_ship.src = '../static/Left/ship-' + ship_type + '.png'
                let new_shipRect3 = user_ship.getBoundingClientRect()
                user_ship.hidden = true
                for (let a = 0; a <= 2; a++) {
                    for (let b = 0; b <= Number(ship_type) + 1; b++) {
                        let some_x3 = new_shipRect3.left - 12.5 + 25 * b
                        let some_y3 = new_shipRect3.top - 12.5 + 25 * a
                        let checked3 = document.elementFromPoint(some_x3, some_y3)
                        if (checked3.classList.contains('ship')) {
                            user_ship.hidden = false
                            rotateShip((ship_position - 1), user_ship)
                            break
                        }
                        else {
                            if (a === 1 && (b > 0 && b < Number(ship_type) + 1)) {
                                if (!checked3.classList.contains('ceil')) {
                                    user_ship.hidden = false
                                    rotateShip((ship_position - 1), user_ship)
                                    break
                                }
                            }
                            continue
                        }
                    }
                }
                user_ship.hidden = false
                break
            case 4:
                user_ship.style.top = user_ship.getAttribute('data-top') + 'px'
                user_ship.style.left = user_ship.getAttribute('data-left') + 'px'
                user_ship.src = '../static/Up/ship-' + ship_type + '.png'
                let new_shipRect4 = user_ship.getBoundingClientRect()
                user_ship.hidden = true
                for (let a = 0; a <= 2; a++) {
                    for (let b = 0; b <= Number(ship_type) + 1; b++) {
                        let some_x4 = new_shipRect4.left - 12.5 + 25 * a
                        let some_y4 = new_shipRect4.top - 12.5 + 25 * b
                        let checked4 = document.elementFromPoint(some_x4, some_y4)
                        if (checked4.classList.contains('ship')) {
                            user_ship.hidden = false
                            rotateShip((ship_position - 1), user_ship)
                            break
                        }
                        else {
                            if (a === 1 && (b > 0 && b < Number(ship_type) + 1)) {
                                if (!checked4.classList.contains('ceil')) {
                                    user_ship.hidden = false
                                    rotateShip((ship_position - 1), user_ship)
                                    break
                                }
                            }
                            else {
                                continue
                            }

                        }
                    }
                }
                user_ship.hidden = false
                break
        }
    }
}

function drag_and_drop(user_ship) {
    return function () {
        if (draggingEnabled === false) {
            return
        }
        else {
            draggingEnabled = false
            const containerRect = container.getBoundingClientRect();
            const shipRect = user_ship.getBoundingClientRect();
            let shiftX = event.pageX - shipRect.left;
            let shiftY = event.pageY - shipRect.top;
            let regexp = /ship-\d/;
            for (let ship_class of user_ship.classList) {
                if (regexp.test(ship_class)) {
                    some_class = ship_class;
                }
            }
            let ship_type = some_class[5];
            event.preventDefault();
            moveAt(event.pageX, event.pageY);
            for (let ship of user_ships) {
                ship.classList.remove('selected')
            }
            let position = user_ship.getAttribute('data-position')
            user_ship.classList.add('selected')
            user_ship.classList.remove('on-field');
            container.append(user_ship);

            function moveAt(pageX, pageY) {
                let x = pageX - shiftX - containerRect.left - 1;
                let y = pageY - shiftY - containerRect.top - 1;
                user_ship.style.left = x + 'px';
                user_ship.style.top = y + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
                let new_shipRect = user_ship.getBoundingClientRect()
                let ceils = document.querySelectorAll('.ceil')
                for (let ceil of ceils) {
                    ceil.classList.remove('busy')
                    ceil.classList.remove('not-busy')
                    ceil.classList.remove('checked')
                }
                for (let ship of user_ships) {
                    ship.classList.remove('checked')
                }
                if (
                    new_shipRect.top >= battlefield.getBoundingClientRect().top - 8 &&
                    new_shipRect.left >= battlefield.getBoundingClientRect().left - 8 &&
                    new_shipRect.bottom <= battlefield.getBoundingClientRect().bottom + 8 &&
                    new_shipRect.right <= battlefield.getBoundingClientRect().right + 8
                ) {
                    user_ship.hidden = true
                    switch (Number(position)) {
                        case 1:
                        case 3:
                            for (let a = 0; a <= 2; a++) {
                                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                                    let some_x = new_shipRect.left - 12.5 + 25 * b
                                    let some_y = new_shipRect.top - 12.5 + 25 * a
                                    let checked = document.elementFromPoint(some_x, some_y)
                                    checked.classList.add('checked')
                                }
                            }
                            break
                        case 2:
                        case 4:
                            for (let a = 0; a <= 2; a++) {
                                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                                    let some_x = new_shipRect.left - 12.5 + 25 * a
                                    let some_y = new_shipRect.top - 12.5 + 25 * b
                                    let checked = document.elementFromPoint(some_x, some_y)
                                    checked.classList.add('checked')
                                }
                            }
                            break
                    }

                    user_ship.hidden = false
                    let allChecked = document.querySelectorAll('.checked')
                    for (let checked of allChecked) {
                        if (checked.classList.contains('ship')) {
                            for (let ceil of allChecked) {
                                if (ceil.classList.contains('ceil')) {
                                    ceil.classList.remove('not-busy')
                                    ceil.classList.add('busy')
                                }
                            }
                            break
                        }
                        else {
                            if (checked.classList.contains('ceil')) {
                                checked.classList.remove('busy')
                                checked.classList.add('not-busy')
                            }
                        }
                    }
                }
            }
            document.addEventListener('mousemove', onMouseMove);
            user_ship.addEventListener('mouseup', function(event) {
                document.removeEventListener('mousemove', onMouseMove)
                draggingEnabled = true
                let new_shipRect = user_ship.getBoundingClientRect()
                if (
                    new_shipRect.top >= battlefield.getBoundingClientRect().top - 8 &&
                    new_shipRect.left >= battlefield.getBoundingClientRect().left - 8 &&
                    new_shipRect.bottom <= battlefield.getBoundingClientRect().bottom + 8 &&
                    new_shipRect.right <= battlefield.getBoundingClientRect().right + 8
                ) {
                    let ceils = document.querySelectorAll('.ceil')
                    for (let ceil of ceils) {
                        ceil.classList.remove('busy')
                        ceil.classList.remove('not-busy')
                    }
                    let x = (Math.round((new_shipRect.left - battlefield.getBoundingClientRect().left - 1) / 25)) * 25;
                    let y = (Math.round((new_shipRect.top - battlefield.getBoundingClientRect().top - 1) / 25)) * 25;

                    user_ship.style.left = x + 'px';
                    user_ship.style.top = y + 'px';
                    battlefield.append(user_ship);
                    user_ship.classList.add('on-field');
                    user_ship.hidden = true
                    switch (Number(user_ship.getAttribute('data-position'))) {
                        case 1:
                        case 3:
                            for (let a = 0; a <= 2; a++) {
                                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                                    let some_x = new_shipRect.left - 13.5 + 25 * b
                                    let some_y = new_shipRect.top - 13.5 + 25 * a
                                    let checked = document.elementFromPoint(some_x, some_y)
                                    if (checked.classList.contains('ship')) {
                                        user_ship.classList.remove('selected')
                                        user_ship.classList.remove('on-field');
                                        user_ship.style.left = user_ship.getAttribute('data-start-left');
                                        user_ship.style.top = user_ship.getAttribute('data-start-top');
                                        user_ship.setAttribute('data-position', '1')
                                        user_ship.src = '../static/Right/ship-' + ship_type + '.png'
                                        container.append(user_ship)
                                        break
                                    }
                                    else {
                                        continue
                                    }
                                }
                            }
                            break
                        case 2:
                        case 4:
                            for (let a = 0; a <= 2; a++) {
                                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                                    let some_x = new_shipRect.left - 12.5 + 25 * a
                                    let some_y = new_shipRect.top - 12.5 + 25 * b
                                    let checked = document.elementFromPoint(some_x, some_y)
                                    if (checked.classList.contains('ship')) {
                                        user_ship.classList.remove('selected')
                                        user_ship.classList.remove('on-field');
                                        user_ship.style.left = user_ship.getAttribute('data-start-left');
                                        user_ship.style.top = user_ship.getAttribute('data-start-top');
                                        user_ship.setAttribute('data-position', '1')
                                        user_ship.src = '../static/Right/ship-' + ship_type + '.png'
                                        container.append(user_ship)
                                        break
                                    }
                                    else {
                                        continue
                                    }
                                }
                            }
                            break
                    }

                    user_ship.hidden = false
                    if (
                        new_shipRect.top >= battlefield.getBoundingClientRect().top - 8 &&
                        new_shipRect.left >= battlefield.getBoundingClientRect().left - 8 &&
                        new_shipRect.bottom <= battlefield.getBoundingClientRect().bottom + 8 &&
                        new_shipRect.right <= battlefield.getBoundingClientRect().right + 8
                    )
                    {
                        let ship_position = user_ship.getAttribute('data-position')
                        switch (Number(ship_position)) {
                            case 1:
                                user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left) + (Number(ship_type) - 1) * 25))
                                user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top)))
                                break
                            case 2:
                                user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left)))
                                user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top) + (Number(ship_type) - 1) * 25))
                                break
                            case 3:
                                user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left)))
                                user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top)))
                                break
                            case 4:
                                user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left)))
                                user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top)))
                                break

                        }
                    }


                }
                else {
                    user_ship.classList.remove('selected')
                    user_ship.setAttribute('data-position', '1')
                    user_ship.src = '../static/Right/ship-' + ship_type + '.png'
                    user_ship.style.left = user_ship.getAttribute('data-start-left');
                    user_ship.style.top = user_ship.getAttribute('data-start-top');
                }
                let field_ships = battlefield.querySelectorAll('.on-field')
                let count_ships = 0
                for (let ship of field_ships) {
                    count_ships += 1
                }
                if (count_ships === 10) {
                    button_ready.style.opacity = 1
                    button_ready.disabled = false
                    button_ready.style.cursor = 'pointer'
                }
                else {
                    button_ready.style.opacity = 0.35
                    button_ready.disabled = true
                    button_ready.style.cursor = 'default'
                }
            })
            user_ship.ondragstart = function() {
                return false;
            }
        }
    }
}


for (let user_ship of user_ships) {
    user_ship.addEventListener('mousedown', drag_and_drop(user_ship))
}

function delete_all_ships() {
    for (let user_ship of user_ships) {
        if (user_ship.offsetParent === battlefield) {
            let regexp = /ship-\d/;
            for (let ship_class of user_ship.classList) {
                if (regexp.test(ship_class)) {
                    some_class = ship_class
                }
            }
            let ship_type = some_class[5];
            user_ship.setAttribute('data-position', '1')
            user_ship.src = '../static/Right/ship-' + ship_type + '.png'
            user_ship.style.left = user_ship.getAttribute('data-start-left')
            user_ship.style.top = user_ship.getAttribute('data-start-top')
            container.append(user_ship)
        }
    }
    button_ready.style.opacity = 0.35
    button_ready.disabled = true
    button_ready.style.cursor = 'default'
}

delete_ships.addEventListener('click' ,delete_all_ships)


function auto_ship(user_ship, ship_type) {
    let random_position = getRandomInt(4) + 1
    user_ship.setAttribute('data-position', String(random_position))
    switch (Number(random_position)) {
        case 1:
            let x1 = getRandomInt(225 - 25 * (Number(ship_type) - 1))
            let y1 = getRandomInt(225)
            user_ship.style.left = Math.round(x1 / 25) * 25 + 'px'
            user_ship.style.top = Math.round(y1 / 25) * 25 + 'px'
            user_ship.src = preLoadedImages['position1'][Number(ship_type) - 1].src
            battlefield.append(user_ship)
            let new_shipRect1 = user_ship.getBoundingClientRect()
            user_ship.classList.add('on-field')
            user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left) + (Number(ship_type) - 1) * 25))
            user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top)))
            user_ship.hidden = true
            let count_ships1 = 0
            for (let a = 0; a <= 2; a++) {
                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                    let some_x1 = new_shipRect1.left - 12.5 + 25 * b
                    let some_y1 = new_shipRect1.top - 12.5 + 25 * a
                    let checked = document.elementFromPoint(some_x1, some_y1)
                    if (checked.classList.contains('ship')) {
                        count_ships1 += 1
                        break
                    }
                    else {
                        continue
                    }
                }
            }
            user_ship.hidden = false
            if (count_ships1 > 0) {
                auto_ship(user_ship, ship_type)
            }
            ship_complete = true
            break
        case 2:
            let y2 = getRandomInt(225 - 25 * (Number(ship_type) - 1))
            let x2 = getRandomInt(225)
            user_ship.style.left = Math.round(x2 / 25) * 25 + 'px'
            user_ship.style.top = Math.round(y2 / 25) * 25 + 'px'
            user_ship.src = preLoadedImages['position2'][Number(ship_type) - 1].src
            battlefield.append(user_ship)
            let new_shipRect2 = user_ship.getBoundingClientRect()
            user_ship.classList.add('on-field')
            user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left)))
            user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top) + (Number(ship_type) - 1) * 25))
            user_ship.hidden = true
            let count_ships2 = 0
            for (let a = 0; a <= 2; a++) {
                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                    let some_x2 = new_shipRect2.left - 12.5 + 25 * a
                    let some_y2 = new_shipRect2.top - 12.5 + 25 * b
                    let checked = document.elementFromPoint(some_x2, some_y2)
                    if (checked.classList.contains('ship')) {
                        count_ships2 += 1
                        break
                    } else {
                        continue
                    }
                }
            }
            user_ship.hidden = false
            if (count_ships2 > 0) {
                auto_ship(user_ship, ship_type)
            }
            ship_complete = true
            break
        case 3:
            let x3 = getRandomInt(225 - 25 * (Number(ship_type) - 1))
            let y3 = getRandomInt(225)
            user_ship.style.left = Math.round(x3 / 25) * 25 + 'px'
            user_ship.style.top = Math.round(y3 / 25) * 25 + 'px'
            user_ship.src = preLoadedImages['position3'][Number(ship_type) - 1].src
            battlefield.append(user_ship)
            let new_shipRect3 = user_ship.getBoundingClientRect()
            user_ship.classList.add('on-field')
            user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left)))
            user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top)))
            user_ship.hidden = true
            let count_ships3 = 0
            for (let a = 0; a <= 2; a++) {
                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                    let some_x3 = new_shipRect3.left - 12.5 + 25 * b
                    let some_y3 = new_shipRect3.top - 12.5 + 25 * a
                    let checked = document.elementFromPoint(some_x3, some_y3)
                    if (checked.classList.contains('ship')) {
                        count_ships3 += 1
                        break
                    } else {
                        continue
                    }
                }
            }
            user_ship.hidden = false
            if (count_ships3 > 0) {
                auto_ship(user_ship, ship_type)
            }
            ship_complete = true
            break
        case 4:
            let y4 = getRandomInt(225 - 25 * (Number(ship_type) - 1))
            let x4 = getRandomInt(225)
            user_ship.style.left = Math.round(x4 / 25) * 25 + 'px'
            user_ship.style.top = Math.round(y4 / 25) * 25 + 'px'
            user_ship.src = preLoadedImages['position4'][Number(ship_type) - 1].src
            battlefield.append(user_ship)
            let new_shipRect4 = user_ship.getBoundingClientRect()
            user_ship.classList.add('on-field')
            user_ship.setAttribute('data-left', String(parseInt(user_ship.style.left)))
            user_ship.setAttribute('data-top', String(parseInt(user_ship.style.top)))
            user_ship.hidden = true
            let count_ships4 = 0
            countShip: for (let a = 0; a <= 2; a++) {
                for (let b = 0; b <= Number(ship_type) + 1; b++) {
                    let some_x4 = new_shipRect4.left - 12.5 + 25 * a
                    let some_y4 = new_shipRect4.top - 12.5 + 25 * b
                    let checked = document.elementFromPoint(some_x4, some_y4)
                    if (checked.classList.contains('ship')) {
                        count_ships4 += 1
                        break countShip
                    } else {
                        continue
                    }
                }
            }
            user_ship.hidden = false
            if (count_ships4 > 0) {
                auto_ship(user_ship, ship_type)
            }
            ship_complete = true
            break
    }
    button_ready.style.opacity = 1
    button_ready.disabled = false
    button_ready.style.cursor = 'pointer'
}

function autoArrange(user_ship) {
    if (ship_complete) {
        ship_complete = false
        let regexp = /ship-\d/;
        for (let ship_class of user_ship.classList) {
            if (regexp.test(ship_class)) {
                some_class = ship_class;
            }
        }
        let ship_type = some_class[5]
        auto_ship(user_ship, ship_type)
    }
}

let timeout;

function autoСomplete(event) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
        for (let user_ship of user_ships) {
            autoArrange(user_ship)
        }
    }, 1);
}


button_auto.addEventListener('click', autoСomplete)

function rotate_ship() {
    for(let user_ship of user_ships) {
        let ship_position = user_ship.getAttribute('data-position')
        rotateShip(ship_position, user_ship)
    }
}

ship_rotate.addEventListener('click', rotate_ship)


button_ready.addEventListener('click', function () {
    let all_coordinates = []
    if (button_ready.textContent === 'Готовий') {
        myGame = true
        draggingEnabled = false
        button_ready.textContent = 'Відміна гри'
        let div_wait_player = document.createElement('div')
        let wait_player = document.createElement('p')
        wait_player.textContent = 'Очікуйте Гравця 2'
        div_wait_player.classList.add('wait-player')
        div_wait_player.append(wait_player)
        container.append(div_wait_player)
        let img_time = document.createElement('img')
        img_time.src = 'https://files.axshare.com/gsc/2AGZYF/88/23/38/882338d60123458087e0059e88a96f0b/images/2_3_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%96_%D1%80%D0%BE%D0%B7%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D1%96__%D0%BF%D0%BE%D1%88%D1%83%D0%BA_%D0%B3%D1%80%D0%B0%D0%B2%D1%86%D1%8F_/u176.svg?pageId=19df8ea5-d9b3-44c4-99e8-597bfdc11276'
        img_time.classList.add('img-time')
        container.append(img_time)
        let text_time = document.createElement("p")
        text_time.classList.add('text-time')
        container.append(text_time)
        delete_ships.removeEventListener('click', delete_all_ships)
        button_auto.removeEventListener('click', autoСomplete)
        ship_rotate.removeEventListener('click', rotate_ship)
        delete_ships.style.opacity = 0.35
        button_auto.style.opacity = 0.35
        ship_rotate.style.opacity = 0.35
        for (let user_ship of user_ships) {
            let coordinates_ship = {}
            let coordinate = []
            let regexp = /ship-\d/;
            for (let ship_class of user_ship.classList) {
                if (regexp.test(ship_class)) {
                    some_class = ship_class;
                }
            }
            let ship_type = some_class[5]
            let start_x = coordinates_x[Number(user_ship.getAttribute('data-left')) / 25]
            let start_y = Number(user_ship.getAttribute('data-top')) / 25 + 1
            let start_coordinate = start_x + start_y
            let position = user_ship.getAttribute('data-position')
            let string_position;
            switch (Number(position)) {
                case 1:
                    string_position = 'right'
                    break
                case 2:
                    string_position = 'down'
                    break
                case 3:
                    string_position = 'left'
                    break
                case 4:
                    string_position  = 'up'
                    break
            }
            coordinates_ship['start_coordinate'] = start_coordinate
            coordinates_ship['position'] = string_position
            coordinates_ship['ship_type'] = ship_type
            let coordinates = []
            switch (Number(position)) {
                case 1:
                case 3:
                    let y = parseInt(user_ship.style.top) / 25 + 1
                    for (let i = 0; i < Number(ship_type); i++) {
                        let x = coordinates_x[(parseInt(user_ship.style.left) + i * 25) / 25]
                        let coordinata = x + y
                        coordinates.push(coordinata)
                    }
                    coordinates_ship['coordinates'] = coordinates
                    break
                case 2:
                case 4:
                    let x = coordinates_x[parseInt(user_ship.style.left) / 25]
                    for (let i = 0; i < Number(ship_type); i++) {
                        let y = (parseInt(user_ship.style.top) + i * 25) / 25 + 1
                        let coordinata = x + y
                        coordinates.push(coordinata)
                    }
                    coordinates_ship['coordinates'] = coordinates
                    break
            }
            all_coordinates.push(coordinates_ship)
        }
        sessionStorage.setItem('all_coordinates', JSON.stringify(all_coordinates))
        let xhr = new XMLHttpRequest()
        xhr.open('POST', './wait_battle.php', true)
        xhr.setRequestHeader('Content-Type', 'application/json')

        let user_request = {
            'login': sessionStorage.getItem('login'),
            'coordinates': all_coordinates,
            'wait_game': 'yes'
        }

        let json_user_request = JSON.stringify(user_request)

        xhr.send(json_user_request)

        xhr.onload = function () {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response['in_game'] === 'yes') {
                    createGame = response['createGame']
                    sessionStorage.setItem('game_id', response['game_id'])
                    sessionStorage.setItem('opponent_id', response['opponent_id'])
                    sessionStorage.setItem('opponent', response['opponent'])
                    sessionStorage.setItem('first_turn', response['first_turn'])
                    window.location.href = './battle/battle.php'
                }
            }
            else {
                console.error('Ошибка: ' + xhr.status);
            }
        }

        function startCountdown() {
            let seconds = 90

            function updateCountdown() {
                if (myGame) {
                    text_time.textContent = seconds + 'сек'
                    seconds--
                    let xhr3 = new XMLHttpRequest()
                    xhr3.open('POST', './wait_battle.php', true)
                    xhr3.setRequestHeader('Content-Type', 'application/json')

                    let user_request3 = {
                        'login': sessionStorage.getItem('login'),
                        'coordinates': all_coordinates,
                        'wait_game': 'wait',
                        'createGame': createGame
                    }

                    let json_user_request3 = JSON.stringify(user_request3)

                    xhr3.send(json_user_request3)

                    xhr3.onload = function () {
                        if (xhr3.status === 200) {
                            let response = JSON.parse(xhr3.responseText);
                            if (response['in_game'] === 'yes') {
                                sessionStorage.setItem('game_id', response['game_id'])
                                sessionStorage.setItem('opponent_id', response['opponent_id'])
                                sessionStorage.setItem('opponent', response['opponent'])
                                sessionStorage.setItem('first_turn', response['first_turn'])
                                window.location.href = './battle/battle.php'
                            }
                        }
                        else {
                            console.error('Ошибка: ' + xhr3.status);
                        }
                    }
                    if (seconds === 0) {
                        clearInterval(intervalId)
                        myGame = false
                        draggingEnabled = true
                        button_ready.textContent = 'Готовий'
                        let div_wait_player = document.querySelector('.wait-player')
                        let parent = div_wait_player.parentNode
                        parent.removeChild(div_wait_player)
                        let img_time = document.querySelector('.img-time')
                        parent.removeChild(img_time)
                        let text_time = document.querySelector('.text-time')
                        parent.removeChild(text_time)
                        delete_ships.addEventListener('click', delete_all_ships)
                        button_auto.addEventListener('click', autoСomplete)
                        ship_rotate.addEventListener('click', rotate_ship)
                        delete_ships.style.opacity = 1
                        button_auto.style.opacity = 1
                        ship_rotate.style.opacity = 1
                        let xhr1 = new XMLHttpRequest()
                        xhr1.open('POST', './wait_battle.php', true)
                        xhr1.setRequestHeader('Content-Type', 'application/json')

                        let user_request1 = {
                            'login': sessionStorage.getItem('login'),
                            'coordinates': all_coordinates,
                            'wait_game': 'no'
                        }

                        let json_user_request1 = JSON.stringify(user_request1)

                        xhr1.send(json_user_request1)
                    }
                }
            }

            updateCountdown()
            let intervalId = setInterval(updateCountdown, 1000)
        }

        startCountdown()
    }
    else {
        all_coordinates = {}
        myGame = false
        draggingEnabled = true
        button_ready.textContent = 'Готовий'
        let div_wait_player = document.querySelector('.wait-player')
        let parent = div_wait_player.parentNode
        parent.removeChild(div_wait_player)
        let img_time = document.querySelector('.img-time')
        parent.removeChild(img_time)
        let text_time = document.querySelector('.text-time')
        parent.removeChild(text_time)
        delete_ships.addEventListener('click', delete_all_ships)
        button_auto.addEventListener('click', autoСomplete)
        ship_rotate.addEventListener('click', rotate_ship)
        delete_ships.style.opacity = 1
        button_auto.style.opacity = 1
        ship_rotate.style.opacity = 1
        let xhr2 = new XMLHttpRequest()
        xhr2.open('POST', './wait_battle.php', true)
        xhr2.setRequestHeader('Content-Type', 'application/json')

        let user_request2 = {
            'login': sessionStorage.getItem('login'),
            'coordinates': all_coordinates,
            'wait_game': 'no'
        }

        let json_user_request2 = JSON.stringify(user_request2)

        xhr2.send(json_user_request2)
    }
})






















