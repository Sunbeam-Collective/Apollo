import {
  load_wheel_ico
} from '../assets'


function Loading() {
  const randomDegree = Math.floor(Math.random() * 360);
  return (
    <>
      <div className='loading-container'>
        <img
          id='load-wheel-ico'
          src={load_wheel_ico}
          style={{
            animation: `spin 0.4s linear infinite`,
            '--start-degree': `${randomDegree}deg`
          }}
          />
      </div>
    </>
  )
}

export default Loading;
