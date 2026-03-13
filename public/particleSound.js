// ------------------------------------------------
// PARTICLE CLASS

class Particle {

    constructor(x, y, col) {

        // starting position
        this.x = x;
        this.y = y;

        // random velocity
        this.vx = random(-2, 2);
        this.vy = random(-2, 2);

        // size
        this.size = random(6, 12);

        // lifespan
        this.life = 255;

        // color
        this.col = col;

    }

    update() {

        // move particle
        this.x += this.vx;
        this.y += this.vy;

        // slow fade
        this.life -= 4;

    }

    draw() {

        noStroke();

        fill(
            red(this.col),
            green(this.col),
            blue(this.col),
            this.life
        );

        circle(this.x, this.y, this.size);

    }

    isDead() {

        return this.life <= 0;

    }

}