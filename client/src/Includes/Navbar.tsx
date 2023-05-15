import { Link } from 'react-router-dom';
import '../App.css'
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const path = useLocation().pathname;
    // console.log(path);
    return (
        <>
            <nav className="navbar sticky-top mb-5" style={{ height: 55, backgroundColor: '#B7B598' }}>
                <div className="navbar-brand h1" style={{ color: 'Black', paddingTop: '0%' }} > <Link to={'/'} className="homeBtn">
                    Home </Link></div>
                {path === '/' && <button type="button" className='btn btn-primary'>
                    <Link to={'/addNewUser'} className="newUserBtn">
                        Add New User
                    </Link>
                </button>}
            </nav>
        </>
    )
}
export default Navbar;