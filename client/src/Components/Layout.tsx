import Footer from '../Includes/Footer';
import Navbar from '../Includes/Navbar';

interface Props {
    children: JSX.Element[] | JSX.Element
}

const Layout = (props: Props) => {
    return (
        <>
            <Navbar />
            {props.children}<br />
            <Footer />
        </>
    );
}

export default Layout;