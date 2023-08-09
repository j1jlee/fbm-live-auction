// import { FontAwesomeIcon } from 'react-fontawesome'
import { FontAwesomeIcon, faAlternateGitHub } from '@fortawesome/react-fontawesome'

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { testDeleteAWSThunk, testGetAWSThunk } from '../../store/item';

// import { frontend_test_get_s3 } from '../aaAwsFrontendTest'

import './AboutPage.css';

function AboutPage() {

    const [ flashText, setFlashText ] = useState(false)
    const [ cssTest, setCssTest ] = useState("about-visible")
    const [ testInput, setTestInput ] = useState("")

    const [ getInput,setGetInput ] = useState('');
    // const [ getFront, setGetFront ] = useState('');

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

    const getHandle = (e) => {
        e.preventDefault();

        console.log("get handle");
        dispatch(testGetAWSThunk(getInput))
    }

    // const handleFront = (e) => {
    //     e.preventDefault();

    //     const frontFormData = new FormData();

    //     frontFormData.append()
    // }





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
{/*
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

        <form onSubmit={getHandle} method={"POST"}>
            <label>
                enter filename to get
            </label>
            <input
                type="text"
                value={getInput}
                onChange={(e) => {
                    setGetInput(e.target.value)
                }}
            />

        <button type="submit">get file</button>
        </form> */}


        {/* <form onSubmit={getHandle} method={"POST"}>
            <label>
                get test frontend
            </label>
            <input
                type="text"
                value={getFront}
                onChange={(e) => {
                    setGetFront(e.target.value)
                }}
            />

        <button type="submit">get file</button>
        </form> */}


        </>
    )
}



export default AboutPage;
