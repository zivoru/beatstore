import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {tags: []};
    }

    componentDidMount() {
        axios.get('/api/v1/tags/trend-tags?limit=5').then(res => {
            this.setState({tags: res.data.length !== 0 ? res.data : null})
        }).catch(() => {
            this.setState({tags: null})
        })
    }

    render() {
        if (this.state.tags !== null && this.state.tags.length !== 0) {
            return (
                <div className="flex-c">
                    <span>В тренде:</span>
                    <ul className="flex-c">
                        {this.state.tags.map((tag, index) => {
                            return (
                                <li className="wnohte pl16 fw300" style={{maxWidth: 80}} key={index}>
                                    <Link to={"/top-charts?tag=" + tag.id} className="mw100 hu" title={tag.name}>
                                        {tag.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        }
    }
}

export {Tags}