import { PLAYER_SPEED, PLAYER_SIZE } from '../Config';

type IPosition = [number, number];
type IPositionModel = [number, number, number, number];
export enum TurnDirection {Left = 0, Right = 1}
export enum Direction {Top = 0, Right = 1, Bottom = 2, Left = 3}
export interface PlayerConfig {
  id?: string;
  position: IPosition;
  color: number;
  direction: number;
  size?: number;
  speed?: number;
}

export type PlayerCurrentConfig = [number, number, number]

export default class Player {
  private id: string;
  private initialConfig: PlayerConfig;
  public position: IPosition; // позиция игрока на текущий момент
  public lastPosition: IPosition; // позиция игрока в предыдущем тике
  public size: number; // размер модельки игрока
  public halfSize: number; // половинчатый размер (для удобства вычислений)
  public positionModel: IPositionModel; // координаты модели игрока
  public lastPositionModel: IPositionModel; // координаты модели игрока в предыдущем тике
  public color: number;
  public direction: number;
  public speed: number;
  public isKilled: boolean;
  public isReady: boolean;

  constructor( id, config: PlayerConfig ) {
    this.id = id;
    this.initialConfig = config;
    this.position = [...config.position] as IPosition;
    this.lastPosition = this.position;

    this.size = config.size || PLAYER_SIZE;
    this.halfSize = Math.floor(this.size / 2);

    this.positionModel = this.calcPositionModel();
    this.lastPositionModel = [...this.positionModel] as IPositionModel;

    this.color = config.color;
    this.direction = config.direction;
    this.speed = config.speed || PLAYER_SPEED;

    this.isKilled = false;
    this.isReady = false;
  }

  public getConfig(): PlayerConfig {
    return {
      id:        this.id,
      position:  this.position,
      size:      this.size,
      color:     this.color,
      direction: this.direction,
      speed:     this.speed,
    }
  }

  public getCurrentConfig(): PlayerCurrentConfig {
    return [
      this.position[0],
      this.position[1],
      this.direction,
    ]
  }

  public tick() {
    this.lastPosition = this.position;
    this.lastPositionModel = this.positionModel;
    switch (this.direction) {
      case Direction.Top:
        this.position = [this.position[0], this.position[1] - this.speed];
        break;
      case Direction.Right:
        this.position = [this.position[0] + this.speed, this.position[1]];
        break;
      case Direction.Bottom:
        this.position = [this.position[0], this.position[1] + this.speed];
        break;
      case Direction.Left:
        this.position = [this.position[0] - this.speed, this.position[1]];
        break;
    }
    this.positionModel = this.calcPositionModel();
  }

  public kill(): void {
    this.isKilled = true;
  }

  public ready(): void {
    this.isReady = true;
  }

  public reset(): void {
    this.position = this.lastPosition = this.initialConfig.position;
    this.direction = this.initialConfig.direction;
    this.isKilled = false;
    this.isReady = false;
  }

  public turn( direction: TurnDirection ): void {
    switch (direction) {
      case TurnDirection.Left:
        this.direction--;
        break;
      case TurnDirection.Right:
        this.direction++;
        break;
    }
    if (this.direction > Direction.Left) this.direction = Direction.Top;
    if (this.direction < Direction.Top) this.direction = Direction.Left;
  }

  private calcPositionModel(): IPositionModel {
    return [
      this.position[1] - this.halfSize, // TOP
      this.position[0] + this.halfSize, // RIGHT
      this.position[1] + this.halfSize, // BOTTOM
      this.position[0] - this.halfSize  // LEFT
    ];
  }
}