import { DIR_BOTTOM, DIR_LEFT, DIR_RIGHT, DIR_TOP, PLAYER_SPEED, PLAYER_SIZE } from './constants'

export default class Player {
    constructor(id, config) {
        this.config = config;
        this.id = id;
        this.position = this.last_position = config.position;
        this.size = config.size || PLAYER_SIZE;

        this.half_size = Math.floor(this.size / 2);

        this.position_model = this.calcPositionModel();
        this.last_position_model = [...this.position_model];

        this.color = config.color;
        this.direction = config.direction;
        this.speed = config.speed || PLAYER_SPEED;

        this.isKilled = false;
        this.isReady = false;
    }

    getConfig() {
        return {
            id: this.id,
            position: this.position,
            size: this.size,
            color: this.color,
            direction: this.direction
        }
    }

    tick() {
        this.last_position = this.position;
        this.last_position_model = this.position_model;
        switch (this.direction) {
            case DIR_TOP:
                this.position = [this.position[0], this.position[1] - this.speed];
                break;
            case DIR_RIGHT:
                this.position = [this.position[0] + this.speed, this.position[1]];
                break;
            case DIR_BOTTOM:
                this.position = [this.position[0], this.position[1] + this.speed];
                break;
            case DIR_LEFT:
                this.position = [this.position[0] - this.speed, this.position[1]];
                break;
        }
        this.position_model = this.calcPositionModel();
    }

    kill() {
        this.isKilled = true;
    }

    ready() {
        this.isReady = true;
    }

    reset() {
        this.position = this.last_position = this.config.position;
        this.direction = this.config.direction;
        this.isKilled = false;
    }

    turn(direction) {
        switch (direction) {
            case 'left':
                this.direction--;
                break;
            case 'right':
                this.direction++;
                break;
        }
        if (this.direction > DIR_LEFT) this.direction = DIR_TOP;
        if (this.direction < DIR_TOP) this.direction = DIR_LEFT;
    }

    calcPositionModel() {
        return [
            this.position[1] - this.half_size, // TOP
            this.position[0] + this.half_size, // RIGHT
            this.position[1] + this.half_size, // BOTTOM
            this.position[0] - this.half_size  // LEFT
        ];
    }
}