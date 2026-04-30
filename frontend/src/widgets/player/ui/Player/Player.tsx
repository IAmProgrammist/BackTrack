import { Slider } from "shared/ui/Slider"
import "./player.css"
import { Card, CardContent } from "shared/ui/Card"
import { useState } from "react"
import { Button } from "shared/ui/Button"
import { MdArrowLeft, MdArrowRight, MdPause, MdRepeat, MdShuffle } from "react-icons/md"

export const Player = () => {
    const [progress, setProgress] = useState(0.);
    const [volume, setVolume] = useState(1.);
    
    return <div className="player-container">
        <Card className="player">
            <CardContent>
                <div className="player-content">
                    <div className="player-controls">
                        <Button equated>
                            <MdShuffle/>
                        </Button>
                        <Button equated>
                            <MdArrowLeft/>
                        </Button>
                        <Button equated>
                            <MdPause/>
                        </Button>
                        <Button equated>
                            <MdArrowRight/>
                        </Button>
                        <Button equated>
                            <MdRepeat/>
                        </Button>
                    </div>
                    <div className="player-progress">0:00<Slider className="player-progress-controller" progress={progress} onProgressChange={(progress) => setProgress(progress)}/>5:32</div>
                    <div className="player-extra">
                        <Slider progress={volume} onProgressChange={(volume) => setVolume(volume)}/>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
}