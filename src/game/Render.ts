import * as PIXI from 'pixi.js';
import { PlayerConfig } from './server/Player';

export interface RenderConfig {
  width: number;
  height: number;
  lineWidth: number;
  players: Array<PlayerConfig>;
}

export default class Render {
  private config: RenderConfig;
  private app: PIXI.Application;
  private stage: PIXI.Container; // фон-сеточка
  private walls: PIXI.Graphics; // линии стенок
  private state: any;
  private playersCount: number;
  private players: Array<PIXI.Graphics>;
  private message: PIXI.Text;

  constructor( config: RenderConfig ) {
    this.config = config;
    this.app = new PIXI.Application(config.width, config.height);

    this.stage = this.prepareStage();
    this.app.stage.addChild(this.stage);

    this.walls = new PIXI.Graphics();
    this.stage.addChild(this.walls);

    this.playersCount = config.players.length;
    this.players = config.players.map(this.preparePlayer);
    this.players.map(player => this.stage.addChild(player));

    this.state = null;
  }

  public getView() {
    return this.app.view;
  }

  public countdown( i ) {
    if (i <= 0) return;
    const text = this.createText(i);
    this.stage.addChild(text);
    this.animateCountdown(text);
  }

  public end( player ) {
    this.message = this.createText("GAME OVER");
    this.stage.addChild(this.message);
  }

  public kill( playerId: string ) {
    // const player = this.players.find(player => player.id == playerId);
    // const half_size = playerConfig.size / 2;
    // player.beginFill(0xDF740C, 1);
    // player.drawRect(-half_size, -half_size, playerConfig.size, playerConfig.size);
  }

  public reset() {
    this.walls.clear();
    this.players.forEach(( p, i ) => {
      const player = this.config.players[i];
      const half_size = player.size / 2;
      p.beginFill(player.color, 1);
      p.drawRect(-half_size, -half_size, player.size, player.size);
      p.x = player.position[0];
      p.y = player.position[1];
    });
    this.state = null;
    this.stage.removeChild(this.message);
  }

  public setState( state ) {
    for (let i = 0; i < this.playersCount; i++) {
      const player = this.players[i];
      const playerState = state[i];
      const lastPlayerState = (this.state || state)[i];
      player.x = playerState[0];
      player.y = playerState[1];

      this.walls.lineStyle(this.config.lineWidth, this.config.players[i].color, 1);
      this.walls.moveTo(lastPlayerState[0], lastPlayerState[1]);
      this.walls.lineTo(playerState[0], playerState[1])
    }
    this.state = state;
  }

  private prepareStage(): PIXI.Container {
    const stage = new PIXI.Container();
    const { width, height } = this.config;
    stage.width = this.config.width;
    stage.height = this.config.height;

    const distanceBetween = 40;
    const padding = 20;
    const color = 0x6FC3DF;
    const steps = [0.4, 0.2, 0.1];
    const grid = new PIXI.Graphics();
    for (let i = distanceBetween; i < width; i += distanceBetween) {
      this.drawLine(grid, [i, padding], [i, height - padding], color, steps);
    }
    for (let i = distanceBetween; i < height; i += distanceBetween) {
      this.drawLine(grid, [padding, i], [width - padding, i], color, steps);
    }
    stage.addChild(grid);
    return stage;
  }

  private drawLine( grid: PIXI.Graphics, from: [number, number], to: [number, number], color: number, steps: Array<number> ): void {
    const stepsLength = steps.length;
    const horisontal = from[0] == to[0];
    for (let i = 0; i < stepsLength; i++) {
      grid.lineStyle(1, color, steps[i]);
      grid.moveTo(horisontal ? from[0] + i : from[0], !horisontal ? from[1] + i : from[1]);
      grid.lineTo(horisontal ? to[0] + i : to[0], !horisontal ? to[1] + i : to[1]);

      if (i == 0) continue;

      grid.moveTo(horisontal ? from[0] - i : from[0], !horisontal ? from[1] - i : from[1]);
      grid.lineTo(horisontal ? to[0] - i : to[0], !horisontal ? to[1] - i : to[1]);
    }
  }

  private preparePlayer( config: PlayerConfig ): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const half_size = config.size / 2;
    graphics.beginFill(config.color, 1);
    graphics.drawRect(-half_size, -half_size, config.size, config.size);
    graphics.x = config.position[0];
    graphics.y = config.position[1];
    return graphics;
  }

  private createText( text: string ): PIXI.Text {
    // const shadow = new PIXI.filters.DropShadowFilter();
    // shadow.color = 0xFFE64D;
    // shadow.distance = 0;
    // shadow.alpha = 0.80;
    // shadow.blur = 5;

    const style = {
      fontFamily: 'helveticaneue',
      fontSize:   '100px',
      fill:       '#DF740C',
    };
    const textObject = new PIXI.Text(text, style);
    // textObject.filters = [shadow];
    textObject.x = this.config.width / 2 - textObject.width / 2;
    textObject.y = this.config.height / 2 - textObject.height / 2;
    return textObject;
  }

  private animateCountdown( text: PIXI.Text ) {
    text.alpha -= 0.03;
    text.y += 1;
    if (text.alpha > 0) {
      requestAnimationFrame(() => this.animateCountdown(text));
    } else {
      this.stage.removeChild(text);
    }
  }
}