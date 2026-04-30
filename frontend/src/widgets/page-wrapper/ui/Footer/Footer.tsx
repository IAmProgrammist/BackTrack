import "./footer.css"

const RANDOM_PHRASES = [
    "Oh, ho, ho, it's magic, you know!",
    "What a splendid pie, pizza-pizza pie",
    "Старая мельница крутится-вертится",
    "Куда же я иду...",
    "No alarms and no surprises, please",
    "So can we wander for a spell?",
    "Год за годом растут большие города",
    "And everybody wants to get evil tonight",
    "Словно из водопровода льёт на нас с небес вода",
    "Sometimes I wonder again and again",
    "Это за окном рассвет!"
]

export const Footer = () => {
    return <footer className="footer">
        IAmProgrammist, {new Date().getFullYear()}. {RANDOM_PHRASES[Math.floor(Math.random() * RANDOM_PHRASES.length)]}
    </footer>
}