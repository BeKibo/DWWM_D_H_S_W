import React from 'react';
import { Link } from 'react-router';

const Home = () => {
    return (
        <div>
         <Link to="/detection">
            <button>Go to Detection</button>
        </Link>
        </div>
    );
};

export default Home;