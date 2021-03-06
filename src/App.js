import React, { Component } from 'react'
import { CirclePicker } from 'react-color'
import _ from 'lodash'

import './App.css'

const initColor = { hex: '#000', off: true, rgb: { r: 0, g: 0, b: 0 } }
const NUM = 16

class App extends Component {
  state = {
    color: initColor,
    colors: _.zipObject(_.range(NUM), _.fill(Array(NUM), initColor)),
  }

  async postLed(id, color) {
    const { rgb, off } = color
    const res = await fetch(`http://rainnow.cps-lab.private/rpc/Control`, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        off,
        start: id,
        end: id,
        color: rgb,
      }),
    })
    console.log(res)
  }

  async offAll() {
    const res = await fetch(`http://rainnow.cps-lab.private/rpc/Control`, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        off: true,
        start: 0,
        end: NUM - 1,
      }),
    })
    console.log(res)
  }

  render() {
    const { colors, color } = this.state
    const deg = 360.0 / NUM
    const r = 150
    const red = deg * Math.PI / 180.0
    return (
      <div className="App">
        <div className="App-header">
          <h2>CPS Lab 14F Rainnow Controller</h2>
        </div>
        <div className="App-intro">
          <section
            className="main-contents"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 30,
            }}
          >
            <div>
              <div
                className="circle-box"
                style={{
                  height: r * 2 + 60,
                  width: r * 2,
                  margin: '20px 10px',
                }}
              >
                {_.map(_.range(0, NUM), i => {
                  const it = (i + 12) % NUM
                  const x = -Math.cos(red * it) * r + r - 20
                  const y = Math.sin(red * it) * r + r
                  return (
                    <button
                      key={i}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: 40,
                        height: 40,
                        background: colors[i].hex,
                      }}
                      onClick={() => {
                        const color = {
                          ...this.state.color,
                          off: false,
                        }
                        this.setState({
                          colors: { ...colors, [i]: color },
                        })
                        this.postLed(i, color)
                      }}
                    />
                  )
                })}
                <button
                  style={{
                    position: 'absolute',
                    left: r - 20,
                    top: r,
                    width: 40,
                    height: 40,
                    background: '#000',
                    color: 'white',
                  }}
                  onClick={() => {
                    this.offAll()
                  }}
                >
                  OFF
                </button>
              </div>
              <CirclePicker
                color={color.hex}
                width={340}
                circleSize={40}
                circleSpacing={16}
                onChangeComplete={color => {
                  this.setState({ color })
                }}
              />
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default App
