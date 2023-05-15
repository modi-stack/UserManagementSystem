import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { User } from "../Interfaces/UserInterface";
import { Config } from "../Config/Config";
import { ApiUrls } from "../Enum/Enum";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";

let getToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJpeWEiLCJzY29wZSI6WyJjdXN0b21lcjpjcmVhdGUiXSwiaWF0IjoxNjgzOTY1NDI5fQ.essQ0YJTL6KC8qAQq_-F-lQ4Wr-tMGk0CDLTkzqD2Pg';

const EditUser = () => {
    const { id } = useParams();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [nameValidity, setNameValidity] = useState({ nameError: "", valid: false });
    const [emailValidity, setEmailValidity] = useState({ emailError: "", valid: false });
    const navigate = useNavigate();

    // For Change Password
    const [new_password, setNew_password] = useState<string>("")
    const [confirm_password, setConfirm_password] = useState<string>("")
    const [passwordValidity, setPasswordValidity] = useState({ Error: "", valid: false });
    const [mismatchValidity, setMismatchValidity] = useState({ Error: "", valid: false });

    useEffect(() => {
        getUserDetails();
    }, [])

    const getUserDetails = async () => {
        try {
            const UserData = await axios.get<User>(
                Config.api_base_url + ApiUrls.SHOW_USER + id, {
                headers: {
                    'authorization': `${getToken}`
                }
            });
            console.log(UserData.data);
            setName(UserData.data.name);
            setEmail(UserData.data.email_id);
            setNameValidity({ nameError: "", valid: true });
            setEmailValidity({ emailError: "", valid: true });
        } catch (error) {
            console.error(error);
        }
    }

    const editUser = async () => {
        try {
            validateName(name);
            validateEmail(email);
            if (nameValidity.valid && emailValidity.valid) {
                const body = {
                    "id": id,
                    "name": name,
                    "email_id": email
                }

                const config = {
                    method: 'put',
                    url: Config.api_base_url + ApiUrls.EDIT_USER,
                    headers: {
                        'authorization': `${getToken}`,
                        "Content-Type": "application/json"
                    },
                    data: body
                };
                const response = await axios(config);
                //console.log(response)
                alert(response.data);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            const err = error as AxiosError;
            alert(err.response?.data);
            navigate('/');
        }
    }

    const validateName = (i_name: string) => {
        if (i_name.length === 0) {
            setNameValidity({ nameError: "Blank Name, Please enter Name", valid: false });
        }
        else
            setNameValidity({ nameError: "", valid: true });
        setName(i_name);
        // console.log("X");
    }

    function isValidEmail(email_id: string) {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email_id);
    }

    const validateEmail = (i_email: string) => {
        if (i_email.length === 0) {
            setEmailValidity({ emailError: "Blank Email, Please enter Email", valid: false });
        }
        else if (!isValidEmail(i_email)) {
            setEmailValidity({ emailError: "Invalid Email", valid: false });
        }
        else {
            setEmailValidity({ emailError: "", valid: true });
        }
        setEmail(i_email);
        // console.log("X");
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name);
        if (e.target.name === "name")
            validateName(e.target.value);
        else if (e.target.name === "email_id")
            validateEmail(e.target.value);
    };
    const refreshPage = () => {
        window.location.reload();
    }
    const updatePassword = async () => {
        try {
            validatePassword(new_password);
            validateConfirmPassword(new_password, confirm_password);
            if (passwordValidity.valid && mismatchValidity.valid) {
                const body = {
                    "id": id,
                    "new_password": new_password
                };
                const config = {
                    method: 'put',
                    url: Config.api_base_url + ApiUrls.UPDATE_PASSWORD,
                    headers: {
                        'authorization': `${getToken}`,
                        "Content-Type": "application/json"
                    },
                    data: body
                };
                const response = await axios(config);
                alert(response.data);
                refreshPage();
            }
        } catch (error) {
            console.error(error);
            const err = error as AxiosError;
            alert(err.response?.data);
        }
    }
    const validatePassword = (i_password: string) => {
        if (i_password.length === 0) {
            setPasswordValidity({ Error: "Blank password, Please enter password", valid: false });
        }
        else if (!RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(i_password)) {
            setPasswordValidity({ Error: "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", valid: false })
        }
        else
            setPasswordValidity({ Error: "", valid: true });
        setNew_password(i_password);
    }
    const validateConfirmPassword = (newPass: string, confirmPass: string) => {
        if (confirmPass.length === 0) {
            setMismatchValidity({ Error: "Blank password, Please enter password", valid: false });
        }
        else if (newPass !== confirmPass) {
            setMismatchValidity({ Error: "New and Confirm passwords should be same", valid: false })
        }
        else
            setMismatchValidity({ Error: "", valid: true });
        setConfirm_password(confirmPass);
    }

    return (
        <Layout>
            <>
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                        <button type="button" className="change_btn btn btn-warning" data-bs-toggle="modal" data-bs-target="#ChangePwd">
                            Change Password
                        </button>

                        <div className="modal" id="ChangePwd">
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h4 className="modal-title">Change Password for User {id}</h4>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>

                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">New Password</label>
                                                <input type="password" className="form-control" id="name" placeholder="Enter New Password" value={new_password} onChange={e => validatePassword(e.target.value)} required />
                                                <p style={{ color: 'red' }}>{passwordValidity.Error}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Re-enter Password</label>
                                                <input type="password" className="form-control" id="name" placeholder="Re-Enter Password" value={confirm_password} onChange={e => validateConfirmPassword(new_password, e.target.value)} required />
                                                <p style={{ color: 'red' }}>{mismatchValidity.Error}</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-warning" onClick={() => updatePassword()}>Save</button>
                                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Edit User</p>
                        <form >
                            <div className="mb-4">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name="name" value={name} onChange={e => onChange(e)} required />
                                <h6 style={{ color: 'red' }}>{nameValidity.nameError}</h6>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Email Id</label>
                                <input type="text" className="form-control" id="email_id" name="email_id" value={email} onChange={e => onChange(e)} required />
                                <h6 style={{ color: 'red' }}>{emailValidity.emailError}</h6>
                            </div>
                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                <button type="button" className="btn btn-primary btn-lg" onClick={() => editUser()}>Save User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        </Layout>
    )
}
export default EditUser;