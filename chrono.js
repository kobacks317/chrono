let stopwatchSeconds = 0;
let stopwatchMinutes = 0;
let stopwatchHours = 0;
let running = false;
let countdown = false;
let chronoRunning = false;
let startDate = new Date();
let pauseDate = new Date();
let chronoDate = new Date();
let maxTime = 900;

function adjustTime(minutes) {
    if (minutes == 0) {
        const d = document.getElementById('max-time-display').valueAsDate;
        maxTime = d.getUTCHours()*3600 + d.getUTCMinutes()*60;
    } else {
        if (maxTime + minutes <= 300) {
            minutes = minutes/5;
        }
        maxTime = Math.max(60, maxTime + minutes * 60);
    }
    document.getElementById('progress-bar').max = maxTime;
    document.getElementById('max-time-display').value = `${String(Math.floor(maxTime/3600)).padStart(2, '0')}:${String(Math.floor(maxTime/60%60)).padStart(2, '0')}`;
    if (stopwatchHours == 0 && stopwatchMinutes == 0 && stopwatchSeconds == 0) {
        startDate = new Date();
    }
    setAnalogClockMarker(true);
}

function updateClockAndStopwatch() {
    const now = new Date();
    now.setMilliseconds(0);
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    document.getElementById('clock').textContent = 
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    document.getElementById('hour-hand').style.transform = `rotate(${(hours * 30) + (minutes / 2) + 270}deg)`;
    document.getElementById('minute-hand').style.transform = `rotate(${hours*360 + minutes * 6 + seconds /10 + 270}deg)`;
    document.getElementById('second-hand').style.transform = `rotate(${hours*360 + minutes * 360 + seconds * 6 + 270}deg)`;

    updateChrono();

    if (running) {
        let elapsed = 0;
        let sign = "";
        let endDate = new Date(startDate);
        endDate.setSeconds(endDate.getSeconds() + maxTime);
        // if (now > startDate) {
        if (now - startDate > -1000) {
            // タイマー開始後
            if (countdown) {
                // カウントダウン形式
                // if (now <= endDate) {
                if (now - endDate > -1000) {
                    // タイムアップ後
                    elapsed = (now - endDate) / 1000;
                    sign = "+";
                } else {
                    // タイムアップ前
                    elapsed = (endDate - now) / 1000;
                    sign = "-";
                }
            } else {
                // カウントアップ形式
                elapsed = (now - startDate) / 1000;
            }
        } else {
            // タイマー開始前
            elapsed = (startDate - now) / 1000;
            sign = "-";
        }
        stopwatchSeconds = Math.floor(elapsed%60);
        stopwatchMinutes = Math.floor(elapsed/60%60);
        stopwatchHours = Math.floor(elapsed/3600);

        document.getElementById('stopwatch').textContent = 
            `${sign} ${String(stopwatchHours).padStart(2, '0')}:${String(stopwatchMinutes).padStart(2, '0')}:${String(stopwatchSeconds).padStart(2, '0')}`;

        if (now - startDate <= -1000) {
            // タイマー開始前
            document.getElementById('progress-bar').value = 0;
            setStopwatchColor("grey");
        } else if (now - endDate <= -1000) {
            // タイマー開始後
            // タイムアップ前
            if (countdown) {
                // カウントダウン
                document.getElementById('progress-bar').value = maxTime - elapsed;
            } else {
                // カウントアップ
                document.getElementById('progress-bar').value = elapsed;
            }
            setStopwatchColor("unset");
        } else {
            // タイムアップ後
            document.getElementById('progress-bar').value = maxTime;
            setStopwatchColor("red");
        }
    }
}



function startStopwatch(chrono=false) {
    running = true;
    startDate = new Date();
    startDate.setMilliseconds(0);
    setAnalogClockMarker(true);
    updateClockAndStopwatch();
    if (chrono) {
        startChrono(true);
    }
}

function stopStopwatch() {
    if (running) {
        running = false;
        pauseDate = new Date();
        setStopwatchColor("grey");
    } else {
        running = true;
        if (stopwatchHours == 0 && stopwatchMinutes == 0 && stopwatchSeconds == 0) {
            startStopwatch();
        } else {
            startDate.setTime(startDate.getTime() + (new Date() - pauseDate));
            setAnalogClockMarker(true);
        }
        updateClockAndStopwatch();
    }
}

function toggleCountdown() {
    countdown = !countdown;
    updateClockAndStopwatch();
}

function setStopwatchColor(color) {
    document.getElementById('stopwatch').style.color = color;
}

function resetStopwatch() {
    running = false;
    stopwatchSeconds = 0;
    stopwatchMinutes = 0;
    stopwatchHours = 0;
    document.getElementById('stopwatch').textContent = "00:00:00";
    document.getElementById('progress-bar').value = 0;
    document.getElementById('guage').textContent = "";
    document.getElementById('chronoRec').innerHTML = "";
    setAnalogClockMarker(false);
    setStopwatchColor("grey");
}

function startChrono(force=false) {
     if (chronoRunning) {
         let elapsed = (new Date().setMilliseconds(0) - chronoDate) / 1000;
         document.getElementById('chronoRec').innerHTML += `${String(Math.floor(elapsed/60%60)).padStart(2, '0')}:${String(Math.floor(elapsed%60)).padStart(2, '0')}`;
     }
     if (chronoRunning && !force) {
         chronoRunning = false;
         updateChrono();
     } else {
         chronoDate = new Date();
         chronoDate.setMilliseconds(0);
         document.getElementById('guage').textContent = Number(document.getElementById('guage').textContent) + 1;
         document.getElementById('chronoRec').innerHTML += "<br>" + String(document.getElementById('guage').textContent).padStart(2, '&nbsp;') + ":&nbsp;&nbsp;";
         document.getElementById('chronoRec').scrollTop = document.getElementById('chronoRec').scrollHeight;
         chronoRunning = true;
         updateChrono();
     }
}

function updateChrono() {
    if (chronoRunning) {
        let start = Math.floor(chronoDate/1000)*6%360;
        let end = Math.floor((new Date() - chronoDate)/1000)*6%360;
        let col1 = "white";
        let col2 = "rgb(230, 230, 255)";
        let col3 = "white";
        //document.getElementById('secChrono').style.background = `conic-gradient(${col1} 0deg, ${col1} ${0}deg, ${col2} ${0}deg, ${col3} ${end}deg, ${col1} ${end}deg)`;
        document.getElementById('secChrono').textContent = Math.floor((new Date() - chronoDate)/60000);
        document.getElementById('stopwatch-second-hand').style.transform = `rotate(${Math.floor((new Date() - chronoDate)/1000)*6 + 270}deg)`;
    } else {
        //document.getElementById('secChrono').style.background = "white";
        document.getElementById('secChrono').textContent = "";
        document.getElementById('stopwatch-second-hand').style.transform = "rotate(270deg)";
    }
}

function setAnalogClockMarker(display) {
    if (display) {
        let start = ((startDate.getMinutes() + startDate.getSeconds()/60) * 6)%360;
        let end = ((startDate.getMinutes() + startDate.getSeconds()/60 + maxTime/60) * 6)%360;
        let bg = "transparent";
        let col1 = "transparent";
        let col2 = "skyblue";
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            col2 = "blue";
        }

        
        document.getElementById('start-time').style.visibility = "visible";
        document.getElementById('end-time').style.visibility = "visible";

        document.getElementById('start-time').value = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:${String(startDate.getSeconds()).padStart(2, '0')}`;

        let endDate = new Date(startDate);
        endDate.setSeconds(endDate.getSeconds() + maxTime);
        document.getElementById('end-time').value = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:${String(endDate.getSeconds()).padStart(2, '0')}`;
        

        if (maxTime > 3600) {
            col1 = "lightgrey";
        }
        if (maxTime%3600 == 0) {
            col1 = "skyblue";
            col2 = "black";
            start = start - 1;
            end = start + 1;
        }
        if (start < end) {
            document.getElementById('analog-clock').style.background = `radial-gradient(circle closest-side, ${bg} 93%, rgba(255, 255, 255, 0) 93%, 100%, rgb(255, 255, 255) 90%), conic-gradient(${col1} 0deg, ${col1} ${start}deg, ${col2} ${start}deg, ${col2} ${end}deg, ${col1} ${end}deg)`;
        } else {
            document.getElementById('analog-clock').style.background = `radial-gradient(circle closest-side, ${bg} 93%, rgba(255, 255, 255, 0) 93%, 100%, rgb(255, 255, 255) 90%), conic-gradient(${col2} 0deg, ${col2} ${end}deg, ${col1} ${end}deg, ${col1} ${start}deg, ${col2} ${start}deg)`;
        }
    } else {
        document.getElementById('analog-clock').style.background = "none";
        document.getElementById('start-time').style.visibility = "hidden";
        document.getElementById('end-time').style.visibility = "hidden";
    }
}

function adjustZoom() {
    let scaleFactor = 1;
    let height = window.innerHeight;
    // let height = window.innerHeight - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safeAreaInsetTop'));
    if (window.innerHeight > window.innerWidth*1.4) {
        scaleFactor = Math.min(window.innerWidth / 200, height / 400);
        document.getElementById('chrono').style.flexDirection = "column";
        document.getElementById('chrono').style.height = "400px";
        document.getElementById('chrono').style.width = "200px";
    } else {
        scaleFactor = Math.min(window.innerWidth / 400, height / 200);
        document.getElementById('chrono').style.flexDirection = "row";
        document.getElementById('chrono').style.height = "200px";
        document.getElementById('chrono').style.width = "400px";
    }
    document.getElementById('chrono').style.zoom = `${scaleFactor}`;
}

async function pip() {
    const pipWindow = await documentPictureInPicture.requestWindow({
        width: 200,
        height: 400
    });
    const c = document.getElementById("chrono").cloneNode(true);
    pipWindow.document.body.append(c);

    const script = pipWindow.document.createElement("script");
    script.src = "chrono.js";
    pipWindow.document.body.appendChild(script);
}

function init() {
    if (!document.pictureInPictureEnabled) {
        document.getElementById("pip-button").remove();
    }
    setInterval(updateClockAndStopwatch, 1000);
    document.getElementById('max-time-display').addEventListener("change", (event) => {
        adjustTime(0);
    });
    document.getElementById('start-time').addEventListener("change", (event) => {
        d = document.getElementById('start-time').valueAsDate;
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        document.getElementById('start-time').valueAsDate = d;
        
        startDate.setHours(d.getUTCHours()); 
        startDate.setMinutes(d.getUTCMinutes()); 
        startDate.setSeconds(d.getUTCSeconds()); 
        startDate.setMilliseconds(0);
        if (!running) {
            running = true;
        }
        setAnalogClockMarker(true);
        updateClockAndStopwatch();
    });
    window.addEventListener('resize', adjustZoom);
    window.addEventListener('load', adjustZoom);
}

init();
