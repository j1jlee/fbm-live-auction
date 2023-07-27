// import { FontAwesomeIcon } from 'react-fontawesome'
import { FontAwesomeIcon, faAlternateGitHub } from '@fortawesome/react-fontawesome'

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { testDeleteAWSThunk } from '../../store/item';

import './AboutPage.css';

function AboutPage() {

    const [ flashText, setFlashText ] = useState(false)
    const [ cssTest, setCssTest ] = useState("about-visible")
    const [ testInput, setTestInput ] = useState("")

    const dispatch = useDispatch();


    const updateClick = (e) => {
        e.preventDefault();

        console.log("update here");
        const tempSwitch = flashText;
        setFlashText(!tempSwitch);

        console.log("flashText?", flashText)
    }

    const deleteHandle = (e) => {
        e.preventDefault();

        console.log("delete handle");
        dispatch(testDeleteAWSThunk(testInput))


    }





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

        <br></br>
        <hr></hr>

        <button onClick={updateClick}>Test Update Text</button>


        <div className={cssTest}>
            testing
        </div>

        <br></br>

        <form onSubmit={deleteHandle} method={"POST"}>
            <label>
                enter filename
            </label>
            <input
                type="text"
                value={testInput}
                onChange={(e) => {
                    setTestInput(e.target.value)
                }}
            />

        <button type="submit">delete file</button>
        </form>



        </>
    )
}



export default AboutPage;
