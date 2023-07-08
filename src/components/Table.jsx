import React, { useEffect, useState, } from 'react'
import "../assets/main.css";
import imag1 from "../assets/logo2.png";
import axios from 'axios'
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";
import { BarLoader } from 'react-spinners'
import tabelhader from "../components/common";
import { Link } from 'react-router-dom';
const Table = () => {

    const [liveInboundDropCalls, setLiveInboundDropCalls] = useState([])
    const [outbounddata, setoutbounddata] = useState([])
    const [realtimeData, setrealtimeData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [finalData, setFinalData] = useState([])
    const [finalData1, setFinalData1] = useState([])
    const [InputStatus, setInputStatus] = useState()
    const [isshow, setisshow] = useState(false)
    const [isinput, setisInputStatus] = useState(false)
    const [updatestatus, setupdatestatus] = useState()
    const [livedate, setlivedate] = useState()
    const [loader, setloader] = useState(false)


    const headerLiveData = {
        Accept: "application/json",
        "Content-Type": "application/json"
    }

    const headerLiveDataReport = {
        Authorization: "Basic NjY2NjpoYWxvb2NvbQ==",
    }

    const commonHeader = {
        "Content-Type": "application/json"
    }

    const fetchFunction = () => {
        const promise1 = axios.get('http://localhost:3000/liveData', headerLiveData)
        const promise2 = axios.get('http://localhost:3000/liveData1', headerLiveDataReport)
        const promise3 = axios.get('http://localhost:3000/outbound', commonHeader)
        const promise4 = axios.get('http://localhost:3000/inbound', commonHeader)

        Promise.all([promise1, promise2, promise3, promise4]).then((response) => {

            let dropCalls = []
            for (let i = 0; i < response[0].data.length; i++) {
                if (response[0].data[i]['CALL STATUS'] === "DROP") {
                    dropCalls.push(response[0].data[i])
                }
            }


            const uniquePhoneNumbers = Object.values(
                dropCalls.reduce((acc, obj) => {
                    acc[obj['PHONE NUMBER']] = obj;
                    return acc
                }, {})
            )
            setLiveInboundDropCalls(uniquePhoneNumbers);
            let uv
            let wx = []
            uniquePhoneNumbers.map((res) => {
                for (let i = 0; i < response[3].data.length; i++) {
                    if (response[3].data[i]["CALL STATUS"] === "FU") {
                        if (response[3].data[i]["PHONE NUMBER"] !== res["PHONE NUMBER"]) {
                            uv = res
                        }
                        else {
                            uv = null
                            break;
                        }
                    }
                }
                if (uv !== null) {
                    var newObj = {
                        match: true,
                        nobj: uv,

                    }
                    wx.push(newObj)
                } else {
                    wx.push({ noMatch: true, ...uv })
                }
            })

            let yz = []
            for (let i = 0; i < wx.length; i++) {
                if (wx[i].match) {
                    yz.push(wx[i])
                }
            }

            let nofodrop = []
            yz.map((res) => {
                for (let i = 0; i < dropCalls.length; i++) {
                    const element = dropCalls[i]["PHONE NUMBER"];
                    if (element === res.nobj["PHONE NUMBER"]) {
                        nofodrop.push(element)
                    }
                }
            })
            // console.log(nofodrop, "nofodrop")

            const uniquedata = [...new Set(nofodrop)];
            const repeatedLengths = [];
            const nonRepeatedLengths = [];
            let dublicatecall = []
            uniquedata.forEach(value => {
                const count = nofodrop.filter(item => item === value).length;
                if (count > 1) {
                    repeatedLengths.push(count);
                } else {
                    nonRepeatedLengths.push(count);
                }
            });

            dublicatecall = repeatedLengths.concat(nonRepeatedLengths)

            const result = yz.map((obj, index) => {
                const newKey = `newKey`;
                const newObj = { ...obj };
                newObj[newKey] = dublicatecall[index];
                return newObj;
            });

            setFinalData1(result)

            //live inbound reports
            let realdata = [];
            for (let i = 0; i < response[1].data.length; i++) {
                const element = response[1].data[i];
                realdata.push(element)
            }
            setrealtimeData(realdata)

            //outbound data
            let abc
            let ak = []
            uniquePhoneNumbers.map((res) => {
                for (let i = 0; i < response[2].data.length; i++) {
                    if (response[2].data[i].status === "FU") {
                        if (response[2].data[i].phone_dialed_no !== res["PHONE NUMBER"]) {
                            abc = res
                        }
                        else {
                            abc = null
                            break;
                        }
                    }
                }
                if (abc !== null) {
                    var obj = {
                        match: true,
                        ob: abc,
                    }
                    ak.push(obj)
                } else {
                    ak.push({ noMatch: true, ...abc })
                }
            })

            let am = []
            for (let i = 0; i < ak.length; i++) {
                if (ak[i].match) {
                    am.push(ak[i])
                }
            }
            setFinalData(am)
            setIsLoading(true)
        })
    }

    // function for updating the status of folllowup calls 
    let dropStatus = []
    for (let i = 0; i < finalData1.length; i++) {
        const element = finalData1[i].nobj["CALL STATUS"];
        dropStatus.push(element)
        // setInputStatus(element)
        // console.log(element, "CALL STATUS")

    }


    const handleupdate = (res) => {
        console.log(res.nobj["CALL DATE"], "followup sucessfully")
        const date = res.nobj["CALL DATE"]
        setlivedate(date)
        setisshow(true)
        setInputStatus(res.nobj["CALL STATUS"])
    }


    const handlechange = (e) => {
        setisInputStatus(true)
        setupdatestatus(e.target.value)

    }
    console.log(updatestatus, "updatestatus")

    const handltoSubmit = async () => {
        console.log("submitted")
        setloader(true)
        const d = {
            "CALL STATUS": updatestatus
        }
        let calldate = []
        await axios.get("https://halocoomapi.glitch.me/get").then((res) => {
            // console.log(res.data.data.inbound,"response")
            const response = res.data.data.inbound
            for (let i = 0; i < response.length; i++) {
                let element = response[i];
                calldate.push(element);
            }

            //  calldate.push(response)
        }).catch((err) => {

            console.log(err, "error")
        })

        console.log(d, "d")
        console.log(calldate, "call date")
        let id = []
        for (let i = 0; i < calldate.length; i++) {
            const element = calldate[i]["CALL DATE"];
            if (livedate === element) {
                id.push(calldate[i]._id)
                console.log(calldate[i])
            }

        }

        await axios.put(`https://halocoomapi.glitch.me/get/inbound/put/:${id}`, {
            headers: {},
            data: d
        }).then((res) => {
            setloader(false)
            alert("change Successfully")
            setisshow(false)
            console.log(res)
            console.log("sucessfully change")
        }).catch((err) => {
            setloader(false)
            alert("sorry status is not change ")
            setisshow(false)
            console.log(err, "error")
        })

        console.log(id, "id")
    }


    // export function here 
    const exportExcelFile = () => {
        // const element = document.getElementById("expo_table");
        // let ws = utils.table_to_sheet(element);
        // /* generate workbook and add the worksheet */
        // let wb = utils.book_new();
        // utils.book_append_sheet(wb, ws, "Sheet1");
        // /* save to file */
        // writeFile(wb, "sample.xlsx");
    };

    console.log(finalData1, "finalData")
    useEffect(() => {
        fetchFunction()
    }, [])
    return (
        <>
            <div className="main-box" >
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

                    </div>
                    <div className="search-section">
                        <input type="text" name='search' placeholder='Search...' />
                    </div>
                </nav>



                {/* main section */}
                <section className='main-section' >

                    {/* table section */}
                    <div className="table-section"  >
                        {/* <div style={{ border:"2px solid black", width:"100px", height:"100px",  top:"300px"}}></div> */}

                        <div className="left-table" >
                            <div style={{ height: "78vh", marginTop: "4px" }}>
                                {
                                    realtimeData.map((res, index) => {
                                        return (
                                            <li>
                                                <ul key={""} style={{ display: "flex", justifyContent: "space-around", alignItems: "center", color: "white", marginTop: "10px" }}>
                                                    <li style={{ width: "auto" }}>{res["DIAL LEVEL:"]}</li>
                                                    <li style={{ width: "auto", fontWeight: res["DIAL LEVEL:"] === "DROPPED / ANSWERED:" ? "bold" : "", color: res["DIAL LEVEL:"] === "DROPPED / ANSWERED:" ? "red" : "" }}>{res["1.000"]}</li>
                                                </ul>
                                            </li>
                                        )
                                    })
                                }

                            </div>
                        </div>

                        <div className="container" >

                            <div className="heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h4 style={{ color: "red" }}>ONLY DROP CALLS FROM LIVE DATA</h4>
                                <div style={{ height: "45px", width: "100px", backgroundColor: "#23252b", marginRight: "20px", borderRadius: "10px", color: "red", marginBottom: "5px" }}>
                                    <h3 style={{ marginLeft: "20px", marginTop: "6px" }}>{finalData1.length} </h3>
                                </div>
                                <button className='exportbtn' onClick={exportExcelFile()} >Export</button>

                            </div>

                            <div className="secondaryContainer" style={{ position: "relative" }}>
                                {/* popup */}
                                <div className={isshow ? "popup" : "popup1"} style={{ zIndex: "1" }}>
                                    <button className='closebtn' onClick={() => setisshow(false)}>close </button>
                                    <div className='call-box'>
                                        <label style={{ fontSize: "20px" }} htmlFor="">CALL STATUS</label>
                                        <br />
                                        <input className='callinp' type="text" onChange={handlechange} name='CALL STATUS' value={isinput ? updatestatus : InputStatus} />
                                        <br />
                                        {
                                            loader ? <div style={{ marginLeft: "50px", marginTop: "20px" }}> <BarLoader color='black' /></div> :
                                                <button className='submitbtn' style={{ width: "100px", height: "45px" }} onClick={handltoSubmit}>submmited</button>

                                        }
                                    </div>
                                </div>

                                <table id='expo_table' className={isshow ? "opt" : ""}   >
                                    {/* popup */}


                                    <thead>
                                        <tr>
                                            {
                                                tabelhader.map((res) => {
                                                    return (<th>{res}</th>)
                                                })
                                            }


                                        </tr>
                                    </thead>
                                    {
                                        isLoading ?
                                            // false ?
                                            <>
                                                {/* updated  */}

                                                <tbody style={{ opacity: "1" }}>

                                                    {
                                                        finalData1.filter((res, index) => {
                                                            if (search.length === 0) {
                                                                return res
                                                            } else {
                                                                return res.nobj["PHONE NUMBER"].includes(search)
                                                            }
                                                        }).map((res, index) => {
                                                            return (
                                                                <tr key={index} className="table-row">
                                                                    <td>{index + 1}</td>
                                                                    <td>{res.nobj["INGROUP NAME"]}</td>
                                                                    <td>{res.nobj["DID"]}</td>
                                                                    <td>{res.nobj["USER"]}</td>
                                                                    <td>{res.nobj["PHONE NUMBER"]}</td>
                                                                    <td>{res.nobj["CALL DATE"]}</td>
                                                                    <td>{res.nobj["CALL DURATION"]}</td>
                                                                    <td>{res.nobj["CALL STATUS"]}</td>
                                                                    <td>{res.nobj["PARK TIME"]}</td>
                                                                    <td>{res.nobj["HANGUP REASON"]}</td>
                                                                    <td style={{ fontWeight: "bold", fontSize: "25px", color: "red" }}>{res["newKey"]}</td>
                                                                    <td><button className='followup' onClick={() => handleupdate(res)} >Follow up</button></td>
                                                                </tr>
                                                            )
                                                        })

                                                    }

                                                </tbody>
                                            </>


                                            :
                                            <>
                                                <div className='spinner'>
                                                    <BarLoader
                                                        color='red'
                                                    />
                                                </div>
                                            </>
                                    }
                                </table>


                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </>
    )
}

export default Table