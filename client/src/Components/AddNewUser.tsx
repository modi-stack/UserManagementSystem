import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Config } from "../Config/Config";
import { ApiUrls } from "../Enum/Enum";
import { NewUser } from "../Interfaces/NewUserInterface";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

let getToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJpeWEiLCJzY29wZSI6WyJjdXN0b21lcjpjcmVhdGUiXSwiaWF0IjoxNjgzOTY1NDI5fQ.essQ0YJTL6KC8qAQq_-F-lQ4Wr-tMGk0CDLTkzqD2Pg';

const AddNewUser = () => {
    const [NewUser, setNewUser] = useState<NewUser>({ name: "", email_id: "", password: "" });
    const [nameValidity, setNameValidity] = useState({ nameError: "", valid: false });
    const [emailValidity, setEmailValidity] = useState({ emailError: "", valid: false });
    const [passwordValidity, setPasswordValidity] = useState({ passwordError: "", valid: false });
    const navigate = useNavigate();
    const AddUser = async () => {
        try {
            validateName(NewUser.name);
            validateEmail(NewUser.email_id);
            validatePassword(NewUser.password);
            if (nameValidity.valid && emailValidity.valid && passwordValidity.valid) {
                const body = {
                    "name": NewUser.name,
                    "email_id": NewUser.email_id,
                    "password": NewUser.password
                };
                // console.log(body);
                const config = {
                    method: 'post',
                    url: Config.api_base_url + ApiUrls.CREATE_USER,
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
        setNewUser({ ...NewUser, name: i_name });
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
        setNewUser({ ...NewUser, email_id: i_email });
    }
    const validatePassword = (i_password: string) => {
        let flag = true;
        if (i_password.length === 0) {
            setPasswordValidity({ passwordError: "Blank password, Please enter password", valid: false });
        }
        else if (!RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(i_password)) {
            setPasswordValidity({ passwordError: "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", valid: false })
        }
        else
            setPasswordValidity({ passwordError: "", valid: true });
        setNewUser({ ...NewUser, password: i_password });
        return flag;
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "name")
            validateName(e.target.value);
        else if (e.target.name === "email_id")
            validateEmail(e.target.value);
        else if (e.target.name === "password")
            validatePassword(e.target.value);
    };

    return (
        <Layout>
            <>
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">New User</p>
                        <form >
                            <div className="mb-4">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name="name" value={NewUser.name} onChange={e => onChange(e)} required />
                                <p style={{ color: 'red' }}>{nameValidity.nameError}</p>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Email Id</label>
                                <input type="text" className="form-control" id="email_id" name="email_id" value={NewUser.email_id} onChange={e => onChange(e)} required />
                                <p style={{ color: 'red' }}>{emailValidity.emailError}</p>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" name="password" value={NewUser.password} onChange={e => onChange(e)} required />
                                <p style={{ color: 'red' }}>{passwordValidity.passwordError}</p>
                            </div>
                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                <button type="button" className="btn btn-info btn-lg" onClick={AddUser}>Add User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        </Layout>
    )
}
export default AddNewUser;