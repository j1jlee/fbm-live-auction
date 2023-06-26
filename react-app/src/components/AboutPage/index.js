// import { FontAwesomeIcon } from 'react-fontawesome'
import { FontAwesomeIcon, faAlternateGitHub } from '@fortawesome/react-fontawesome'

function AboutPage() {


    return (
        <>
        <div className="about-by">
        Created by Jaewon Lee for the App Academy Jan 2023 Cohort.
        </div>

        <div>
        <a href="https://github.com/j1jlee/fbm-live-auction/">Github</a>
        </div>

        <div>
        <a href="linkedin.com/in/joshua-lee-9573a0142">LinkedIn</a>
        </div>

        <br></br>
        <hr></hr>

        <div>
            Technologies Used:
        </div>
        <ul>
            <li>Javascript</li>
            <li>Python</li>
            <li>React/Redux</li>
            <li>Flask</li>
            <li>SQLAlchemy/Postgres</li>
        </ul>
        </>
    )
}



export default AboutPage;
