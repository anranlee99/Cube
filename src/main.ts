class Cube {
    ctx: CanvasRenderingContext2D;
    size: number;
    vertices: number[][];
    faces: number[][];
    colors: string[];
    rotationX: number;
    rotationY: number;

    constructor(context: CanvasRenderingContext2D, size: number) {
        this.ctx = context;
        this.size = size;
        this.vertices = [
            [-1, -1, -1], 
            [1, -1, -1], 
            [1, 1, -1], 
            [-1, 1, -1],
            [-1, -1, 1], 
            [1, -1, 1], 
            [1, 1, 1],
            [-1, 1, 1]
        ];

        this.faces = [
            [0, 1, 2, 3], 
            [1, 5, 6, 2], 
            [5, 4, 7, 6],
            [4, 0, 3, 7], 
            [0, 4, 5, 1], 
            [3, 2, 6, 7],
        ];

        this.colors = ["red", "green", "blue", "yellow", "purple", "orange"];
        
        this.rotationX = 0;
        this.rotationY = 0;
    }

    rotate(axis: string, theta: number) {
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        for (const vertex of this.vertices) {
            let x = vertex[0];
            let y = vertex[1];
            let z = vertex[2];
            if (axis === 'x') {
                vertex[1] = y * cosTheta - z * sinTheta;
                vertex[2] = z * cosTheta + y * sinTheta;
            } else if (axis === 'y') {
                vertex[0] = x * cosTheta - z * sinTheta;
                vertex[2] = z * cosTheta + x * sinTheta;
            }
        }
    }

    drawFace(face: number[], color: string) {
        let normal = this.calculateNormal(face);
        if (normal[2] > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.vertices[face[0]][0] * this.size, this.vertices[face[0]][1] * this.size);
            for (let i = 1; i < face.length; i++) {
                this.ctx.lineTo(this.vertices[face[i]][0] * this.size, this.vertices[face[i]][1] * this.size);
            }
            this.ctx.closePath();
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    calculateNormal(face: number[]) {
        let v1 = this.vertices[face[0]];
        let v2 = this.vertices[face[1]];
        let v3 = this.vertices[face[2]];
        let normal = [
            (v2[1] - v1[1]) * (v3[2] - v1[2]) - (v2[2] - v1[2]) * (v3[1] - v1[1]),
            (v2[2] - v1[2]) * (v3[0] - v1[0]) - (v2[0] - v1[0]) * (v3[2] - v1[2]),
            (v2[0] - v1[0]) * (v3[1] - v1[1]) - (v2[1] - v1[1]) * (v3[0] - v1[0])
        ];
        let length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
        return [normal[0] / length, normal[1] / length, normal[2] / length];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

        for (let i = 0; i < this.faces.length; i++) {
            this.drawFace(this.faces[i], this.colors[i]);
        }

        this.ctx.restore();
    }
}

window.onload = function() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const cube = new Cube(context, 100);
    let lastX: number, lastY: number, dragging = false;

    canvas.onmousedown = function(e) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    };

    canvas.onmouseup = canvas.onmouseleave = function() {
        dragging = false;
    };

    canvas.onmousemove = function(e) {
        if (dragging) {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            cube.rotate('y', dx * 0.01);
            cube.rotate('x', dy * 0.01);
            cube.draw();
        }
    };

    cube.draw();
};