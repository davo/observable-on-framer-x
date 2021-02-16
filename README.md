# Embedding Observable Notebooks on Framer X

Observable notebooks on Framer X

## Motivation

While reading the noteboook [Advanced Embedding and Downloading](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks) I learned that Observable provides tooling for [runtime](https://github.com/observablehq/runtime), a [standard library](https://github.com/observablehq/stdlib), for HTML, SVG, generators, files and promises; and an [inspector](https://github.com/observablehq/inspector), which implements a default strategy for rendering DOM and JavaScript.

Using the example [react-dataflow](https://github.com/observablehq/examples/tree/main/react-dataflow) which modifies the React code generated by the Embed tool to facilitate dataflow between the notebook and the React app, I was curious about how it will perform with one of the most popular prototyping tools.

So, in this example, the React app is a Framer X project, which incorporates all the amazing capabilities from Framer, with an `ObservableCell` component using the notebook [draw-squircle-shapes-with-svg-javascript](https://observablehq.com/@daformat/draw-squircle-shapes-with-svg-javascript) from Mathieu Jouhet.

By mapping Observable’s `module.redefine` methods with Framer X’s [Property Controls](https://www.framer.com/api/property-controls/), we have a seamless integration of an Observable cell with Framer X controls that overrides the notebook data.


##### Framer X Web Project
- [Overriding Observable Cells with Framer Props](https://framer.com/projects/Overriding-Observable-Cells-with-Framer-Props--zKnJUSeu4Pkqiaz3peFI-apCCE?node=w0Zlet6Mq)
