import {
  dot_marker
} from '../assets'

function RatePicker({ playbackRate }) {
  return (
    <>
    {
      new Array(151)
        .fill(50)
        .map((v,i) => {
          const percentRate = v + i;
          const actualRate = percentRate / 100;
          let className = 'rate-value';
          if (actualRate === playbackRate) className += ' current';
          return (
            <li
              key={crypto.randomUUID()}
              data-value={percentRate}
              className={className}
            >
              <p className='item-text'>{percentRate}</p>
              {
                (actualRate === playbackRate) &&
                <img src={dot_marker} />
              }
            </li>
          )
        })
    }
  </>
  )
}

export default RatePicker;
