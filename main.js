function getDistance(posX1, posY1, posX2, posY2) {
    return Math.sqrt(Math.pow(posX2 - posX1, 2) + Math.pow(posY2 - posY1, 2));
}

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.backgroundColor = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posx = x;
        this.posy = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Almacenar el color original
        this.text = text;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posx, this.posy)
        context.lineWidth = 5;
        context.arc(this.posx, this.posy, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        let superpuesto = false; // Variable para rastrear si el círculo está superpuesto con otros
        for (let otherCircle of circles) {
            if (otherCircle !== this && this.seSuperponeCon(otherCircle)) {
                superpuesto = true;
                this.rebotar(otherCircle); // Hacer que rebote si está superpuesto
                break; // No necesitamos seguir buscando
            }
        }

        // Cambiar color basado en si está superpuesto o no
        if (superpuesto) {
            this.color = "red"; // Cambiar a rojo si está superpuesto
        } else {
            this.color = this.originalColor; // Restaurar el color original si no está superpuesto
        }

        this.posx += this.dx;
        this.posy += this.dy;
        
        if ((this.posx + this.radius) > window_width || (this.posx - this.radius) < 0) {
            this.dx = -this.dx;
        }
        
        if ((this.posy + this.radius) > window_height || (this.posy - this.radius) < 0) {
            this.dy = -this.dy;
        }
        
        this.posx = Math.max(this.radius, Math.min(this.posx, window_width - this.radius));
        this.posy = Math.max(this.radius, Math.min(this.posy, window_height - this.radius));
        
        this.draw(context);
    }

    seSuperponeCon(otherCircle) {
        let distancia = getDistance(this.posx, this.posy, otherCircle.posx, otherCircle.posy);
        return distancia < (this.radius + otherCircle.radius);
    }

    rebotar(otherCircle) {
        // Calcular el ángulo de colisión
        let angulo = Math.atan2(otherCircle.posy - this.posy, otherCircle.posx - this.posx);
        
        // Calcular las velocidades en las direcciones x e y después del rebote
        let v1x = this.dx * Math.cos(angulo) + this.dy * Math.sin(angulo);
        let v1y = this.dy * Math.cos(angulo) - this.dx * Math.sin(angulo);
        let v2x = otherCircle.dx * Math.cos(angulo) + otherCircle.dy * Math.sin(angulo);
        let v2y = otherCircle.dy * Math.cos(angulo) - otherCircle.dx * Math.sin(angulo);
        
        // Calcular las nuevas velocidades después del rebote
        let newV1x = ((this.radius - otherCircle.radius) * v1x + (otherCircle.radius + otherCircle.radius) * v2x) / (this.radius + otherCircle.radius);
        let newV2x = ((this.radius + this.radius) * v1x + (otherCircle.radius - this.radius) * v2x) / (this.radius + otherCircle.radius);
        
        // Asignar las nuevas velocidades
        this.dx = Math.cos(angulo) * newV1x - Math.sin(angulo) * v1y;
        this.dy = Math.sin(angulo) * newV1x + Math.cos(angulo) * v1y;
        otherCircle.dx = Math.cos(angulo) * newV2x - Math.sin(angulo) * v2y;
        otherCircle.dy = Math.sin(angulo) * newV2x + Math.cos(angulo) * v2y;
    }
}

let arrayCircle = [];

const n = 10;
for (let i = 0; i < n; i++) {
    let randomX = Math.random() * window_width;
    let randomY = Math.random() * window_height;
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    let randomSpeed = Math.random() * (5 - 1) + 1; // Genera un número aleatorio entre 1 y 5
    let myCircle = new Circle(randomX, randomY, randomRadius, "blue", i + 1, randomSpeed); // Color azul como color original
    arrayCircle.push(myCircle);
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    for (let i = 0; i < arrayCircle.length; i++) {
        arrayCircle[i].update(ctx, arrayCircle);
    }
}

updateCircles();

