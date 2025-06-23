import React, { } from "react";
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div>
            <div className="login-container">
                <div className="row h-100">
                    <div className="col-102">
                        <p><Link to="/login" className="btn btn-success">Login</Link> | <Link to="/register" className="btn btn-success">register</Link> </p>
                    </div>
                </div>
            </div>
        </div>
    );
}