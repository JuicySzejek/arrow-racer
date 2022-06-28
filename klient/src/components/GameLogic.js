export default class GameLogic {
    constructor () {
        this.signsUrls = [
            {url : '../images/arrows/straight.png', key : 87},
            {url : '../images/arrows/back.png', key : 83},
            {url : '../images/arrows/left.png', key : 65},
            {url : '../images/arrows/right.png', key : 68},
            {url : '../images/arrows/plus.png', key : 107},
            {url : '../images/arrows/minus.png', key : 109},
        ]

        this.multipler = 1
    }

    startingAnimation() {

        const guiBox = document.querySelector('.gui-box')
        guiBox.style.display = 'none'

        let startAnimationBox = document.createElement('div')
        startAnimationBox.classList.add('start-animation-box')
        document.body.appendChild(startAnimationBox)
        startAnimationBox.innerText = "3.."

        setTimeout(()=>{
            startAnimationBox.innerText = "2.."
            setTimeout(()=>{
                startAnimationBox.innerText = "1.."
                setTimeout(()=>{
                    startAnimationBox.innerText = "START!"
                    setTimeout(()=>{
                        startAnimationBox.remove()
                    },300)
                },1000)
            },1000)
        },1000)
    }

    randomSign () {

        let signNumber = Math.floor(Math.random() * 6);

        const followSign = document.querySelector('#follow-sign')
        followSign.innerHTML = ''

        let sign = document.createElement('div')
        sign.classList.add('sign')

        let img = document.createElement('img')
        img.setAttribute('src',this.signsUrls[signNumber].url)
        sign.appendChild(img)
        followSign.appendChild(sign)

        return this.signsUrls[signNumber].key
    }

    endinfo(win, goodClicks, badClicks) {
        let text
        if (win == true) text = "Wygrana!"
        else text = "Przegrana :("

        const infoBox = document.querySelector('#info')
        infoBox.innerHTML = text + `<br> Udane naciśnięcia: ${goodClicks}, <br> Nieudane naciśnięcia: ${badClicks},`
        infoBox.style.display = 'block'
        infoBox.style.fontSize = '60px'

    }



}