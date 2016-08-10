export default class GameRender {
  constructor(config) {
    // console.log(config);
    this.renderer = PIXI.autoDetectRenderer(config.width, config.height);
    // create the root of the scene graph
    this.stage = new PIXI.Container();
    this.stage.width = config.width;
    this.stage.height = config.height;
    this.players = [];
    this.playersCount = config.players.length;
    this.state = null;
    this.config = config;
    this.prepareStage();

    this.lineWidth = config.lineWidth;
    this.walls = new PIXI.Graphics();
    this.stage.addChild(this.walls);

    for (let i = 0; i < this.playersCount; i++) {
      const player = config.players[i];

      const graphics = new PIXI.Graphics();
      const half_size = player.size / 2;
      graphics.beginFill(player.color, 1);
      graphics.drawRect(-half_size, -half_size, player.size, player.size);
      graphics.x = player.position[0];
      graphics.y = player.position[1];
      this.players.push(graphics);
      this.stage.addChild(graphics);
    }
    this.render();
  }

  getView() {
    return this.renderer.view;
  }

  prepareStage() {
    const {width, height} = this.config;
    const disttanceBetween = 40;
    const padding = 20;
    const color = 0x6FC3DF;
    const steps = [0.4, 0.2, 0.1];
    const grid = new PIXI.Graphics();
    this.grid = grid;
    for (let i = disttanceBetween; i < width; i += disttanceBetween) {
      this.drawLine([i, padding], [i, height - padding], color, steps);
    }
    for (let i = disttanceBetween; i < height; i += disttanceBetween) {
      this.drawLine([padding, i], [width - padding, i], color, steps);
    }
    this.stage.addChild(grid);
  }

  drawLine(from, to, color, steps){
    const stepsLength = steps.length;
    const horisontal = from[0] == to[0];
    for(let i = 0; i < stepsLength; i++ ){
      this.grid.lineStyle(1, color, steps[i]);
      this.grid.moveTo(horisontal ? from[0] + i : from[0], !horisontal ? from[1] + i : from[1]);
      this.grid.lineTo(horisontal ? to[0] + i : to[0], !horisontal ? to[1] + i : to[1]);

      if(i == 0) continue;

      this.grid.moveTo(horisontal ? from[0] - i : from[0], !horisontal ? from[1] - i : from[1]);
      this.grid.lineTo(horisontal ? to[0] - i : to[0], !horisontal ? to[1] - i : to[1]);
    }
  }

  createText(text){
    var shadow = new PIXI.filters.DropShadowFilter();
    shadow.color = 0xFFE64D;
    shadow.distance = 0;
    shadow.alpha = 0.80;
    shadow.blur = 5;

    var style = {
      font: '100px helveticaneue',
      fill: '#DF740C',
    };
    const textObject = new PIXI.Text(text, style);
    textObject.filters = [shadow];
    textObject.x = this.config.width / 2 - textObject.width / 2;
    textObject.y = this.config.height / 2 - textObject.height / 2;
    return textObject;
  }

  countdown(i) {
    if (i <= 0) return;
    const text = this.createText(i);
    this.stage.addChild(text);
    this.animateCountdown(text);
  }

  animateCountdown(text){
    text.alpha -= 0.03;
    text.y += 1;
    this.render();
    if(text.alpha > 0)
      requestAnimationFrame(() => this.animateCountdown(text, ));
    else
      this.stage.removeChild(text);
  }

  kill(i){
    const player = this.players[i];
    const playerConfig = this.config.players[i];
    const half_size = playerConfig.size / 2;
    player.beginFill(0xDF740C, 1);
    player.drawRect(-half_size, -half_size, playerConfig.size, playerConfig.size);
    this.render();
  }

  end(player){
    const text = this.createText("GAME OVER");
    console.log(player);
    this.stage.addChild(text);
  }

  setState(state) {
    for (let i = 0; i < this.playersCount; i++) {
      const player = this.players[i];
      const playerState = state[i];
      const lastPlayerState = (this.state || state)[i];
      player.x = playerState[0];
      player.y = playerState[1];

      this.walls.lineStyle(this.lineWidth, this.config.players[i].color, 1);
      this.walls.moveTo(lastPlayerState[0], lastPlayerState[1]);
      this.walls.lineTo(playerState[0], playerState[1])
    }
    this.render();
    this.state = state;
  }

  render(){
    this.renderer.render(this.stage);
  }
}