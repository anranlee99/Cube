const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 1024;
canvas.height = 768;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


class Cube {
    vertices: Array<{ x: number, y: number, z: number }>;
    constructor(vertices: Array<{ x: number, y: number, z: number }>) {
        this.vertices = vertices;
    }
    getCenter() {
        let sumX = 0, sumY = 0, sumZ = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            sumX += this.vertices[i].x;
            sumY += this.vertices[i].y;
            sumZ += this.vertices[i].z;
        }
        return {
            x: sumX / this.vertices.length,
            y: sumY / this.vertices.length,
            z: sumZ / this.vertices.length
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    rotateX(theta: number) {
        const center = this.getCenter();
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        for (let i = 0; i < this.vertices.length; i++) {
            let { x, y, z } = this.vertices[i];
            y -= center.y;
            z -= center.z;
            this.vertices[i] = {
                x: x,
                y: y * cos - z * sin + center.y,
                z: y * sin + z * cos + center.z
            };
        }
    }

    rotateY(theta: number) {
        const center = this.getCenter();
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        for (let i = 0; i < this.vertices.length; i++) {
            let { x, y, z } = this.vertices[i];
            x -= center.x;
            z -= center.z;
            this.vertices[i] = {
                x: x * cos + z * sin + center.x,
                y: y,
                z: -x * sin + z * cos + center.z
            };
        }
    }

    rotateZ(theta: number) {
        const center = this.getCenter();
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        for (let i = 0; i < this.vertices.length; i++) {
            let { x, y, z } = this.vertices[i];
            x -= center.x;
            y -= center.y;
            this.vertices[i] = {
                x: x * cos - y * sin + center.x,
                y: x * sin + y * cos + center.y,
                z: z
            };
        }
    }

    project() {
        for (let i = 0; i < this.vertices.length; i++) {
            const { x, y, z } = this.vertices[i];
            this.vertices[i] = {
                x: x - z * 0.5,
                y: y - z * 0.5,
                z: z
            }
        }
    }

}


// Define the 3D points of the cube
var vertices = [
    { x: 100, y: 100, z: 100 },
    { x: 200, y: 100, z: 100 },
    { x: 200, y: 200, z: 100 },
    { x: 100, y: 200, z: 100 },
    { x: 100, y: 100, z: 200 },
    { x: 200, y: 100, z: 200 },
    { x: 200, y: 200, z: 200 },
    { x: 100, y: 200, z: 200 }
];



const cube = new Cube(vertices);


cube.draw(ctx);


let startX = 0;
let startY = 0;
let isMouseDown = false;
document.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isMouseDown = true;
});

document.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        cube.rotateY(dx * 0.01);
        cube.rotateX(dy * 0.01);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cube.draw(ctx);
    }
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});



