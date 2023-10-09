
const user_nickname = document.querySelector('.nickname')
const button_dis = document.querySelector('.start-game')
const symbol_nickname = document.querySelector('.symbol')
const div_error = document.querySelector(".error")
const tool_tip = document.querySelector('.tool-tip')
const tool_arrow = document.querySelector('.arrow')
let iter_errors = 0
function validation_login(connect) {
    iter_errors = 0
    let new_nickname = connect.value
    let errors = false
    let user_errors = []
    let regexp1 = /^[a-zA-Z0-9а-яА-Я]/
    let regexp2 =/[a-zA-Z0-9а-яА-Я]$/
    let regexp3 = /[a-zA-Z0-9а-яА-Я-_' ]/
    if (new_nickname.length === 0) {
        tool_tip.classList.remove('tool-tip-vis')
        tool_arrow.classList.remove('tool-tip-vis')
        symbol_nickname.innerHTML = ''
        let symbol_img = document.createElement('img')
        symbol_img.src = 'https://files.axshare.com/gsc/2AGZYF/88/23/38/882338d60123458087e0059e88a96f0b/images/1_2_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BD%D0%B5_%D0%BC%D0%B5%D0%BD%D1%8E__%D1%84%D1%80%D0%BE%D0%BD%D1%82_%D0%BD%D0%B5%D0%B2%D0%B0%D0%BB%D1%96%D0%B4%D0%BD%D0%B8%D0%B9_/u9.svg?pageId=af9be59b-3408-4b85-a60d-e5bccfcb2b62'
        symbol_nickname.append(symbol_img)
        button_dis.disabled = true
        button_dis.classList.remove('ready')
        div_error.innerHTML= ''
    }
    else {
        if ((new_nickname.length < 3 && new_nickname.length > 0) || new_nickname.length > 10) {
            let error = '&nbsp;&nbsp;&nbsp;На жаль, помилка - дозволена довжина нікнейму від 3 до 10 символів;'
            user_errors.push(error)
            iter_errors += 1
            errors = true
        }
        for (let symbol of new_nickname) {
            if (!regexp3.test(symbol)) {
                let error = "&nbsp;&nbsp;&nbsp;На жаль, помилка - нікнейм може містити літери (zZ-яЯ),цифри (0-9), спецсимволи (Word space, -, ', _)"
                user_errors.push(error)
                iter_errors += 1
                errors = true
                break
            }
        }
        if (!regexp1.test(new_nickname)) {
            let error = "&nbsp;&nbsp;&nbsp;Нікнейм повинен починатися з літер чи цифр;"
            user_errors.push(error)
            iter_errors += 1
            errors = true
        }
        if (!regexp2.test(new_nickname)) {
            let error = "&nbsp;&nbsp;&nbsp;Нікнейм повинен закінчуватися на літеру чи цифру;"
            user_errors.push(error)
            iter_errors += 1
            errors = true
        }

        if (errors) {
            symbol_nickname.innerHTML = ''
            let symbol_img = document.createElement('img')
            symbol_img.src = 'https://files.axshare.com/gsc/2AGZYF/88/23/38/882338d60123458087e0059e88a96f0b/images/1_2_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BD%D0%B5_%D0%BC%D0%B5%D0%BD%D1%8E__%D1%84%D1%80%D0%BE%D0%BD%D1%82_%D0%BD%D0%B5%D0%B2%D0%B0%D0%BB%D1%96%D0%B4%D0%BD%D0%B8%D0%B9_/u9.svg?pageId=af9be59b-3408-4b85-a60d-e5bccfcb2b62'
            symbol_nickname.append(symbol_img)
            button_dis.disabled = true
            button_dis.classList.remove('ready')
            div_error.innerHTML = ''
            if (iter_errors > 2) {
                tool_tip.innerHTML = ''
                for (let i = 0; i < 2; i++) {
                    let user_error = document.createElement('p')
                    user_error.style.margin = 0
                    if (i === 1) {
                        user_error.innerHTML = user_errors[i] + '...'
                        div_error.append(user_error)
                        continue
                    }
                    user_error.innerHTML = user_errors[i]
                    div_error.append(user_error)
                }
                for (let error of user_errors) {
                    let user_error = document.createElement('p')
                    user_error.style.margin = 0
                    user_error.innerHTML = error
                    tool_tip.append(user_error)
                }
            }
            else {
                for (let error of user_errors) {
                    let user_error = document.createElement('p')
                    user_error.style.margin = 0
                    user_error.innerHTML = error
                    div_error.append(user_error)
                }
            }
        }
        else {
            tool_tip.classList.remove('tool-tip-vis')
            tool_arrow.classList.remove('tool-tip-vis')
            div_error.innerHTML= ''
            button_dis.disabled = false
            button_dis.classList.add('ready')
            symbol_nickname.innerHTML = ''
            let symbol_img = document.createElement('img')
            symbol_img.src = 'https://files.axshare.com/gsc/2AGZYF/88/23/38/882338d60123458087e0059e88a96f0b/images/1_3_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BD%D0%B5_%D0%BC%D0%B5%D0%BD%D1%8E__%D1%84%D1%80%D0%BE%D0%BD%D1%82_%D0%B2%D0%B0%D0%BB%D1%96%D0%B4%D0%BD%D0%B8%D0%B9_/u10.svg?pageId=da49ce86-c2a1-450c-8d2c-7611c8f52120'
            symbol_nickname.append(symbol_img)
        }
    }
}

user_nickname.addEventListener('input', function () {
    setTimeout(validation_login, 200, user_nickname)
})

user_nickname.addEventListener('blur', function () {
    validation_login(user_nickname)
})


div_error.addEventListener('mouseover', function () {
    if (iter_errors > 2) {
        tool_arrow.style.left = tool_tip.offsetLeft + 10 + "px"
        tool_arrow.style.top = tool_tip.offsetTop + tool_tip.offsetHeight - 6 + "px"
        tool_tip.classList.add('tool-tip-vis')
        tool_arrow.classList.add('tool-tip-vis')
    }
})

div_error.addEventListener('mouseout', function () {
    tool_tip.classList.remove('tool-tip-vis')
    tool_arrow.classList.remove('tool-tip-vis')
})

button_dis.addEventListener('click', function () {
    let login = user_nickname.value
    sessionStorage.setItem('login', login)
    fetch('validation.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'Login=' + login,
    })
        .then(response => {
            if (response.status === 204) {
                let user_error = document.createElement('p')
                user_error.style.margin = 0
                user_error.innerHTML = '&nbsp;&nbsp;&nbsp;На жаль, помилка - данний нікнейм вже зайнят, спробуйте іншій.'
                div_error.append(user_error)
            }
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            if (response.status === 200) {
                window.location.href = './acc/acc.php'
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
})

let user_login = sessionStorage.getItem('login')
user_nickname.value = user_login


































