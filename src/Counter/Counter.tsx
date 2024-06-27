import React from 'react'
import counterStore from '../store/counterStore';
import { observer } from 'mobx-react-lite';

interface CounterProps {
    
}

const Counter:React.FC<CounterProps> = observer(({}) => {
    
    const {count, dec, inc} = counterStore

    return (
        <>
            <button onClick={() => inc(1)}>+</button>
            <p>{count}</p>
            <button onClick={() => dec(1)}>-</button>
        </>
    )
})
export default Counter;