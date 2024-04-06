import React from "react";
import Proton from "proton-engine";
import RAFManager from "raf-manager";
import Canvas from "./Canvas.jsx";

export default class Color extends React.Component {
  constructor(props) {
    super(props);

    this.colors = [
      "#529B88",
      "#CDD180",
      "#FFFA32",
      "#FB6255",
      "#FB4A53",
      "#FF4E50",
      "#F9D423"
    ];
    this.renderProton = this.renderProton.bind(this);
  }

  componentWillUnmount() {
    try {
      RAFManager.remove(this.renderProton);
      this.proton.destroy();
    } catch (e) {}
  }

  onCanvasInited(canvas, width, height) {
    this.createProton(canvas, width, height);
    RAFManager.add(this.renderProton);
  }

  onResize() {}

  createProton(canvas, width, height) {
    this.proton = new Proton();
    const emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(
      this.props.num ? new Proton.Span(this.props.num) : new Proton.Span(5, 8),
      new Proton.Span(0.1, 0.25)
    );

    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(20, 200));
    emitter.addInitialize(new Proton.Life(2, 4));
    emitter.addInitialize(
      new Proton.Position(new Proton.RectZone(0, 0, width, height))
    );

    emitter.addBehaviour(new Proton.Alpha(0, 1, Infinity, Proton.easeOutCubic));
    emitter.addBehaviour(new Proton.Scale(1, 0, Infinity, Proton.easeOutCubic));
    emitter.addBehaviour(new Proton.Color(this.colors, "random"));

    emitter.emit();
    this.proton.addEmitter(emitter);

    const renderer = new Proton.CanvasRenderer(canvas);
    this.proton.addRenderer(renderer);
  }

  renderProton() {
    this.proton && this.proton.update();
  }

  render() {
    return (
      <Canvas bg={this.props.bg}
        globalCompositeOperation="darker"
        onCanvasInited={this.onCanvasInited.bind(this)}
        onResize={this.onResize.bind(this)}
      />
    );
  }
}
