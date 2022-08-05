import React from 'react';
import {Link} from "react-router-dom";

const Cart = (props) => (
    <div>
        <div className="wrapper">
            <div className="container">

                <div className="title">
                    <h1>Корзина</h1>
                </div>

                {props.cart.map((cart, index) => {
                    return (
                        <div style={{width: 300, height: 69}} key={index}>
                            <p>{cart.beat.title}</p>
                        </div>
                    )
                })}

            </div>
        </div>
    </div>
);

export default Cart;