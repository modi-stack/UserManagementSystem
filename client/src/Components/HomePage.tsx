import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import Layout from '../Components/Layout';
import { ApiUrls } from '../Enum/Enum';
import { Config } from '../Config/Config';
import { User } from '../Interfaces/UserInterface';
import { Link } from 'react-router-dom';

let getToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJpeWEiLCJzY29wZSI6WyJjdXN0b21lcjpjcmVhdGUiXSwiaWF0IjoxNjgzOTY1NDI5fQ.essQ0YJTL6KC8qAQq_-F-lQ4Wr-tMGk0CDLTkzqD2Pg';

const HomePage = () => {
    const [allUsers, setallUsers] = useState<User[]>([]);
    const [modelData, setModelData] = useState<User[]>([]);

    const removeUser = async (email: string) => {
        try {
            const YesNo = prompt("Deleted User with email Id: " + email + "?(Yes/No)");
            if (YesNo === "Yes".toLowerCase()) {
                const body = { "email_id": email };
                const removeUser = await axios.delete<User>(
                    Config.api_base_url + ApiUrls.REMOVE_USER,
                    {
                        headers: {
                            'authorization': `${getToken}`,
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(body)
                    },
                );
                setallUsers(allUsers.filter((delete_user) => delete_user.email_id !== email))
            }
        } catch (error) {
            console.error(error);
        }
    }

    const showUser = (id: number) => {
        const singleUser = allUsers.filter((_filteredUser) => _filteredUser.id === id)
        setModelData(singleUser);
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const allData = await axios.get<User[]>(
                    Config.api_base_url + ApiUrls.USER_LIST, {
                    headers: {
                        'authorization': `${getToken}`
                    }
                });
                // console.log(allData.data);    
                setallUsers(allData.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [])
    // console.log(allUsers);

    return (
        <Layout>
            <>
                <div className="view-modal">
                    <div className="modal fade" id="exampleModal">
                        <div className="modal-dialog">
                            {modelData && modelData.map((userShow) => {
                                return (
                                    <div key={userShow.id}>
                                        <div className="modal-content" style={{ width: "700px" }}>
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">User Data</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <h5>Woo-hoo! you are viewing User {userShow.id}'s Data</h5>
                                                <table className="table table-striped table-sm">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Email_id</th>
                                                            <th>Created_at</th>
                                                            <th>Updated_at</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{userShow.id}</td>
                                                            <td>{userShow.name}</td>
                                                            <td>{userShow.email_id}</td>
                                                            <td>{userShow.created_at}</td>
                                                            <td>{userShow.updated_at}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <h1 style={{ textAlign: 'center', color: 'black' }}>User Details</h1> <br />
                <table className="table table-hover" style={{ backgroundColor: '#E8E8E0', color: 'black' }}>
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th scope='"col'>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {allUsers.map((_eachUser) => {
                            return (
                                <tr key={_eachUser.id} style={{ textAlign: 'center' }}>
                                    <td>{_eachUser.id}</td>
                                    <td>{_eachUser.name}</td>
                                    <td>{_eachUser.email_id}</td>
                                    <td>{_eachUser.created_at}</td>
                                    <td>{_eachUser.updated_at}</td>

                                    <td>
                                        <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
                                            <div className="btn-group mr-2" role="group" aria-label="First group">
                                                <button className="btn btn-warning"><Link to={'/editUser/' + _eachUser.id} className="newUserBtn">Edit User</Link>
                                                </button>
                                                <button className="btn btn-danger" onClick={() =>
                                                    removeUser(_eachUser.email_id)
                                                }>Delete</button>

                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    value={_eachUser.id} data-bs-toggle="modal"
                                                    data-bs-target="#exampleModal"
                                                    onClick={(e) => {
                                                        showUser(parseInt(e.currentTarget.value));
                                                    }}
                                                >View Data</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </>
        </Layout>
    );
}

export default HomePage;