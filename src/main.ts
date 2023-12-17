const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 1024;
canvas.height = 768;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


class Cube {
    vertices: Array<{ x: number, y: number, z: number }>;
    faces: Array<Array<number>>;
    constructor(vertices: Array<{ x: number, y: number, z: number }>) {
        this.vertices = vertices;
        this.faces = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [0, 4, 5, 1],
            [1, 5, 6, 2],
            [2, 6, 7, 3],
            [3, 7, 4, 0]
        ];
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
        // ctx.save();
        // ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.beginPath();
        for (let i = 0; i < this.faces.length; i++) {
            const face = this.faces[i];
            ctx.moveTo(this.vertices[face[0]].x, this.vertices[face[0]].y);
            for (let j = 1; j < face.length; j++) {
                ctx.lineTo(this.vertices[face[j]].x, this.vertices[face[j]].y);
            }
            ctx.closePath();
        }
        ctx.stroke();
        // ctx.restore();
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

//add touch event
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isMouseDown = true;
});

document.addEventListener('touchmove', (e) => {
    if (isMouseDown) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        cube.rotateY(dx * 0.01);
        cube.rotateX(dy * 0.01);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cube.draw(ctx);
    }
});

document.addEventListener('touchend', () => {
    isMouseDown = false;
});



