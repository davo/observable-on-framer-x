import * as React from 'react'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from '@daformat/draw-squircle-shapes-with-svg-javascript'
import { Frame, addPropertyControls, ControlType, RenderTarget } from 'framer'

function DrawSquircleShapesWithSVG({width, height, wiggle, exponent, lameWidth, margin, resolution, shadows, lighting}) {
	const squirclesRef = useRef(null)
	const [module, setModule] = useState(undefined)

	useLayoutEffect(() => {
		const runtime = new Runtime()
		const main = runtime.module(notebook, (name) => {
			if (name === 'squircles') return new Inspector(squirclesRef.current)
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
			module.redefine('wiggle', wiggle)
			module.redefine('exponent', exponent)
			module.redefine('lameWidth', lameWidth)
			module.redefine('margin', margin)
			module.redefine('resolution', resolution)
			module.redefine('shadows', shadows)
			module.redefine('lighting', lighting)
		}
	}, [width, height, wiggle, exponent, lameWidth, margin, resolution, shadows, lighting, module])

	return (
		<Frame
			ref={squirclesRef}
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
    exponent: number
    lameWidth: number
    margin: number
    resolution: number
    advancedProps: boolean
    shadows: boolean
    lighting: boolean
    credits: boolean
    backgroundColor: string
}

export function ObservableCell(props: ObservableCellProps) {
	const {width, height, backgroundColor, exponent, lameWidth, margin, resolution, advancedProps, shadows = false, lighting = false, credits, ...rest} = props

	const [state, setState] = useState({
        width: width, height: height,
		exponent: exponent,
		lameWidth: lameWidth,
		margin: margin,
		resolution: resolution,
		shadows: shadows,
		lighting: lighting,
	})

	useLayoutEffect(() => {
		setState({
			...state,
			exponent: exponent,
			lameWidth: lameWidth,
			margin: margin,
			resolution: resolution,
			shadows: shadows,
			lighting: lighting,
		})
	}, [exponent, lameWidth, margin, resolution, shadows, lighting])

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
			<Frame background={backgroundColor} width={state.width} height={20} right={0} bottom={0} style={{textAlign: 'right', paddingRight: 8}}>
				<>
					Credit:<a href='https://observablehq.com/@daformat/draw-squircle-shapes-with-svg-javascript'>Drawing a SVG squircle shapes with JS</a>
					by <a href='https://observablehq.com/@daformat'>Mathieu Jouhet</a>
				</>
			</Frame>
		)
	}

	return (
		<Frame background={backgroundColor} width={state.width} height={height}>
			<DrawSquircleShapesWithSVG
				width={state.width}
				height={height}
				exponent={state.exponent}
				lameWidth={state.lameWidth}
				margin={state.margin}
				resolution={state.resolution}
				shadows={state.shadows}
				lighting={state.lighting}
				wiggle={false}
			/>
			{credits ? <Credit /> : null}
		</Frame>
	)
}

ObservableCell.defaultProps = {
	width: 980,
	height: 550,
	backgroundColor: '#fff',
	exponent: 5,
	lameWidth: 200,
	resolution: 32,
	margin: 75,
	advancedProps: false,
	shadows: false,
	lightning: false,
	credits: false,
}

// Prop controls mapped from the Observable Notebook: https://observablehq.com/@daformat/draw-squircle-shapes-with-svg-javascript
addPropertyControls(ObservableCell, {
    backgroundColor: {
        title: 'Bakground',
        type: ControlType.Color,
        defaultValue: '#fff',
    },
    exponent: {
        title: 'Exponent',
        type: ControlType.Number,
        min: 0.5,
        max: 8,
        step: 0.05,
    },
    resolution: {
        title: 'Resolution',
        type: ControlType.Number,
        defaultValue: 32,
        min: 2,
        max: 100,
        step: 0.5,
    },
    lameWidth: {
        title: 'Radius',
        type: ControlType.Number,
        min: 40,
        max: 500,
        step: 1,
    },
    advancedProps: {
        title: 'More...',
        type: ControlType.Boolean,
        enabledTitle: 'Show',
        disabledTitle: 'Hide',
    },
    margin: {
        title: 'Margin',
        type: ControlType.Number,
        hidden: ({ advancedProps }) => advancedProps === false,
        min: 1,
        max: 100,
        step: 1,
    },
    shadows: {
        title: 'Shadow',
        type: ControlType.Boolean,
        hidden: ({ advancedProps }) => advancedProps === false,
        defaultValue: false,
        enabledTitle: 'Yes',
        disabledTitle: 'No',
    },
    lighting: {
        title: 'Lighting',
        type: ControlType.Boolean,
        hidden: ({ advancedProps }) => advancedProps === false,
        defaultValue: false,
        enabledTitle: 'Yes',
        disabledTitle: 'No',
    },
    credits: {
        title: 'Credits',
        type: ControlType.Boolean,
        hidden: ({ advancedProps }) => advancedProps === false,
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
