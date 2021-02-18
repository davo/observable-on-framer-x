import * as React from 'react'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from "@davo/supertoroid";
import { Frame, addPropertyControls, ControlType, RenderTarget } from 'framer'

function Supertoroid({width, height, s, t, material}) {
  const renderRef = useRef(null)
	const [module, setModule] = useState(undefined)

	useLayoutEffect(() => {
    	const runtime = new Runtime()
      const main = runtime.module(notebook, (name) => {
        if (name === 'render') return new Inspector(renderRef.current)
      })
      setModule(main)
      return () => {
        setModule(undefined)
        runtime.dispose()
      }
  }, [width, height])

	// Propagate internal props from React to Observable.
	useLayoutEffect(() => {
		if (module !== undefined) {
			module.redefine('width', width)
			module.redefine('height', height)
			module.redefine('s', s)
			module.redefine('t', t)
			module.redefine('material', material)
		}
	}, [width, height, s, t, material, module])

	return (
		<Frame
			ref={renderRef}
			background='none'
			size='100%'
			style={{
				maxWidth: '100%',
				maxHeight: '100%',
			}}
		/>
	)
}

interface ObservableCellProps {
    width: number
    height: number
    s: number
    t: number
    material: string
    credits: boolean
    backgroundColor: string
}

export function ObservableCell(props: ObservableCellProps) {
	const {width, height, backgroundColor, s, t, material, credits, ...rest} = props

	const [state, setState] = useState({
        width: width, height: height,
		s: s,
		t: t,
		material: material,
	})

	useLayoutEffect(() => {
		setState({
			...state,
			s: s,
			t: t,
			material: material,
		})
	}, [s, t, material])

	useLayoutEffect(() => {
		setState({...state, width: width, height: height})
	}, [width, height])

	// Render Targets: canvas | export | preview | thumbnail
	if (RenderTarget.current() === RenderTarget.thumbnail) {
		return <Thumbnail />
	}

    // An optional Credit component.
	const Credit = () => {
		return (
			<Frame background={backgroundColor} width={state.width} height={20} right={0} bottom={0} style={{textAlign: 'right', paddingRight: 8, color: '#f3f3f3'}}>
				<span>
					<a href='https://observablehq.com/@sw1227/supertoroid' style={{color: '#f3f3f3'}}>Supertoroid</a> by <a href='https://observablehq.com/@sw1227' style={{color: '#f3f3f3'}}>@sw1227</a>
				</span>
			</Frame>
		)
	}

	return (
		<Frame background={backgroundColor} width={state.width} height={height}>
			<Supertoroid
				width={width}
				height={height}
				s={s}
				t={t}
				material={material}
			/>
			{credits ? <Credit /> : null}
		</Frame>
	)
}

ObservableCell.defaultProps = {
	width: 980,
	height: 550,
	backgroundColor: '#202020',
	s: 1.6,
	t: 1.6,
	material: 'Normal',
	credits: false,
}

// Prop controls mapped from the Observable Notebook: https://observablehq.com/@davo/supertoroid
addPropertyControls(ObservableCell, {
    backgroundColor: {
        title: 'Bakground',
        type: ControlType.Color,
        defaultValue: '#202020',
    },
    s: {
        title: 'Vert. Sections',
        type: ControlType.Number,
        defaultValue: 1.6,
        min: 0,
        max: 2.5,
        step: 0.01,
    },
    t: {
        title: 'Hor. Sections',
        type: ControlType.Number,
        defaultValue: 0.4,
        min: 0,
        max: 2.5,
        step: 0.01,
    },
    material: {
      type: ControlType.Enum,
      title: 'Material',
      options: ['Normal', 'Wireframe',]
    },
    credits: {
      title: 'Credits',
      type: ControlType.Boolean,
      enabledTitle: 'Show',
      disabledTitle: 'Hide',
  },
})

// For Framer X
// A thumbnail component to be conditionally rendered inside the Components panel.
// This <Thumbnail /> component is intended only to improve the performance of the tool
// because it will not render the <ObservableCell /> unless this one is being rendered
// inside the Canvas or Preview.

function Thumbnail() {
    return (
      <Frame size='100%' borderRadius={16} border={`4px solid ${colors.primary}`} background={colors.background}>
        <Frame
          size={'100%'}
          center
          scale={1.2}
          background='transparent'
          style={{
            display: 'inline-flex',
            flex: 'none',
            width: 'auto',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <svg viewBox='0 0 32 32' width='100%' height='100%' aria-label='Observable' fill={colors.primary} role='presentation'>
            <path
              d='M16,24.7c-1.2,0-2.2-0.3-3-0.8c-0.8-0.5-1.5-1.2-1.9-2c-0.5-0.9-0.8-1.8-1-2.7c-0.2-1-0.3-2.1-0.3-3.1
      c0-0.8,0.1-1.6,0.2-2.4c0.1-0.8,0.3-1.5,0.6-2.3c0.3-0.8,0.7-1.5,1.1-2c0.5-0.6,1.1-1.1,1.8-1.4C14.2,7.5,15,7.3,16,7.3
      c1.2,0,2.2,0.3,3,0.8c0.8,0.5,1.5,1.2,1.9,2c0.5,0.9,0.8,1.8,1,2.7c0.2,1,0.3,2,0.3,3.1c0,0.8-0.1,1.6-0.2,2.4
      c-0.1,0.8-0.3,1.6-0.6,2.3c-0.3,0.8-0.7,1.5-1.1,2c-0.5,0.6-1,1-1.8,1.4C17.8,24.5,17,24.7,16,24.7z M18.2,18.3
      c0.6-0.6,0.9-1.4,0.9-2.3c0-0.9-0.3-1.7-0.9-2.3c-0.6-0.6-1.3-1-2.2-1s-1.6,0.3-2.2,1c-0.6,0.6-0.9,1.4-0.9,2.3
      c0,0.9,0.3,1.7,0.9,2.3c0.6,0.6,1.3,1,2.2,1S17.6,18.9,18.2,18.3z M16,29c6.9,0,12.5-5.8,12.5-13c0-7.2-5.6-13-12.5-13
      C9.1,3,3.5,8.8,3.5,16C3.5,23.2,9.1,29,16,29z'
            />
          </svg>
          <svg viewBox='0 0 32 32' width='100%' height='100%' aria-label='Framer' fill={colors.primary} role='presentation'>
            <path d='M25,11.5h-9l-9-9h18V11.5z M7,20.5l9,9v-9h9l-9-9H7V20.5z' />
          </svg>
        </Frame>
      </Frame>
    )
  }

  const colors = {
	primary: '#96f',
	background: 'rgba(153,102,255,0.15)',
}
