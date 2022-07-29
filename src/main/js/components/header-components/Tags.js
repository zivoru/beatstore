import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {tags: []};
    }

    componentDidMount() {
        axios.get('/api/v1/tags/trend-tags?limit=8').then(res => {
            res.data.length !== 0 ? this.setState({tags: res.data}) : this.setState({tags: null})
        }).catch(() => {
            this.setState({tags: null})
        })
    }

    render() {
        if (this.state.tags !== null && this.state.tags.length !== 0) {
            return (
                <div className="mt16">
                    <span className="fw400 fs14">В тренде</span>
                    <ul>
                        {this.state.tags.map((tag, index) => {
                            return (
                                <li key={index}>
                                    <Link to={"/top-charts?tag=" + tag.id} onClick={this.props.click}>
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

export default Tags;