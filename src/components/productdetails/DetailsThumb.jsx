import React, { Component } from 'react';

export class DetailsThumb extends Component {
    render() {
        const { images, activeIndex, tab, myRef } = this.props;
        return (
            <div className="thumb  flex gap-5 " ref={myRef}>
                {
                images.map((img, index) => (
                    <div
                        key={index}
                        className={`thumb-image cursor-pointer ${activeIndex === index ? 'active' : ''}`}
                    >
                        <img
                            src={img}
                            alt=""
                            onClick={() => tab(index)}
                        />
                    </div>
                ))
                }
            </div>
        );
    }
}

export default DetailsThumb;
