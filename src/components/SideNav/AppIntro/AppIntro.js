import './AppIntro.css'

function AppIntro() {
    return (
        <div>
            <p fontFamily={"Orelega One"} className="greeting">Sign up and Login!</p>
            <p fontFamily={"Orelega One"} className="appIntro">
                Select a day,<br/>
                start time,<br/>
                end time,<br/>
                and add course name!<br/>
            </p>
            <p className="appWord">Make your own Schedule!</p>

        </div>
    );
}

export default AppIntro;