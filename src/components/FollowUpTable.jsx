import axios from "axios";
import imag1 from "../assets/logo2.png";
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { Link } from 'react-router-dom'

const FollowUpTable = () => {

    const [alldata, setalldata] = useState([])
    const [date1, setdate1] = useState([])
    const [date2, setdate2] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            await axios.get("https://halocoomapi.glitch.me/get").then((res) => {
                setIsLoading(false)
                setalldata(res.data.data.inbound)
            }).catch((err) => {
                setIsLoading(false)
                console.log(err, "error")
            })
        } catch (error) {
            console.log(error, "error")
        }
    }


    let FU = []
    for (let i = 0; i < alldata.length; i++) {
        const element = alldata[i];
        if (alldata[i]["CALL STATUS"] == "FU") {
            FU.push(element)
        }

    }

    console.log(FU, "fu")

    useEffect(() => {
        fetchData()
    }, [date1, date2])

    return (
        <>
            <nav className='navbar '>
                <div className='image-section'>
                    <img src={imag1} className="img" alt="error" />
                    <h5>APML CALLDESK</h5>
                </div>
                <div className="navbar-buttons">
                    <Link to="/">
                        <button className="drop-button">
                            DROP CALLS
                        </button>
                    </Link>

                    <Link to="/followuptable">
                        <button className="followup-button">
                            FOLLOW UP CALLS
                        </button>
                    </Link>

                    <div className="followup-date">
                        <input type="date" value={date1} onChange={(e) => { setdate1(e.target.value) }} />
                    </div>
                    <div className="followup-date">
                        <input type="date" value={date2} onChange={(e) => { setdate2(e.target.value) }} />
                    </div>
                </div>

                <div className="search-section">
                    <input type="text" name='search' placeholder='Search...' />
                </div>
            </nav>

            <div className="follow-up-table-container">
                <div className="followup-table">
                    <table>
                        <thead>
                            <tr>
                                <th>INGROUP NAME</th>
                                <th>DID</th>
                                <th>USER</th>
                                <th>USER GROUP</th>
                                <th>PHONE NUMBER</th>
                                <th>CALL DATE</th>
                                <th>CALL DURATION</th>
                                <th>CALL STATUS</th>
                                <th>PARK TIME</th>
                                <th>HANGUP REASON</th>
                                <th>COMMENTS</th>
                            </tr>
                        </thead>
                        {
                            isLoading ? <BarLoader color="red" /> :

                                <tbody>
                                    {
                                        FU.filter((item) => {
                                            if (date1.length === 0 && date2.length === 0) {
                                                return item
                                            }
                                            else
                                              (item["CALL DATE"].split(" ")[0] >= date1 && item["CALL DATE"].split(" ")[0] <= date2)
                                            {
                                                console.log(item["CALL DATE"].split(" ")[0],date1)
                                                console.log(item["CALL DATE"].split(" ")[0],date1 && '06-07-2023',"sdfdssfss")
                                                console.log(item["CALL DATE"].split(" ")[0].includes(date1) && item["CALL DATE"].split(" ")[0].includes(date2), "before map")
                                                console.log(item["CALL DATE"].split(" ")[0].includes(date1) , item["CALL DATE"].split(" ")[0].includes(date2), "before map")
                                                return item["CALL DATE"].split(" ")[0].includes(date1) && item["CALL DATE"].split(" ")[0].includes(date2)
                                            }
                                        }).map((item, index) => {
                                            console.log(item, "after if")
                                            return (
                                                <tr key={index}>
                                                    <td>{item["INGROUP NAME"]}</td>
                                                    <td>{item["DID"]}</td>
                                                    <td>{item["USER"]}</td>
                                                    <td>{item["USER GROUP"]}</td>
                                                    <td>{item["PHONE NUMBER"]}</td>
                                                    <td>{item["CALL DATE"]}</td>
                                                    <td>{item["CALL DURATION"]}</td>
                                                    <td>{item["CALL STATUS"]}</td>
                                                    <td>{item["PARK TIME"]}</td>
                                                    <td>{item["HANGUP REASON"]}</td>
                                                    <td>{item["COMMENTS"]}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                        }

                    </table>
                </div>
            </div>
        </>
    )
}

export default FollowUpTable